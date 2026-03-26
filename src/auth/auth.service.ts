import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User, UserRole } from 'src/user/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from 'src/user/dto/user-login.dto';
import { UserRegisterDto } from 'src/user/dto/user-register.dto';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { access } from 'fs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  // login
  async signIn(
    userLoginDto: UserLoginDto,
  ): Promise<{
    user: Omit<User, 'password'>;
    access_token: string;
    refresh_token: string;
  }> {

    const user = await this.userService.searchByEmail(userLoginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      userLoginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password, ...result } = user;
    const tokens = this.generateTokens(user);
    
    return {
      user: result,
      ...tokens
    };
  }

  async signUp(userRegisterDto: UserRegisterDto) {
    const existUser = await this.userService.searchByEmail(
      userRegisterDto.email,
    );
    if (existUser) {
      throw new UnauthorizedException('User already exists');
    }
    const passwordHash = await bcrypt.hash(userRegisterDto.password, 10);
        const partial: DeepPartial<User> = {
          name: userRegisterDto.name,
          email: userRegisterDto.email,
          password: passwordHash,
          role: UserRole.USER,
        };
      const user = await this.userRepository.save(partial);
      const tokens = this.generateTokens(user);
      return {
        ...tokens,
        user,
      };
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key'
      });
      
      // Get user from database
      const user = await this.userService.getUser(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      
      // Generate new tokens
      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private generateTokens(user: User) {
    return {
      access_token: this.generateAccessToken(user),
      refresh_token: this.generateRefreshToken(user),
    }
  }

  private generateAccessToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });
  }

  private generateRefreshToken(user: User) {
    const payload = { sub: user.id };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    })
  }

  validateUser(id: number) {
    const user = this.userService.getUser(id);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
