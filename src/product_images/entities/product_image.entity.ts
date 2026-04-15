import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class ProductImage {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid' })
    productId!: string;

    @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productId' })
    product!: Product;

    @Column({ type: 'text' })
    imageUrl!: string;

    @Column({ type: 'int', default: 0 })
    order!: number;
}
