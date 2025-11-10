import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import supabaseConfig from '../../../config/supabase.config';
import { MongoService } from './services/mongo.service';
import { SupabaseService } from './services/supabase.service';

/**
 * Database module
 */
@Module({
  imports: [
    ConfigModule.forFeature(supabaseConfig),
    // TypeORM MongoDB connection. Uses MONGODB_URL env var or local default.
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_URL,
      database: process.env.MONGODB_DB_NAME,
      synchronize: true,
      // point to compiled JS or TS entity files depending on runtime
      entities: [__dirname + '/../../tickets/domain/models/*.{ts,js}'],
    }),
  ],
  providers: [MongoService, SupabaseService],
  exports: [MongoService, SupabaseService, TypeOrmModule],
})
export class DatabaseModule {}
