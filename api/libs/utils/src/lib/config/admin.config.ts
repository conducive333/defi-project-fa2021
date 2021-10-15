import * as Joi from 'joi'
export const adminConfigSchema = {
  ADMIN_PORT: Joi.number().integer().required(),
  ADMIN_DB_HOST: Joi.string().required(),
  ADMIN_DB_NAME: Joi.string().required(),
  ADMIN_DB_PORT: Joi.number().integer().required(),
  ADMIN_DB_USER: Joi.string().required(),
  ADMIN_DB_PASS: Joi.string().required(),
}
