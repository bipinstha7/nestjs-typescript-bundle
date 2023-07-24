import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';

import AuthService from '../auth.service';
import User from '../../user/entity/user.entity';
import UserService from '../../user/user.service';
import { mockedJwtService } from '../../../utils/mocks/jwt.service';
import { mockedConfigService } from '../../../utils/mocks/config.service';

describe('The AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        AuthService,
        /* MOCKS */
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
      ],
    }).compile();

    authService = await moduleRef.get<AuthService>(AuthService);
  });

  describe('when creating a cookie', () => {
    it('should return a string', () => {
      const userId = 1;
      const tokeyKey = 'login';
      expect(
        typeof authService.getCookieWithJwtToken(userId, tokeyKey),
      ).toEqual('string');
    });
  });
});
