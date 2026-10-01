"use client"

import { type PointerEvent, useState, useTransition } from "react"
import useProductSearch from "@/presentation/hooks/useProductSearch"
import useProductBrands from "@/presentation/pages/Products/hooks/useProductBrands"
import { PRODUCT_SEARCH_KEYS } from "../../ProductsFiltersConfig"
import useAnalytics from "@/presentation/hooks/useAnalytics"
import { EventName } from "@/presentation/analytics/types"
import BrandFilter from "./BrandFilter"

type Props = {
    brandIds: string[]
    enabled?: boolean
    onAccordionOpenChange?: (isOpen: boolean) => void
}

const BrandFilterBaseContainer = ({ brandIds, enabled = true, onAccordionOpenChange }: Props) => {
    const [isPending, startTransition] = useTransition()
    const { searchValues, onChangeFilter } = useProductSearch()
    const currentBrand = searchValues.brand
    const { brands, isLoading } = useProductBrands({ brands: brandIds || [], enabled })
    const { track } = useAnalytics()

    const [showAllBrands, setShowAllBrands] = useState(false)

    const handleCheck = (value: string) => {
        if (currentBrand === value) return

        const brand = brands.find((brand) => brand.id === value)
        if (brand) {
            track(EventName.CLICKED_FILTERS, { type: "brand", filter: brand })
        }

        startTransition(() => {
            onChangeFilter(PRODUCT_SEARCH_KEYS.brand, value)
        })
    }

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>, value: string) => {
        if (currentBrand === value) {
            event.preventDefault()
            event.stopPropagation()

            startTransition(() => {
                onChangeFilter(PRODUCT_SEARCH_KEYS.brand, "")
            })
        }
    }

    if (!isLoading && !brandIds.length) {
        return null
    }

    return (
        <BrandFilter
            isLoading={isLoading}
            brands={brands}
            showAllBrands={showAllBrands}
            currentBrand={currentBrand}
            onCheckBrand={handleCheck}
            setShowAllBrands={setShowAllBrands}
            isPending={isPending}
            onPressBrand={handlePointerDown}
            onAccordionOpenChange={onAccordionOpenChange}
        />
    )
}

export default BrandFilterBaseContainer
