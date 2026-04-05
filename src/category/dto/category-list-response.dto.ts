import { Category } from "../entity/category.entity";

export class CategoryListResponse {
  data!: Category[];
  total!: number;
  page!: number;
  limit!: number;
  totalPages!: number;
}