import { Category } from "@/domain/entity/Category/structure/category";
import { useState } from "react";
import FilterAccordion from "@/presentation/pages/Products/components/ProductsFilters/FilterAccordion";
import { DEFAULT_CAMPAIGN_CATEGORIES_TO_SHOW } from "@/presentation/pages/Products/components/ProductsFilters/ProductsFiltersConfig";
import ShowAllFilters from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Brands/ShowAllFilters";
import ToggleFilter from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/ToggleFilter";
import ToggleFilterSkeleton from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/ToggleFilterSkeleton";
import useAnalytics from "@/presentation/hooks/useAnalytics";
import {EventName} from "@/presentation/analytics/types";

type Props = {
    isLoading: boolean;
    categories: Category[];
    selectedCategory: string | null;
    onSelectCategory: (categoryId: string | null) => void;
}
const CampaignCategoriesOptions = ({ isLoading, categories, selectedCategory, onSelectCategory }: Props) => {
    const [showAllCategories, setShowAllCategories] = useState(false)
    const { track } = useAnalytics()
    return   (
        <FilterAccordion title={"Categorías"} defaultExpanded>
            <>
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => {
                        const key = `toggle-filter-skeleton-${i}`;
                        return (
                            <ToggleFilterSkeleton key={key} />
                        )
                    })
                ) : (
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-1">
                            {
                                categories?.slice(0, showAllCategories ? categories.length : DEFAULT_CAMPAIGN_CATEGORIES_TO_SHOW).map((brand) => (
                                    <div key={brand.id}>
                                        <ToggleFilter
                                            isActive={selectedCategory === brand.id}
                                            onPress={() => {
                                                track(EventName.CLICKED_FILTERS, {type: "category", filter: brand});
                                                onSelectCategory(selectedCategory === brand.id ? null : brand.id)
                                            }}
                                        >
                                            {brand.name}
                                        </ToggleFilter>
                                    </div>
                                ))
                            }
                        </div>
                        {
                            categories && categories.length > DEFAULT_CAMPAIGN_CATEGORIES_TO_SHOW && (
                                <div>
                                    <ShowAllFilters
                                        showAll={showAllCategories}
                                        setShowAll={setShowAllCategories}
                                    />
                                </div>
                            )
                        }
                    </div>
                )
                }
            </>
        </FilterAccordion>  
    )
}

export default CampaignCategoriesOptions