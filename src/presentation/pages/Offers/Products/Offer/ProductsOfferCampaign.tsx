import { ProductsCampaign } from "@/domain/entity/Campaign/campaign"
import { Product, ProductSearch, Search } from "@/domain/entity/Product/product"
import ProductOfferBanner from "@/presentation/pages/Offers/Products/Offer/components/Banner"
import DesktopToolbar from "@/presentation/pages/Products/components/DesktopToolbar"
import ProductsCatalogLayout from "@/presentation/pages/Products/components/ProductsCatalogLayout"
import { getProductIdsWindow, getProductsSearchContext, parsePage } from "@/presentation/pages/Products/lib/getProductsList"
import { notFound } from "next/navigation"
import DesktopOfferFilters from "./components/Filters"
import ProductsOfferProvider from "./context/ProductsOfferProvider"
import ProductsOfferToolbar from "./components/ProductsOfferToolbar"
import ProductsCampaignList from "./components/ProductsCampaignList"

const ProductsOfferCampaign = async ({ campaign, searchParams }: { campaign: ProductsCampaign, searchParams?: Partial<Search> }) => {
    const orderedProductIds = [
        ...campaign?.priorityProducts ?? [],
        ...campaign?.productIds.filter((id) => !campaign?.priorityProducts?.includes(id)) ?? [],
    ]

    const categoryParam = searchParams?.category
    const selectedCategory = Array.isArray(categoryParam) ? categoryParam[0] : categoryParam

    const hasActiveFilters = Boolean(
        selectedCategory ||
        searchParams?.brand ||
        searchParams?.search ||
        searchParams?.points ||
        searchParams?.sort,
    )

    const { perPage, productsSearchUseCase } = await getProductsSearchContext()

    // Step 1: always fetch the full unfiltered campaign product list.
    // This gives us: (a) stable category sidebar, (b) a base to narrow IDs for filtered queries.
    const fullCampaignSearch: Search = {
        search: '',
        brand: '',
        category: [],
        sort: '',
        page: 1,
        perPage: orderedProductIds.length,
        productIds: orderedProductIds,
    }

    const fullCampaignResult = await productsSearchUseCase.searchProducts(fullCampaignSearch)

    // Collect category IDs that actually appear in the campaign's products
    const productCategoryIds = new Set(
        fullCampaignResult.list.data.flatMap(p => p.categories.map(c => c.id))
    )

    const campaignCategoryIds = campaign.categories.filter(id => productCategoryIds.has(id))

    if (selectedCategory && !campaignCategoryIds.includes(selectedCategory)) {
        notFound()
    }

    // Step 2: build the display product list
    let displayProductsResult: ProductSearch

    if (!hasActiveFilters) {
        // No filters: pre-slice IDs by page to enforce campaign order, send page 1 to Algolia
        const { idsWindow } = getProductIdsWindow(orderedProductIds, searchParams?.page, perPage)
        const page = parsePage(searchParams?.page)

        const result = await productsSearchUseCase.searchProducts({
            ...fullCampaignSearch,
            page: 1,
            perPage,    
            productIds: idsWindow,
        })

        // Reorder by campaign position and set correct pagination metadata
        const orderIndex = new Map(orderedProductIds.map((id, i) => [id, i]))
        const orderedData = [...result.list.data]
            .sort((a, b) => (orderIndex.get(a.id) ?? Infinity) - (orderIndex.get(b.id) ?? Infinity))
            .filter((p): p is Product => orderIndex.has(p.id))

        const total = orderedProductIds.length
        displayProductsResult = {
            ...result,
            list: {
                ...result.list,
                data: orderedData,
                pagination: { page, pageSize: perPage, total, totalPages: Math.ceil(total / perPage) },
            },
        }
    } else {
        // Filters active: narrow candidate IDs from the full result, then run a filtered+paginated query.
        // This keeps the productIds list small (only products from this campaign) avoiding Algolia limits.
        const candidateIds = fullCampaignResult.list.data.map(p => p.id)

        const filteredResult = await productsSearchUseCase.searchProducts({
            ...fullCampaignSearch,
            ...searchParams,
            search: searchParams?.search ?? '',
            page: parsePage(searchParams?.page),
            perPage,
            productIds: candidateIds,
        })

        displayProductsResult = filteredResult
    }

    return (
        <ProductsOfferProvider>
            <ProductOfferBanner
                title={campaign.mainTitle}
                image={campaign.image}
                subtitle={campaign.secondaryTitle}
            />
            <ProductsOfferToolbar campaignCategoryIds={campaignCategoryIds} />
            <ProductsCatalogLayout desktopFilters={<DesktopOfferFilters campaignCategoryIds={campaignCategoryIds} />}>
                <div className="space-y-3">
                    <DesktopToolbar />
                    <div className="px-6 lg:px-0 pt-2">
                        <h2 className="text-[22px] text-blue-500 font-slab leading-8">
                            {campaign?.mainTitle} ({fullCampaignResult.list.data.length})
                        </h2>
                    </div>
                    <ProductsCampaignList products={displayProductsResult} searchQuery={searchParams?.search} />
                </div>
            </ProductsCatalogLayout>
        </ProductsOfferProvider>
    )
}

export default ProductsOfferCampaign
