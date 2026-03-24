import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterDto } from './dto/user-register.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get-users')
  getUsers(): string[] {
    return this.userService.getUsers();
  }

  @Get('get-user/:id')
  getUser(@Param('id', ParseIntPipe) id: number): number {
    return this.userService.getUser(id);
  }

  @Post('register')
  register(@Body() userRegisterDto: UserRegisterDto): void {
    console.log(userRegisterDto);
  }
}
