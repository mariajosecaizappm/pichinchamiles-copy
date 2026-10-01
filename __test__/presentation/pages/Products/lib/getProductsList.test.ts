import { describe, it, expect, vi, beforeEach } from "vitest"
import getProductsList, {
    parsePage,
    getProductIdsWindow,
    getProductsSearchContext,
} from "@/presentation/pages/Products/lib/getProductsList"
import { Product, ProductSearch, Search } from "@/domain/entity/Product/product"

const { mockSearchProducts, mockContainerGet, mockUserAgent } = vi.hoisted(
    () => ({
        mockSearchProducts: vi.fn(),
        mockContainerGet: vi.fn(),
        mockUserAgent: {
            value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0",
        },
    })
)

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: () => mockContainerGet(),
    },
}))

vi.mock("next/headers", () => ({
    headers: () => ({
        get: (key: string) =>
            key === "user-agent" ? mockUserAgent.value : null,
    }),
}))

const buildProduct = (id: string): Product => ({ id } as Product)

const buildProductSearch = (
    products: Product[],
    pagination?: Partial<ProductSearch["list"]["pagination"]>
): ProductSearch => ({
    list: {
        data: products,
        pagination: {
            page: 1,
            pageSize: 21,
            total: products.length,
            totalPages: Math.ceil(products.length / 21) || 1,
            ...pagination,
        },
    },
    brandIds: [],
    categoryIds: [],
    categories: {},
})

describe("parsePage", () => {
    it("returns positive numbers", () => {
        expect(parsePage(3)).toBe(3)
        expect(parsePage("2")).toBe(2)
    })

    it("falls back to 1 for invalid values", () => {
        expect(parsePage(undefined)).toBe(1)
        expect(parsePage(null)).toBe(1)
        expect(parsePage("abc")).toBe(1)
        expect(parsePage(0)).toBe(1)
        expect(parsePage(-1)).toBe(1)
        expect(parsePage(NaN)).toBe(1)
    })
})

describe("getProductIdsWindow", () => {
    it("slices ids for page", () => {
        const ids = ["a", "b", "c", "d", "e"]
        expect(getProductIdsWindow(ids, 1, 2)).toEqual({
            page: 1,
            idsWindow: ["a", "b"],
        })
        expect(getProductIdsWindow(ids, 2, 2)).toEqual({
            page: 2,
            idsWindow: ["c", "d"],
        })
        expect(getProductIdsWindow(ids, 3, 2)).toEqual({
            page: 3,
            idsWindow: ["e"],
        })
    })

    it("uses page 1 when page is invalid", () => {
        expect(getProductIdsWindow(["a", "b"], "x", 10)).toEqual({
            page: 1,
            idsWindow: ["a", "b"],
        })
    })
})

describe("getProductsSearchContext", () => {
    beforeEach(() => {
        mockContainerGet.mockReturnValue({ searchProducts: mockSearchProducts })
    })

    it("returns perPage 21 for desktop", async () => {
        mockUserAgent.value =
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0"
        const ctx = await getProductsSearchContext()
        expect(ctx.perPage).toBe(21)
        expect(ctx.productsSearchUseCase).toBeDefined()
    })

    it("returns perPage 30 for mobile", async () => {
        mockUserAgent.value =
            "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)"
        const ctx = await getProductsSearchContext()
        expect(ctx.perPage).toBe(30)
    })

    it("uses empty string when user-agent header is missing", async () => {
        mockUserAgent.value = null as unknown as string
        const ctx = await getProductsSearchContext()
        expect(ctx.perPage).toBe(21)
    })
})

