import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {

  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  description!: string;
}
