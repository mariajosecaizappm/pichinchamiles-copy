"use client"

import { Button } from "@/presentation/components/Form/components/Button"
import useProductSearch from "@/presentation/hooks/useProductSearch"
import CloseIcon from "@/presentation/pages/Home/components/Header/components/Menu/components/Icons/CloseIcon"
type Props = {
    onClearFilters: () => void
    isLoading?: boolean
}
const CleanFilters = ({ onClearFilters, isLoading }: Props) => {
    const { searchParams } = useProductSearch()
    const keys = [...searchParams.keys()]
    if(!keys.filter(k => k !== "page" && k !== "sort").length) return null
    return (
        <Button
            className="bg-darkGrayishBlue-200 text-blue-500 h-8 border border-darkGrayishBlue-300 text-xs leading-4"
            onPress={onClearFilters}
            isLoading={isLoading}
        >
            {
                !isLoading && (
                    <CloseIcon className="h-2.5 w-2.5" />
                )
            }
            Eliminar filtros
        </Button>
    )
}

export default CleanFilters
