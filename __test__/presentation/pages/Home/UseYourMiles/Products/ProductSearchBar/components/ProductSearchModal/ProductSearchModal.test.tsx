import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest"
import ProductSearchModal from "@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar/components/ProductSearchModal/ProductSearchModal"
import type { ProductSuggestion, Product } from "@/domain/entity/Product/product"
import type SearchEngine from "@/domain/entity/SearchEngine/structure/SearchEngine"
import useIsDesktop from "@/presentation/hooks/useIsDesktop"

// Mock child components
vi.mock("@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar/ProductSearchBar", () => ({
    default: ({ value, onChange, onSubmit, onKeyDown, placeholder, inputRef, children }: {
        value: string
        onChange: (value: string) => void
        onSubmit: (e: React.FormEvent) => void
        onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
        placeholder?: string
        inputRef?: React.RefObject<HTMLInputElement | null>
        children?: React.ReactNode
    }) => (
        <div data-testid="product-search-bar">
            <input
                data-testid="search-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onSubmit={onSubmit}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                ref={inputRef}
            />
            {children}
        </div>
    )
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar/components/ProductSearchSuggestions/ProductSearchSuggestionsContainer", () => ({
    default: ({ suggestions, products, isLoading, searchQuery, isOpen, onClearSuggestions, onSubmit, onCloseModal }: {
        suggestions: ProductSuggestion[]
        products: Product[]
        isLoading: boolean
        searchQuery: string
        isOpen: boolean
        onClearSuggestions: () => void
        onSubmit: (values: { search: string }) => void
        onCloseModal: () => void
    }) => (
        <div data-testid="product-search-suggestions-container" data-is-open={isOpen}>
            <div data-testid="suggestions-count">{suggestions.length}</div>
            <div data-testid="products-count">{products.length}</div>
            <div data-testid="is-loading">{isLoading.toString()}</div>
            <div data-testid="search-query">{searchQuery}</div>
            <button data-testid="clear-suggestions" onClick={onClearSuggestions} />
            <button data-testid="submit-suggestions" onClick={() => onSubmit({ search: searchQuery })} />
            <button data-testid="close-modal" onClick={onCloseModal} />
        </div>
    )
}))

vi.mock("@/presentation/components/Modal/Modal", () => ({
    default: ({ isOpen, onClose, placement, closeButtonAriaLabel, headerButton, classNames, children }: {
        isOpen: boolean
        onClose: () => void
        placement?: string
        closeButtonAriaLabel?: string
        headerButton?: React.ReactNode
        classNames?: Record<string, string>
        children?: React.ReactNode
    }) => {
        if (!isOpen) return null
        return (
            <div data-testid="modal" data-placement={placement}>
                <div data-testid="close-button-aria-label">{closeButtonAriaLabel}</div>
                <div data-testid="header-button">{headerButton}</div>
                <div data-testid="class-names">{JSON.stringify(classNames)}</div>
                <button data-testid="modal-close" onClick={onClose} />
                {children}
            </div>
        )
    }
}))

vi.mock("@/presentation/hooks/useIsDesktop", () => ({
    default: vi.fn(() => ({ isDesktop: true }))
}))

const mockUseIsDesktop = vi.mocked(useIsDesktop)

vi.mock("@/presentation/components/icons/IconLargeArrow", () => ({
    default: ({ className }: { className?: string }) => <div data-testid="icon-large-arrow" className={className} />
}))

// Mock window.matchMedia
Object.defineProperty(globalThis, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})

