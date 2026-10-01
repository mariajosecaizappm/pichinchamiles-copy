import { List } from "@/domain/entity/List/list";
import { Product, ProductListParams, ProductSearch, ProductSuggestion } from "@/domain/entity/Product/product";


export default interface IProductRepository {
    getProducts(params: ProductListParams): Promise<List<Product>>
    getProductSearch(params: ProductListParams): Promise<ProductSearch>
    getProductSuggestions(params: ProductListParams): Promise<ProductSuggestion[]>
    getProductBySlug(slug: string): Promise<Product>
}
