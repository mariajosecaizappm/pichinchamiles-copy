"use client"

import { CategoryGroup } from "@/domain/entity/Category/structure/category"
import { useParams } from "next/navigation"
import { useMemo } from "react"
import { useProductsContext } from "../context/useProductsContext"

type SlugSource = "category" | "subcategory"

const useSubcategoriesFromUrl = (paramKey: SlugSource = "subcategory") => {
    const params = useParams()
    const { categorization } = useProductsContext()

    const slug = (params[paramKey] as string | undefined) ?? ""

    const subcategories = useMemo<CategoryGroup[]>(() => {
        if (!slug || !categorization) return []
        return categorization.getSubcategoriesBySlug(slug)
    }, [slug, categorization])

    return { subcategories, slug }
}

export default useSubcategoriesFromUrl
