
import { injectable } from "inversify";
import RepositoryBase from "../RepositoryBase";
import { Product, ProductListParams, ProductSearch, ProductSuggestion } from "@/domain/entity/Product/product";
import { List, SortListType } from "@/domain/entity/List/list";
import AlgoliaClient from "@/data/provider/algolia/algoliaClient";
import { AlgoliaIndex } from "@/data/provider/algolia/types";
import IProductRepository from "@/domain/repository/Product/IProductRepository";
import { getProductAdapter, getProductSuggestionAdapter } from "@/data/adapters/Product/productAdapter";

@injectable()
export default class ProductRepository extends RepositoryBase implements IProductRepository {
    private algoliaClient = new AlgoliaClient(AlgoliaIndex.PRODUCTS);


    async getProductBySlug(slug: string): Promise<Product> {
        const { list } = await this.algoliaClient.search({
            adapter: getProductAdapter,
            params: {
                slug,
                programId: this.programId
            }
        })
        return list.data[0]
    }

    async getProducts(params: ProductListParams): Promise<List<Product>> {
        const { list } = await this.getProductSearch(params)
        return list
    }

    async getProductSearch(params: ProductListParams): Promise<ProductSearch> {
        const { list, facets } = await this.algoliaClient.search({
            adapter: getProductAdapter,
            nameMap: {
                brandSlug: 'brand.slug',
                brandId: 'brand.brandId',
                categoryId: 'categories.categoryId',
                parentCategoryId: 'categories.parentId'
            },
            sortMap: {
                points: {
                    [SortListType.ASC]: AlgoliaIndex.PRODUCTS_POINTS_ASC,
                    [SortListType.DESC]: AlgoliaIndex.PRODUCTS_POINTS_DESC
                },
                priority: {
                    [SortListType.ASC]: AlgoliaIndex.PRODUCTS_PRIORITY_ASC,
                    [SortListType.DESC]: AlgoliaIndex.PRODUCTS
                }
            },
            params: {
                ...params,
                programId: this.programId
            }
        })
        

        const getIdFacet = (key: string) => {
            if (facets?.[key]) {
                return Object.entries(facets[key])
                    .filter(([, results]) => results > 0)
                    .map(([id]) => id)
            }

            return []
        }

        const getResultsFacet = (key: string) => {
            return (facets?.[key]) ?? {}
        }

        return {
            list,
            brandIds: getIdFacet('brand.brandId'),
            categoryIds: getIdFacet('categories.categoryId'),
            categories: getResultsFacet('categories.name')
        }
    }

    async getProductSuggestions(params: ProductListParams): Promise<ProductSuggestion[]> {
        const algoliaSuggestionsClient = new AlgoliaClient(AlgoliaIndex.PRODUCTS_QUERY_SUGGESTIONS);

        const searchParams = {
            ...params,
            query: params.name
        };

        const productSearch = await algoliaSuggestionsClient.search({
            adapter: getProductSuggestionAdapter,
            params: searchParams
        });

        return productSearch.list.data;
    }
}