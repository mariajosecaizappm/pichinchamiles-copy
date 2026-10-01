import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import ProductsListBaseContainer from "@/presentation/pages/Products/components/ProductsList/ProductsListBaseContainer"
import type { ProductSearch } from "@/domain/entity/Product/product"

const { mockUseProductSearch } = vi.hoisted(() => ({
    mockUseProductSearch: vi.fn(),
}))

vi.mock("@/presentation/hooks/useProductSearch", () => ({
    default: () => mockUseProductSearch(),
}))

vi.mock(
    "@/presentation/pages/Products/components/ProductsList/ProductsList",
    () => ({
        default: ({
            products,
            searchQuery,
            className,
            breadcrumbs,
            searchResultsText,
            noResultsClassName,
        }: {
            products: ProductSearch | null
            searchQuery?: string
            className?: string
            breadcrumbs?: React.ReactNode
            searchResultsText?: React.ReactNode
            noResultsClassName?: string
        }) => (
            <div
                data-testid="products-list"
                data-search-query={searchQuery ?? ""}
                data-class={className ?? ""}
                data-no-results-class={noResultsClassName ?? ""}
                data-has-products={String(products !== null)}
            >
                {breadcrumbs}
                {searchResultsText}
            </div>
        ),
    })
)

const makeProducts = (
    overrides?: Partial<ProductSearch>
): ProductSearch =>
    ({
        list: {
            data: [{ id: "p1" }],
            pagination: { page: 1, pageSize: 21, total: 1, totalPages: 1 },
        },
        categories: { cat1: 1, cat2: 2 },
        brandIds: ["brand-1", "brand-2"],
        ...overrides,
    }) as ProductSearch

