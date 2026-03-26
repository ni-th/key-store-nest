// jwt.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/user/user.service'; // Import UserService, not AuthService

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) { // Use UserService directly
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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