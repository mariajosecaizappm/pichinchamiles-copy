"use client"

import { useProductsContext } from "@/presentation/pages/Products/context/useProductsContext"
import { getProductsBrowseTitle } from "@/presentation/helpers/product"
import { useParams, usePathname } from "next/navigation"
import { useMemo } from "react"

type ProductSearchResultsTextProps = {
    searchQuery?: string
    total?: number
    isLoading?: boolean
}

const ProductSearchResultsText = ({
    searchQuery = "",
    total = 0,
    isLoading = false,
}: ProductSearchResultsTextProps) => {
    const pathname = usePathname() ?? ""
    const params = useParams()
    const { categorization } = useProductsContext()

    const normalizedQuery = searchQuery.trim()

    const browseTitle = useMemo(
        () =>
            getProductsBrowseTitle({
                pathname,
                params,
                categorization,
            }),
        [pathname, params, categorization],
    )

    if (normalizedQuery) {
        if (!isLoading && total === 0) {
            return (
                <p className="text-[22px] font-normal text-blue-500 font-slab">
                    No se encontraron resultados
                </p>
            )
        }

        return (
            <p className="text-[22px] font-normal text-blue-500 font-slab">
                Resultado de &ldquo;{normalizedQuery}&rdquo;
                {!isLoading && ` (${total})`}
            </p>
        )
    }

    if (browseTitle === null) {
        return null
    }

    return (
        <p className="text-[22px] font-normal text-blue-500 font-slab">
            {browseTitle}
            {!isLoading && ` (${total})`}
        </p>
    )
}

export default ProductSearchResultsText
