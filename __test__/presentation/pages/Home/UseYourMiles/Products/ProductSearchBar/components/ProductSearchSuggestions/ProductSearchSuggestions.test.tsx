import React from "react"
import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import type {Product, ProductSuggestion} from "@/domain/entity/Product/product"
import {ProductType} from "@/domain/entity/Product/product"
import type SearchEngine from "@/domain/entity/SearchEngine/structure/SearchEngine"
import ProductSearchSuggestions from "@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar/components/ProductSearchSuggestions/ProductSearchSuggestions"

vi.mock("../SuggestionItem/SuggestionItem", () => ({
    default: ({suggestion, onClick, disabled}: {suggestion: string; onClick?: (s: string) => void; disabled?: boolean}) => (
        disabled ? (
            <li>
                <span data-testid="disabled-suggestion">{suggestion}</span>
            </li>
        ) : (
            <li>
                <button
                    type="button"
                    onClick={() => onClick?.(suggestion)}
                    className="w-full text-left text-wrap px-3 py-2.5 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                    <span className="text-sm text-gray-800">{suggestion}</span>
                </button>
            </li>
        )
    ),
}))

vi.mock("../ProductItem/ProductItem", () => ({
    default: ({product, onClick}: {product: Product; onClick: (p: Product) => void}) => (
        <li>
            <button
                type="button"
                onClick={() => onClick(product)}
                className="lg:max-w-79.5 w-full flex flex-row border border-gray-100 rounded-lg text-left px-4 py-2 cursor-pointer"
            >
                <div className="flex items-center gap-3 w-full">
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-blue-500 leading-5 text-wrap">
                            {product.name}
                        </span>
                        <div>
                            <p className="text-blue-500 text-lg font-semibold leading-5">
                                <span className="font-medium text-xs text-grayscale-500">Desde: </span>
                                1.000 millas
                            </p>
                        </div>
                    </div>
                </div>
            </button>
        </li>
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

describe("ProductSearchSuggestions", () => {
    const mockSuggestions: ProductSuggestion[] = [
        { query: "Product 1", popularity: 1, objectID: "1" },
        { query: "Product 2", popularity: 2, objectID: "2" },
        { query: "Product 3", popularity: 3, objectID: "3" },
        { query: "Product 4", popularity: 4, objectID: "4" },
        { query: "Product 5", popularity: 5, objectID: "5" },
        { query: "Product 6", popularity: 6, objectID: "6" },
    ]

    const mockProducts: Product[] = [
        createMockProduct("1", "Product 1"),
        createMockProduct("2", "Product 2"),
        createMockProduct("3", "Product 3"),
        createMockProduct("4", "Product 4"),
        createMockProduct("5", "Product 5"),
    ]

    const defaultProps = {
        suggestions: mockSuggestions,
        products: mockProducts,
        onProductClick: vi.fn(),
        onSuggestionClick: vi.fn(),
    }

    it("should render Sugerencias heading", () => {
        render(<ProductSearchSuggestions {...defaultProps} />)

        expect(screen.getByText("Sugerencias")).toBeInTheDocument()
    })

    it("should render Productos heading", () => {
        render(<ProductSearchSuggestions {...defaultProps} />)

        expect(screen.getByText("Productos")).toBeInTheDocument()
    })

    it("should render limited suggestions (MAX_SUGGESTIONS = 7)", () => {
        render(<ProductSearchSuggestions {...defaultProps} />)

        const suggestionButtons = screen.getAllByText(/Product \d+/).filter(btn => 
            btn.closest('.space-y-1') // Suggestion section
        )
        expect(suggestionButtons).toHaveLength(6)
    })

    it("should render limited products (MAX_PRODUCTS = 3)", () => {
        render(<ProductSearchSuggestions {...defaultProps} />)

        const productButtons = screen.getAllByText(/Product \d+/).filter(btn => 
            btn.closest('.space-y-2') // Product section
        )
        expect(productButtons).toHaveLength(3)
    })

    it("should handle suggestion click", () => {
        const onSuggestionClick = vi.fn()
        render(<ProductSearchSuggestions {...defaultProps} onSuggestionClick={onSuggestionClick} />)

        const suggestionButtons = screen.getAllByText(/Product \d+/).filter(btn => 
            btn.closest('.space-y-1') // Suggestion section
        )
        suggestionButtons[0].click()

        expect(onSuggestionClick).toHaveBeenCalledWith("Product 1")
    })

    it("should handle product click", () => {
        const onProductClick = vi.fn()
        render(<ProductSearchSuggestions {...defaultProps} onProductClick={onProductClick} />)

        const productButtons = screen.getAllByText(/Product \d+/).filter(btn => 
            btn.closest('.space-y-2') // Product section
        )
        productButtons[0].click()

        expect(onProductClick).toHaveBeenCalledWith(mockProducts[0])
    })

    it("should render with empty suggestions and products when showNoProducts is false", () => {
        render(<ProductSearchSuggestions {...defaultProps} suggestions={[]} products={[]} />)

        expect(screen.queryByText("Sugerencias")).not.toBeInTheDocument()
        expect(screen.queryByText("Productos")).not.toBeInTheDocument()
    })

    it("should render Sugerencias title and no results when showNoProducts is true", () => {
        render(
            <ProductSearchSuggestions
                {...defaultProps}
                suggestions={[]}
                products={[]}
                showNoProducts
                searchQuery="Nombre sin respuesta"
            />
        )

        expect(screen.getByText("Sugerencias")).toBeInTheDocument()
        expect(screen.getByText("Nombre sin respuesta")).toBeInTheDocument()
        expect(screen.queryByRole("button", { name: "Nombre sin respuesta" })).not.toBeInTheDocument()
        expect(screen.queryByText("Productos")).not.toBeInTheDocument()
        expect(screen.getByTestId("product-search-no-results")).toBeInTheDocument()
        expect(screen.getByText("Intenta con otro término de búsqueda")).toBeInTheDocument()
    })

    it("should render clickable suggestions and not the query when showNoProducts has api suggestions", () => {
        const suggestions = mockSuggestions.slice(0, 1)
        render(
            <ProductSearchSuggestions
                {...defaultProps}
                suggestions={suggestions}
                products={[]}
                showNoProducts
                searchQuery="Nombre de producto no disponible"
            />
        )

        expect(screen.getByText("Sugerencias")).toBeInTheDocument()
        expect(screen.getByText("Product 1")).toBeInTheDocument()
        expect(screen.queryByText("Nombre de producto no disponible")).not.toBeInTheDocument()
        expect(screen.queryByText("Productos")).not.toBeInTheDocument()
        expect(screen.getByTestId("product-search-no-results")).toBeInTheDocument()
    })

    it("should render only products section when suggestions are empty", () => {
        render(<ProductSearchSuggestions {...defaultProps} suggestions={[]} />)

        expect(screen.queryByText("Sugerencias")).not.toBeInTheDocument()
        expect(screen.getByText("Productos")).toBeInTheDocument()
    })

    it("should render with less than max suggestions", () => {
        const lessSuggestions = mockSuggestions.slice(0, 2)
        render(<ProductSearchSuggestions {...defaultProps} suggestions={lessSuggestions} />)

        const suggestionButtons = screen.getAllByText(/Product \d+/).filter(btn => 
            btn.closest('.space-y-1') // Suggestion section
        )
        expect(suggestionButtons).toHaveLength(2)
    })

    it("should render with less than max products", () => {
        const lessProducts = mockProducts.slice(0, 2)
        render(<ProductSearchSuggestions {...defaultProps} products={lessProducts} />)

        const productButtons = screen.getAllByText(/Product \d+/).filter(btn => 
            btn.closest('.space-y-2') // Product section
        )
        expect(productButtons).toHaveLength(2)
    })

    it("should apply correct grid layout classes when both sections are visible", () => {
        const {container} = render(<ProductSearchSuggestions {...defaultProps} />)

        const grid = container.querySelector(".grid")
        expect(grid).toHaveClass("grid-cols-1")
        expect(grid).toHaveClass("lg:grid-cols-2")
    })

    it("should apply two column layout when showNoProducts is true", () => {
        const {container} = render(
            <ProductSearchSuggestions
                {...defaultProps}
                suggestions={[]}
                products={[]}
                showNoProducts
            />
        )

        const grid = container.querySelector(".grid")
        expect(grid).toHaveClass("lg:grid-cols-2")
    })

    it("should render with search query display", () => {
        render(<ProductSearchSuggestions {...defaultProps} />)

        // Component should render with the search query context
        expect(screen.getByText("Sugerencias")).toBeInTheDocument()
        expect(screen.getByText("Productos")).toBeInTheDocument()
    })
})
