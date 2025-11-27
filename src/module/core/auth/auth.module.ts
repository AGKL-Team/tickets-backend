import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurationModule } from '../../../config/configuration.module';
import { DatabaseModule } from '../database/database.module';
import { SupabaseService } from '../database/services/supabase.service';
import { SupabaseAuthGuard } from './infrastructure/guard';
import { AuthService } from './infrastructure/services/auth.service';
import { AuthController } from './presentation/api/auth.controller';
import { TicketModule } from '../../tickets/tickets.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigurationModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30m' },
    }),
    forwardRef(() => TicketModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SupabaseAuthGuard,
    SupabaseService,
  ],
  exports: [
    AuthService,
    JwtModule,
    SupabaseAuthGuard,
  ],
})
export class AuthModule {}