import User from '../../user/user.entity';

export const mockedUser: User = {
  id: 1,
  name: 'username',
  email: 'test@email.com',
  password: 'hashedPassword',
  tokenKey: '',
  address: {
    id: 1,
    street: 'streetName',
    city: 'cityName',
    country: 'countryName',
  },
};
