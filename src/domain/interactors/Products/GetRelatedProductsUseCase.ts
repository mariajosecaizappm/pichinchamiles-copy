import {inject, injectable} from "inversify";
import "reflect-metadata";
import type IProductRepository from "@/domain/repository/Product/IProductRepository";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import { SortListType, StringComparator } from "@/domain/entity/List/list";
import { Product } from "@/domain/entity/Product/product";

@injectable()
export default class GetRelatedProductsUseCase {
    private productRepository: IProductRepository;

    constructor(@inject(RepositoryTypes.ProductRepository) productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }

    async getRelatedProducts(productId: string, categoryId: string): Promise<Product[]> {
        const productsList = await this.productRepository.getProducts({
            id: {
                value: productId,
                comparator: StringComparator.NOT_EQUAL
            },
            categoryId,
            sort: {
                type: SortListType.ASC,
                field: 'points'
            },
            page: 1,
            pageSize: 10
        });
        return productsList.data;
    }
}
