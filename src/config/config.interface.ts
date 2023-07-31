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
}
export interface IMicroserviceRMQConfig {
  RABBITMQ_USER: string;
  RABBITMQ_HOST: string;
  RABBITMQ_PASSWORD: string;
  RABBITMQ_QUEUE_NAME: string;
}

export interface IConfig
  extends IDBConfig,
    IJWTConfig,
    IAWSConfig,
    IElasticSearchConfig,
    IMicroserviceConfig,
    IMicroserviceRMQConfig {}
