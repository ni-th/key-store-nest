import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from 'src/user/dto/user-login.dto';
import { UserRegisterDto } from 'src/user/dto/user-register.dto';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/user/enums/user-role.enum';
import { UserMapper } from 'src/user/mapper/user.mapper';
import { UserResponseDto } from 'src/user/dto/user-response.dto';

export type GoogleUserPayload = {
  email: string;
  googleId: string;
  name?: string;
  avatar?: string;
};

type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

type AuthResponse = AuthTokens & {
  user: UserResponseDto;
};

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
  ): Promise<AuthResponse> {

    const user = await this.userService.searchByEmail(userLoginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new UnauthorizedException('This account uses Google login');
    }

    const isPasswordValid = await bcrypt.compare(
      userLoginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.createAuthResponse(user);
  }

  async signUp(userRegisterDto: UserRegisterDto): Promise<AuthResponse> {
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
    return this.createAuthResponse(user);
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.getRefreshTokenSecret(),
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

  async googleLogin(googleUser: GoogleUserPayload): Promise<AuthResponse> {
    let user = await this.userService.searchByEmail(googleUser.email);

    if (!user) {
      const partial: DeepPartial<User> = {
        email: googleUser.email,
        googleId: googleUser.googleId,
        name: googleUser.name || googleUser.email.split('@')[0],
        avatar: googleUser.avatar,
        role: UserRole.USER,
      };

      user = await this.userRepository.save(partial);
    } else {
      const updateData: DeepPartial<User> = {
        googleId: user.googleId || googleUser.googleId,
        avatar: googleUser.avatar || user.avatar,
      };

      if (!user.name && googleUser.name) {
        updateData.name = googleUser.name;
      }

      await this.userRepository.update(user.id, updateData);
      user = (await this.userService.getUser(user.id)) as User;
    }

    return this.createAuthResponse(user);
  }

  private createAuthResponse(user: User): AuthResponse {
    return {
      ...this.generateTokens(user),
      user: UserMapper.toResponse(user),
    };
  }

  private generateTokens(user: User): AuthTokens {
    return {
      access_token: this.generateAccessToken(user),
      refresh_token: this.generateRefreshToken(user),
    };
  }

  private generateAccessToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload, {
      secret: this.getAccessTokenSecret(),
      expiresIn: '15m',
    });
  }

  private generateRefreshToken(user: User) {
    const payload = { sub: user.id };
    return this.jwtService.sign(payload, {
      secret: this.getRefreshTokenSecret(),
      expiresIn: '7d',
    })
  }

  private getAccessTokenSecret() {
    return process.env.JWT_SECRET || '1234';
  }

  private getRefreshTokenSecret() {
    return process.env.JWT_REFRESH_SECRET || 'refresh-secret-key';
  }

  validateUser(id: number) {
    const user = this.userService.getUser(id);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
