import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  CategoryService,
} from './category.service';
import { Category } from './entity/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryPaginationDto } from './dto/category-pagination.dto';
import { CategoryListResponse } from './dto/category-list-response.dto';

@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create-category')
  async createCategory(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.createCategory(dto);
  }

  @Get('get-categories')
  async getCategories(
    @Query() paginationDto: CategoryPaginationDto,
  ): Promise<CategoryListResponse> {
    return this.categoryService.getCategories(paginationDto.page, paginationDto.limit);
  }

  @Get('get-category/:id')
  async getCategory(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoryService.getCategory(id);
  }

  @Put('update-category/:id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, dto);
  }

  @Delete('delete-category/:id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoryService.deleteCategory(id);
  }
}
