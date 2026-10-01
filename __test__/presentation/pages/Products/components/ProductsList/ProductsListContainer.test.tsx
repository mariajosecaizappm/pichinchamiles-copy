import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import ProductsListServerContainer from "@/presentation/pages/Products/components/ProductsList/ProductsListServerContainer"
import { ProductSearch, Search } from "@/domain/entity/Product/product"

const mockGetProductsList = vi.fn()

// ProductsListServerContainer now delegates entirely to getProductsList(searchParams) —
// no DI container call happens inside it anymore.
vi.mock("@/presentation/pages/Products/lib/getProductsList", () => ({
    default: (searchParams: Partial<Search> | undefined) => mockGetProductsList(searchParams),
}))

// The rendered child is ProductsListContainer (imported as "./ProductsListContainer"
// inside the server container), which itself reads useProductsContext — mock it
// directly so the server container test doesn't need a real ProductsProvider.
vi.mock("@/presentation/pages/Products/components/ProductsList/ProductsListContainer", () => ({
    default: ({ products, searchQuery, className }: { products: ProductSearch | null; searchQuery?: string; className?: string }) => (
        <div
            data-testid="products-list"
            data-products={JSON.stringify(products)}
            data-search-query={searchQuery}
            data-class-name={className}
        >
            Products List
        </div>
    ),
}))

describe("ProductsListServerContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should call getProductsList with the provided searchParams", async () => {
        const mockResult = {
            products: {
                list: { data: [], pagination: { page: 1, pageSize: 28, total: 0, totalPages: 0 } },
                brandIds: [],
                categoryIds: [],
                categories: {},
            } as ProductSearch,
            searchQuery: "",
        }
        mockGetProductsList.mockResolvedValue(mockResult)

        const searchParams: Partial<Search> = { search: "laptop", brand: "brand-1" }
        const result = await ProductsListServerContainer({ searchParams })
        render(result)

        expect(mockGetProductsList).toHaveBeenCalledWith(searchParams)
        expect(screen.getByTestId("products-list")).toBeInTheDocument()
    })

    it("should call getProductsList with undefined when no searchParams are provided", async () => {
        const mockResult = {
            products: {
                list: { data: [], pagination: { page: 1, pageSize: 28, total: 0, totalPages: 0 } },
                brandIds: [],
                categoryIds: [],
                categories: {},
            } as ProductSearch,
            searchQuery: "",
        }
        mockGetProductsList.mockResolvedValue(mockResult)

        await ProductsListServerContainer({})

        expect(mockGetProductsList).toHaveBeenCalledWith(undefined)
    })

    it("should render ProductsListContainer with products from getProductsList", async () => {
        const mockProducts = {
            list: { data: [], pagination: { page: 1, pageSize: 28, total: 5, totalPages: 1 } },
            brandIds: ["b1", "b2"],
            categoryIds: ["c1"],
            categories: { Electronics: 10 },
        } as ProductSearch

        mockGetProductsList.mockResolvedValue({ products: mockProducts, searchQuery: "" })

        const result = await ProductsListServerContainer({})
        render(result)

        const productsList = screen.getByTestId("products-list")
        const productsData = JSON.parse(productsList.dataset.products || "null")
        expect(productsData).toEqual(mockProducts)
    })

    it("should render ProductsListContainer with the search query from getProductsList", async () => {
        mockGetProductsList.mockResolvedValue({
            products: {
                list: { data: [], pagination: { page: 1, pageSize: 28, total: 9, totalPages: 1 } },
                brandIds: [],
                categoryIds: [],
                categories: {},
            } as ProductSearch,
            searchQuery: "maleta",
        })

        const result = await ProductsListServerContainer({ searchParams: { search: "maleta" } })
        render(result)

        expect(screen.getByTestId("products-list")).toHaveAttribute("data-search-query", "maleta")
    })

    it("should render ProductsListContainer with products=null when getProductsList resolves null products", async () => {
        // Matches the documented error path: on failure, getProductsList itself
        // is responsible for resolving { products: null, searchQuery }, and the
        // server container just forwards that through untouched.
        mockGetProductsList.mockResolvedValue({ products: null, searchQuery: "" })

        const result = await ProductsListServerContainer({})
        render(result)

        const productsList = screen.getByTestId("products-list")
        expect(productsList.dataset.products).toBe("null")
    })

    it("should forward the className prop to ProductsListContainer", async () => {
        mockGetProductsList.mockResolvedValue({
            products: {
                list: { data: [], pagination: { page: 1, pageSize: 28, total: 0, totalPages: 0 } },
                brandIds: [],
                categoryIds: [],
                categories: {},
            } as ProductSearch,
            searchQuery: "",
        })

        const result = await ProductsListServerContainer({ className: "custom-class" })
        render(result)

        expect(screen.getByTestId("products-list")).toHaveAttribute("data-class-name", "custom-class")
    })
})