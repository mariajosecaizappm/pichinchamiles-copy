import React from "react"
import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"
import type {Product, ProductSuggestion} from "@/domain/entity/Product/product"
import {ProductType} from "@/domain/entity/Product/product"
import type SearchEngine from "@/domain/entity/SearchEngine/structure/SearchEngine"
import ProductSearchSuggestionsContainer from "@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar/components/ProductSearchSuggestions/ProductSearchSuggestionsContainer"

vi.mock("../ProductSearchBarLoader/ProductSearchBarLoader", () => ({
    default: ({searchQuery}: {searchQuery: string}) => (
        <div className="flex flex-col items-center h-[224px] justify-center p-4 lg:p-10 bg-white">
            <div className="mb-2.5">
                <svg 
                    width="64" 
                    height="64" 
                    viewBox="0 0 64 64" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="w-16 h-16 animate-spin"
                    role="img"
                >
                    <circle cx="32" cy="32" r="32" fill="#ECECED"/>
                    <path d="M32 1.9712C32 0.882537 32.8834 -0.00632628 33.97 0.0606927C37.4985 0.278326 40.9713 1.0795 44.2459 2.43586C48.1283 4.04401 51.6559 6.40111 54.6274 9.37259C57.5989 12.3441 59.956 15.8717 61.5641 19.7541C62.9205 23.0287 63.7217 26.5015 63.9393 30.03C64.0063 31.1166 63.1175 32 62.0288 32C60.9401 32 60.0648 31.1164 59.9884 30.0304C59.7765 27.0199 59.08 24.0589 57.9218 21.2628C56.5118 17.8587 54.4451 14.7657 51.8397 12.1603C49.2343 9.55489 46.1413 7.48818 42.7372 6.07816C39.9411 4.91997 36.9801 4.22347 33.9696 4.01162C32.8836 3.93519 32 3.05986 32 1.9712Z" fill="#FFC500"/>
                </svg>
            </div>
            <p className="text-[22px] font-normal text-blue-500 text-center max-w[288px]">
                Productos para {searchQuery}
            </p>
        </div>
    ),
}))

const createMockProduct = (id: string, name: string): Product => ({
    id,
    name,
    slug: `product-${id}`,
    description: `Description ${id}`,
    brand: {id: `brand-${id}`, name: `Brand ${id}`},
    categories: [],
    minPrice: 100,
    maxPrice: 200,
    minPointsPrice: 1000,
    maxPointsPrice: 2000,
    assets: [],
    features: [],
    mostWanted: false,
    productType: ProductType.PHYSICAL_PRODUCT,
    recommended: true,
    segmentCodes: [],
    store: {id: `store-${id}`, name: `Store ${id}`},
    supplierId: `sup-${id}`,
    priority: 1,
    searchEngine: {id: "", name: "", structure: {}} as unknown as SearchEngine,
})

const mockSuggestions: ProductSuggestion[] = [
    { query: "Suggestion 1", popularity: 1, objectID: "1" }
]

const mockProducts: Product[] = [
    createMockProduct("1", "Product 1"),
    createMockProduct("2", "Product 2")
]

const defaultProps = {
    suggestions: mockSuggestions,
    products: mockProducts,
    isOpen: true,
    isLoading: false,
    searchQuery: "test",
    onClearSuggestions: vi.fn(),
    onSubmit: vi.fn(),
}

describe("ProductSearchSuggestionsContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render suggestions when isOpen is true and suggestions exist", () => {
        render(<ProductSearchSuggestionsContainer {...defaultProps} />)

        expect(screen.getByText("Sugerencias")).toBeInTheDocument()
        expect(screen.getByText("Productos")).toBeInTheDocument()
    })

    it("should render loader when isLoading is true", () => {
        render(<ProductSearchSuggestionsContainer {...defaultProps} isLoading={true} />)

        expect(screen.getByText("Productos para test")).toBeInTheDocument()
    })

    it("should render loader when isLoading is true and searchQuery is empty", () => {
        render(
            <ProductSearchSuggestionsContainer
                {...defaultProps}
                isLoading={true}
                searchQuery=""
                suggestions={[]}
                products={[]}
                isOpen={true}
            />
        )

        expect(screen.getByText("Buscando productos...")).toBeInTheDocument()
    })

    it("should return null when isOpen is false", () => {
        const {container} = render(<ProductSearchSuggestionsContainer {...defaultProps} isOpen={false} />)

        expect(container.firstChild).toBeNull()
    })

    it("should return null when suggestions are empty and search query is empty", () => {
        const {container} = render(<ProductSearchSuggestionsContainer {...defaultProps} suggestions={[]} products={[]} searchQuery="" />)

        expect(container.firstChild).toBeNull()
    })

    it("should render no results when suggestions and products are empty but search query exists", () => {
        render(<ProductSearchSuggestionsContainer {...defaultProps} suggestions={[]} products={[]} searchQuery="xyz" />)

        expect(screen.getByText("Sugerencias")).toBeInTheDocument()
        expect(screen.getByText("xyz")).toBeInTheDocument()
        expect(screen.queryByRole("button", { name: "xyz" })).not.toBeInTheDocument()
        expect(screen.getByTestId("product-search-no-results")).toBeInTheDocument()
        expect(screen.getByText("Intenta con otro término de búsqueda")).toBeInTheDocument()
    })

    it("should render suggestions and no results when products are empty but suggestions exist", () => {
        render(
            <ProductSearchSuggestionsContainer
                {...defaultProps}
                products={[]}
                searchQuery="cafetera"
            />
        )

        expect(screen.getByText("Sugerencias")).toBeInTheDocument()
        expect(screen.getByText("Suggestion 1")).toBeInTheDocument()
        expect(screen.queryByText("Productos")).not.toBeInTheDocument()
        expect(screen.getByTestId("product-search-no-results")).toBeInTheDocument()
    })

    it("should render products when suggestions are empty but products exist", () => {
        render(<ProductSearchSuggestionsContainer {...defaultProps} suggestions={[]} searchQuery="test" />)

        expect(screen.getByText("Productos")).toBeInTheDocument()
        expect(screen.queryByText("Sugerencias")).not.toBeInTheDocument()
    })

    it("should handle product click", () => {
        const onSelectProduct = vi.fn()
        render(<ProductSearchSuggestionsContainer {...defaultProps} onSelectProduct={onSelectProduct} />)

        const productButtons = screen.getAllByText(/Product \d+/).filter(btn => 
            btn.closest('.space-y-2') // Product section
        )
        productButtons[0].click()

        expect(onSelectProduct).toHaveBeenCalledWith(mockProducts[0])
        expect(defaultProps.onClearSuggestions).not.toHaveBeenCalled()
    })

    it("should close modal when product is clicked without onSelectProduct", () => {
        const onCloseModal = vi.fn()
        const onClearSuggestions = vi.fn()
        render(
            <ProductSearchSuggestionsContainer
                {...defaultProps}
                onSelectProduct={undefined}
                onCloseModal={onCloseModal}
                onClearSuggestions={onClearSuggestions}
            />
        )

        const productButtons = screen.getAllByText(/Product \d+/).filter(btn =>
            btn.closest('.space-y-2')
        )
        productButtons[0].click()

        expect(onClearSuggestions).toHaveBeenCalled()
        expect(onCloseModal).toHaveBeenCalled()
    })

    it("should handle suggestion click", () => {
        const onSelectSuggestion = vi.fn()
        const onSubmit = vi.fn()
        render(<ProductSearchSuggestionsContainer {...defaultProps} onSelectSuggestion={onSelectSuggestion} onSubmit={onSubmit} />)

        const suggestionButton = screen.getByText("Suggestion 1")
        suggestionButton.click()

        expect(onSelectSuggestion).toHaveBeenCalledWith("Suggestion 1")
        expect(onSubmit).toHaveBeenCalledWith({ search: "Suggestion 1", page: 1 })
    })

    it("should handle suggestion click with onCloseModal", () => {
        const onCloseModal = vi.fn()
        render(<ProductSearchSuggestionsContainer {...defaultProps} onCloseModal={onCloseModal} />)

        const suggestionButton = screen.getByText("Suggestion 1")
        suggestionButton.click()

        expect(onCloseModal).toHaveBeenCalled()
    })

    it("should still call onClearSuggestions when onSelectProduct is not provided", () => {
        const onClearSuggestions = vi.fn()
        render(<ProductSearchSuggestionsContainer {...defaultProps} onSelectProduct={undefined} onClearSuggestions={onClearSuggestions} />)

        const productButtons = screen.getAllByText(/Product \d+/).filter(btn => 
            btn.closest('.space-y-2') // Product section
        )
        productButtons[0].click()

        expect(onClearSuggestions).toHaveBeenCalled()
    })

    it("should not call onSelectSuggestion when it is not provided", () => {
        render(<ProductSearchSuggestionsContainer {...defaultProps} onSelectSuggestion={undefined} />)

        const suggestionButton = screen.getByText("Suggestion 1")
        suggestionButton.click()

        expect(defaultProps.onSubmit).toHaveBeenCalledWith({ search: "Suggestion 1", page: 1 })
    })

    it("should not call onSubmit when suggestion click and onSubmit is not provided", () => {
        render(<ProductSearchSuggestionsContainer {...defaultProps} onSubmit={undefined} />)

        const suggestionButton = screen.getByText("Suggestion 1")
        suggestionButton.click()

        // Should not throw error
    })
})
