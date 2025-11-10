import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from '../../../config/configuration.module';
import { Role, UserArea, UserRole } from '../../tickets/domain/models';
import { UserRoleService } from '../../tickets/infrastructure/services/user-role.service';
import { DatabaseModule } from '../database/database.module';
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
    TypeOrmModule.forFeature([UserRole, UserArea, Role]),
  ],
  controllers: [AuthController],
  providers: [AuthService, SupabaseAuthGuard, UserRoleService],
  exports: [AuthService, JwtModule, SupabaseAuthGuard, UserRoleService],
})
export class AuthModule {}
