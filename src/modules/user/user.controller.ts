import {
  Get,
  Res,
  Req,
  Post,
  Param,
  Delete,
  UseGuards,
  Controller,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Express, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import UserService from './user.service';
import { IdParams } from '../../utils/validations';
import AuthGuard from '../auth/middleware/auth.guard';
import { IRequestWithUser } from '../auth/interface/auth.interface';

@Controller('users')
export default class UserController {
  constructor(private readonly userService: UserService) {}

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
}
