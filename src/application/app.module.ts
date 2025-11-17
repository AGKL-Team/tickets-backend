import { Logger, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigurationModule } from '../config/configuration.module';
import { AuthModule } from '../module/core/auth/auth.module';
import { DatabaseModule } from '../module/core/database/database.module';
import { TicketModule } from '../module/tickets/tickets.module';

@Module({
  imports: [
    ConfigurationModule,
    // PostgreSQL Module (Supabase) && MongoDB Module
    DatabaseModule,
    // Authentication Module
    AuthModule,
    // Módulos del dominio
    TicketModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
  exports: [Logger],
})
export class AppModule {}
