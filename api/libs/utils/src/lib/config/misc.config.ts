import * as Joi from 'joi'
export const miscConfigSchema = {
  MISC_DOCS_USERNAME: Joi.string().optional(),
  MISC_DOCS_PASSWORD: Joi.string().optional(),
}
