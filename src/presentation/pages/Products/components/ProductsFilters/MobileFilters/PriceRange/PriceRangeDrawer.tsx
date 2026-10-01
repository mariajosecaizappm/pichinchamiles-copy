"use client"

import { PRODUCT_SEARCH_KEYS } from "../../ProductsFiltersConfig"
import FilterDrawer from "../FilterDrawer/FilterDrawer"
import PriceRangeOptions from "./PriceRangeOptions"

type Props = {
    onApplyFilters: () => void
    onClearFilters: () => void
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onClose: () => void
    selectedOption: string | null
    onSelectionChange: (value: string | null) => void
}

const PriceRangeDrawer = ({ onApplyFilters, onClearFilters, isOpen, onOpenChange, onClose, selectedOption, onSelectionChange }: Props) => {

    return (
        <FilterDrawer
            triggerLabel={"Rango de precios"}
            filterKeys={PRODUCT_SEARCH_KEYS.points}
            onApplyFilters={onApplyFilters}
            onClearFilters={onClearFilters}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={onClose}
        >
            <PriceRangeOptions selectedOption={selectedOption} onSelectionChange={onSelectionChange} />
        </FilterDrawer>
    )
}

export default PriceRangeDrawer