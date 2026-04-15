import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entity/user.entity';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entity/category.entity';
import { ProductModule } from './product/product.module';
import { ProductImagesModule } from './product_images/product_images.module';
import { Product } from './product/entities/product.entity';
import { ProductImage } from './product_images/entities/product_image.entity';

@Module({
  imports: [
    UserModule,
    CategoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'keymart',
      entities: [User, Category, Product, ProductImage],
      synchronize: true,
    }),
    AuthModule,
    ProductModule,
    ProductImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
