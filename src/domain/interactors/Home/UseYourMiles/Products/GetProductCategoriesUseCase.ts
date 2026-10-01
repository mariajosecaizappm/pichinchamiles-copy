import { Category, CategoryParams } from "@/domain/entity/Category/structure/category";
import { List } from "@/domain/entity/List/list";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import type ICategoryRepository from "@/domain/repository/Category/ICategoryRepository";
import type IProductRepository from "@/domain/repository/Product/IProductRepository";
import { CategoryWithCount } from "@/presentation/pages/Products/components/Categories/types";
import { inject, injectable } from "inversify";
import "reflect-metadata";


@injectable()
export default class GetProductCategoriesUseCase {
    private readonly categoryRepository: ICategoryRepository;
    private readonly productRepository: IProductRepository;

    constructor(
        @inject(RepositoryTypes.CategoryRepository) categoryRepository: ICategoryRepository,
        @inject(RepositoryTypes.ProductRepository) productRepository: IProductRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository
    }

    async getHomeMenuMainCategories(params?: CategoryParams, productPageSize: number = 10): Promise<CategoryWithCount[]> {
        const [categoryList, productSearch] = await Promise.all([
            this.categoryRepository.getCategories({
                page: 1,
                pageSize: 1000,
                ...params
            }),
            this.productRepository.getProductSearch({
                page: 1,
                pageSize: productPageSize
            })
        ])

        const filteredCategories = categoryList.data.filter(category => productSearch.categoryIds.includes(category.id))
        
        return filteredCategories.map(category => ({
            ...category,
            count: productSearch.categories[category.name] || 0
        }))
    }

    async getCategories(params?: CategoryParams): Promise<List<Category>> {
        return this.categoryRepository.getCategories(params || {});
    }

}

