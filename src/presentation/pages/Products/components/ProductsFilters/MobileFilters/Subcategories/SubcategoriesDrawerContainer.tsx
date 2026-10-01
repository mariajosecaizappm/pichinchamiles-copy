"use client"

import { CategoryGroup } from "@/domain/entity/Category/structure/category"
import useProductSearch from "@/presentation/hooks/useProductSearch"
import useFilterDraft from "@/presentation/pages/Products/hooks/useFilterDraft"
import useProductSubcategories from "@/presentation/pages/Products/hooks/useProductSubcategories"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
    buildProductsHref,
    buildSubcategoryReplaceParams
} from "../../ProductsFiltersConfig"
import SubcategoriesDrawer from "./SubcategoriesDrawer"
import useAnalytics from "@/presentation/hooks/useAnalytics";
import {EventName} from "@/presentation/analytics/types";


const SubcategoriesDrawerContainer = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [activeNestedSubcategory, setActiveNestedSubcategory] = useState<CategoryGroup | null>(null)

    const router = useRouter()
    const pathname = usePathname()
    const { searchParams, } = useProductSearch()
    const { subcategories, selectedSubcategoriesFromUrl } = useProductSubcategories()
    const { track } = useAnalytics();

    const {
        draft: selectedSubcategories,
        setDraft: setSelectedSubcategories,
        reset: resetSubcategories,
    } = useFilterDraft<CategoryGroup[]>(selectedSubcategoriesFromUrl)

    const handleApplyFilters = () => {
        const ids = selectedSubcategories.map((s) => s.id)
        router.push(buildProductsHref(pathname, searchParams, buildSubcategoryReplaceParams(ids)))
        setIsOpen(false)
    }

    const handleClearFilters = () => {
        setSelectedSubcategories([])
        router.replace(buildProductsHref(pathname, searchParams, buildSubcategoryReplaceParams([])))
    }

    const handleSelectSubcategory = (subcategory: CategoryGroup) => {
        track(EventName.CLICKED_FILTERS, {type: "category", filter: subcategory});
        if (subcategory.subcategories?.length) {
            setActiveNestedSubcategory(subcategory)
        } else {
            setSelectedSubcategories((prev) =>
                prev.some((s) => s.id === subcategory.id)
                    ? prev.filter((s) => s.id !== subcategory.id)
                    : [...prev, subcategory]
            )
        }
    }

    const handleClose = () => {
        resetSubcategories(selectedSubcategoriesFromUrl)
        setActiveNestedSubcategory(null)
    }

    return (
        <SubcategoriesDrawer
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
            onClose={handleClose}
            activeSubcategory={activeNestedSubcategory}
            subcategories={subcategories ?? []}
            selectedSubcategories={selectedSubcategories}
            onSelectSubcategory={handleSelectSubcategory}
            setActiveSubcategory={setActiveNestedSubcategory}
        />
    )
}

export default SubcategoriesDrawerContainer
