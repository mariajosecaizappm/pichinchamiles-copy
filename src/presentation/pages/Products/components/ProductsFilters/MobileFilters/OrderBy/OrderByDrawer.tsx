import { OrderByValue } from "../../types"
import { PRODUCT_SEARCH_KEYS } from "../../ProductsFiltersConfig"
import FilterDrawer from "../FilterDrawer"
import OrderByOptions from "./OrderByOptions"

type Props = {
    onApplyFilters: () => void
    onClearFilters: () => void
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onClose: () => void
    selectedOption: OrderByValue | null
    onSelectOption: (value: OrderByValue | null) => void
}

const OrderByDrawer = ({ onApplyFilters, onClearFilters, isOpen, onOpenChange, onClose, selectedOption, onSelectOption }: Props) => {
    const title = "Ordenar por"
  

    return (
        <FilterDrawer
            triggerLabel={title}
            filterKeys={[PRODUCT_SEARCH_KEYS.sort, PRODUCT_SEARCH_KEYS.recommended]}
            onApplyFilters={onApplyFilters}
            onClearFilters={onClearFilters}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={onClose}
        >
            <OrderByOptions selectedOption={selectedOption} onSelectOption={onSelectOption as (value: string | null) => void} />
        </FilterDrawer>
    )
}

export default OrderByDrawer