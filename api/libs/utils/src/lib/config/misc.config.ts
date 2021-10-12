import * as Joi from 'joi'
export const miscConfigSchema = {
  MISC_COOKIE_SECRET: Joi.string().required(),
  MISC_CLIENT_URL: Joi.string().required(),
  MISC_DOCS_USERNAME: Joi.string().optional(),
  MISC_DOCS_PASSWORD: Joi.string().optional(),
}
