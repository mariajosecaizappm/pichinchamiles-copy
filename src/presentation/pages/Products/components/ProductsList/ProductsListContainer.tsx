"use client"

import { ProductSearch } from "@/domain/entity/Product/product"
import { useProductsContext } from "../../context/useProductsContext"
import ProductsBreadcrumbs from "../ProductsBreadcrumbs"
import ProductSearchResultsText from "../ProductSearchResultsText/ProductSearchResultsText"
import ProductsListBaseContainer from "./ProductsListBaseContainer"

type Props = {
    products: ProductSearch | null
    searchQuery?: string
    className?: string
}

const ProductsListContainer = ({ products, searchQuery = "", className }: Props) => {
    const { productBrands, setProductCategories, setProductBrands } = useProductsContext()

    return (
        <ProductsListBaseContainer
            products={products}
            searchQuery={searchQuery}
            className={className}
            brandIds={productBrands}
            onBrandsChange={setProductBrands}
            onCategoriesChange={setProductCategories}
            breadcrumbs={<ProductsBreadcrumbs />}
            searchResultsText={
                <ProductSearchResultsText
                    searchQuery={searchQuery}
                    total={products?.list.pagination.total ?? 0}
                />
            }
        />
    )
}

export default ProductsListContainer