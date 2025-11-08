import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import cloudinaryConfig from './cloudinary.config';
import { configSchema } from './config.schema';
import firebaseConfig from './firebase.config';
import frontendConfig from './frontend.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: '.env',
      load: [frontendConfig, firebaseConfig, cloudinaryConfig],
      validationSchema: configSchema,
    }),
  ],
})
export class ConfigurationModule {}
