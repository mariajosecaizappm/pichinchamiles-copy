import { inject, injectable } from "inversify";
import "reflect-metadata";
import { NumberComparator, SortListType } from "@/domain/entity/List/list";
import { Product } from "@/domain/entity/Product/product";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import type IProductRepository from "@/domain/repository/Product/IProductRepository";

const PUBLIC_RECOMMENDED_PRODUCTS_PAGE_SIZE = 12;

@injectable()
export default class GetRecommendedProductsUseCase {
    private readonly productRepository: IProductRepository;

    constructor(
        @inject(RepositoryTypes.ProductRepository) productRepository: IProductRepository
    ) {
        this.productRepository = productRepository;
    }

    async getPublicRecommendedProducts(): Promise<Product[]> {
        const productsList = await this.productRepository.getProducts({
            minPointsPrice: { value: 0, comparator: NumberComparator.GREATER_THAN },
            recommended: true,
            sort: { field: "priority", type: SortListType.ASC },
            page: 1,
            pageSize: PUBLIC_RECOMMENDED_PRODUCTS_PAGE_SIZE,
        });

        return productsList.data;
    }
}
