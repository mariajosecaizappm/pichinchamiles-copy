"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useTransition } from "react"
import { buildProductsHref, CLEAR_ALL_FILTERS_PARAMS } from "@/presentation/pages/Products/components/ProductsFilters/ProductsFiltersConfig"

type NavigateMethod = "push" | "replace"

type Options = {
    method?: NavigateMethod
    wrapTransition?: boolean
}

const useFilterNavigation = (options: Options = {}) => {
    const { method = "replace", wrapTransition = false } = options
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const applyMany = useCallback((patch: Record<string, string | null>) => {
        const action = () => {
            const href = buildProductsHref(pathname, searchParams, patch)
            if (method === "replace") {
                router.replace(href)
            } else {
                router.push(href)
            }
        }

        if (wrapTransition) {
            startTransition(action)
        } else {
            action()
        }
    }, [router, pathname, searchParams, method, wrapTransition, startTransition])

    const handleClearFilters = useCallback(() => {
        applyMany(CLEAR_ALL_FILTERS_PARAMS)
    }, [applyMany])

    return {
        applyMany,
        handleClearFilters,
        isPending,
    }
}

export default useFilterNavigation
