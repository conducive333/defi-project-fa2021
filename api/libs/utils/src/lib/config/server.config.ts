import * as Joi from 'joi'
export const serverConfigSchema = {
  SERVER_PORT: Joi.number().integer().required(),
  SERVER_DB_HOST: Joi.string().required(),
  SERVER_DB_NAME: Joi.string().required(),
  SERVER_DB_PORT: Joi.number().integer().required(),
  SERVER_DB_USER: Joi.string().required(),
  SERVER_DB_PASS: Joi.string().required(),
}
