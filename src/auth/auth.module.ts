import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './stratergies/jwt.stratergy';
import { RolesGuard } from './guards/roles-guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  imports: [TypeOrmModule.forFeature([User]),
  UserModule,
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '7d' },
  })],
  exports: [AuthService, RolesGuard, JwtModule, PassportModule],
})
export class AuthModule {}
