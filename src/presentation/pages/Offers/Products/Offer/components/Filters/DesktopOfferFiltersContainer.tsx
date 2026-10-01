"use client"

import useFilterNavigation from "@/presentation/pages/Products/hooks/useFilterNavigation"
import DesktopFiltersWrapper from "@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/DesktopFiltersWrapper"
import DesktopOfferFilters from "./DesktopOfferFilters"

type Props = {
    campaignCategoryIds: string[]
}

const DesktopOfferFiltersContainer = ({ campaignCategoryIds }: Props) => {
    const { handleClearFilters, isPending } = useFilterNavigation({ method: "replace", wrapTransition: true })

    return (
        <DesktopFiltersWrapper onClearFilters={handleClearFilters} isLoading={isPending} className="lg:top-20">
            <DesktopOfferFilters campaignCategoryIds={campaignCategoryIds} />
        </DesktopFiltersWrapper>
    )
}

export default DesktopOfferFiltersContainer