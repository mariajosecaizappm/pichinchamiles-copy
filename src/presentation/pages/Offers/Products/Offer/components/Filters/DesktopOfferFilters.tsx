import CampaignCategoriesFilter from "./Categories"
import CampaignBrandFilter from "./Brands"

type Props = {
    campaignCategoryIds: string[]
}

const DesktopOfferFilters = ({ campaignCategoryIds }: Props) => {
    return (
        <>
            {campaignCategoryIds && campaignCategoryIds.length > 0 && <CampaignCategoriesFilter campaignCategoryIds={campaignCategoryIds} />}
            <CampaignBrandFilter />
        </>
    )
}

export default DesktopOfferFilters