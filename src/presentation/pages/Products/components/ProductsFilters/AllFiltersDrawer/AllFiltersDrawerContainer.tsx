"use client"

import { CategoryGroup } from "@/domain/entity/Category/structure/category"
import useProductSearch from "@/presentation/hooks/useProductSearch"
import useFilterDraft from "@/presentation/pages/Products/hooks/useFilterDraft"
import { useDisclosure, Divider } from "@heroui/react"

import { useState } from "react"
import useProductBrands from "../../../hooks/useProductBrands"
import useProductSubcategories from "../../../hooks/useProductSubcategories"
import {
    CLEAR_ALL_FILTERS_PARAMS,
    buildOrderBySearchParams,
    buildSingleKeyParams,
    buildSubcategoryReplaceParams,
} from "../ProductsFiltersConfig"
import { OrderByValue } from "../types"
import AllFiltersDrawer from "./AllFiltersDrawer"
import { useProductsContext } from "../../../context/useProductsContext"
import useFilterNavigation from "../../../hooks/useFilterNavigation"
import OrderByOptions from "../MobileFilters/OrderBy/OrderByOptions"
import PriceRangeOptions from "../MobileFilters/PriceRange/PriceRangeOptions"
import SubcategoriesFiltersSection from "../MobileFilters/Subcategories/SubcategoriesFiltersSection"
import BrandsOptions from "../MobileFilters/Brands/BrandsOptions"
import useIsDesktop from "@/presentation/hooks/useIsDesktop"
import { MOBILE_BREAKPOINT } from "@/presentation/config/breakpoint"


const AllFiltersDrawerContainer = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { applyMany } = useFilterNavigation()
    const { isDesktop } = useIsDesktop(MOBILE_BREAKPOINT)

    const { searchValues, searchParams } = useProductSearch()
    const { productBrands } = useProductsContext()
    const { brands, isLoading: isLoadingBrands } = useProductBrands({ brands: productBrands, enabled: !isDesktop && isOpen })
    const { subcategories, selectedSubcategoriesFromUrl } = useProductSubcategories()

    // Committed values from URL
    const committedOrderBy = searchValues.sort
    const committedPoints = searchParams.get("points") ?? null
    const committedBrand = searchValues.brand || null


    // Draft state — auto-resyncs to URL via useFilterDraft's internal useEffect
    const { draft: orderByState, setDraft: setOrderByState, reset: resetOrderBy } = useFilterDraft<OrderByValue | null>(committedOrderBy)
    const { draft: pointsState, setDraft: setPointsState, reset: resetPoints } = useFilterDraft<string | null>(committedPoints)
    const { draft: brandState, setDraft: setBrandState, reset: resetBrand } = useFilterDraft<string | null>(committedBrand)
    const { draft: selectedSubcategories, setDraft: setSelectedSubcategories, reset: resetSubcategories } = useFilterDraft<CategoryGroup[]>(selectedSubcategoriesFromUrl)
    const [activeNestedSubcategory, setActiveNestedSubcategory] = useState<CategoryGroup | null>(null)

    const handleApplyFilters = () => {
        const patch: Record<string, string | null> = {}
        Object.assign(patch, buildOrderBySearchParams(orderByState))
        Object.assign(patch, buildSingleKeyParams("points", pointsState))
        Object.assign(patch, buildSingleKeyParams("brand", brandState))
        const selectedIds = selectedSubcategories.map((s) => s.id)
        Object.assign(patch, buildSubcategoryReplaceParams(selectedIds))
        applyMany(patch)
        onOpenChange()
    }

    const handleClearFilters = () => {
        applyMany(CLEAR_ALL_FILTERS_PARAMS)
        resetOrderBy(null)
        resetPoints(null)
        resetBrand(null)
        resetSubcategories([])
        onOpenChange()
    }

    const handleClose = () => {
        resetOrderBy(committedOrderBy)
        resetPoints(committedPoints)
        resetBrand(committedBrand)
        resetSubcategories(selectedSubcategoriesFromUrl)
        setActiveNestedSubcategory(null)
    }

    const handleSelectSubcategory = (subcategory: CategoryGroup) => {
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

    return (
        <AllFiltersDrawer
            isOpen={isOpen}
            onOpen={onOpen}
            onOpenChange={onOpenChange}
            handleClose={handleClose}
            onClearFilters={handleClearFilters}
            onApplyFilters={handleApplyFilters}
        >
            <OrderByOptions selectedOption={orderByState} onSelectOption={setOrderByState} />
            <Divider className="bg-darkGrayishBlue-300" />
            <PriceRangeOptions selectedOption={pointsState} onSelectionChange={setPointsState} />
            <Divider className="bg-darkGrayishBlue-300" />
            {
                subcategories && subcategories.length > 0 && (
                    <>
                        <SubcategoriesFiltersSection
                            activeSubcategory={activeNestedSubcategory}
                            subcategories={subcategories || []}
                            onSelectSubcategory={handleSelectSubcategory}
                            selectedSubcategories={selectedSubcategories}
                            setActiveSubcategory={setActiveNestedSubcategory} />
                        <Divider className="bg-darkGrayishBlue-300" />
                    </>
                )
            }
            {brands && brands.length > 0 && (
                <BrandsOptions
                    isLoading={isLoadingBrands}
                    brands={brands || []}
                    selectedBrand={brandState}
                    onSelectBrand={setBrandState}
                />
            )}
        </AllFiltersDrawer>
    )
}

export default AllFiltersDrawerContainer