describe("getProductsList", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockUserAgent.value =
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0"
        mockContainerGet.mockReturnValue({ searchProducts: mockSearchProducts })
    })

    it("preserves campaign order when no sort", async () => {
        const productIds = ["p-3", "p-1", "p-2"]
        mockSearchProducts.mockResolvedValue(
            buildProductSearch([
                buildProduct("p-1"),
                buildProduct("p-2"),
                buildProduct("p-3"),
            ])
        )
        const result = await getProductsList({ productIds })
        expect(mockSearchProducts).toHaveBeenCalledWith(
            expect.objectContaining({
                page: 1,
                perPage: 21,
                productIds,
                sort: "",
            })
        )
        expect(result.products?.list.data.map((p) => p.id)).toEqual(productIds)
        expect(result.products?.list.pagination).toEqual({
            page: 1,
            pageSize: 21,
            total: 3,
            totalPages: 1,
        })
    })

    it("uses API order when sort is set", async () => {
        const productIds = ["p-3", "p-1", "p-2"]
        mockSearchProducts.mockResolvedValue(
            buildProductSearch(
                [buildProduct("p-1"), buildProduct("p-2"), buildProduct("p-3")],
                { total: 3, totalPages: 1 }
            )
        )
        const result = await getProductsList({
            productIds,
            sort: "points-asc",
        })
        expect(mockSearchProducts).toHaveBeenCalledWith(
            expect.objectContaining({
                page: 1,
                productIds,
                sort: "points-asc",
            })
        )
        expect(result.products?.list.data.map((p) => p.id)).toEqual([
            "p-1",
            "p-2",
            "p-3",
        ])
    })

    it("passes full productIds and page when sorting on later page", async () => {
        const productIds = Array.from({ length: 25 }, (_, i) => `p-${i}`)
        mockSearchProducts.mockResolvedValue(
            buildProductSearch(productIds.slice(21).map(buildProduct), {
                page: 2,
                pageSize: 21,
                total: 25,
                totalPages: 2,
            })
        )
        const result = await getProductsList({
            productIds,
            sort: "points-desc",
            page: 2,
        })
        expect(mockSearchProducts).toHaveBeenCalledWith(
            expect.objectContaining({
                page: 2,
                productIds,
                sort: "points-desc",
            })
        )
        expect(result.products?.list.data.map((p) => p.id)).toEqual(
            productIds.slice(21)
        )
    })

    it("uses perPage 30 on mobile", async () => {
        mockUserAgent.value =
            "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)"
        mockSearchProducts.mockResolvedValue(buildProductSearch([]))
        await getProductsList({ search: "q" })
        expect(mockSearchProducts).toHaveBeenCalledWith(
            expect.objectContaining({ perPage: 30 })
        )
    })

    it("uses perPage 21 on desktop", async () => {
        mockSearchProducts.mockResolvedValue(buildProductSearch([]))
        await getProductsList({})
        expect(mockSearchProducts).toHaveBeenCalledWith(
            expect.objectContaining({ perPage: 21 })
        )
    })

    it("returns null products on error", async () => {
        mockSearchProducts.mockRejectedValue(new Error("fail"))
        const result = await getProductsList({ search: "x" })
        expect(result).toEqual({ products: null, searchQuery: "x" })
    })

    it("returns empty searchQuery when no searchParams", async () => {
        mockSearchProducts.mockResolvedValue(buildProductSearch([]))
        const result = await getProductsList()
        expect(result.searchQuery).toBe("")
    })

    it("parses points into numbers filtering NaN", async () => {
        mockSearchProducts.mockResolvedValue(buildProductSearch([]))
        await getProductsList({
            points: "100-abc-500" as unknown as Search["points"],
        })
        expect(mockSearchProducts).toHaveBeenCalledWith(
            expect.objectContaining({ points: [100, 500] })
        )
    })

    it("omits points when not provided", async () => {
        mockSearchProducts.mockResolvedValue(buildProductSearch([]))
        await getProductsList({ search: "q" })
        const arg = mockSearchProducts.mock.calls[0][0]
        expect(arg).not.toHaveProperty("points")
    })

    it("does not preserve order when productIds empty", async () => {
        mockSearchProducts.mockResolvedValue(
            buildProductSearch([buildProduct("a")], { total: 1 })
        )
        const result = await getProductsList({ productIds: [] })
        expect(mockSearchProducts).toHaveBeenCalledWith(
            expect.objectContaining({ page: 1, productIds: [] })
        )
        expect(result.products?.list.data.map((p) => p.id)).toEqual(["a"])
    })

    it("pre-slices window on page 2 with small perPage via many ids", async () => {
        const productIds = Array.from({ length: 25 }, (_, i) => `p${i}`)
        mockSearchProducts.mockResolvedValue(
            buildProductSearch(productIds.slice(21, 25).map(buildProduct))
        )
        await getProductsList({ productIds, page: 2 })
        expect(mockSearchProducts).toHaveBeenCalledWith(
            expect.objectContaining({
                page: 1,
                productIds: productIds.slice(21, 42),
            })
        )
    })

    it("preserves order page 1 window", async () => {
        const productIds = ["p1", "p2", "p3"]
        mockSearchProducts.mockResolvedValue(
            buildProductSearch([
                buildProduct("p1"),
                buildProduct("p2"),
                buildProduct("p3"),
            ])
        )
        const result = await getProductsList({ productIds, page: 1 })
        expect(mockSearchProducts).toHaveBeenCalledWith(
            expect.objectContaining({
                page: 1,
                productIds: ["p1", "p2", "p3"],
            })
        )
        expect(result.products?.list.data.map((p) => p.id)).toEqual([
            "p1",
            "p2",
            "p3",
        ])
    })

    it("uses search result length as total when search + preserve order", async () => {
        const productIds = ["p1", "p2", "p3"]
        mockSearchProducts.mockResolvedValue(
            buildProductSearch([buildProduct("p1")], { total: 99 })
        )
        const result = await getProductsList({
            productIds,
            search: "zapato",
        })
        expect(result.products?.list.pagination.total).toBe(1)
        expect(result.searchQuery).toBe("zapato")
    })

    it("uses productIds length as total when preserve order without search", async () => {
        const productIds = ["p1", "p2", "p3"]
        mockSearchProducts.mockResolvedValue(
            buildProductSearch([buildProduct("p1"), buildProduct("p2")])
        )
        const result = await getProductsList({ productIds })
        expect(result.products?.list.pagination.total).toBe(3)
        expect(result.products?.list.pagination.totalPages).toBe(1)
    })

    it("filters missing ids when reordering", async () => {
        const productIds = ["p1", "missing", "p2"]
        mockSearchProducts.mockResolvedValue(
            buildProductSearch([buildProduct("p2"), buildProduct("p1")])
        )
        const result = await getProductsList({ productIds })
        expect(result.products?.list.data.map((p) => p.id)).toEqual(["p1", "p2"])
    })

    it("passes brand and category", async () => {
        mockSearchProducts.mockResolvedValue(buildProductSearch([]))
        await getProductsList({ brand: "b1", category: ["c1"] })
        expect(mockSearchProducts).toHaveBeenCalledWith(
            expect.objectContaining({
                brand: "b1",
                category: ["c1"],
            })
        )
    })

    it("defaults brand and category when missing", async () => {
        mockSearchProducts.mockResolvedValue(buildProductSearch([]))
        await getProductsList({})
        expect(mockSearchProducts).toHaveBeenCalledWith(
            expect.objectContaining({
                brand: "",
                category: [],
                sort: "",
                productIds: [],
            })
        )
    })

    it("keeps API pagination when not preserving order", async () => {
        mockSearchProducts.mockResolvedValue(
            buildProductSearch([buildProduct("a")], {
                page: 2,
                pageSize: 21,
                total: 40,
                totalPages: 2,
            })
        )
        const result = await getProductsList({ page: 2 })
        expect(result.products?.list.pagination).toEqual({
            page: 2,
            pageSize: 21,
            total: 40,
            totalPages: 2,
        })
    })
})