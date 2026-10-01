import { FilterOption, OrderByValue, ProductSearchKey, ProductSearchParamsLike } from "./types"


export const DEFAULT_BRANDS_TO_SHOW = 10
export const DEFAULT_CAMPAIGN_CATEGORIES_TO_SHOW = 7

export const PRICE_RANGE_OPTIONS: FilterOption[] = [
    { value: "600-2000", label: "Entre 600 a 2.000 millas" },
    { value: "2001-5000", label: "Entre 2.001 a 5.000 millas" },
    { value: "5001-10000", label: "Entre 5.001 a 10.000 millas" },
    { value: "10001", label: "Más de 10.001 millas" },
]

export const ORDER_BY_OPTIONS: FilterOption[] = [
    { value: "points-asc", label: "Millas: Menor a mayor" },
    { value: "points-desc", label: "Millas: Mayor a menor" },
]



export const PRODUCT_SEARCH_KEYS = {
    search: "search",
    category: "category",
    subcategory: "subcategory",
    brand: "brand",
    sort: "sort",
    recommended: "recommended",
    points: "points",
    page: "page",
} as const


export const buildProductsHref = (
    pathname: string,
    searchParams: ProductSearchParamsLike,
    patch: Record<string, string | null>,
): string => {
    const next = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(patch)) {
        if (value == null || value === "") next.delete(key)
        else next.set(key, value)
    }
    const qs = next.toString()
    return qs ? `${pathname}?${qs}` : pathname
}

export const readSubcategoryIds = (searchParams: ProductSearchParamsLike): string[] =>
    searchParams.get(PRODUCT_SEARCH_KEYS.subcategory)?.split(",").filter(Boolean) ?? []


export const buildOrderBySearchParams = (
    value: OrderByValue | null,
): Record<string, string | null> => {
    if (value === null) {
        return {
            [PRODUCT_SEARCH_KEYS.sort]: null,
            [PRODUCT_SEARCH_KEYS.page]: null,
        }
    }
    return {
        [PRODUCT_SEARCH_KEYS.sort]: value,
        [PRODUCT_SEARCH_KEYS.page]: null,
    }
}

export const buildCategoryParams = (
    current: string[],
    id: string,
): Record<string, string | null> => {
    const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    return {
        [PRODUCT_SEARCH_KEYS.subcategory]: next.length ? next.join(",") : null,
        [PRODUCT_SEARCH_KEYS.page]: null,
    }
}


export const buildSubcategoryReplaceParams = (
    ids: string[],
): Record<string, string | null> => ({
    [PRODUCT_SEARCH_KEYS.subcategory]: ids.length ? ids.join(",") : null,
    [PRODUCT_SEARCH_KEYS.page]: null,
})

export const buildSingleKeyParams = (
    key: ProductSearchKey,
    value: string | null,
): Record<string, string | null> => ({
    [key]: value,
    [PRODUCT_SEARCH_KEYS.page]: null,
})


export const CLEAR_ALL_FILTERS_PARAMS: Record<string, string | null> = {
    [PRODUCT_SEARCH_KEYS.search]: null,
    [PRODUCT_SEARCH_KEYS.sort]: null,
    [PRODUCT_SEARCH_KEYS.recommended]: null,
    [PRODUCT_SEARCH_KEYS.points]: null,
    [PRODUCT_SEARCH_KEYS.brand]: null,
    [PRODUCT_SEARCH_KEYS.subcategory]: null,
    [PRODUCT_SEARCH_KEYS.page]: null,
    [PRODUCT_SEARCH_KEYS.category]: null,
}
