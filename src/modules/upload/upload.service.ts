import {
  HttpStatus,
  Injectable,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { config, S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import DatabaseFile from './file.entity';
import PublicFile from './pulicFile.entity';
import PrivateFile from './privateFile.entity';
import { IAWSConfig } from '../../config/config.interface';

@Injectable()
export default class UploadService {
  private readonly _ = config.update({
    accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    region: this.configService.get('AWS_REGION_NAME'),
  });

  constructor(
    @InjectRepository(PublicFile)
    private publicFileRepository: Repository<PublicFile>,

    @InjectRepository(PrivateFile)
    private privateFileRepository: Repository<PrivateFile>,

    private readonly configService: ConfigService<IAWSConfig>,

    @InjectRepository(DatabaseFile)
    private fileRepository: Repository<DatabaseFile>,
  ) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
        Bucket: this.configService.get('AWS_BUCKET_NAME'),
      })
      .promise();

    const newFile = this.publicFileRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
    });
    await this.publicFileRepository.save(newFile);

    return newFile;
  }

  async deletePublicFileWithQueryRunner(
    fileId: number,
    queryRunner: QueryRunner,
  ) {
    const file = await queryRunner.manager.findOneBy(PublicFile, {
      id: fileId,
    });

    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: this.configService.get('AWS_BUCKET_NAME'),
        Key: file.key,
      })
      .promise();

    await queryRunner.manager.delete(PublicFile, fileId);
  }

  async uploadPrivateFile(
    dataBuffer: Buffer,
    ownerId: number,
    filename: string,
  ) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
        Bucket: this.configService.get('AWS_BUCKET_NAME'),
      })
      .promise();

    const newFile = this.privateFileRepository.create({
      key: uploadResult.Key,
      owner: { id: ownerId },
    });
    await this.privateFileRepository.save(newFile);

    return newFile;
  }

  async getPrivateFileFile(fileId: number) {
    const s3 = new S3();

    const fileInfo = await this.privateFileRepository.findOne({
      where: { id: fileId },
      relations: ['owner'],
    });

    if (fileInfo) {
      const stream = await s3
        .getObject({
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Key: fileInfo.key,
        })
        .createReadStream();

      return { stream, info: fileInfo };
    }

    throw new HttpException('File not found', HttpStatus.NOT_FOUND);
  }

  async generatePresignedUrl(key: string) {
    const s3 = new S3();

    return s3.getSignedUrlPromise('getObject', {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: key,
    });
  }

  async uploadDatabaseFile(dataBuffer: Buffer, filename: string) {
    const newFile = await this.fileRepository.create({
      filename,
      data: dataBuffer,
    });
    await this.fileRepository.save(newFile);
    return newFile;
  }

  async getFileById(fileId: number) {
    const file = await this.fileRepository.findOneBy({ id: fileId });
    if (!file) throw new NotFoundException();

    return file;
  }
}
