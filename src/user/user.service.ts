import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUsers(): string[] {
    return ['John', 'Jane', 'Jim', 'Jill'];
  }
}
