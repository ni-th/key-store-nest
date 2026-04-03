import { Expose } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';

export class UserResponseDto {
      @Expose()
      id!: number;

      @Expose()
      name?: string;

      @Expose()
      email?: string;

      @Expose()
      avatar?: string;

      @Expose()
      role!: UserRole;
}