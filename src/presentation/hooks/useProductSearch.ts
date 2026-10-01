"use client"
import { Search } from "@/domain/entity/Product/product"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"
import links from "@/presentation/config/links"
import { isScopedProductsPath } from "@/presentation/helpers/product"

const useProductSearch = () => {
    const router = useRouter()
    const pathname = usePathname() ?? ""
    const searchParams = useSearchParams()

    const searchValues: Search = useMemo(() => {
        const values = Object.fromEntries(searchParams.entries())
        return {
            search: values?.search ?? "",
            category: values?.category ?? "",
            brand: values?.brand ?? "",
            sort: values?.sort ?? "",
            page: Number.parseInt(values?.page ?? "1"),
            perPage: Number.parseInt(values?.perPage),
        }
    }, [searchParams])

    const redirect = useCallback((urlSearchParams: URLSearchParams) => {
        const queryString = urlSearchParams.toString()
        const url = pathname
        router.push(queryString ? `${url}?${queryString}` : url)
    }, [router, pathname])

    const handleChangeFilter = useCallback((name: string, value: string) => {
        const urlSearchParams = new URLSearchParams(searchParams)
        if (value) {
            urlSearchParams.set(name, value)
            if (name === "category") {
                urlSearchParams.delete("brand")
            }
        } else {
            urlSearchParams.delete(name)
        }
        urlSearchParams.delete("page")

        redirect(urlSearchParams)
    }, [searchParams, redirect])

    const clearSearch = useCallback(() => {
        const urlSearchParams = new URLSearchParams(searchParams)
        urlSearchParams.delete("search")
        redirect(urlSearchParams)
    }, [searchParams, redirect])

    const submitSearch = useCallback((search: string) => {
        const parsedSearch = search.trim()
        if (!parsedSearch) return

        if (isScopedProductsPath(pathname)) {
            handleChangeFilter("search", parsedSearch)
            return
        }

        const params = new URLSearchParams()
        params.set("search", parsedSearch)
        router.push(`${links.productsList}?${params.toString()}`)
    }, [pathname, router, handleChangeFilter])

    const onChangePage = useCallback(
        (nextPage: number) => {
            const params = new URLSearchParams(searchParams.toString())
            if (nextPage <= 1) {
                params.delete("page")
            } else {
                params.set("page", String(nextPage))
            }
            const query = params.toString()
            router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
        },
        [router, pathname, searchParams],
    )

    return {
        searchValues,
        searchParams,
        onChangeFilter: handleChangeFilter,
        submitSearch,
        clearSearch,
        onChangePage,
    }
}

export default useProductSearch
