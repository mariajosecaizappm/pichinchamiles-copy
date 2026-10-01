"use client"

import { useParams, useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { readSubcategoryIds } from "../components/ProductsFilters/ProductsFiltersConfig"
import { useProductsContext } from "../context/useProductsContext"

const useProductSubcategories = () => {
    const params = useParams()
    const searchParams = useSearchParams()
    const { categorization } = useProductsContext()

    const currentMainSubcategory = params.subcategory as string

    const subcategories = useMemo(
        () =>
            currentMainSubcategory && categorization
                ? categorization.getSubcategoriesBySlug(currentMainSubcategory)
                : [],
        [categorization, currentMainSubcategory],
    )

    const committedSubcategoryIds = useMemo(
        () => readSubcategoryIds(searchParams),
        [searchParams],
    )

    const selectedSubcategoriesFromUrl = useMemo(() => {
        const allSubcategories = [
            ...subcategories,
            ...subcategories.flatMap((sub) => sub.subcategories ?? []),
        ]

        return allSubcategories.filter((sub) => committedSubcategoryIds.includes(sub.id))
    }, [subcategories, committedSubcategoryIds])

    return {
        subcategories,
        committedSubcategoryIds,
        selectedSubcategoriesFromUrl,
    }
}

export default useProductSubcategories