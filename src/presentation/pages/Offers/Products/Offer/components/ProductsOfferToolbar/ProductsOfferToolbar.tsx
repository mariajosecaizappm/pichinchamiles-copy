"use client"

import ProductsToolbar from "@/presentation/pages/Products/components/ProductsToolbar/ProductsToolbar"
import AllCampaignFiltersDrawer from "../Filters/Drawer"
import MobileCampaignFilters from "../Filters/MobileCampaignFilters/MobileCampaignFilters"

type Props = {
    campaignCategoryIds: string[];
}

const ProductsOfferToolbar = ({ campaignCategoryIds }: Props) => {
    return (
        <ProductsToolbar
            filtersDrawer={<AllCampaignFiltersDrawer campaignCategoryIds={campaignCategoryIds} />}
            mobileFilters={<MobileCampaignFilters campaignCategoryIds={campaignCategoryIds} />}
        />
    )
}

export default ProductsOfferToolbar