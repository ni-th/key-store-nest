import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from '../../product_images/entities/product_image.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255 })
    @IsString()
    name!: string;

    @Column({ type: 'text' })
    @IsString()
    description!: string;

    @Column({ type: 'float' })
    @IsNumber()
    price!: number;

    @Column({ type: 'float' })
    @IsNumber()
    purchasePrice!: number;

    @Column({ type: 'int' })
    @IsNumber()
    warranty!: number;

    @Column({ type: 'float', default: 0 })
    @IsNumber()
    discount!: number;

    @Column({ type: 'boolean', default: false })
    @IsBoolean()
    isDeleted!: boolean;

    @OneToMany(() => ProductImage, (image) => image.product)
    images!: ProductImage[];
}
