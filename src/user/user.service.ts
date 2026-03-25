import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserRole } from './entity/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRegisterDto } from './dto/user-register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async createUser(dto: UserRegisterDto): Promise<User> {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const partial: DeepPartial<User> = {
      name: dto.name,
      email: dto.email,
      password: passwordHash,
      role: UserRole.USER,
    };
    return this.userRepository.save(partial);
  }
  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUser(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, updateData);
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return updatedUser;
  }
  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
