import * as Joi from 'joi'
export const dbConfigSchema = {
  DB_HOST: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_PORT: Joi.number().integer().required(),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
}
