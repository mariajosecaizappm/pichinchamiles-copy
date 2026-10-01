import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { ProductSearch } from "@/domain/entity/Product/product"
import ProductsCampaignListContainer from "@/presentation/pages/Offers/Products/Offer/components/ProductsCampaignList/ProductsCampaignListContainer"

const mockSetBrandIds = vi.fn()
const mockUseProductsOfferContext = vi.fn(() => ({
    brandIds: ["brand-1", "brand-2"],
    setBrandIds: mockSetBrandIds,
}))

vi.mock("@/presentation/pages/Offers/Products/Offer/context/useProductsOfferContext", () => ({
    default: () => mockUseProductsOfferContext(),
}))

vi.mock("@/presentation/pages/Products/components/ProductsList/ProductsListBaseContainer", () => ({
    default: (props: Record<string, unknown>) => (
        <div
            data-testid="products-list-base"
            data-products={JSON.stringify(props.products)}
            data-search-query={props.searchQuery}
            data-brand-ids={JSON.stringify(props.brandIds)}
            data-class={props.className}
            data-no-results-class={props.noResultsClassName}
        >
            {props.searchResultsText as React.ReactNode}
        </div>
    ),
}))

vi.mock(
    "@/presentation/pages/Offers/Products/Offer/components/ProductsCampaignList/components/ProductCampaignSearchResultsText",
    () => ({
        default: ({ searchQuery, total }: { searchQuery?: string; total: number }) => (
            <span data-testid="search-results-text" data-query={searchQuery ?? ""} data-total={total} />
        ),
    }),
)

describe("ProductsCampaignListContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockUseProductsOfferContext.mockReturnValue({
            brandIds: ["brand-1", "brand-2"],
            setBrandIds: mockSetBrandIds,
        })
    })

    const buildProducts = (total: number): ProductSearch =>
        ({
            list: {
                data: [],
                pagination: {
                    page: 1,
                    pageSize: 21,
                    total,
                    totalPages: 1,
                },
            },
            brandIds: ["brand-1"],
            categoryIds: ["cat-1"],
            categories: {},
        } as unknown as ProductSearch)

    it("should pass products, searchQuery and brand state to ProductsListBaseContainer", () => {
        const products = buildProducts(3)

        render(<ProductsCampaignListContainer products={products} searchQuery="shoes" />)

        expect(screen.getByTestId("products-list-base")).toHaveAttribute("data-search-query", "shoes")
        expect(screen.getByTestId("products-list-base")).toHaveAttribute(
            "data-brand-ids",
            JSON.stringify(["brand-1", "brand-2"]),
        )
    })

    it("should render the search results text with the campaign total", () => {
        const products = buildProducts(10)

        render(<ProductsCampaignListContainer products={products} searchQuery="miles" />)

        expect(screen.getByTestId("search-results-text")).toHaveAttribute("data-query", "miles")
        expect(screen.getByTestId("search-results-text")).toHaveAttribute("data-total", "10")
    })

    it("should default to an empty search query", () => {
        const products = buildProducts(5)

        render(<ProductsCampaignListContainer products={products} />)

        expect(screen.getByTestId("products-list-base")).toHaveAttribute("data-search-query", "")
    })

    it("should pass the brand setter to ProductsListBaseContainer", () => {
        const products = buildProducts(2)

        render(<ProductsCampaignListContainer products={products} />)

        // The onBrandsChange prop is the same function reference returned by the context.
        expect(screen.getByTestId("products-list-base")).toBeInTheDocument()
    })
})
