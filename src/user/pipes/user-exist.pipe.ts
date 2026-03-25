import {
  ArgumentMetadata,
  NotFoundException,
  PipeTransform,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserExistPipe implements PipeTransform {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async transform(value: number, metadata: ArgumentMetadata): Promise<number> {
    void metadata;
    const user: User | null = await this.userRepository.findOne({
      where: { id: value },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${value} not found`);
    }
    return value;
  }
}
