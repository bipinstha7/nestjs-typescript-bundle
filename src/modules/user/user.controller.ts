import {
  Get,
  Res,
  Req,
  Post,
  Param,
  Delete,
  UseGuards,
  Controller,
  ParseIntPipe,
  UploadedFile,
  StreamableFile,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import etag from 'etag';
import util from 'util';
import filesystem from 'fs';
import { join } from 'path';
import { diskStorage } from 'multer';
import { Express, Response, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import UserService from './user.service';
import { IdParams } from '../../utils/validations';
import UploadService from '../upload/upload.service';
import AuthGuard from '../auth/middleware/auth.guard';
import { IRequestWithUser } from '../auth/interface/auth.interface';

const readFile = util.promisify(filesystem.readFile);

@Controller('users')
export default class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uploadService: UploadService,
  ) {}

  @Post('avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(
    @Req() req: IRequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.addAvatar(
      req.user.id,
      file.buffer,
      file.originalname,
    );
  }

  @Delete('avatar')
  @UseGuards(AuthGuard)
  async deleteAvatar(@Req() req: IRequestWithUser) {
    return this.userService.deleteAvatar(req.user.id);
  }

  @Post('files')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addPrivateFile(
    @Req() req: IRequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.addPrivateFile(
      req.user.id,
      file.buffer,
      file.originalname,
    );
  }

  @Get('files/:id')
  @UseGuards(AuthGuard)
  async getPrivateFile(
    @Req() request: IRequestWithUser,
    @Param() { id }: IdParams,
    @Res() res: Response,
  ) {
    const file = await this.userService.getPrivateFile(
      request.user.id,
      Number(id),
    );

    file.stream.pipe(res);
  }

  @Get('files')
  @UseGuards(AuthGuard)
  async getAllPrivateFiles(@Req() request: IRequestWithUser) {
    return this.userService.getAllPrivateFiles(request.user.id);
  }

  @Post('avatar-file')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addAvatarFile(
    @Req() request: IRequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.addAvatarFile(
      request.user.id,
      file.buffer,
      file.originalname,
    );
  }

  @Post('avatar-save-server')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploadedFiles/avatars',
      }),
    }),
  )
  async saveAvatarToServer(
    @Req() request: IRequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.saveAvatarToServer(request.user.id, {
      path: file.path,
      filename: file.originalname,
      mimetype: file.mimetype,
    });
  }

  @Get(':userId/avatar')
  async getAvatar(
    @Param('userId', ParseIntPipe) userId: number,
    @Res({ passthrough: true }) response: Response,
    @Req() req: Request,
  ) {
    const user = await this.userService.findBy(userId);
    const fileId = user.avatarId;
    if (!fileId) throw new NotFoundException();

    const fileMetadata = await this.uploadService.getLocalFileById(
      user.avatarId,
    );

    const pathOnDisk = join(process.cwd(), fileMetadata.path);

    const file = await readFile(pathOnDisk);

    /* etag users crypto library to generate the hash, so it might take little bit of time, to minimize that time we can use id */
    // const tag = etag(file);
    const tag = `W/"file-id-${fileId}"`;

    response.set({
      'Content-Disposition': `inline; filename="${fileMetadata.filename}"`,
      'Content-Type': fileMetadata.mimetype,
      ETag: tag,
    });

    if (req.headers['if-none-match'] === tag) {
      return response.status(304);
    }

    return new StreamableFile(file);
  }
}
