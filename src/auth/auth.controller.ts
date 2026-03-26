import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from 'src/user/dto/user-login.dto';
import { User } from 'src/user/entity/user.entity';
import { UserRegisterDto } from 'src/user/dto/user-register.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() userLoginDto: UserLoginDto ): Promise<{ user: Omit<User, 'password'>; access_token: string; refresh_token: string }> {
    return this.authService.signIn(userLoginDto);
  }
  @Post('signup')
  async signUp(@Body() userRegisterDto: UserRegisterDto): Promise<{ user: Omit<User, 'password'>; access_token: string; refresh_token: string }> {
    return await this.authService.signUp(userRegisterDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return user;
  }
}
