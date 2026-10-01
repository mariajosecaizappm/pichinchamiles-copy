"use client"

import { useDisclosure, Divider } from "@heroui/react"
import AllFiltersDrawer from "@/presentation/pages/Products/components/ProductsFilters/AllFiltersDrawer/AllFiltersDrawer"
import useProductSearch from "@/presentation/hooks/useProductSearch"
import useFilterDraft from "@/presentation/pages/Products/hooks/useFilterDraft"
import useProductsOfferContext from "@/presentation/pages/Offers/Products/Offer/context/useProductsOfferContext"
import useProductBrands from "@/presentation/pages/Products/hooks/useProductBrands"
import { OrderByValue } from "@/presentation/pages/Products/components/ProductsFilters/types"
import useFilterNavigation from "@/presentation/pages/Products/hooks/useFilterNavigation"
import OrderByOptions from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/OrderBy/OrderByOptions"
import CampaignCategoriesSection from "../Categories/CampaignCategoriesDrawer/CampaignCategoriesSection"
import BrandsOptions from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Brands/BrandsOptions"
import { buildOrderBySearchParams, buildSingleKeyParams, CLEAR_ALL_FILTERS_PARAMS } from "@/presentation/pages/Products/components/ProductsFilters/ProductsFiltersConfig"

type Props = {
    campaignCategoryIds: string[];
}

const AllCampaignFiltersDrawerContainer = ({ campaignCategoryIds }: Props) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { searchValues } = useProductSearch()
    const { brandIds } = useProductsOfferContext()
    const { brands, isLoading } = useProductBrands({ brands: brandIds, enabled: isOpen })
    const { applyMany } = useFilterNavigation()

    const committedOrderBy = searchValues.sort
    const committedCategory = (Array.isArray(searchValues.category)
        ? searchValues.category[0]
        : searchValues.category) || null
    const committedBrand = searchValues.brand || null

    const { draft: orderByState, setDraft: setOrderByState, reset: resetOrderBy } = useFilterDraft<OrderByValue | null>(committedOrderBy)
    const { draft: campaignCategoryState, setDraft: setCampaignCategoryState, reset: resetCampaignCategory } = useFilterDraft<string | null>(committedCategory)
    const { draft: brandState, setDraft: setBrandState, reset: resetBrand } = useFilterDraft<string | null>(committedBrand)


    const handleClose = () => {
        resetOrderBy(committedOrderBy)
        resetBrand(committedBrand)
        resetCampaignCategory(committedCategory)
    }

    const handleClearFilters = () => {
        applyMany(CLEAR_ALL_FILTERS_PARAMS)
        resetOrderBy(null)
        resetBrand(null)
        resetCampaignCategory(null)
        onOpenChange()
    }
    const handleApplyFilters = () => {
        const patch: Record<string, string | null> = {}
        Object.assign(patch, buildOrderBySearchParams(orderByState))
        Object.assign(patch, buildSingleKeyParams("brand", brandState))
        Object.assign(patch, buildSingleKeyParams("category", campaignCategoryState))
        applyMany(patch)
        onOpenChange()
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
            {
                campaignCategoryIds.length > 0 && (
                    <>
                        <Divider className="bg-darkGrayishBlue-300" />
                        <CampaignCategoriesSection campaignCategoryIds={campaignCategoryIds} selectedCategory={campaignCategoryState} onSelectCategory={setCampaignCategoryState} />
                    </>
                )
            }
            {
                (brands?.length ?? 0) > 0 && (
                    <>
                        <Divider className="bg-darkGrayishBlue-300" />
                        <BrandsOptions
                            isLoading={isLoading}
                            brands={brands || []}
                            selectedBrand={brandState}
                            onSelectBrand={setBrandState}
                        />
                    </>
                )
            }
        </AllFiltersDrawer>
    )
}

export default AllCampaignFiltersDrawerContainer