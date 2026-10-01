import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import ProductsList from "@/presentation/pages/Products/components/ProductsList/ProductsListContainer"

const mockSetProductCategories = vi.fn()
const mockSetProductBrands = vi.fn()
let mockProductBrands: string[] = []
let mockSearchBrand = ""

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        replace: vi.fn(),
        push: vi.fn(),
    }),
    usePathname: () => "/productos",
    useParams: () => ({}),
    useSearchParams: () => new URLSearchParams(mockSearchBrand ? `brand=${mockSearchBrand}` : ""),
}))

vi.mock("@/presentation/hooks/useProductSearch", () => ({
    default: () => ({
        searchValues: {
            search: "",
            category: "",
            brand: mockSearchBrand,
            sort: "",
            page: 1,
            perPage: undefined,
        },
    }),
}))

vi.mock("@/presentation/pages/Products/components/ProductsList/ProductsListPagination", () => ({
    default: ({ page, totalPages }: { page: number; totalPages: number }) => (
        <div data-testid="products-list-pagination">
            {page}/{totalPages}
        </div>
    ),
}))

vi.mock("@/presentation/pages/Products/context/useProductsContext", () => ({
    useProductsContext: () => ({
        productBrands: mockProductBrands,
        setProductCategories: mockSetProductCategories,
        setProductBrands: mockSetProductBrands,
    }),
}))

const mockProducts = {
    list: {
        data: [],
        pagination: { page: 1, pageSize: 28, total: 0, totalPages: 0 },
    },
    brandIds: ["b1", "b2"],
    categoryIds: ["c1"],
    categories: { Electronics: 10 },
}

describe("ProductsList", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockProductBrands = []
        mockSearchBrand = ""
    })
    it("should return null when products is null", () => {
        render(<ProductsList products={null} />)

        expect(screen.queryByText(/Resultado/)).not.toBeInTheDocument()
    })

    it("should render search result text when products and search query are provided", () => {
        const mockProducts = {
            list: {
                data: [],
                pagination: { page: 1, pageSize: 28, total: 9, totalPages: 1 },
            },
            brandIds: [],
            categoryIds: [],
            categories: {},
        }

        render(<ProductsList products={mockProducts} searchQuery="maleta" />)

        expect(screen.getByText("Resultado de \u201cmaleta\u201d (9)")).toBeInTheDocument()
    })

    it("should render no-results helper when the list is empty with a search query", () => {
        const mockProducts = {
            list: {
                data: [],
                pagination: { page: 1, pageSize: 28, total: 0, totalPages: 0 },
            },
            brandIds: [],
            categoryIds: [],
            categories: {},
        }

        render(<ProductsList products={mockProducts} searchQuery="xyz" />)

        expect(screen.getByTestId("products-list-no-results")).toHaveTextContent(
            "Intenta con otro término",
        )
        expect(screen.getByTestId("products-list-no-results")).toHaveTextContent("de búsqueda")
    })

    it("should render no-results helper when the list is empty without a search query", () => {
        const mockProducts = {
            list: {
                data: [],
                pagination: { page: 1, pageSize: 28, total: 0, totalPages: 0 },
            },
            brandIds: [],
            categoryIds: [],
            categories: {},
        }

        render(<ProductsList products={mockProducts} />)

        expect(screen.getByTestId("products-list-no-results")).toHaveTextContent(
            "No hay productos disponibles por ahora.",
        )
    })

    it("should update product brands when no brand filter is active", () => {
        render(<ProductsList products={mockProducts} />)

        expect(mockSetProductBrands).toHaveBeenCalledWith(["b1", "b2"])
    })

    it("should keep brand snapshot when a brand filter is active", () => {
        mockSearchBrand = "b1"
        mockProductBrands = ["b1", "b2"]

        render(<ProductsList products={{ ...mockProducts, brandIds: ["b1"] }} />)

        expect(mockSetProductBrands).not.toHaveBeenCalled()
    })

    it("should seed product brands on first load even with brand filter active", () => {
        mockSearchBrand = "b1"

        render(<ProductsList products={{ ...mockProducts, brandIds: ["b1"] }} />)

        expect(mockSetProductBrands).toHaveBeenCalledWith(["b1"])
    })

    it("should not throw when rendering with valid products", () => {
        expect(() => {
            render(<ProductsList products={mockProducts} />)
        }).not.toThrow()
    })

    it("should pass pagination metadata to ProductsListPagination", () => {
        const mockProducts = {
            list: {
                data: [],
                pagination: { page: 2, pageSize: 28, total: 56, totalPages: 2 },
            },
            brandIds: [],
            categoryIds: [],
            categories: {},
        }

        render(<ProductsList products={mockProducts} />)

        expect(screen.getByTestId("products-list-pagination")).toHaveTextContent("2/2")
    })
})
