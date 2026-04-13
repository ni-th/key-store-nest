import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBrandDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString()
    @MaxLength(120)
    name!: string

    @IsNotEmpty({ message: 'Logo URL is required' })
    @IsString()
    logoUrl!: string
}
