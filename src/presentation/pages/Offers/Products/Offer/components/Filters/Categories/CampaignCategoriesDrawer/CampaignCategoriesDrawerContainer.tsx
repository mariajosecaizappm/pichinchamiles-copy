import {useEffect, useState, useTransition} from "react";
import CampaignCategoriesDrawer from "./CampaignCategoriesDrawer";
import useProductSearch from "@/presentation/hooks/useProductSearch";
import useFilterDraft from "@/presentation/pages/Products/hooks/useFilterDraft";
import {usePathname, useRouter} from "next/navigation";
import {buildProductsHref, buildSingleKeyParams} from "@/presentation/pages/Products/components/ProductsFilters/ProductsFiltersConfig";
import useAnalytics from "@/presentation/hooks/useAnalytics";
import {EventName} from "@/presentation/analytics/types";
import { useProductCampaingCategories } from "@/presentation/hooks/queries/products/useProductCampaingCategories";

type Props = {
    campaignCategoryIds: string[]
}

const CampaignCategoriesDrawerContainer = ({ campaignCategoryIds }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition]  = useTransition()
    const { data: categories, isLoading } = useProductCampaingCategories({ id: campaignCategoryIds }, campaignCategoryIds.length > 0 && isOpen)
    const router = useRouter()
    const pathname = usePathname()
    const { searchValues, searchParams } = useProductSearch()
    const { track } = useAnalytics()
    const committedCategoryIds = searchValues.category || null
    const { draft: categoryState, setDraft: setCategoryState, reset: resetCategory } = useFilterDraft(committedCategoryIds)
    const handleApplyFilters = () => {
        router.push(buildProductsHref(pathname, searchParams, buildSingleKeyParams("category", categoryState as string | null)))
        setIsOpen(false)
    }
    const handleClearFilters = () => {
        router.replace(buildProductsHref(pathname, searchParams, buildSingleKeyParams("category", null)))
        setCategoryState(null)
    }
    const handleClose = () => {
        resetCategory(committedCategoryIds)
    }

    const handleOpenChange = (open: boolean) => {
        startTransition(() => {
            setIsOpen(open)
        })
    }

    useEffect(() => {
        if(categories && categories.data.length > 0){
            track(EventName.VIEWED_FILTER, { filters: categories.data })
        }
    }, [categories, track]);

    if (!campaignCategoryIds || campaignCategoryIds.length === 0) return null
    return <CampaignCategoriesDrawer isOpen={isOpen} isLoading={isLoading || isPending} onOpenChange={handleOpenChange} categories={categories?.data || []} onApplyFilters={handleApplyFilters} onClearFilters={handleClearFilters} onClose={handleClose} selectedCategory={categoryState as string | null} onSelectCategory={setCategoryState} disabled={categories?.data.length === 0} />;
}

export default CampaignCategoriesDrawerContainer;