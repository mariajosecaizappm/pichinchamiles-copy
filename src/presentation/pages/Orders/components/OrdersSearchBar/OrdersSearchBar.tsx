import SearchInput from "@/presentation/components/Form/components/SearchInput"
import useDebounce from "@/presentation/hooks/useDebounce"
import { useRef, useState } from "react"
import { sanitizeOrderNumber } from "../../OrdersConfig"
import ClearSearchButton from "./ClearSearchButton"

type Props = {
    value: string
    onSearch: (value: string) => void
    onClear: () => void
    isClearing?: boolean
}

const OrdersSearchBar = ({ value, onSearch, onClear, isClearing = false }: Props) => {
    const [searchValue, setSearchValue] = useState(value)
    const debouncedSearch = useDebounce(onSearch, 500)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleChange = (value: string) => {
        const numericValue = sanitizeOrderNumber(value)
        if (numericValue === searchValue) return
        setSearchValue(numericValue)
        debouncedSearch(numericValue)
    }

    const handleClear = () => {
        setSearchValue("")
        onClear()
        inputRef.current?.focus()
    }

    return (
        <SearchInput
            ref={inputRef}
            name="orderNumber"
            placeholder="Busca por número de pedido"
            className="placeholder:text-base"
            value={searchValue}
            onChange={handleChange}
            endContent={value ? (
                <ClearSearchButton onClear={handleClear} isClearing={isClearing} />
            ) : undefined}
            maxLength={20}
        />
    )
}

export default OrdersSearchBar