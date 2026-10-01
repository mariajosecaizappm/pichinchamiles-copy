import { DrawerFooter } from "@heroui/react";
import ClearFiltersAction from "./ClearFiltersAction";
import ApplyFiltersAction from "./ApplyFiltersAction";

type Props = {
    onClearFilters: () => void;
    onApplyFilters: () => void;
}

const FilterDrawerFooter = ({ onClearFilters, onApplyFilters }: Props) => {
    return (
        <DrawerFooter className="gap-4 border-t border-darkGrayishBlue-300">
            <ClearFiltersAction
                onClearFilters={onClearFilters}
            />
            <ApplyFiltersAction
                onApplyFilters={onApplyFilters}
            />
        </DrawerFooter>
    )
}

export default FilterDrawerFooter