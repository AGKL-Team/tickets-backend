import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurationModule } from '../../../config/configuration.module';
import { RoleService } from '../../tickets/infrastructure/services';
import { UserRoleService } from '../../tickets/infrastructure/services/user-role.service';
import { DatabaseModule } from '../database/database.module';
import { SupabaseService } from '../database/services/supabase.service';
import { SupabaseAuthGuard } from './infrastructure/guard/supabase-auth.guard';
import { AuthService } from './infrastructure/services/auth.service';
import { AuthController } from './presentation/api/auth.controller';

@Module({
  imports: [
    DatabaseModule,
    ConfigurationModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SupabaseAuthGuard,
    UserRoleService,
    RoleService,
    SupabaseService,
  ],
  exports: [
    AuthService,
    JwtModule,
    SupabaseAuthGuard,
    UserRoleService,
    RoleService,
  ],
})
export class AuthModule {}
