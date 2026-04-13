import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("brand")
export class Brand {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @IsString()
    name!: string

    @IsString()
    logoUrl!: string
}
