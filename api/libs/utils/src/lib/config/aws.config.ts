import * as Joi from 'joi'

const baseConfig = {
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_S3_BUCKET_NAME: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
}

export const awsConfigSchema =
  process.env['NODE' + '_ENV'] === 'development'
    ? baseConfig
    : {
        ...baseConfig,
        AWS_KMS_KEY_ID: Joi.string().required(),
      }
