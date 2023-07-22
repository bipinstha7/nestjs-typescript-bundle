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
  });
}
