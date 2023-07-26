import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import User from '../user.entity';
import UserService from '../user.service';

describe('The UserService', () => {
  let userService: UserService;
  let findOne: jest.Mock;
  let findOneBy: jest.Mock;

  beforeEach(async () => {
    findOne = jest.fn();
    findOneBy = jest.fn();
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: { findOne, findOneBy } },
      ],
    }).compile();

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
