import * as Joi from 'joi'
export const clientConfigSchema = {
  CLIENT_PORT: Joi.number().integer().required(),
  CLIENT_DB_HOST: Joi.string().required(),
  CLIENT_DB_NAME: Joi.string().required(),
  CLIENT_DB_PORT: Joi.number().integer().required(),
  CLIENT_DB_USER: Joi.string().required(),
  CLIENT_DB_PASS: Joi.string().required(),
}
