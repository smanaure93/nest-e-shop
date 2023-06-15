import * as joi from 'joi';

export const JoiValidationSchema = joi.object({
  DB_HOST: joi.required(),
  DB_PORT: joi.number().default(5432),
  DB_USER: joi.required(),
  DB_PASSWORD: joi.required(),
  DB_NAME: joi.required(),
  PORT: joi.number().default(4200),
});
