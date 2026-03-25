import {
  ArgumentMetadata,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

export class UserExistPipe implements PipeTransform {
  constructor(private userRepository: Repository<User>) {}
  async transform(value: number, metadata: ArgumentMetadata): Promise<User> {
    void metadata;
    const user: User | null = await this.userRepository.findOne({
      where: { id: value },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${value} not found`);
    }
    return user;
  }
}
