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
  JWT_EMAIL_VERIFICATION_SECRET: string;
  JWT_EMAIL_VERIFICATION_EXPIRATION_TIME: string;
  EMAIL_CONFIRMATION_URL: string;
}
export interface IAWSConfig {
  AWS_REGION_NAME: string;
  AWS_BUCKET_NAME: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
}

export interface IElasticSearchConfig {
  ELASTICSEARCH_NODE: string;
  ELASTICSEARCH_USERNAME: string;
  ELASTICSEARCH_PASSWORD: string;
}

export interface IMicroserviceConfig {
  SUBSCRIBER_SERVICE_HOST: string;
  SUBSCRIBER_SERVICE_PORT: string;
  GRPC_CONNECTION_URL: string;
}
export interface IMicroserviceRMQConfig {
  RABBITMQ_USER: string;
  RABBITMQ_HOST: string;
  RABBITMQ_PASSWORD: string;
  RABBITMQ_QUEUE_NAME: string;
}

export interface IRedisConfig {
  REDIS_HOST: string;
  REDIS_PORT: number;
}

export interface IEmailConfig {
  EMAIL_USER: string;
  EMAIL_SERVICE: string;
  EMAIL_PASSWORD: string;
}

export interface ITwilioConfig {
  TWILIO_AUTH_TOKEN: string;
  TWILIO_ACCOUNT_SERVICE_ID: string;
  TWILIO_VERIFICATION_SERVICE_ID: string;
}

export interface IMongoConfig {
  MONGO_HOST: string;
  MONGO_USERNAME: string;
  MONGO_PASSWORD: string;
  MONGO_DATABASE: string;
}

export interface IConfig
  extends IDBConfig,
    IJWTConfig,
    IAWSConfig,
    IRedisConfig,
    IEmailConfig,
    IMongoConfig,
    ITwilioConfig,
    IMicroserviceConfig,
    IElasticSearchConfig,
    IMicroserviceRMQConfig {}
