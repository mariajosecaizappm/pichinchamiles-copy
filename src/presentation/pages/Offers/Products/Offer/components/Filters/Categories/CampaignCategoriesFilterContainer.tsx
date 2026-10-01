"use client"

import { type PointerEvent, useState, useTransition } from "react"
import CampaignCategoriesFilter from "./CampaignCategoriesFilter"
import useProductSearch from "@/presentation/hooks/useProductSearch"
import { PRODUCT_SEARCH_KEYS } from "@/presentation/pages/Products/components/ProductsFilters/ProductsFiltersConfig"
import { Category } from "@/domain/entity/Category/structure/category"
import useAnalytics from "@/presentation/hooks/useAnalytics";
import {EventName} from "@/presentation/analytics/types";
import { useProductCampaingCategories } from "@/presentation/hooks/queries/products/useProductCampaingCategories"

type Props = {
    campaignCategoryIds: string[]
}

const CampaignCategoriesFilterContainer = ({ campaignCategoryIds }: Props) => {
    const [showAllCategories, setShowAllCategories] = useState(false)
    const [isAccordionOpen, setIsAccordionOpen] = useState(false)
    const { searchValues, onChangeFilter } = useProductSearch()
    const currentCategory = searchValues.category
    const [isPending, startTransition] = useTransition()
    const { track } = useAnalytics();

    const {data: categories, isLoading} = useProductCampaingCategories({id: campaignCategoryIds}, campaignCategoryIds.length > 0 && isAccordionOpen)

    const handleCheckCategory = (value: string) => {
        if (currentCategory === value) return
        const category = categories?.data?.find(category => category.id === value);
        if(category) track(EventName.CLICKED_FILTERS, {type: "category", filter: category})

        startTransition(() => {
            onChangeFilter(PRODUCT_SEARCH_KEYS.category, value)
        })
    }
    
    const handlePointerDown = (event: PointerEvent<HTMLDivElement>, category: Category) => {
        if (currentCategory === category.id) {
            event.preventDefault()
            event.stopPropagation()
   
            startTransition(() => {
                onChangeFilter(PRODUCT_SEARCH_KEYS.category, "")
            })
        }
    }
    return (
        <CampaignCategoriesFilter 
            categories={categories?.data || []}
            isLoading={isLoading}
            showAllCategories={showAllCategories}
            setShowAllCategories={setShowAllCategories}
            currentCategory={currentCategory as string}
            onCheckCategory={handleCheckCategory}
            onPressCategory={handlePointerDown}
            isPendingTransition={isPending}
            onAccordionOpenChange={setIsAccordionOpen}
        />
    )
}

export default CampaignCategoriesFilterContainer