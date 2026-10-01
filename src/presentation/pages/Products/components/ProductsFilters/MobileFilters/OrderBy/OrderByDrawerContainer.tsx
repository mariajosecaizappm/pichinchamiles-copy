"use client"

import useProductSearch from "@/presentation/hooks/useProductSearch"
import useFilterDraft from "@/presentation/pages/Products/hooks/useFilterDraft"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { buildOrderBySearchParams, buildProductsHref } from "../../ProductsFiltersConfig"
import OrderByDrawer from "./OrderByDrawer"
import { OrderByValue } from "@/presentation/pages/Products/components/ProductsFilters/types"

const OrderByDrawerContainer = () => {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const { searchValues, searchParams } = useProductSearch()
    const commitedOrderBy = searchValues.sort as OrderByValue | null

    const { draft: orderByState, setDraft: setOrderByState, reset: resetOrderBy } = useFilterDraft(commitedOrderBy)



    const handleApplyFilters = () => {
        if (commitedOrderBy !== orderByState) {
            router.push(buildProductsHref(pathname, searchParams, buildOrderBySearchParams(orderByState)))
        }
        setIsOpen(false)
    }

    const handleClose = () => {
        if (commitedOrderBy !== orderByState) {
            setOrderByState(commitedOrderBy)
        }
    }

    const handleClearFilters = () => {
        router.replace(buildProductsHref(pathname, searchParams, buildOrderBySearchParams(null)))
        resetOrderBy(null)
    }
    return (
        <OrderByDrawer
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            onClose={handleClose}
            selectedOption={orderByState}
            onSelectOption={setOrderByState}
        />
    )
}

export default OrderByDrawerContainer
