import type { Basket } from "@/domain/entity/Basket/structure/basket"
import type Categorization from "@/domain/entity/Category/models/Categorization"
import links from "@/presentation/config/links"
import { firstParam, titleCaseSlug } from "@/presentation/helpers/url"

export type ProductRouteParams = Record<string, string | string[] | undefined>

export const getProductCategorySlugsFromParams = (params: ProductRouteParams) => ({
    categorySlug: firstParam(params.category),
    subcategorySlug: firstParam(params.subcategory),
})

export const isProductsPath = (pathname: string) => pathname.startsWith(links.productsList)

export const isProductOffersPath = (pathname: string) => pathname.startsWith(`${links.offers}/productos`)

export const isProductsRootPath = (pathname: string) => {
    const normalizedPath = pathname.replace(/\/$/, "") || "/"
    const base = links.productsList.replace(/\/$/, "") || "/"
    return normalizedPath === base
}

export const isScopedProductsPath = (pathname: string) => (
    isProductsRootPath(pathname) || isProductOffersPath(pathname)
)

export const getCategoryDisplayName = (
    slug: string,
    categorization: Categorization | null | undefined,
) => categorization?.getCategoryBySlug(slug)?.name ?? titleCaseSlug(slug)

export const getProductsBrowseTitle = (options: {
    pathname: string
    params: ProductRouteParams
    categorization: Categorization | null | undefined
    todosLabel?: string
}): string | null => {
    const { pathname, params, categorization, todosLabel = "Todos los productos" } = options

    if (!isProductsPath(pathname)) {
        return null
    }

    const { categorySlug, subcategorySlug } = getProductCategorySlugsFromParams(params)

    if (subcategorySlug) {
        return getCategoryDisplayName(subcategorySlug, categorization)
    }
    if (categorySlug) {
        return getCategoryDisplayName(categorySlug, categorization)
    }
    if (isProductsRootPath(pathname)) {
        return todosLabel
    }

    return null
}

export const getCartQuantityForVariation = (
    basket: Basket | null | undefined,
    variationId: string | undefined
): number => {
    if (!basket?.items?.length || !variationId) return 0

    return basket.items
        .filter((item) => item.variationId === variationId)
        .reduce((sum, item) => sum + item.quantity, 0)
}

export const isMaxStockAlreadyInCart = (
    basket: Basket | null | undefined,
    variation: { id: string; stock: number } | null | undefined
): boolean => {
    if (!variation) return false

    const cartQuantity = getCartQuantityForVariation(basket, variation.id)
    return cartQuantity > 0 && cartQuantity >= variation.stock
}
