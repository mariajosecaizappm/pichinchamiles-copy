import { ProductVariation } from "@/domain/entity/Product/product";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import type IProductRepository from "@/domain/repository/Product/IProductRepository";
import type IVariationRepository from "@/domain/repository/Variation/IVariationRepository";
import { inject, injectable } from "inversify";
import "reflect-metadata";


@injectable()
export default class GetProductDetailUseCase {
    private productRepository: IProductRepository;
    private variationRepository: IVariationRepository;

    constructor(
        @inject(RepositoryTypes.ProductRepository) productRepository: IProductRepository,
        @inject(RepositoryTypes.VariationRepository) variationRepository: IVariationRepository,
    ) {
        this.productRepository = productRepository;
        this.variationRepository = variationRepository;
    }

    async getProductDetails(slug: string): Promise<ProductVariation | { product: null; variations: [] }> {
        const product = await this.productRepository.getProductBySlug(slug);
        if (!product) {
            return {
                product: null,
                variations: []
            }
        }
        const variationList = await this.variationRepository.getVariations({
            productId: product.id,
            page: 1,
            pageSize: 40
        });
        return {
            product,
            variations: variationList,
        }
    }
}