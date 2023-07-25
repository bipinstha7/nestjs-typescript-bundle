import { v4 as uuid } from 'uuid';
import { config, S3 } from 'aws-sdk';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

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

  async deletePublicFile(fileId: number) {
    const file = await this.publicFileRepository.findOneBy({ id: fileId });

    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: this.configService.get('AWS_BUCKET_NAME'),
        Key: file.key,
      })
      .promise();

    await this.publicFileRepository.delete(fileId);
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
}
