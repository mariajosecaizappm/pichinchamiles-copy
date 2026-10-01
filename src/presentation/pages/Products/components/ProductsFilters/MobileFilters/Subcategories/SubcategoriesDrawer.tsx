import { PRODUCT_SEARCH_KEYS } from "../../ProductsFiltersConfig";
import FilterDrawer from "../FilterDrawer/FilterDrawer";
import SubcategoriesFiltersSection from "./SubcategoriesFiltersSection";
import { CategoryGroup } from "@/domain/entity/Category/structure/category";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    disabled?: boolean;
    onApplyFilters: () => void;
    onClearFilters?: () => void;
    onClose?: () => void;
    subcategories: CategoryGroup[];
    selectedSubcategories: CategoryGroup[];
    onSelectSubcategory: (subcategory: CategoryGroup) => void;
    activeSubcategory: CategoryGroup | null;
    setActiveSubcategory: (subcategory: CategoryGroup | null) => void;
}

const SubcategoriesDrawer = ({ isOpen, onOpenChange, disabled, onApplyFilters, onClearFilters, onClose, activeSubcategory, subcategories, onSelectSubcategory, selectedSubcategories, setActiveSubcategory }: Props) => {
    return (
        <FilterDrawer
            triggerLabel={"Subcategorías"}
            filterKeys={PRODUCT_SEARCH_KEYS.subcategory}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            disabled={disabled}
            onApplyFilters={onApplyFilters}
            onClearFilters={onClearFilters}
            onClose={onClose}
        >
            <SubcategoriesFiltersSection
                activeSubcategory={activeSubcategory}
                subcategories={subcategories ?? []}
                onSelectSubcategory={onSelectSubcategory}
                selectedSubcategories={selectedSubcategories}
                setActiveSubcategory={setActiveSubcategory}
            />
        </FilterDrawer>
    )
}

export default SubcategoriesDrawer