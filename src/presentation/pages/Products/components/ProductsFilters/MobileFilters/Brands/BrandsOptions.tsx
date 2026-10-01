import {Brand} from "@/domain/entity/Brand/brand";
import {useState} from "react";
import FilterAccordion from "../../FilterAccordion";
import {DEFAULT_BRANDS_TO_SHOW} from "../../ProductsFiltersConfig";
import ToggleFilter from "../ToggleFilter";
import ToggleFilterSkeleton from "../ToggleFilterSkeleton";
import ShowAllFilters from "./ShowAllFilters";
import useAnalytics from "@/presentation/hooks/useAnalytics";
import {EventName} from "@/presentation/analytics/types";


type Props = {
    isLoading: boolean;
    brands: Brand[];
    selectedBrand: string | null;
    onSelectBrand: (brandId: string | null) => void;
}

const BrandsOptions = ({ isLoading, brands, selectedBrand, onSelectBrand }: Props) => {
    const [showAllBrands, setShowAllBrands] = useState(false)
    const { track } = useAnalytics();
    if (!isLoading && !brands?.length) {
        return null
    }
    return (
        <FilterAccordion title={"Marcas"} defaultExpanded>
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
                                brands?.slice(0, showAllBrands ? brands.length : DEFAULT_BRANDS_TO_SHOW).map((brand) => (
                                    <div key={brand.id}>
                                        <ToggleFilter
                                            isActive={selectedBrand === brand.id}
                                            onPress={() => {
                                                track(EventName.CLICKED_FILTERS, {type: "brand", filter: brand})
                                                onSelectBrand(selectedBrand === brand.id ? null : brand.id)
                                            }}
                                        >
                                            {brand.name}
                                        </ToggleFilter>
                                    </div>
                                ))
                            }
                        </div>
                        {
                            brands && brands.length > DEFAULT_BRANDS_TO_SHOW && (
                                <div>
                                    <ShowAllFilters
                                        showAll={showAllBrands}
                                        setShowAll={setShowAllBrands}
                                    />
                                </div>
                            )
                        }
                    </div>
                )}
            </>

        </FilterAccordion>
    )
}

export default BrandsOptions