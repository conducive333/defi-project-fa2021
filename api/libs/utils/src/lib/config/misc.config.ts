import * as Joi from 'joi'
export const miscConfigSchema = {
  MISC_COOKIE_SECRET: Joi.string().required(),
}
