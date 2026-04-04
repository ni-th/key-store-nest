import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../enums/user-role.enum';



@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ unique: true, nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'user'],
    default: 'user',
    enumName: 'user_role',
  })
  role!: UserRole;

  @Column({ default: false })
  isDeleted?: boolean;
  
  @Column({ nullable: true })
  createdAt?: Date;
}
