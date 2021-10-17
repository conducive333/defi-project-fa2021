import * as Joi from 'joi'
export const firebaseConfigSchema = {
  FIREBASE_API_KEY: Joi.string().required(),
  FIREBASE_AUTH_DOMAIN: Joi.string().required(),
  FIREBASE_PROJECT_ID: Joi.string().required(),
  FIREBASE_STORAGE_BUCKET: Joi.string().required(),
  FIREBASE_MSG_SENDER_ID: Joi.string().required(),
  FIREBASE_APP_ID: Joi.string().required(),
  FIREBASE_MEASUREMENT_ID: Joi.string().required(),
}
