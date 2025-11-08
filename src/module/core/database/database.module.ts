import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import supabaseConfig from '../../../config/firebase.config';
import { FirebaseService } from './services/firebase.service';

/**
 * Database module
 */
@Module({
  imports: [ConfigModule.forFeature(supabaseConfig)],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class DatabaseModule {}
