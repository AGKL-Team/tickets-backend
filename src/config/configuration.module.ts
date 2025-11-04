import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from './config.schema';
import frontendConfig from './frontend.config';
import supabaseConfig from './supabase.config';
import cloudinaryConfig from './cloudinary.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: '.env',
      load: [frontendConfig, supabaseConfig, cloudinaryConfig],
      validationSchema: configSchema,
    }),
  ],
})
export class ConfigurationModule {}