describe("ProductSearchModal", () => {
    const mockProps = {
        isOpen: false,
        onClose: vi.fn(),
        searchValue: "",
        onSearchChange: vi.fn(),
        onSearchSubmit: vi.fn(),
        onKeyDown: vi.fn(),
        placeholder: "Busca tu producto",
        inputRef: { current: null } as React.RefObject<HTMLInputElement | null>,
        suggestions: [] as ProductSuggestion[],
        products: [] as Product[],
        isLoading: false,
        searchQuery: "",
        onClearSuggestions: vi.fn(),
        onSubmit: vi.fn(),
    }

    beforeEach(() => {
        vi.clearAllMocks()
        // Reset document.body.style
        document.body.style.overflow = ''
        mockUseIsDesktop.mockReturnValue({ isDesktop: true })
    })

    afterEach(() => {
        vi.clearAllMocks()
        document.body.style.overflow = ''
    })

    describe("when isOpen is false", () => {
        it("should not render anything", () => {
            const { container } = render(<ProductSearchModal {...mockProps} />)
            expect(container.firstChild).toBeNull()
        })
    })

    describe("when isOpen is true and isDesktop is true", () => {
        beforeEach(() => {
            mockUseIsDesktop.mockReturnValue({ isDesktop: true })
        })

        it("should render desktop layout", () => {
            render(<ProductSearchModal {...mockProps} isOpen={true} />)

            expect(screen.getByTestId("product-search-bar")).toBeInTheDocument()
            expect(screen.getByTestId("product-search-suggestions-container")).toBeInTheDocument()
        })

        it("should render desktop layout inside a Modal", () => {
            render(<ProductSearchModal {...mockProps} isOpen={true} />)

            expect(screen.getByTestId("modal")).toBeInTheDocument()
        })

        it("should call onClose when modal close button is clicked in desktop", () => {
            render(<ProductSearchModal {...mockProps} isOpen={true} />)

            fireEvent.click(screen.getByTestId("modal-close"))

            expect(mockProps.onClose).toHaveBeenCalledTimes(1)
        })

        it("should set document.body.style.overflow to hidden when modal opens", () => {
            render(<ProductSearchModal {...mockProps} isOpen={true} />)

            expect(document.body.style.overflow).toBe('hidden')
        })

        it("should reset document.body.style.overflow when modal unmounts", () => {
            const { unmount } = render(<ProductSearchModal {...mockProps} isOpen={true} />)

            expect(document.body.style.overflow).toBe('hidden')

            unmount()

            expect(document.body.style.overflow).toBe('')
        })

        it("should pass correct props to ProductSearchBar", () => {
            const customProps = {
                ...mockProps,
                isOpen: true,
                searchValue: "test search",
                placeholder: "Custom placeholder",
            }

            render(<ProductSearchModal {...customProps} />)

            const searchInput = screen.getByTestId("search-input")
            expect(searchInput).toHaveValue("test search")
            expect(searchInput).toHaveAttribute("placeholder", "Custom placeholder")
        })

        it("should pass correct props to ProductSearchSuggestionsContainer", () => {
            const customProps = {
                ...mockProps,
                isOpen: true,
                suggestions: [{ query: "test", popularity: 1, objectID: "1" }] as ProductSuggestion[],
                products: [{ 
                    id: "1", 
                    name: "Product 1", 
                    slug: "product-1", 
                    description: "test", 
                    brand: { id: "1", name: "Brand" }, 
                    categories: [], 
                    minPrice: 0, 
                    recommended: false, 
                    segmentCodes: [], 
                    store: { id: "1", name: "Store" }, 
                    supplierId: "1", 
                    priority: 0, 
                    maxPrice: 0, 
                    minPointsPrice: 0, 
                    maxPointsPrice: 0, 
                    assets: [], 
                    features: [], 
                    mostWanted: false, 
                    productType: "physicalproduct" as const, 
                    searchEngine: {} as SearchEngine, 
                    unitPointsPriceWithoutDiscount: 0
                }] as Product[],
                isLoading: true,
                searchQuery: "test query",
            }

            render(<ProductSearchModal {...customProps} />)

            const suggestionsContainer = screen.getByTestId("product-search-suggestions-container")
            expect(suggestionsContainer).toHaveAttribute("data-is-open", "true")

            expect(screen.getByTestId("suggestions-count")).toHaveTextContent("1")
            expect(screen.getByTestId("products-count")).toHaveTextContent("1")
            expect(screen.getByTestId("is-loading")).toHaveTextContent("true")
            expect(screen.getByTestId("search-query")).toHaveTextContent("test query")
        })

        it("should open suggestions when suggestions exist and searchQuery has length", () => {
            const props = {
                ...mockProps,
                isOpen: true,
                suggestions: [{ query: "test", popularity: 1, objectID: "1" }] as ProductSuggestion[],
                searchQuery: "test",
            }

            render(<ProductSearchModal {...props} />)

            const suggestionsContainer = screen.getByTestId("product-search-suggestions-container")
            expect(suggestionsContainer).toHaveAttribute("data-is-open", "true")
        })

        it("should open suggestions when products exist and searchQuery is empty", () => {
            const props = {
                ...mockProps,
                isOpen: true,
                products: [{ 
                    id: "1", 
                    name: "Product 1", 
                    slug: "product-1", 
                    description: "test", 
                    brand: { id: "1", name: "Brand" }, 
                    categories: [], 
                    minPrice: 0, 
                    recommended: false, 
                    segmentCodes: [], 
                    store: { id: "1", name: "Store" }, 
                    supplierId: "1", 
                    priority: 0, 
                    maxPrice: 0, 
                    minPointsPrice: 0, 
                    maxPointsPrice: 0, 
                    assets: [], 
                    features: [], 
                    mostWanted: false, 
                    productType: "physicalproduct" as const, 
                    searchEngine: {} as SearchEngine, 
                    unitPointsPriceWithoutDiscount: 0
                }] as Product[],
                searchQuery: "",
            }

            render(<ProductSearchModal {...props} />)

            const suggestionsContainer = screen.getByTestId("product-search-suggestions-container")
            expect(suggestionsContainer).toHaveAttribute("data-is-open", "true")
        })

        it("should open suggestions panel when search query has length even without results", () => {
            const props = {
                ...mockProps,
                isOpen: true,
                suggestions: [],
                products: [],
                searchQuery: "test",
            }

            render(<ProductSearchModal {...props} />)

            const suggestionsContainer = screen.getByTestId("product-search-suggestions-container")
            expect(suggestionsContainer).toHaveAttribute("data-is-open", "true")
        })

        it("should not open suggestions panel when no search query and no products", () => {
            const props = {
                ...mockProps,
                isOpen: true,
                suggestions: [],
                products: [],
                searchQuery: "",
            }

            render(<ProductSearchModal {...props} />)

            const suggestionsContainer = screen.getByTestId("product-search-suggestions-container")
            expect(suggestionsContainer).toHaveAttribute("data-is-open", "false")
        })
    })

    describe("when isOpen is true and isDesktop is false", () => {
        beforeEach(() => {
            mockUseIsDesktop.mockReturnValue({ isDesktop: false })
        })

        it("should render mobile layout with Modal", () => {
            render(<ProductSearchModal {...mockProps} isOpen={true} />)

            expect(screen.getByTestId("modal")).toBeInTheDocument()
            expect(screen.getByTestId("modal")).toHaveAttribute("data-placement", "bottom")
        })

        it("should render correct modal properties", () => {
            render(<ProductSearchModal {...mockProps} isOpen={true} />)

            expect(screen.getByTestId("close-button-aria-label")).toHaveTextContent("Cerrar búsqueda")
            
            const classNames = JSON.parse(screen.getByTestId("class-names").textContent || "{}")
            expect(classNames.base).toContain("!m-0 w-full h-full max-h-full !rounded-none overflow-hidden")
            expect(classNames.backdrop).toContain("bg-white")
            expect(classNames.header).toBe("border-none")
            expect(classNames.body).toBe("p-0 overflow-y-auto gap-0")
            expect(classNames.closeButton).toBe("hidden")
        })

        it("should render header button with back arrow and title", () => {
            render(<ProductSearchModal {...mockProps} isOpen={true} />)

            expect(screen.getByTestId("icon-large-arrow")).toBeInTheDocument()
            expect(screen.getByText("¿Qué quieres canjear?")).toBeInTheDocument()
        })

        it("should call onClose when header back button is clicked", () => {
            render(<ProductSearchModal {...mockProps} isOpen={true} />)

            const backButton = screen.getByTestId("icon-large-arrow").closest("button")
            if (backButton) {
                fireEvent.click(backButton)
                expect(mockProps.onClose).toHaveBeenCalledTimes(1)
            }
        })

        it("should render ProductSearchBar in mobile layout", () => {
            render(<ProductSearchModal {...mockProps} isOpen={true} />)

            expect(screen.getByTestId("product-search-bar")).toBeInTheDocument()
            expect(screen.getByTestId("search-input")).toBeInTheDocument()
        })

        it("should render ProductSearchSuggestionsContainer in mobile layout", () => {
            render(<ProductSearchModal {...mockProps} isOpen={true} />)

            expect(screen.getByTestId("product-search-suggestions-container")).toBeInTheDocument()
        })

        it("should use hasSuggestionsOrProducts for mobile suggestions isOpen", () => {
            const props = {
                ...mockProps,
                isOpen: true,
                suggestions: [{ query: "test", popularity: 1, objectID: "1" }] as ProductSuggestion[],
                searchQuery: "test",
            }

            render(<ProductSearchModal {...props} />)

            const suggestionsContainer = screen.getByTestId("product-search-suggestions-container")
            expect(suggestionsContainer).toHaveAttribute("data-is-open", "true")
        })

        it("should not set document.body.style.overflow when modal opens on mobile", () => {
            render(<ProductSearchModal {...mockProps} isOpen={true} />)

            expect(document.body.style.overflow).toBe('')
        })
    })

    describe("event handlers", () => {
        beforeEach(() => {
            mockUseIsDesktop.mockReturnValue({ isDesktop: true })
        })

        it("should handle onSearchChange", () => {
            render(<ProductSearchModal {...mockProps} isOpen={true} />)

            const searchInput = screen.getByTestId("search-input")
            fireEvent.change(searchInput, { target: { value: "new value" } })

            expect(mockProps.onSearchChange).toHaveBeenCalledWith("new value")
        })

        it("should handle onSearchSubmit", () => {
            render(<ProductSearchModal {...mockProps} isOpen={true} />)

            const searchInput = screen.getByTestId("search-input")
            fireEvent.submit(searchInput)

            expect(mockProps.onSearchSubmit).toHaveBeenCalledTimes(1)
            expect(mockProps.onSearchSubmit).toHaveBeenCalledWith(expect.any(Object))
        })

        it("should handle onKeyDown", () => {
            render(<ProductSearchModal {...mockProps} isOpen={true} />)

            const searchInput = screen.getByTestId("search-input")
            fireEvent.keyDown(searchInput, { key: "ArrowDown" })

            expect(mockProps.onKeyDown).toHaveBeenCalledTimes(1)
            expect(mockProps.onKeyDown).toHaveBeenCalledWith(expect.any(Object))
        })

        it("should handle suggestions container events", () => {
            render(<ProductSearchModal {...mockProps} isOpen={true} />)

            fireEvent.click(screen.getByTestId("clear-suggestions"))
            expect(mockProps.onClearSuggestions).toHaveBeenCalledTimes(1)

            fireEvent.click(screen.getByTestId("submit-suggestions"))
            expect(mockProps.onSubmit).toHaveBeenCalledWith({ search: "" })

            fireEvent.click(screen.getByTestId("close-modal"))
            expect(mockProps.onClose).toHaveBeenCalledTimes(1)
        })
    })

    describe("default props", () => {
        it("should use default placeholder when not provided", () => {
            const propsWithoutPlaceholder = { ...mockProps, isOpen: true, placeholder: undefined }
            
            render(<ProductSearchModal {...propsWithoutPlaceholder} />)

            const searchInput = screen.getByTestId("search-input")
            expect(searchInput).toHaveAttribute("placeholder", "Busca tu producto")
        })
    })
})
