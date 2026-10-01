import { OrderByValue } from "../../types"
import { ORDER_BY_OPTIONS } from "../../ProductsFiltersConfig"
import FilterOptions from "../FilterOptions"

type Props = {
    selectedOption: OrderByValue | null
    onSelectOption: (value: string | null) => void
}

const OrderByOptions = ({
    selectedOption,
    onSelectOption
}: Props) => {
    return (
        <FilterOptions
            title={"Ordenar por"}
            options={ORDER_BY_OPTIONS}
            selectedOption={selectedOption}
            onSelectionChange={onSelectOption}
        />
    )
}

export default OrderByOptions