// auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Res, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from 'src/user/dto/user-login.dto';
import { User } from 'src/user/entity/user.entity';
import { UserRegisterDto } from 'src/user/dto/user-register.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { Response, Request } from 'express'; // Add Request import

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    async signIn(
        @Body() userLoginDto: UserLoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const { user, access_token, refresh_token } = await this.authService.signIn(userLoginDto);
        
        // Set cookies
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
        
        return { user };
    }

    @Post('signup')
    async signUp(
        @Body() userRegisterDto: UserRegisterDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const { user, access_token, refresh_token } = await this.authService.signUp(userRegisterDto);
        
        // Set cookies
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
        
        return { user };
    }

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

    // ✅ FIXED: Read refresh token from cookie, not from body
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(
        @Req() req: Request,  // Add Request to read cookies
        @Res({ passthrough: true }) res: Response
    ) {
        // Get refresh token from cookie
        const refreshToken = req.cookies?.refresh_token;
        
        if (!refreshToken) {
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
            throw new UnauthorizedException('Refresh token not found');
        }

        let tokens: { access_token: string; refresh_token: string };

        try {
            tokens = await this.authService.refreshToken(refreshToken);
        } catch (error) {
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
            throw new UnauthorizedException('Session expired. Please sign in again.');
        }
        
        const { access_token, refresh_token } = tokens;
        
        // Set new cookies
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