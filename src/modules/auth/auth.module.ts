import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import AuthService from './auth.service';
import UserModule from '../user/user.module';
import AuthController from './auth.controller';
import IConfig from 'src/config/config.interface';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configServie: ConfigService<IConfig>) => ({
        secret: configServie.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configServie.get('JWT_EXPIRATION_TIME')}`,
        },
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [UserModule, ConfigModule, JwtModule],
  /**
   * These exports modules are required in auth.guard.ts file. The auth guard is used in other modules like post, user etc.
   * As the auth guard is using UserModule, ConfigModule and JwtModule, any modules that uses the auth guard also needs to
   * import these modules dispite they are not using it.
   * So to get rid of this dependency, we just exports the required modules here and just import the AuthModule in those modules
   * where auth guard has been used.
   */
})
export default class AuthModule {}
