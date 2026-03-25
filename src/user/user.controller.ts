import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserExistPipe } from './pipes/user-exist.pipe';
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
  @Put('update-user/:id')
  async updateUser(
    @Param('id', ParseIntPipe, UserExistPipe) id: number,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    return this.userService.updateUser(id, updateData);
  }
  @Delete('delete-user/:id')
  async deleteUser(
    @Param('id', ParseIntPipe, UserExistPipe) user: User,
  ): Promise<void> {
    await this.userService.deleteUser(user.id);
  }
}
