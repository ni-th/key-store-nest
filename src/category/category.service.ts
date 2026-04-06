

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Category } from './entity/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { SortOrder } from 'src/common/dto/pagination-query.dto';



@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: dto.name },
    });

    if (existingCategory) {
      throw new ConflictException(`Category '${dto.name}' already exists`);
    }

    const category = this.categoryRepository.create(dto);
    return this.categoryRepository.save(category);
  }

  async getCategories(page = 1, limit = 10, sort?: SortOrder, search?: string): Promise<PaginatedResponseDto<Category>> {
    const normalizedSearch = search?.trim();

    const [data, total] = await this.categoryRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: sort || 'DESC' },
      where: normalizedSearch ? { name: Like(`%${normalizedSearch}%`) } : undefined,
    });

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getCategory(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async updateCategory(id: number, dto: UpdateCategoryDto): Promise<Category> {
    await this.categoryRepository.update(id, dto);
    return this.getCategory(id);
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await this.getCategory(id);
    await this.categoryRepository.delete(category.id);
  }
}
