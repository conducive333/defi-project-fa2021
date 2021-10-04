import * as Joi from 'joi'
export const flowConfigSchema = {
  FLOW_ACCESS_API: Joi.string().required(),
  FLOW_TOKEN_ADDRESS: Joi.string().required(),
  FLOW_FEES_ADDRESS: Joi.string().required(),
  FLOW_FT_ADDRESS: Joi.string().required(),
  FLOW_NFT_ADDRESS: Joi.string().required(),
  FLOW_DEV_ADDRESS: Joi.string().required(),
  FLOW_TREASURY_ADDRESS: Joi.string().required(),
  FLOW_MASTER_KEY: Joi.string(),
}
