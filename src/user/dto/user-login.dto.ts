import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;
}
