"use client"

import useSubcategoriesFromUrl from "@/presentation/pages/Products/hooks/useSubcategoriesFromUrl"
import {useParams, useSearchParams} from "next/navigation"
import {CategoryWithCount} from "../types"
import Subcategories from "./Subcategories"
import useAnalytics from "@/presentation/hooks/useAnalytics";
import {useEffect} from "react";
import {EventName} from "@/presentation/analytics/types";

const SubcategoriesContainer = () => {
    const params = useParams()
    const searchParams = useSearchParams()
    const { track } = useAnalytics();

    const { category: currentCategorySlug, subcategory: currentSubcategorySlug } = params as {
        category?: string
        subcategory?: string
    }

    const { subcategories } = useSubcategoriesFromUrl("category")

    const buildSubcategoryHref = (subcategorySlug: string) => {
        if (!currentCategorySlug) return "#"
        const params = new URLSearchParams(searchParams.toString())
        params.delete('subcategory')
        params.delete('brand')
        params.delete('page')
        const basePath = `/productos/categoria/${currentCategorySlug}`
        const query = params.toString()
        const targetPath = subcategorySlug === currentSubcategorySlug
            ? basePath
            : `${basePath}/${subcategorySlug}`

        if (!query) return targetPath

        return `${targetPath}?${query}`
    }

    useEffect(() => {
        if(subcategories.length > 0){
            track(EventName.VIEWED_FILTER, { filters: subcategories })
        }
    }, [subcategories]);

    if (!currentCategorySlug || !subcategories.length) {
        return null
    }

    return (
        <div className="py-3 min-w-0">
            <Subcategories
                categories={subcategories as CategoryWithCount[]}
                activeSubcategory={currentSubcategorySlug ?? ""}
                buildSubcategoryHref={buildSubcategoryHref}
            />
        </div>
    )
}

export default SubcategoriesContainer