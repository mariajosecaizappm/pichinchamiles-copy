"use client"

import { ProductSearch } from "@/domain/entity/Product/product"
import { useEffect } from "react"
import useProductSearch from "@/presentation/hooks/useProductSearch"
import ProductsList from "./ProductsList"

type Props = {
    products: ProductSearch | null
    searchQuery?: string
    className?: string
    brandIds?: string[]
    onBrandsChange?: (brandIds: string[]) => void
    onCategoriesChange?: (categories: string[]) => void
    breadcrumbs?: React.ReactNode
    searchResultsText?: React.ReactNode
    noResultsClassName?: string
}

const ProductsListBaseContainer = ({
    products,
    searchQuery = "",
    className,
    brandIds,
    onBrandsChange,
    onCategoriesChange,
    breadcrumbs,
    searchResultsText,
    noResultsClassName,
}: Props) => {
    const { searchValues } = useProductSearch()

    useEffect(() => {
        if (onCategoriesChange && products?.categories) {
            onCategoriesChange(Object.keys(products.categories))
        }
        if (onBrandsChange && products?.brandIds) {
            const shouldUpdateBrands = !searchValues.brand || (brandIds?.length === 0)
            if (shouldUpdateBrands) {
                onBrandsChange(products.brandIds)
            }
        }
    }, [products, searchValues.brand, brandIds?.length, onCategoriesChange, onBrandsChange])

    return (
        <ProductsList
            products={products}
            searchQuery={searchQuery}
            className={className}
            breadcrumbs={breadcrumbs}
            searchResultsText={searchResultsText}
            noResultsClassName={noResultsClassName}
        />
    )
}

export default ProductsListBaseContainer
