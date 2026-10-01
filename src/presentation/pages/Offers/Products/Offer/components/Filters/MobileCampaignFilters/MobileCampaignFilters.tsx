import MobileFiltersWrapper from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/MobileFiltersWrapper"
import OrderByDrawer from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/OrderBy"
import CampaignCategoriesDrawer from "@/presentation/pages/Offers/Products/Offer/components/Filters/Categories/CampaignCategoriesDrawer"
import CampaignBrandsDrawer from "@/presentation/pages/Offers/Products/Offer/components/Filters/Brands/CampaignBrandsDrawer"


type Props = {
    className?: string
    campaignCategoryIds: string[]
}

const MobileCampaignFilters = ({ className, campaignCategoryIds }: Props) => {
    return (
        <MobileFiltersWrapper className={className}>
            {[
                <OrderByDrawer key="order-by" />,
                ...(campaignCategoryIds && campaignCategoryIds.length > 0 ? [<CampaignCategoriesDrawer key="categories" campaignCategoryIds={campaignCategoryIds || []} />] : []),
                <CampaignBrandsDrawer key="brands" />
            ]}
        </MobileFiltersWrapper>
    )
}

export default MobileCampaignFilters