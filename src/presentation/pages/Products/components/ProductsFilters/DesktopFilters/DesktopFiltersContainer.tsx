"use client"

import { useParams } from "next/navigation"
import { useProductsContext } from "../../../context/useProductsContext"
import useFilterNavigation from "../../../hooks/useFilterNavigation"
import DesktopFilters from "./DesktopFilters"
import DesktopFiltersWrapper from "./DesktopFiltersWrapper"

const DesktopFiltersContainer = () => {
    const { category } = useParams()
    const { handleClearFilters, isPending } = useFilterNavigation({ method: "push", wrapTransition: true })
    const { categorization } = useProductsContext()
    const subcategories = categorization?.getSubcategoriesBySlug(category as string)

    return (
        <DesktopFiltersWrapper
            onClearFilters={handleClearFilters}
            isLoading={isPending}
            className={
                category && subcategories && subcategories.length > 0 ? "lg:top-[257px]" : "lg:top-[201px]"
            }
        >
            <DesktopFilters />
        </DesktopFiltersWrapper>
    )
}

export default DesktopFiltersContainer