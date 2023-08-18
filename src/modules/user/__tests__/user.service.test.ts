import bcrypt from 'bcrypt';
import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { getRepositoryToken } from '@nestjs/typeorm';

import User from '../user.entity';
import UserService from '../user.service';
import UploadService from '../../upload/upload.service';

describe('The UserService', () => {
  let userData;
  let userService: UserService;
  let findOne: jest.Mock;
  let findOneBy: jest.Mock;

  beforeEach(async () => {
    const password = 'strongPassword123';
    const hashedPassword = await bcrypt.hash(password, 10);
    userData = {
      id: 1,
      name: 'John',
      addressId: null,
      email: 'john@smith.com',
      password: hashedPassword,
    };
    findOne = jest.fn();
    findOneBy = jest.fn();
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne,
            findOneBy,
          },
        },
        // {
        //   provide: UserService,
        //   useValue: {
        //     getByEmail: jest.fn().mockResolvedValueOnce(userData),
        //   },
        // },
      ],
      // imports: [UploadModule],
    })
      .useMocker(() => createMock())
      .compile();

    userService = await moduleRef.get<UserService>(UserService);
  });

  describe('when getting a user by email', () => {
    const email = 'test@test.com';
    describe('and the user is matched', () => {
      let user: User;

      beforeEach(() => {
        user = new User();
        findOneBy.mockReturnValue(Promise.resolve(user));
      });

      it('should return the user', async () => {
        const fetchedUser = await userService.getByEmail(email);

        expect(fetchedUser).toEqual(user);
      });
    });

    describe('and the user is not matched', () => {
      beforeEach(() => {
        findOneBy.mockReturnValue(undefined);
      });

      it('should throw an error', async () => {
        await expect(userService.getByEmail(email)).rejects.toThrow();
      });
    });
  });
});
