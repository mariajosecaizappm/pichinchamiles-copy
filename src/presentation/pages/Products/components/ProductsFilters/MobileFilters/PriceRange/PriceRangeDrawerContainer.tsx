"use client"

import useProductSearch from "@/presentation/hooks/useProductSearch"
import useFilterDraft from "@/presentation/pages/Products/hooks/useFilterDraft"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { buildProductsHref, buildSingleKeyParams } from "../../ProductsFiltersConfig"
import PriceRangeDrawer from "./PriceRangeDrawer"

const PriceRangeDrawerContainer = () => {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const { searchParams } = useProductSearch()

    const committedPoints = searchParams.get("points")

    const { draft: pointsState, setDraft: setPointsState, reset: resetPoints } = useFilterDraft(committedPoints)


    const handleApplyFilters = () => {
        router.push(buildProductsHref(pathname, searchParams, buildSingleKeyParams("points", pointsState)))
        setIsOpen(false)
    }

    const handleClose = () => {
        setPointsState(committedPoints)
        setIsOpen(false)
    }

    const handleClearFilters = () => {
        router.replace(buildProductsHref(pathname, searchParams, buildSingleKeyParams("points", null)))
        resetPoints(null)
    }

    return (
        <PriceRangeDrawer
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            onClose={handleClose}
            selectedOption={pointsState}
            onSelectionChange={setPointsState}
        />
    )
}

export default PriceRangeDrawerContainer
