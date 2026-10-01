"use client"

import useProductSearch from "@/presentation/hooks/useProductSearch";
import { SharedSelection } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { buildOrderBySearchParams, buildProductsHref } from "../../ProductsFiltersConfig";
import { OrderByValue } from "../../types";
import OrderBySelect from "./OrderBySelect";

const OrderBySelectContainer = () => {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const pathname = usePathname()
    const { searchValues, searchParams } = useProductSearch()
    const orderBy = searchValues.sort

    const handleSelectionChange = (keys: SharedSelection) => {
        const key = Array.from(keys)[0] as string
        const next: OrderByValue | null =
        orderBy === key || !key ? null : (key as OrderByValue)
        startTransition(() => {
            router.push(buildProductsHref(pathname, searchParams, buildOrderBySearchParams(next)))
        })
    }

    return (
        <OrderBySelect
            orderBy={orderBy}
            isPending={isPending}
            onSelectionChange={handleSelectionChange}
        />
    )
}

export default OrderBySelectContainer