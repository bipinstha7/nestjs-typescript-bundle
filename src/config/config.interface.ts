export interface IDBConfig {
  PORT: number;
  POSTGRES_DB: string;
  POSTGRES_PORT: number;
  POSTGRES_HOST: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
}

export interface IJWTConfig {
  JWT_SECRET: string;
  JWT_EXPIRATION_TIME: string;
}

export interface IConfig extends IDBConfig, IJWTConfig {}
