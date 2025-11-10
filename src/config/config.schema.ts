import * as Joi from 'joi';

export const configSchema = Joi.object({
  SUPABASE_URL: Joi.string().uri().required(),
  SUPABASE_KEY: Joi.string().required(),
  MONGODB_URL: Joi.string().uri().required(),
  MONGODB_DB_NAME: Joi.string().optional(),
  FRONTEND_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().required(),
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
});
