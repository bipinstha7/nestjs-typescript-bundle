import Joi from 'joi';

export default function ConfigValidation() {
  return Joi.object().keys({
    PORT: Joi.number().required(),
    POSTGRES_DB: Joi.string().required(),
    POSTGRES_PORT: Joi.number().required(),
    POSTGRES_HOST: Joi.string().required(),
    POSTGRES_USER: Joi.string().required(),
    POSTGRES_PASSWORD: Joi.string().required(),

    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRATION_TIME: Joi.string().required(),

    AWS_BUCKET_NAME: Joi.string().required(),
    AWS_REGION_NAME: Joi.string().required(),
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),

    ELASTICSEARCH_NODE: Joi.string().required(),
    ELASTICSEARCH_USERNAME: Joi.string().required(),
    ELASTICSEARCH_PASSWORD: Joi.string().required(),

    RABBITMQ_USER: Joi.string().required(),
    RABBITMQ_PASSWORD: Joi.string().required(),
    RABBITMQ_HOST: Joi.string().required(),
    RABBITMQ_QUEUE_NAME: Joi.string().required(),

    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required(),

    EMAIL_USER: Joi.string().required(),
    EMAIL_SERVICE: Joi.string().required(),
    EMAIL_PASSWORD: Joi.string().required(),

    STRIPE_SECRET_KEY: Joi.string(),
    STRIPE_CURRENCY: Joi.string(),
    FRONTEND_URL: Joi.string(),
  });
}
