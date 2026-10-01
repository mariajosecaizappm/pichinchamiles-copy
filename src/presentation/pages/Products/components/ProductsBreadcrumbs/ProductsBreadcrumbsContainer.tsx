"use client"

import links from "@/presentation/config/links"
import { useProductsContext } from "@/presentation/pages/Products/context/useProductsContext"
import {
    getCategoryDisplayName,
    getProductCategorySlugsFromParams,
    getProductsBrowseTitle,
    isProductsPath,
    isProductsRootPath,
} from "@/presentation/helpers/product"
import { useParams, usePathname } from "next/navigation"
import { useMemo } from "react"
import ProductsBreadcrumbs from "./ProductsBreadcrumbs"

const ProductsBreadcrumbsContainer = () => {
    const pathname = usePathname() ?? ""
    const params = useParams()
    const { categorization } = useProductsContext()

    const { categorySlug, subcategorySlug } = getProductCategorySlugsFromParams(params)

    const items = useMemo(() => {
        if (!isProductsPath(pathname)) {
            return null
        }

        const base = links.productsList
        const home = { id: "home", label: "Home", href: links.shoppingProducts, isCurrent: false }

        const nameForSlug = (slug: string) => getCategoryDisplayName(slug, categorization)

        const onProductsRoot = isProductsRootPath(pathname)
        const productsListCrumbLabel =
            !categorySlug && !subcategorySlug
                ? getProductsBrowseTitle({ pathname, params, categorization }) ?? "Productos"
                : "Productos"
        const productos = { id: "productos", label: productsListCrumbLabel, href: base }

        if (categorySlug) {
            if (subcategorySlug) {
                return [
                    home,
                    { ...productos, isCurrent: false },
                    {
                        id: `category-${categorySlug}`,
                        label: nameForSlug(categorySlug),
                        href: `${base}/categoria/${categorySlug}`,
                        isCurrent: false,
                    },
                    {
                        id: `subcategory-${subcategorySlug}`,
                        label: nameForSlug(subcategorySlug),
                        href: `${base}/categoria/${categorySlug}/${subcategorySlug}`,
                        isCurrent: true,
                    },
                ]
            }

            return [
                home,
                { ...productos, isCurrent: false },
                {
                    id: `category-${categorySlug}`,
                    label: nameForSlug(categorySlug),
                    href: `${base}/categoria/${categorySlug}`,
                    isCurrent: true,
                },
            ]
        }

        return [home, { ...productos, isCurrent: onProductsRoot }]
    }, [pathname, categorySlug, subcategorySlug, categorization, params])

    if (items === null) {
        return null
    }

    return <ProductsBreadcrumbs items={items} />
}

export default ProductsBreadcrumbsContainer
