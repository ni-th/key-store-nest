// auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from 'src/user/dto/user-login.dto';
import { User } from 'src/user/entity/user.entity';
import { UserRegisterDto } from 'src/user/dto/user-register.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { Response } from 'express'; // Add this import

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    async signIn(
        @Body() userLoginDto: UserLoginDto,
        @Res({ passthrough: true }) res: Response // Add this
    ) {
        const { user, access_token, refresh_token } = await this.authService.signIn(userLoginDto);
        
        // Set cookies (add this)
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 minutes
            path: '/',
        });
        
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/',
        });
        
        // Return only user data (not tokens)
        return { user };
    }

    @Post('signup')
    async signUp(
        @Body() userRegisterDto: UserRegisterDto,
        @Res({ passthrough: true }) res: Response // Add this
    ) {
        const { user, access_token, refresh_token } = await this.authService.signUp(userRegisterDto);
        
        // Set cookies (add this)
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
            path: '/',
        });
        
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });
        
        // Return only user data
        return { user };
    }

    // Add logout endpoint
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });
        
        return { message: 'Logged out successfully' };
    }

    // Add refresh token endpoint
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(
        @Body('refresh_token') refreshToken: string,
        @Res({ passthrough: true }) res: Response
    ) {
        const { access_token, refresh_token } = await this.authService.refreshToken(refreshToken);
        
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
            path: '/',
        });
        
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });
        
        return { message: 'Tokens refreshed successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@CurrentUser() user: any) {
        return user;
    }
}