export default interface IConfig {
  PORT: number;
  POSTGRES_DB: string;
  POSTGRES_PORT: number;
  POSTGRES_HOST: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;

  JWT_SECRET: string;
  JWT_EXPIRATION_TIME: string;
}
