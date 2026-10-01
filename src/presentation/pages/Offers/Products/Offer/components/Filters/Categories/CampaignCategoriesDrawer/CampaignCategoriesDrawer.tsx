import { Category } from "@/domain/entity/Category/structure/category";
import FilterDrawer from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/FilterDrawer";
import { PRODUCT_SEARCH_KEYS } from "@/presentation/pages/Products/components/ProductsFilters/ProductsFiltersConfig";
import CampaignCategoriesOptions from "./CampaignCategoriesOptions";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    categories: Category[]
    onApplyFilters: () => void;
    onClearFilters: () => void;
    onClose: () => void;
    isLoading?: boolean;
    selectedCategory: string | null;
    onSelectCategory: (categoryId: string | null) => void;
    disabled?: boolean;
}

const CampaignCategoriesDrawer = ({ isOpen, onOpenChange, categories, onApplyFilters, onClearFilters, onClose, isLoading = false, selectedCategory, onSelectCategory, disabled = false }: Props) => {
    return (
        <FilterDrawer
            onApplyFilters={onApplyFilters}
            onClearFilters={onClearFilters}
            onClose={onClose}
            triggerLabel={"Categorías"}
            filterKeys={PRODUCT_SEARCH_KEYS.category}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            disabled={disabled}
            isLoading={isLoading}
        >
            <CampaignCategoriesOptions isLoading={isLoading} categories={categories} selectedCategory={selectedCategory} onSelectCategory={onSelectCategory} />
        </FilterDrawer>
    )
}

export default CampaignCategoriesDrawer;