describe("ProductsListBaseContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockUseProductSearch.mockReturnValue({
            searchValues: { brand: null },
        })
    })

    it("renders ProductsList", () => {
        render(<ProductsListBaseContainer products={makeProducts()} />)
        expect(screen.getByTestId("products-list")).toBeInTheDocument()
    })

    it("passes products, searchQuery, className and optional slots", () => {
        render(
            <ProductsListBaseContainer
                products={makeProducts()}
                searchQuery="zapatos"
                className="my-class"
                noResultsClassName="no-results"
                breadcrumbs={<span data-testid="breadcrumbs">crumbs</span>}
                searchResultsText={
                    <span data-testid="results-text">10 results</span>
                }
            />
        )

        const list = screen.getByTestId("products-list")
        expect(list).toHaveAttribute("data-search-query", "zapatos")
        expect(list).toHaveAttribute("data-class", "my-class")
        expect(list).toHaveAttribute("data-no-results-class", "no-results")
        expect(list).toHaveAttribute("data-has-products", "true")
        expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument()
        expect(screen.getByTestId("results-text")).toBeInTheDocument()
    })

    it("defaults searchQuery to empty string", () => {
        render(<ProductsListBaseContainer products={makeProducts()} />)
        expect(screen.getByTestId("products-list")).toHaveAttribute(
            "data-search-query",
            ""
        )
    })

    it("handles products null", () => {
        render(<ProductsListBaseContainer products={null} />)
        expect(screen.getByTestId("products-list")).toHaveAttribute(
            "data-has-products",
            "false"
        )
    })

    it("calls onCategoriesChange with category keys", async () => {
        const onCategoriesChange = vi.fn()
        render(
            <ProductsListBaseContainer
                products={makeProducts()}
                onCategoriesChange={onCategoriesChange}
            />
        )
        await waitFor(() => {
            expect(onCategoriesChange).toHaveBeenCalledWith(["cat1", "cat2"])
        })
    })

    it("does not call onCategoriesChange when callback is missing", async () => {
        render(<ProductsListBaseContainer products={makeProducts()} />)
        await waitFor(() => {
            expect(screen.getByTestId("products-list")).toBeInTheDocument()
        })
    })

    it("does not call onCategoriesChange when products is null", async () => {
        const onCategoriesChange = vi.fn()
        render(
            <ProductsListBaseContainer
                products={null}
                onCategoriesChange={onCategoriesChange}
            />
        )
        await waitFor(() => {
            expect(onCategoriesChange).not.toHaveBeenCalled()
        })
    })

    it("does not call onCategoriesChange when products has no categories", async () => {
        const onCategoriesChange = vi.fn()
        render(
            <ProductsListBaseContainer
                products={makeProducts({ categories: undefined })}
                onCategoriesChange={onCategoriesChange}
            />
        )
        await waitFor(() => {
            expect(onCategoriesChange).not.toHaveBeenCalled()
        })
    })

    it("calls onBrandsChange when no brand filter is active", async () => {
        const onBrandsChange = vi.fn()
        render(
            <ProductsListBaseContainer
                products={makeProducts()}
                onBrandsChange={onBrandsChange}
            />
        )
        await waitFor(() => {
            expect(onBrandsChange).toHaveBeenCalledWith(["brand-1", "brand-2"])
        })
    })

    it("calls onBrandsChange when brand is empty string", async () => {
        mockUseProductSearch.mockReturnValue({
            searchValues: { brand: "" },
        })
        const onBrandsChange = vi.fn()
        render(
            <ProductsListBaseContainer
                products={makeProducts()}
                brandIds={["brand-1"]}
                onBrandsChange={onBrandsChange}
            />
        )
        await waitFor(() => {
            expect(onBrandsChange).toHaveBeenCalledWith(["brand-1", "brand-2"])
        })
    })

    it("does not call onBrandsChange when brand filter is active and brandIds has values", async () => {
        mockUseProductSearch.mockReturnValue({
            searchValues: { brand: "brand-1" },
        })
        const onBrandsChange = vi.fn()
        render(
            <ProductsListBaseContainer
                products={makeProducts()}
                brandIds={["brand-1"]}
                onBrandsChange={onBrandsChange}
            />
        )
        await waitFor(() => {
            expect(onBrandsChange).not.toHaveBeenCalled()
        })
    })

    it("calls onBrandsChange when brand filter is active but brandIds length is 0", async () => {
        mockUseProductSearch.mockReturnValue({
            searchValues: { brand: "brand-1" },
        })
        const onBrandsChange = vi.fn()
        render(
            <ProductsListBaseContainer
                products={makeProducts()}
                brandIds={[]}
                onBrandsChange={onBrandsChange}
            />
        )
        await waitFor(() => {
            expect(onBrandsChange).toHaveBeenCalledWith(["brand-1", "brand-2"])
        })
    })

    it("does not call onBrandsChange when brand filter is active and brandIds is undefined", async () => {
        mockUseProductSearch.mockReturnValue({
            searchValues: { brand: "brand-1" },
        })
        const onBrandsChange = vi.fn()
        render(
            <ProductsListBaseContainer
                products={makeProducts()}
                onBrandsChange={onBrandsChange}
            />
        )
        await waitFor(() => {
            expect(onBrandsChange).not.toHaveBeenCalled()
        })
    })

    it("does not call onBrandsChange when products has no brandIds", async () => {
        const onBrandsChange = vi.fn()
        render(
            <ProductsListBaseContainer
                products={makeProducts({ brandIds: undefined })}
                onBrandsChange={onBrandsChange}
            />
        )
        await waitFor(() => {
            expect(onBrandsChange).not.toHaveBeenCalled()
        })
    })

    it("does not call onBrandsChange when products is null", async () => {
        const onBrandsChange = vi.fn()
        render(
            <ProductsListBaseContainer
                products={null}
                onBrandsChange={onBrandsChange}
            />
        )
        await waitFor(() => {
            expect(onBrandsChange).not.toHaveBeenCalled()
        })
    })

    it("does not call onBrandsChange when callback is missing", async () => {
        render(<ProductsListBaseContainer products={makeProducts()} />)
        await waitFor(() => {
            expect(screen.getByTestId("products-list")).toBeInTheDocument()
        })
    })

    it("calls both category and brand callbacks together", async () => {
        const onCategoriesChange = vi.fn()
        const onBrandsChange = vi.fn()
        render(
            <ProductsListBaseContainer
                products={makeProducts()}
                onCategoriesChange={onCategoriesChange}
                onBrandsChange={onBrandsChange}
            />
        )
        await waitFor(() => {
            expect(onCategoriesChange).toHaveBeenCalledWith(["cat1", "cat2"])
            expect(onBrandsChange).toHaveBeenCalledWith(["brand-1", "brand-2"])
        })
    })
})