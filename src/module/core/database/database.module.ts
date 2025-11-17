import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import supabaseConfig from '../../../config/supabase.config';
import {
  Area,
  Claim,
  ClaimCancellation,
  ClaimCategory,
  ClaimComment,
  ClaimCriticality,
  ClaimHistory,
  ClaimRating,
  ClaimState,
  Priority,
  Project,
  RatingCategory,
  Role,
  SubArea,
  UserArea,
  UserProject,
  UserRole,
} from '../../tickets/domain/models';
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
      name: 'mongoConnection',
      type: 'mongodb',
      url: process.env.MONGODB_URL,
      database: process.env.MONGODB_DB_NAME,
      synchronize: true,
      entities: [
        Area,
        SubArea,
        Project,
        UserArea,
        Claim,
        ClaimCancellation,
        ClaimCategory,
        ClaimComment,
        ClaimCriticality,
        ClaimRating,
        UserProject,
        RatingCategory,
        ClaimHistory,
        ClaimState,
        UserRole,
        Priority,
      ],
    }),
    TypeOrmModule.forRoot({
      name: 'postgresConnection',
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: process.env.NODE_ENV !== 'production',
      ssl: { rejectUnauthorized: false },
      entities: [Role],
      connectTimeoutMS: 30000,
      logging: ['query', 'error'],
    }),
    TypeOrmModule.forFeature(
      [
        UserRole,
        Area,
        SubArea,
        UserArea,
        Project,
        Claim,
        ClaimCancellation,
        ClaimCategory,
        ClaimComment,
        ClaimCriticality,
        ClaimRating,
        UserProject,
        RatingCategory,
        ClaimHistory,
        ClaimState,
        Priority,
      ],
      'mongoConnection',
    ),
    TypeOrmModule.forFeature([Role], 'postgresConnection'),
  ],
  providers: [MongoService, SupabaseService, Logger],
  exports: [MongoService, SupabaseService, TypeOrmModule],
})
export class DatabaseModule {}
