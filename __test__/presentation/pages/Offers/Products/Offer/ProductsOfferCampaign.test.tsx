import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import type { ProductsCampaign } from "@/domain/entity/Campaign/campaign"
import ProductsOfferCampaign from "@/presentation/pages/Offers/Products/Offer/ProductsOfferCampaign"

const { mockNotFound, mockGetProductsList } = vi.hoisted(() => ({
    mockNotFound: vi.fn(),
    mockGetProductsList: vi.fn(),
}))

vi.mock("next/navigation", () => ({
    notFound: () => {
        mockNotFound()
        throw new Error("NEXT_NOT_FOUND")
    },
}))

vi.mock("@/presentation/pages/Products/lib/getProductsList", () => ({
    getProductsSearchContext: () =>
        Promise.resolve({
            perPage: 21,
            productsSearchUseCase: { searchProducts: mockGetProductsList },
        }),
    getProductIdsWindow: (
        productIds: string[],
        page: unknown,
        perPage: number
    ) => {
        const parsedPage = Math.max(1, Number(page) || 1)
        const start = (parsedPage - 1) * perPage
        return {
            page: parsedPage,
            idsWindow: productIds.slice(start, start + perPage),
        }
    },
    parsePage: (page: unknown) => {
        const parsed = Number(page)
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
    },
    __esModule: true,
}))

vi.mock("@/presentation/pages/Offers/Products/Offer/components/Banner", () => ({
    default: ({
        title,
        image,
        subtitle,
    }: {
        title: string
        image?: { desktopUrl: string; mobileUrl: string }
        subtitle?: string
    }) => {
        if (!image) return null
        return (
            <div
                data-testid="product-offer-banner"
                data-title={title}
                data-image-desktop={image.desktopUrl}
                data-subtitle={subtitle ?? ""}
            />
        )
    },
}))

vi.mock(
    "@/presentation/pages/Offers/Products/Offer/components/ProductsOfferToolbar",
    () => ({
        default: ({ campaignCategoryIds }: { campaignCategoryIds: string[] }) => (
            <div
                data-testid="products-offer-toolbar"
                data-categories={campaignCategoryIds.join(",")}
            />
        ),
    })
)

vi.mock(
    "@/presentation/pages/Products/components/ProductsCatalogLayout",
    () => ({
        default: ({
            children,
            desktopFilters,
        }: {
            children: React.ReactNode
            desktopFilters: React.ReactNode
        }) => (
            <div data-testid="products-catalog-layout">
                <div data-testid="desktop-filters-wrapper">{desktopFilters}</div>
                {children}
            </div>
        ),
    })
)

vi.mock(
    "@/presentation/pages/Offers/Products/Offer/components/Filters",
    () => ({
        default: ({ campaignCategoryIds }: { campaignCategoryIds: string[] }) => (
            <div
                data-testid="desktop-offer-filters"
                data-categories={campaignCategoryIds.join(",")}
            />
        ),
    })
)

vi.mock("@/presentation/pages/Products/components/DesktopToolbar", () => ({
    default: () => <div data-testid="desktop-toolbar" />,
}))

vi.mock(
    "@/presentation/pages/Offers/Products/Offer/components/ProductsCampaignList",
    () => ({
        default: ({
            products,
            searchQuery,
        }: {
            products: { categoryIds?: string[]; list?: { data: unknown[] } } | null
            searchQuery?: string
        }) => (
            <div
                data-testid="products-campaign-list"
                data-category-count={products?.categoryIds?.length ?? 0}
                data-search-query={searchQuery ?? ""}
                data-product-count={products?.list?.data?.length ?? 0}
            />
        ),
    })
)

vi.mock(
    "@/presentation/pages/Offers/Products/Offer/context/ProductsOfferProvider",
    () => ({
        default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    })
)

const baseCampaign = {
    id: "c1",
    mainTitle: "Top Products",
    secondaryTitle: "Best deals",
    slug: "top-products",
    categories: ["cat-1", "cat-2"],
    productIds: ["p1", "p2", "p3"],
    priorityProducts: [],
    image: { desktopUrl: "/banner-desktop.jpg", mobileUrl: "/banner-mobile.jpg" },
    campaignType: "products",
    isOutstanding: false,
    positions: [],
    segmentCodes: [],
    hasLanding: false,
    numberElementsSlide: 0,
    order: 0,
    status: "active",
    priority: 0,
} as unknown as ProductsCampaign

