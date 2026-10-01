import { headers } from "next/headers"
import { Product, ProductSearch, Search } from "@/domain/entity/Product/product"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"
import ProductsSearchUseCase from "@/domain/interactors/Products/ProductsSearchUseCase"
import container from "@/presentation/config/inversify.config"

export type ProductsSearchContext = {
    perPage: number
    productsSearchUseCase: ProductsSearchUseCase
}

export const getProductsSearchContext = async (): Promise<ProductsSearchContext> => {
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') ?? ''
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    const perPage = isMobile ? 30 : 21
    const productsSearchUseCase = container.get<ProductsSearchUseCase>(UseCaseTypes.ProductsSearchUseCase)
    return { perPage, productsSearchUseCase }
}

export const parsePage = (page: unknown): number => {
    const parsed = Number(page)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

export const getProductIdsWindow = (
    productIds: string[],
    page: unknown,
    perPage: number
): { page: number; idsWindow: string[] } => {
    const parsedPage = parsePage(page)
    const start = (parsedPage - 1) * perPage
    return { page: parsedPage, idsWindow: productIds.slice(start, start + perPage) }
}

export type ProductsListResult = {
    products: ProductSearch | null
    searchQuery: string
}

const getProductsList = async (searchParams?: Partial<Search>): Promise<ProductsListResult> => {
    const searchQuery = searchParams?.search ?? ''

    try {
        const { perPage, productsSearchUseCase } = await getProductsSearchContext()

        const page = parsePage(searchParams?.page)
        const hasProductIds = !!searchParams?.productIds && searchParams.productIds.length > 0
        const preserveCampaignOrder = hasProductIds && !searchParams?.sort
        const { idsWindow } = preserveCampaignOrder
            ? getProductIdsWindow(searchParams.productIds!, page, perPage)
            : { idsWindow: [] }

        const products = await productsSearchUseCase.searchProducts({
            search: searchQuery,
            brand: searchParams?.brand ?? '',
            category: searchParams?.category ?? [],
            sort: searchParams?.sort ?? '',
            page: preserveCampaignOrder ? 1 : page,
            perPage,
            ...(searchParams?.points && {
                points: (searchParams.points as unknown as string).split("-").map(Number).filter(n => !isNaN(n))
            }),
            productIds: preserveCampaignOrder ? idsWindow : (searchParams?.productIds ?? []),
        })

        const orderedData = preserveCampaignOrder
            ? idsWindow.map(id => products.list.data.find(p => p.id === id)).filter((p): p is Product => !!p)
            : products.list.data

        let total = products.list.pagination.total
        if (preserveCampaignOrder) {
            total = searchParams?.search ? products.list.data.length : (searchParams?.productIds?.length ?? 0)
        }
        const pagination = preserveCampaignOrder
            ? { page, pageSize: perPage, total, totalPages: Math.ceil(total / perPage) }
            : products.list.pagination

        return {
            products: { ...products, list: { ...products.list, data: orderedData, pagination } },
            searchQuery,
        }    } catch {
        return { products: null, searchQuery }
    }
}

export default getProductsList
