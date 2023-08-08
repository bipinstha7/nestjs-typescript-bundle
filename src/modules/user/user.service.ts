import {
  HttpStatus,
  Injectable,
  HttpException,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import User from './user.entity';
import { CreateUserDto } from './dto/user.dto';
import UploadService from '../upload/upload.service';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly uploadService: UploadService,
    private connection: DataSource,
  ) {}

  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) return user;

    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async create(userData: CreateUserDto): Promise<User> {
    const newUser = await this.userRepository.create(userData);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async findBy(id: number, tokenKey?: string): Promise<User> {
    let query: { id: number; tokenKey?: string } = { id };
    if (tokenKey) {
      query = { ...query, tokenKey };
    }
    const user = await this.userRepository.findOne({ where: query });
    if (user) return user;

    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async addTokenKey(id: number, tokenKey: string): Promise<void> {
    await this.userRepository.update({ id }, { tokenKey });
  }

  async clearTokenKey(id: number): Promise<void> {
    await this.userRepository.update({ id }, { tokenKey: '' });
  }

  async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
    const avatar = await this.uploadService.uploadPublicFile(
      imageBuffer,
      filename,
    );

    await this.userRepository.update({ id: userId }, { avatar });

    return avatar;
  }

  async deleteAvatar(userId: number) {
    const queryRunner = this.connection.createQueryRunner();

    const user = await this.userRepository.findOneBy({ id: userId });
    const fileId = user.avatar?.id;

    if (fileId) {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const userUpdate = await queryRunner.manager.update(User, userId, {
          avatar: null,
        });
        const deleteFile = this.uploadService.deletePublicFileWithQueryRunner(
          fileId,
          queryRunner,
        );
        await Promise.all([userUpdate, deleteFile]);

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException();
      } finally {
        await queryRunner.release();
      }

      return 'Avatar deleted';
    }

    throw new HttpException('Avatar not found', HttpStatus.NOT_FOUND);
  }

  async addPrivateFile(userId: number, imageBuffer: Buffer, filename: string) {
    return this.uploadService.uploadPrivateFile(imageBuffer, userId, filename);
  }

  async getPrivateFile(userId: number, fileId: number) {
    const file = await this.uploadService.getPrivateFileFile(fileId);

    if (file.info.owner.id === userId) return file;

    throw new UnauthorizedException();
  }

  async getAllPrivateFiles(userId: number) {
    const userWithFiles = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['files'],
    });

    if (userWithFiles) {
      return Promise.all(
        userWithFiles.files.map(async file => {
          const url = await this.uploadService.generatePresignedUrl(file.key);
          return {
            ...file,
            url,
          };
        }),
      );
    }
    throw new NotFoundException('User with this id does not exist');
  }

  async getByIds(ids: number[]) {
    return this.userRepository.find({ where: { id: In(ids) } });
  }
}
