import {
  HttpStatus,
  Injectable,
  HttpException,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In } from 'typeorm';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import User from './user.entity';
import PostService from '../post/post.service';
import { CreateUserDto } from './dto/user.dto';
import UploadService from '../upload/upload.service';
import StripeService from '../stripe/stripe.service';
import PrismaService from 'src/prisma/prisma.service';
import { User as MongoUser, UserDocument } from './user.model';
import LocalFileDto from '../upload/dto/localFile.dto';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly uploadService: UploadService,
    private connection: DataSource,
    private readonly prismaService: PrismaService,
    private readonly stripeService: StripeService,

    @InjectModel(MongoUser.name) private userModel: Model<UserDocument>,
    private readonly postService: PostService,

    @InjectConnection()
    private readonly mongooseConnection: mongoose.Connection,
  ) {}

  /**
   * A method that returns the user matching the provided email
   * @param email string - Email of the user
   * @returns A promise with the user
   */
  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) return user;

    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  /**
   * @deprecated Use another method instead
   */
  async create(userData: CreateUserDto): Promise<User> {
    const stripeCustomer = await this.stripeService.createCustomer(
      userData.name,
      userData.email,
    );
    const newUser = await this.userRepository.create({
      ...userData,
      stripeCustomerId: stripeCustomer.id,
    });
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

  async setTwoFactorAuthSecret(secret: string, userId: number) {
    return this.userRepository.update(userId, { twoFactorAuthSecret: secret });
  }

  async turnOnTwoFactorAuth(userId: number) {
    return this.userRepository.update(userId, { isTwoFactorAuthEnabled: true });
  }

  /* With Prisma, we can easily create both a user entity and the address and create a relationship between them at once. To do that, we need to use the create property. */
  async craetePrismaUser(user: CreateUserDto) {
    const address = user.address;
    return this.prismaService.user.create({
      data: {
        ...user,
        address: { create: address },
      },
      include: { address: true }, // returns whole address object instead of only address id
    });
  }

  async updateMonthlySubscriptionStatus(
    stripeCustomerId: string,
    monthlySubscriptionStatus: string,
  ) {
    return this.userRepository.update(
      { stripeCustomerId },
      { monthlySubscriptionStatus },
    );
  }

  async markEmailAsConfirmed(email: string) {
    return this.userRepository.update(
      { email },
      {
        isEmailConfirmed: true,
      },
    );
  }

  async markPhoneNumberAsConfirmed(userId: number) {
    return this.userRepository.update(
      { id: userId },
      { isPhoneNumberConfirmed: true },
    );
  }

  async delete(userId: string) {
    const session = await this.mongooseConnection.startSession();
    session.startTransaction();

    try {
      const user = await this.userModel
        .findByIdAndDelete(userId)
        .populate('posts')
        .session(session);

      if (!user) throw new NotFoundException();

      const posts = user.posts;

      await this.postService.deleteMany(
        posts.map(post => post._id.toString()),
        session,
      );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async addAvatarFile(userId: number, imageBuffer: Buffer, filename: string) {
    const avatar = await this.uploadService.uploadDatabaseFile(
      imageBuffer,
      filename,
    );

    await this.userRepository.update(userId, {
      avatarId: avatar.id,
    });
    return avatar;
  }

  async saveAvatarToServer(userId: number, fileData: LocalFileDto) {
    const avatar = await this.uploadService.saveLocalFileData(fileData);
    await this.userRepository.update(userId, {
      avatarId: avatar.id,
    });
  }
}
