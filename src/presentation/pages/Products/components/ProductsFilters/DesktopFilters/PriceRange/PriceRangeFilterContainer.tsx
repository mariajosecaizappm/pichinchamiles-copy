import useProductSearch from "@/presentation/hooks/useProductSearch"
import { type PointerEvent, useTransition } from "react"
import { PRODUCT_SEARCH_KEYS } from "../../ProductsFiltersConfig"
import PriceRangeFilter from "./PriceRangeFilter"

const PriceRangeFilterContainer = () => {
    const { searchParams, onChangeFilter } = useProductSearch()
    const points = searchParams.get(PRODUCT_SEARCH_KEYS.points) ?? ""
    const [isPending, startTransition] = useTransition()
    
    const handleChange = (value: string) => {
        if (points === value) return
        startTransition(() => {
            onChangeFilter(PRODUCT_SEARCH_KEYS.points, value)
        })
    }

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>, value: string) => {
        if (points === value) {
            event.preventDefault()
            event.stopPropagation()

            startTransition(() => {
                onChangeFilter(PRODUCT_SEARCH_KEYS.points, "")
            })
        }
    }

    return (
        <PriceRangeFilter 
            points={points}
            onValueChange={handleChange}
            isPending={isPending}
            onPressOption={handlePointerDown}
        />
    )
}

export default PriceRangeFilterContainer