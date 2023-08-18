import bcrypt from 'bcrypt';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';
import { getRepositoryToken } from '@nestjs/typeorm';

import AuthService from '../auth.service';
import User from '../../user/user.entity';
import UserService from '../../user/user.service';
import { mockedJwtService } from '../../../utils/mocks/jwt.service';
import { mockedConfigService } from '../../../utils/mocks/config.service';

describe('The AuthService', () => {
  let userData;
  let password: string;
  let authService: AuthService;

  beforeEach(async () => {
    password = 'strongPassword123';
    const hashedPassword = await bcrypt.hash(password, 10);
    userData = {
      id: 1,
      name: 'John',
      addressId: null,
      email: 'john@smith.com',
      password: hashedPassword,
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
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
        {
          provide: UserService,
          useValue: {
            clearTokenKey: jest.fn(),
            getByEmail: jest.fn().mockResolvedValueOnce(userData),
          },
        },
      ],
    })
      .useMocker(() => createMock())
      .compile();

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

  describe('when calling the logout method', () => {
    it('should return a correct string', () => {
      const result = authService.logout(1);
      expect(result).toBe('Authentication=; HttpOnly; Path=/; Max-Age=0');
    });
  });

  // describe('when the getAuthenticatedUser method is called', () => {
  //   describe('and a valid email and password are provided', () => {
  //     it('should return the new user', async () => {
  //       const result = await authenticationService.getAuthenticatedUser(
  //         userData.email,
  //         password,
  //       );
  //       expect(result).toBe(userData);
  //     });
  //   });
  // });
});
