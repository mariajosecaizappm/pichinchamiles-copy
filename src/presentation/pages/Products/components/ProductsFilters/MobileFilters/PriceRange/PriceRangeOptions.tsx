import { PRICE_RANGE_OPTIONS } from "@/presentation/pages/Products/components/ProductsFilters/ProductsFiltersConfig"
import FilterOptions from "../FilterOptions"

type Props = {
    selectedOption: string | null
    onSelectionChange: (value: string | null) => void
}

const PriceRangeOptions = ({ selectedOption, onSelectionChange }: Props) => {
    return (
        <FilterOptions
            title="Rango de precios"
            options={PRICE_RANGE_OPTIONS}
            selectedOption={selectedOption}
            onSelectionChange={onSelectionChange}
        />
    )
}

export default PriceRangeOptions
