import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserExistPipe } from './pipes.user-exist.pipe';
import { User } from './entity/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get-users')
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Get('get-user/:id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
    return await this.userService.getUser(id);
  }

  @Post('register')
  async register(@Body() userRegisterDto: UserRegisterDto): Promise<User> {
    return await this.userService.createUser(userRegisterDto);
  }
  @Post('update-user/:id')
  async updateUser(
    @Param('id', ParseIntPipe, UserExistPipe) user: User,
  ): Promise<User> {
    return this.userService.updateUser(user.id, user);
  }
  @Delete('delete-user/:id')
  async deleteUser(
    @Param('id', ParseIntPipe, UserExistPipe) user: User,
  ): Promise<void> {
    await this.userService.deleteUser(user.id);
  }
}
