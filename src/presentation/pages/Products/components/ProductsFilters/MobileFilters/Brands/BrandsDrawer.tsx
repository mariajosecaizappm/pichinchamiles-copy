import { Brand } from "@/domain/entity/Brand/brand";
import { PRODUCT_SEARCH_KEYS } from "../../ProductsFiltersConfig";
import FilterDrawer from "../FilterDrawer";
import BrandsOptions from "./BrandsOptions";

type Props = {
    onApplyFilters: () => void;
    onClearFilters: () => void;
    onClose?: () => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    brands: Brand[];
    isLoading?: boolean;
    selectedBrand: string | null;
    onSelectBrand: (brandId: string | null) => void;
}

const Brands = ({ onApplyFilters, onClearFilters, onClose, isOpen, onOpenChange, brands, isLoading = false, selectedBrand, onSelectBrand }: Props) => {
    return (
        <FilterDrawer
            onApplyFilters={onApplyFilters}
            onClearFilters={onClearFilters}
            onClose={onClose}
            triggerLabel={"Marcas"}
            filterKeys={PRODUCT_SEARCH_KEYS.brand}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <BrandsOptions isLoading={isLoading} brands={brands} selectedBrand={selectedBrand} onSelectBrand={onSelectBrand} />
        </FilterDrawer>
    )
}

export default Brands