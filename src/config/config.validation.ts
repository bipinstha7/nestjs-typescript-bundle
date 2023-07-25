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
  });
}
