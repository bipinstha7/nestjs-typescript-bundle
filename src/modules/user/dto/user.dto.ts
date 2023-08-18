export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  tokenKey: string;
  address?: {
    street: string;
    city: string;
    country: string;
  };
}
