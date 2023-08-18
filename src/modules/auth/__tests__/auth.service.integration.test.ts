import bcrypt from 'bcrypt';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';
import { getRepositoryToken } from '@nestjs/typeorm';

import { mockedUser } from './user.mock';
import AuthService from '../auth.service';
import User from '../../user/user.entity';
import UserService from '../../user/user.service';
import { mockedJwtService } from '../../../utils/mocks/jwt.service';
import { mockedConfigService } from '../../../utils/mocks/config.service';

describe('The AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  const email = 'test@email.com';
  const password = 'strong_password';
  let bcryptCompare: jest.Mock;
  let userData: Partial<User>;
  let findUser: jest.Mock;

  beforeEach(async () => {
    bcryptCompare = jest.fn().mockReturnValue(true);
    bcrypt.compare = bcryptCompare;
    // (bcrypt.compare as jest.Mock) = bcryptCompare;
    userData = { ...mockedUser };
    findUser = jest.fn().mockResolvedValue(userData);
    const userRepository = {
      findOneBy: findUser,
      update: jest.fn().mockImplementation(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        AuthService,
        /* MOCKS */
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
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
    })
      .useMocker(() => createMock())
      .compile();

    authService = await moduleRef.get<AuthService>(AuthService);
    userService = await moduleRef.get<UserService>(UserService);
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

  describe('when attempting to login', () => {
    it('should attempt to get the user by email', async () => {
      const getByEmailSpy = jest.spyOn(userService, 'getByEmail');
      jest.spyOn(userService, 'addTokenKey');
      await authService.login(email, password);

      expect(getByEmailSpy).toBeCalledTimes(1);
    });

    it('should throw an error if the password is not valid', async () => {
      bcryptCompare.mockReturnValue(false);

      await expect(authService.login(email, password)).rejects.toThrow();
    });

    it('should find the user in database if the password is valid', async () => {
      const { user } = await authService.login(email, password);
      expect(user).toBe(userData);
    });

    it('should throw an error if the user is not found in the database', async () => {
      findUser.mockResolvedValueOnce(undefined);

      await expect(authService.login(email, password)).rejects.toThrow();
    });
  });
});
