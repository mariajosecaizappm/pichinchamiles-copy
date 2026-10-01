"use client"

import { ProductSearch } from "@/domain/entity/Product/product"
import ProductsListGrid from "./ProductsListGrid"
import ProductsListNoResults from "./ProductsListNoResults"
import ProductsListPagination from "./ProductsListPagination"
import { cn } from "@heroui/react"
import ProductSearchResultsText from "../ProductSearchResultsText"

type Props = {
    products: ProductSearch | null
    searchQuery?: string
    className?: string
    breadcrumbs?: React.ReactNode
    searchResultsText?: React.ReactNode
    noResultsClassName?: string
}

const ProductsList = ({
    products,
    searchQuery = "",
    className,
    breadcrumbs,
    searchResultsText,
    noResultsClassName,
}: Props) => {
    if (!products) return null
    const { data, pagination } = products.list
    return (
        <div className={cn("body-container lg:px-0 flex flex-col gap-2 py-3", className)}>
            {breadcrumbs}
            {searchResultsText || (
                <ProductSearchResultsText
                    searchQuery={searchQuery}
                    total={pagination.total}
                />
            )}
            {data.length > 0 ? (
                <div className="lg:p-3">
                    <ProductsListGrid products={data} />
                </div>
            ) : (
                <ProductsListNoResults hasSearchQuery={Boolean(searchQuery.trim())} className={noResultsClassName} />
            )}
            <ProductsListPagination
                page={pagination.page}
                totalPages={pagination.totalPages}
            />
        </div>
    )
}

export default ProductsList