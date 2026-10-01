import CampaignCategoriesOptions from "./CampaignCategoriesOptions"
import { useProductCampaingCategories } from "@/presentation/hooks/queries/products/useProductCampaingCategories";

type Props = {
    campaignCategoryIds: string[]
    selectedCategory: string | null;
    onSelectCategory: (categoryId: string | null) => void;
    enabled?: boolean;
}

const CampaignCategoriesSection = ({ campaignCategoryIds, selectedCategory, onSelectCategory, enabled = true }: Props) => {

    const { data: categories, isLoading } = useProductCampaingCategories({ id: campaignCategoryIds }, enabled && campaignCategoryIds.length > 0)
    return (
        <CampaignCategoriesOptions isLoading={isLoading} categories={categories?.data || []} selectedCategory={selectedCategory} onSelectCategory={onSelectCategory} />
    )
}

export default CampaignCategoriesSection