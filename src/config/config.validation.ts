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
    JWT_EMAIL_VERIFICATION_SECRET: Joi.string().required(),
    JWT_EMAIL_VERIFICATION_EXPIRATION_TIME: Joi.string().required(),
    EMAIL_CONFIRMATION_URL: Joi.string().required(),

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

    MONTHLY_SUBSCRIPTION_PRICE_ID: Joi.string(),
    STRIPE_SECRET_KEY: Joi.string(),
    STRIPE_CURRENCY: Joi.string(),
    FRONTEND_URL: Joi.string(),
    STRIPE_WEBHOOK_SECRET: Joi.string(),

    TWILIO_AUTH_TOKEN: Joi.string().required(),
    TWILIO_ACCOUNT_SERVICE_ID: Joi.string().required(),
    TWILIO_VERIFICATION_SERVICE_ID: Joi.string().required(),

    MONGO_HOST: Joi.string().required(),
    MONGO_USERNAME: Joi.string().required(),
    MONGO_PASSWORD: Joi.string().required(),
    MONGO_DATABASE: Joi.string().required(),
  });
}
