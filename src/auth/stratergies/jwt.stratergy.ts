// jwt.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      // CHANGE THIS: Extract JWT from cookie instead of Authorization header
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // Get token from cookie
          const token = request?.cookies?.access_token;
          if (!token) {
            return null;
          }
          return token;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET || '1234',
      ignoreExpiration: false,
    });
  }

  async validate(payload: any): Promise<any> {
    try {
      // Find user by ID from the token payload
      const user = await this.userService.getUser(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      
      // Return user object (without password)
      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}