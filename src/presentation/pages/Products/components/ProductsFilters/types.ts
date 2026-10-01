import { ReadonlyURLSearchParams } from "next/navigation"
import { ORDER_BY_OPTIONS, PRODUCT_SEARCH_KEYS } from "./ProductsFiltersConfig"

export type FilterOption = {
    value: string
    label: string
}

export type ProductSearchKey = (typeof PRODUCT_SEARCH_KEYS)[keyof typeof PRODUCT_SEARCH_KEYS]

export type ProductSearchParamsLike = URLSearchParams | ReadonlyURLSearchParams

export type OrderByValue = (typeof ORDER_BY_OPTIONS)[number]['value']

export type OrderByOption = (typeof ORDER_BY_OPTIONS)[number]
