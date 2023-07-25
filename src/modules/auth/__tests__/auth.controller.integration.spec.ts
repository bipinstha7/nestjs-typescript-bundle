import request from 'supertest';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import { mockedUser } from './user.mock';
import AuthService from '../auth.service';
import User from '../../user/entity/user.entity';
import AuthController from '../auth.controller';
import UserService from '../../user/user.service';
import { mockedJwtService } from '../../../utils/mocks/jwt.service';
import { mockedConfigService } from '../../../utils/mocks/config.service';

describe('The AuthController', () => {
  let app: INestApplication;
  let userData: User;

  beforeEach(async () => {
    userData = { ...mockedUser };

    const userRepository = {
      create: jest.fn().mockResolvedValueOnce(userData),
      save: jest.fn().mockReturnValueOnce(Promise.resolve()),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        UserService,
        AuthService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        { provide: JwtService, useValue: mockedJwtService },
        { provide: getRepositoryToken(User), useValue: userRepository },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('When registering the user', () => {
    it('should respond with the data of the user without the password and tokenKey', () => {
      const { password, tokenKey, ...expectedData } = userData;

      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: mockedUser.name,
          email: mockedUser.email,
          password: mockedUser.password,
        })
        .expect(201);
      // .expect(expectedData); /* TODO */
    });

    test('should throw and error on invalid data', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: mockedUser.name })
        .expect(400);
    });
  });
});
