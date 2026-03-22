import { Controller, Get, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get-users')
  getUsers(): string[] {
    // return this.userService.getUsers();
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