const productSearchResult = (categoryIds: string[] = ["cat-1", "cat-2"]) => ({
    list: {
        data: categoryIds.map((catId, i) => ({
            id: `p${i + 1}`,
            categories: [{ id: catId }],
        })),
        pagination: {
            page: 1,
            pageSize: 21,
            total: categoryIds.length,
            totalPages: 1,
        },
    },
    brandIds: [],
    categoryIds,
    categories: {},
})

describe("ProductsOfferCampaign", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockGetProductsList.mockResolvedValue(productSearchResult())
    })

    it("renders campaign title with product count", async () => {
        const component = await ProductsOfferCampaign({
            campaign: baseCampaign,
            searchParams: undefined,
        })
        render(component)
        expect(
            screen.getByRole("heading", { name: /Top Products \(2\)/i })
        ).toBeInTheDocument()
    })

    it("renders ProductOfferBanner with title, image and subtitle", async () => {
        const component = await ProductsOfferCampaign({
            campaign: baseCampaign,
            searchParams: undefined,
        })
        render(component)
        const banner = screen.getByTestId("product-offer-banner")
        expect(banner).toHaveAttribute("data-title", "Top Products")
        expect(banner).toHaveAttribute("data-image-desktop", "/banner-desktop.jpg")
        expect(banner).toHaveAttribute("data-subtitle", "Best deals")
    })

    it("does not render banner without image", async () => {
        const component = await ProductsOfferCampaign({
            campaign: { ...baseCampaign, image: undefined } as unknown as ProductsCampaign,
            searchParams: undefined,
        })
        render(component)
        expect(screen.queryByTestId("product-offer-banner")).not.toBeInTheDocument()
    })

    it("passes campaign categories to toolbar and desktop filters", async () => {
        const component = await ProductsOfferCampaign({
            campaign: baseCampaign,
            searchParams: undefined,
        })
        render(component)
        expect(screen.getByTestId("products-offer-toolbar")).toHaveAttribute(
            "data-categories",
            "cat-1,cat-2"
        )
        expect(screen.getByTestId("desktop-offer-filters")).toHaveAttribute(
            "data-categories",
            "cat-1,cat-2"
        )
    })

    it("hides categories with no products in the campaign", async () => {
        mockGetProductsList.mockResolvedValue(productSearchResult(["cat-1"]))
        const component = await ProductsOfferCampaign({
            campaign: baseCampaign,
            searchParams: undefined,
        })
        render(component)
        expect(screen.getByTestId("products-offer-toolbar")).toHaveAttribute(
            "data-categories",
            "cat-1"
        )
    })

    it("keeps category list stable when category filter is active", async () => {
        mockGetProductsList
            .mockResolvedValueOnce(productSearchResult(["cat-1", "cat-2"]))
            .mockResolvedValueOnce(productSearchResult(["cat-1"]))

        const component = await ProductsOfferCampaign({
            campaign: baseCampaign,
            searchParams: { category: "cat-1" },
        })
        render(component)

        expect(screen.getByTestId("products-offer-toolbar")).toHaveAttribute(
            "data-categories",
            "cat-1,cat-2"
        )
        expect(screen.getByTestId("products-campaign-list")).toHaveAttribute(
            "data-category-count",
            "1"
        )
    })

    it("calls notFound when category is outside campaign", async () => {
        mockGetProductsList.mockResolvedValue(productSearchResult(["cat-1"]))

        await expect(
            ProductsOfferCampaign({
                campaign: baseCampaign,
                searchParams: { category: "cat-empty" },
            })
        ).rejects.toThrow("NEXT_NOT_FOUND")

        expect(mockNotFound).toHaveBeenCalledTimes(1)
    })

    it("passes prefetched products to ProductsCampaignList", async () => {
        const component = await ProductsOfferCampaign({
            campaign: baseCampaign,
            searchParams: undefined,
        })
        render(component)
        expect(screen.getByTestId("products-campaign-list")).toHaveAttribute(
            "data-category-count",
            "2"
        )
    })

    it("puts priorityProducts first in ordered ids (no filters)", async () => {
        mockGetProductsList
            .mockResolvedValueOnce({
                list: {
                    data: [
                        { id: "p1", categories: [{ id: "cat-1" }] },
                        { id: "p2", categories: [{ id: "cat-2" }] },
                        { id: "p3", categories: [{ id: "cat-1" }] },
                    ],
                    pagination: { page: 1, pageSize: 21, total: 3, totalPages: 1 },
                },
                brandIds: [],
                categoryIds: ["cat-1", "cat-2"],
                categories: {},
            })
            .mockResolvedValueOnce({
                list: {
                    data: [
                        { id: "p1", categories: [{ id: "cat-1" }] },
                        { id: "p3", categories: [{ id: "cat-1" }] },
                    ],
                    pagination: { page: 1, pageSize: 21, total: 2, totalPages: 1 },
                },
                brandIds: [],
                categoryIds: ["cat-1"],
                categories: {},
            })

        await ProductsOfferCampaign({
            campaign: {
                ...baseCampaign,
                priorityProducts: ["p3"],
                productIds: ["p1", "p2", "p3"],
            } as unknown as ProductsCampaign,
            searchParams: undefined,
        })

        expect(mockGetProductsList).toHaveBeenCalledTimes(2)
        expect(mockGetProductsList.mock.calls[1][0].productIds[0]).toBe("p3")
    })

    it("uses filtered path when brand is active", async () => {
        mockGetProductsList
            .mockResolvedValueOnce(productSearchResult(["cat-1", "cat-2"]))
            .mockResolvedValueOnce(productSearchResult(["cat-1"]))

        await ProductsOfferCampaign({
            campaign: baseCampaign,
            searchParams: { brand: "brand-1" },
        })

        expect(mockGetProductsList).toHaveBeenCalledTimes(2)
        expect(mockGetProductsList.mock.calls[1][0]).toEqual(
            expect.objectContaining({
                brand: "brand-1",
                productIds: ["p1", "p2"],
            })
        )
    })

    it("uses filtered path when search is active", async () => {
        mockGetProductsList
            .mockResolvedValueOnce(productSearchResult(["cat-1", "cat-2"]))
            .mockResolvedValueOnce(productSearchResult(["cat-1"]))

        const component = await ProductsOfferCampaign({
            campaign: baseCampaign,
            searchParams: { search: "zapatos" },
        })
        render(component)

        expect(mockGetProductsList.mock.calls[1][0].search).toBe("zapatos")
        expect(screen.getByTestId("products-campaign-list")).toHaveAttribute(
            "data-search-query",
            "zapatos"
        )
    })

    it("uses filtered path when sort is active", async () => {
        mockGetProductsList
            .mockResolvedValueOnce(productSearchResult(["cat-1", "cat-2"]))
            .mockResolvedValueOnce(productSearchResult(["cat-1"]))

        await ProductsOfferCampaign({
            campaign: baseCampaign,
            searchParams: { sort: "price_asc" },
        })

        expect(mockGetProductsList.mock.calls[1][0].sort).toBe("price_asc")
    })

    it("uses filtered path when points is active", async () => {
        mockGetProductsList
            .mockResolvedValueOnce(productSearchResult(["cat-1", "cat-2"]))
            .mockResolvedValueOnce(productSearchResult(["cat-1"]))

        await ProductsOfferCampaign({
            campaign: baseCampaign,
            searchParams: { points: "100-500" as never },
        })

        expect(mockGetProductsList).toHaveBeenCalledTimes(2)
        expect(mockGetProductsList.mock.calls[1][0].points).toBe("100-500")
    })

    it("reads selectedCategory from category array", async () => {
        mockGetProductsList
            .mockResolvedValueOnce(productSearchResult(["cat-1", "cat-2"]))
            .mockResolvedValueOnce(productSearchResult(["cat-1"]))

        const component = await ProductsOfferCampaign({
            campaign: baseCampaign,
            searchParams: { category: ["cat-1"] as never },
        })
        render(component)

        expect(screen.getByTestId("products-offer-toolbar")).toHaveAttribute(
            "data-categories",
            "cat-1,cat-2"
        )
    })

    it("pre-slices product ids by page when no filters", async () => {
        mockGetProductsList
            .mockResolvedValueOnce({
                list: {
                    data: [
                        { id: "p1", categories: [{ id: "cat-1" }] },
                        { id: "p2", categories: [{ id: "cat-2" }] },
                        { id: "p3", categories: [{ id: "cat-1" }] },
                    ],
                    pagination: { page: 1, pageSize: 21, total: 3, totalPages: 1 },
                },
                brandIds: [],
                categoryIds: ["cat-1", "cat-2"],
                categories: {},
            })
            .mockResolvedValueOnce({
                list: {
                    data: [],
                    pagination: { page: 1, pageSize: 21, total: 0, totalPages: 0 },
                },
                brandIds: [],
                categoryIds: [],
                categories: {},
            })

        await ProductsOfferCampaign({
            campaign: baseCampaign,
            searchParams: { page: "2" as never },
        })

        const secondCall = mockGetProductsList.mock.calls[1][0]
        expect(secondCall.page).toBe(1)
        expect(secondCall.perPage).toBe(21)
        expect(Array.isArray(secondCall.productIds)).toBe(true)
    })

    it("reorders display data by campaign order when no filters", async () => {
        mockGetProductsList
            .mockResolvedValueOnce({
                list: {
                    data: [
                        { id: "p1", categories: [{ id: "cat-1" }] },
                        { id: "p2", categories: [{ id: "cat-1" }] },
                    ],
                    pagination: { page: 1, pageSize: 21, total: 2, totalPages: 1 },
                },
                brandIds: [],
                categoryIds: ["cat-1"],
                categories: {},
            })
            .mockResolvedValueOnce({
                list: {
                    data: [
                        { id: "p2", categories: [{ id: "cat-1" }] },
                        { id: "p1", categories: [{ id: "cat-1" }] },
                    ],
                    pagination: { page: 1, pageSize: 21, total: 2, totalPages: 1 },
                },
                brandIds: [],
                categoryIds: ["cat-1"],
                categories: {},
            })

        const component = await ProductsOfferCampaign({
            campaign: {
                ...baseCampaign,
                productIds: ["p1", "p2"],
                categories: ["cat-1"],
            } as unknown as ProductsCampaign,
            searchParams: undefined,
        })
        render(component)

        expect(screen.getByTestId("products-campaign-list")).toBeInTheDocument()
        expect(mockGetProductsList).toHaveBeenCalledTimes(2)
    })

    it("renders DesktopToolbar and catalog layout", async () => {
        const component = await ProductsOfferCampaign({
            campaign: baseCampaign,
            searchParams: undefined,
        })
        render(component)
        expect(screen.getByTestId("desktop-toolbar")).toBeInTheDocument()
        expect(screen.getByTestId("products-catalog-layout")).toBeInTheDocument()
    })

    it("first search always requests full campaign product list", async () => {
        await ProductsOfferCampaign({
            campaign: baseCampaign,
            searchParams: undefined,
        })

        expect(mockGetProductsList.mock.calls[0][0]).toEqual(
            expect.objectContaining({
                search: "",
                brand: "",
                category: [],
                sort: "",
                page: 1,
                perPage: 3,
                productIds: ["p1", "p2", "p3"],
            })
        )
    })

    it("renders with undefined priority products and filters out-of-order ids", async () => {
        mockGetProductsList
            .mockReset()
            .mockResolvedValueOnce(productSearchResult(["cat-1", "cat-2"]))
            .mockResolvedValueOnce({
                list: {
                    data: [
                        { id: "p4", categories: [{ id: "cat-1" }] },
                        { id: "p5", categories: [{ id: "cat-1" }] },
                    ],
                    pagination: {
                        page: 1,
                        pageSize: 21,
                        total: 2,
                        totalPages: 1,
                    },
                },
                brandIds: [],
                categoryIds: [],
                categories: {},
            })

        const component = await ProductsOfferCampaign({
            campaign: {
                ...baseCampaign,
                priorityProducts: undefined,
            } as unknown as ProductsCampaign,
            searchParams: undefined,
        })
        render(component)

        expect(
            screen.getByRole("heading", { name: /Top Products \(2\)/i })
        ).toBeInTheDocument()
        expect(screen.getByTestId("products-campaign-list")).toHaveAttribute(
            "data-product-count",
            "0"
        )
    })
})