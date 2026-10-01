"use client"

import useProductSearch from "@/presentation/hooks/useProductSearch"
import useFilterDraft from "@/presentation/pages/Products/hooks/useFilterDraft"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { buildProductsHref, buildSingleKeyParams } from "../../ProductsFiltersConfig"
import useProductBrands from "@/presentation/pages/Products/hooks/useProductBrands"
import BrandsDrawer from "./BrandsDrawer"

type Props = {
    brandIds: string[]
}

const BrandsDrawerBaseContainer = ({ brandIds }: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const { searchValues, searchParams } = useProductSearch()
    const { brands, isLoading } = useProductBrands({ brands: brandIds || [], enabled: isOpen })

    const committedBrand = searchValues.brand || null
    const { draft: brandState, setDraft: setBrandState, reset: resetBrand } = useFilterDraft(committedBrand)

    const handleApplyFilters = () => {
        router.replace(buildProductsHref(pathname, searchParams, buildSingleKeyParams("brand", brandState)))
        setIsOpen(false)
    }

    const handleClearFilters = () => {
        router.replace(buildProductsHref(pathname, searchParams, buildSingleKeyParams("brand", null)))
        setBrandState(null)
    }

    const handleClose = () => {
        resetBrand(committedBrand)
    }

    if (!isLoading && (!brandIds || brandIds.length === 0)) return null

    return (
        <BrandsDrawer
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
            onClose={handleClose}
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            brands={brands || []}
            isLoading={isLoading}
            selectedBrand={brandState}
            onSelectBrand={setBrandState}
        />
    )
}

export default BrandsDrawerBaseContainer
