import { inject, injectable } from "inversify";
import "reflect-metadata";
import type IProductRepository from "@/domain/repository/Product/IProductRepository";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import {
    NumberListParam,
    NumberComparator,
    SortListParam,
    SortListType,
    StringComparator
} from "@/domain/entity/List/list";
import { ProductSearch, ProductListParams, ProductSuggestion, Search } from '@/domain/entity/Product/product';

@injectable()
export default class ProductsSearchUseCase {
    private readonly productRepository: IProductRepository;

    constructor(@inject(RepositoryTypes.ProductRepository) productRepository: IProductRepository,) {
        this.productRepository = productRepository;
    }

    private getProductSearchParams(params: Search): ProductListParams {
        const searchParams = params.search ? {
            name: {
                value: params.search,
                comparator: StringComparator.CONTAINS
            },
            description: {
                value: params.search,
                comparator: StringComparator.CONTAINS
            },
            keywords: {
                value: params.search,
                comparator: StringComparator.CONTAINS
            },
            seoKeywords: {
                value: params.search,
                comparator: StringComparator.CONTAINS
            }
        } : {};
        let sort: undefined | SortListParam<'points' | 'priority'> = undefined;

        if (params.sort) {
            const [field, type] = params.sort.split("-");
            sort = {
                type: type as SortListType,
                field: field as 'points' | 'priority'
            }
        }

        if ((params.productIds && params.productIds.length > 0) && !params.sort) {
            sort = {
                type: SortListType.ASC,
                field: "priority"
            }
        }
        let minPointsPrice: undefined | NumberListParam = undefined
        if (params.points && params.points.length > 0) {
            const [min, max] = params.points;

            if (max !== undefined && max !== min) {
                // Range case: [5001, 10000] -> >= 5001 AND <= 10000
                minPointsPrice = {
                    value: max,
                    comparator: NumberComparator.LESS_THAN_EQUAL_TO,
                    and: {
                        value: min,
                        comparator: NumberComparator.GREATER_THAN_EQUAL_TO
                    }
                };
            } else if (min === 10001) {
                // Single value >= case (10001+)
                minPointsPrice = {
                    value: min,
                    comparator: NumberComparator.GREATER_THAN_EQUAL_TO
                };
            } else {
                // Single value <= case
                minPointsPrice = {
                    value: min,
                    comparator: NumberComparator.LESS_THAN_EQUAL_TO
                };
            }
        }

        return {
            ...searchParams,
            id: params.productIds ?? undefined,
            categoryId: params.category,
            brandId: params.brand,
            minPointsPrice,
            sort,
            page: params.page,
            pageSize: params.perPage
        }
    }

    async searchProducts(params: Search): Promise<ProductSearch> {
        const searchParams = this.getProductSearchParams(params);
        return this.productRepository.getProductSearch(searchParams);
    }

    async getAutocompleteProducts(search: string): Promise<ProductSuggestion[]> {
        const suggestionsParams = {
            name: search ? {
                value: search,
                comparator: StringComparator.CONTAINS
            } : undefined,
        };

        return await this.productRepository.getProductSuggestions(suggestionsParams);
    }
}
