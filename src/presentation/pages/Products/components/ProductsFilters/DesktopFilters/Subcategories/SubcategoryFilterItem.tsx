"use client"

import { CategoryGroup } from "@/domain/entity/Category/structure/category"
import { Checkbox } from "@/presentation/components/Form/components/Checkbox"
import useProductSearch from "@/presentation/hooks/useProductSearch"
import { readSubcategoryIds } from "@/presentation/pages/Products/components/ProductsFilters/searchKeys"
import { cn } from "@heroui/react"

type Props = {
    subcategory: CategoryGroup
    onSelectSubcategory: (subcategory: CategoryGroup) => void
    isPending: boolean
}

const SubcategoryFilterItem = ({ subcategory, onSelectSubcategory, isPending }: Props) => {

    const { searchParams } = useProductSearch()
    const currentSubcategories = readSubcategoryIds(searchParams)


    const handleValueChange = () => {
        onSelectSubcategory(subcategory)
    }

    const isSelected = currentSubcategories.includes(subcategory.id) || subcategory.subcategories?.some((sub) => currentSubcategories.includes(sub.id))


    return (
        <button
            className={cn("rounded-lg border-2 border-transparent cursor-pointer group", isSelected && " border-information-500 bg-darkGrayishBlue-100")}
            onClick={handleValueChange}
        >
            <Checkbox
                key={subcategory.id}
                name={subcategory.id}
                label={subcategory.name}
                className="h-12 pl-4 flex items-center pointer-events-none"
                classNames={{
                    wrapper: "group-hover:bg-darkGrayishBlue-100 before:border-grayscale-400 before:border-1"
                }}
                labelClassName="text-black text-sm font-medium leading-5"
                isDisabled={isPending}
                isSelected={isSelected}
                onValueChange={handleValueChange}

            />
        </button>
    )
}

export default SubcategoryFilterItem