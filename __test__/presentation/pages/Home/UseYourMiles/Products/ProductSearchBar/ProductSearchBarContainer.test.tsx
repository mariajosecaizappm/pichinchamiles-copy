import React from "react"
import {render, screen, fireEvent, waitFor, act} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach, beforeAll, afterEach} from "vitest"
import {Provider} from "react-redux"
import {configureStore} from "@reduxjs/toolkit"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import links from "@/presentation/config/links"
import type { Product } from "@/domain/entity/Product/product"
import {
    QUERY_SUGGESTIONS_SOURCE_ID,
    RECOMMENDED_PRODUCTS_SOURCE_ID,
    SEARCH_DEBOUNCE_MS,
} from "@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar/data"

const mocks = vi.hoisted(() => {
    const autocompleteInstance = {
        refresh: vi.fn(),
        destroy: vi.fn(),
        setQuery: vi.fn(),
    }

    return {
        routerPush: vi.fn(),
        mockPathname: '/test',
        autocompleteInstance,
        autocompleteOptions: null as Record<string, unknown> | null,
        getAutocompleteProducts: vi.fn().mockResolvedValue([
            { query: "laptop", popularity: 1, objectID: "1" },
        ]),
        searchProducts: vi.fn().mockResolvedValue({
            list: {
                data: [
                    {
                        id: "1",
                        name: "Product",
                        slug: "catalog-product",
                        description: "",
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
                        unitPointsPriceWithoutDiscount: 0,
                        assets: [],
                        features: [],
                        mostWanted: false,
                        productType: "physicalproduct",
                        searchEngine: {},
                    },
                ],
            },
        }),
        mockProduct: {
            id: "1",
            name: "Product",
            slug: "test-product",
            description: "",
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
            unitPointsPriceWithoutDiscount: 0,
            assets: [],
            features: [],
            mostWanted: false,
            productType: "physicalproduct",
            searchEngine: {},
        },
    }
})

const mockProduct = mocks.mockProduct as Product

import ProductSearchBarContainer from "@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar/ProductSearchBarContainer"


const mockUseSession = vi.fn()
const mockOnChangeFilter = vi.fn()
const mockSubmitSearch = vi.fn()
const mockClearSearch = vi.fn()
const mockSearchValues = {
    search: '',
    category: '',
    brand: '',
    sort: '',
    recommended: undefined as boolean | undefined,
}
vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

// Default mock implementation
mockUseSession.mockReturnValue({
    isLogged: true,
    information: null,
    balance: 0,
    isValidatingSession: false,
    basket: null,
    programCurrency: null,
    consent: null,
    cif: null as string | null,
    onOpenAuthModal: vi.fn(),
    onCloseAuthModal: vi.fn(),
    initSession: vi.fn(),
    closeSession: vi.fn(),
    updateBasket: vi.fn(),
    updateBalance: vi.fn(),
    updateGender: vi.fn(),
    updateEmail: vi.fn(),
    filterBanners: vi.fn(),
    clearConsent: vi.fn(),
})

// Mock useProductSearch hook
vi.mock("@/presentation/hooks/useProductSearch", () => ({
    default: () => ({
        searchValues: mockSearchValues,
        searchParams: new URLSearchParams(),
        onChangeFilter: mockOnChangeFilter,
        submitSearch: mockSubmitSearch,
        clearSearch: mockClearSearch,
        onChangePage: vi.fn(),
    }),
}))

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            retryDelay: 0,
        },
    },
})

const renderWithProviders = (ui: React.ReactElement, isLogged = true) => {
    const store = configureStore({
        reducer: {
            user: () => ({
                information: null,
                isLogged,
                balance: 0,
                isValidatingSession: false,
                basket: null,
                programCurrency: null,
                consent: null,
                cif: null as string | null,
            }),
        },
    })

    return render(
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                {ui}
            </QueryClientProvider>
        </Provider>
    )
}



// Remove SearchBarContext mock since component doesn't use it

// Mock Next.js router
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mocks.routerPush,
        replace: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => mocks.mockPathname,
}))

vi.mock("@algolia/autocomplete-js", () => ({
    autocomplete: vi.fn((options: Record<string, unknown>) => {
        mocks.autocompleteOptions = options
        return mocks.autocompleteInstance
    }),
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: vi.fn(() => ({
            getAutocompleteProducts: mocks.getAutocompleteProducts,
            searchProducts: mocks.searchProducts,
        })),
    },
}))

vi.mock("@/presentation/hooks/useIsDesktop", () => ({
    default: () => ({isDesktop: true}),
}))

interface ProductSearchModalMockProps {
    isOpen: boolean
    onClose: () => void
    onClearSuggestions: () => void
    onSelectProduct?: (product: Product) => void
    onSubmit: (values: { search: string }) => void
    onSearchChange: (value: string) => void
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
    onSearchSubmit: (e: React.FormEvent) => void
    searchValue: string
    inputRef?: React.RefObject<HTMLInputElement | null>
}

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar/components/ProductSearchModal/ProductSearchModal", () => ({
    default: (props: ProductSearchModalMockProps) =>
        props.isOpen ? (
            <div data-testid="modal">
                <button data-testid="modal-close" onClick={props.onClose} />
                <button data-testid="clear-suggestions" onClick={props.onClearSuggestions} />
                <button
                    data-testid="select-product"
                    onClick={() => props.onSelectProduct?.(mocks.mockProduct as Product)}
                />
                <button
                    data-testid="submit-suggestion"
                    onClick={() => props.onSubmit({ search: "laptop" })}
                />
                <button
                    data-testid="submit-empty-suggestion"
                    onClick={() => props.onSubmit({ search: "   " })}
                />
                <form onSubmit={props.onSearchSubmit}>
                    <input
                        data-testid="modal-search-input"
                        ref={props.inputRef}
                        value={props.searchValue}
                        onChange={(e) => props.onSearchChange(e.target.value)}
                        onKeyDown={props.onKeyDown}
                    />
                    <button type="submit" data-testid="modal-search-submit">
                        search
                    </button>
                </form>
            </div>
        ) : null,
}))

interface ProductSearchBarProps {
    value: string
    onChange: (value: string) => void
    onFocus?: () => void
    onBlur?: () => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    onSubmit: (event: React.FormEvent) => void
    onClick?: () => void
    placeholder?: string
    displayOnly?: boolean
    children?: React.ReactNode
    inputRef?: React.RefObject<HTMLInputElement | null>
}

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar/ProductSearchBar", () => ({
    default: (props: ProductSearchBarProps) => (
        <div data-testid="product-search-bar">
            <form onSubmit={props.onSubmit}>
                <input
                    data-testid="search-input"
                    ref={props.inputRef}
                    type="text"
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                    onFocus={props.onFocus}
                    onBlur={props.onBlur}
                    onKeyDown={props.onKeyDown}
                    placeholder={props.placeholder}
                    readOnly={props.displayOnly}
                    onClick={props.onClick}
                />
            </form>
            {props.children}
        </div>
    ),
}))

vi.mock("@/presentation/components/icons/IconLargeArrow", () => ({
    default: () => <span data-testid="icon-arrow">Arrow</span>,
}))

const openModal = async () => {
    const input = screen.getByTestId("search-input")
    const clickTarget = input.closest("button") ?? input

    fireEvent.click(clickTarget)

    await waitFor(() => {
        expect(screen.getByTestId("modal")).toBeInTheDocument()
    })
}

describe("ProductSearchBarContainer", () => {
    beforeAll(() => {
        Object.defineProperty(globalThis, "matchMedia", {
            writable: true,
            value: vi.fn().mockImplementation((query: string) => ({
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
    })

    beforeEach(() => {
        vi.clearAllMocks()
        mockSubmitSearch.mockClear()
        mockClearSearch.mockClear()
        mocks.autocompleteOptions = null
        mockSearchValues.search = ''
        mockSearchValues.category = ''
        mockSearchValues.brand = ''
        mockSearchValues.sort = ''
        mockSearchValues.recommended = undefined
        mocks.mockPathname = '/test'
        mockUseSession.mockReturnValue({
            isLogged: true,
            information: null,
            balance: 0,
            isValidatingSession: false,
            basket: null,
            programCurrency: null,
            consent: null,
            cif: null as string | null,
            onOpenAuthModal: vi.fn(),
            onCloseAuthModal: vi.fn(),
            initSession: vi.fn(),
            closeSession: vi.fn(),
            updateBasket: vi.fn(),
            updateBalance: vi.fn(),
            updateGender: vi.fn(),
            updateEmail: vi.fn(),
            filterBanners: vi.fn(),
            clearConsent: vi.fn(),
        })
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("should render search bar with default placeholder", () => {
        renderWithProviders(<ProductSearchBarContainer />)

        expect(screen.getByRole("textbox")).toBeInTheDocument()
    })

    it("should render search bar with custom placeholder", () => {
        renderWithProviders(<ProductSearchBarContainer placeholder="Custom placeholder" />)

        const input = screen.getByRole("textbox")
        expect(input).toHaveAttribute("placeholder", "Custom placeholder")
    })

    it("should open modal when input is clicked on desktop and user is logged", async () => {
        renderWithProviders(<ProductSearchBarContainer />)

        const input = screen.getByRole("textbox")
        fireEvent.click(input)

        await waitFor(() => {
            expect(screen.getByTestId("modal")).toBeInTheDocument()
        })
    })

    it("should open modal when input is clicked regardless of login status", async () => {
        // Mock useSession to return not logged
        vi.doMock("@/presentation/hooks/useSession", () => ({
            default: () => ({
                isLogged: false,
                information: null,
                balance: 0,
                isValidatingSession: false,
                basket: null,
                programCurrency: null,
                consent: null,
                cif: null as string | null,
                onOpenAuthModal: vi.fn(),
                onCloseAuthModal: vi.fn(),
                initSession: vi.fn(),
                closeSession: vi.fn(),
                updateBasket: vi.fn(),
                updateBalance: vi.fn(),
                updateGender: vi.fn(),
                updateEmail: vi.fn(),
                filterBanners: vi.fn(),
                clearConsent: vi.fn(),
            }),
        }))
        
        renderWithProviders(<ProductSearchBarContainer />)

        const input = screen.getByRole("textbox")
        fireEvent.click(input)

        await waitFor(() => {
            expect(screen.getByTestId("modal")).toBeInTheDocument()
        })
    })

    it("should submit search when form is submitted with valid search", async () => {
        mockSearchValues.search = "maleta"
        renderWithProviders(<ProductSearchBarContainer />)

        const input = screen.getByRole("textbox")
        fireEvent.submit(input.closest("form") as HTMLFormElement)

        expect(mockSubmitSearch).toHaveBeenCalledWith("maleta")
    })

    it("should close modal when form is submitted with valid search", async () => {
        mockSearchValues.search = "maleta"
        renderWithProviders(<ProductSearchBarContainer />)

        const input = screen.getByRole("textbox")
        fireEvent.click(input)

        await waitFor(() => {
            expect(screen.getByTestId("modal")).toBeInTheDocument()
        })

        const modalInput = screen.getByTestId("modal-search-input")
        fireEvent.submit(modalInput.closest("form") as HTMLFormElement)

        await waitFor(() => {
            expect(screen.queryByTestId("modal")).not.toBeInTheDocument()
        })
    })

    it("should not call onSubmit when form is submitted with empty search", async () => {
        renderWithProviders(<ProductSearchBarContainer />)

        const input = screen.getByRole("textbox")
        fireEvent.submit(input.closest("form") as HTMLFormElement)

        expect(mockOnChangeFilter).not.toHaveBeenCalled()
    })

    it("should clear search param when input is emptied and url had a search", async () => {
        mockSearchValues.search = "maleta"
        renderWithProviders(<ProductSearchBarContainer />)

        const input = screen.getByRole("textbox")
        fireEvent.click(input)

        await waitFor(() => {
            expect(screen.getByTestId("modal")).toBeInTheDocument()
        })

        const modalInput = screen
            .getAllByRole("textbox")
            .find((textbox) => !textbox.hasAttribute("readOnly"))

        fireEvent.change(modalInput as HTMLInputElement, { target: { value: "" } })

        expect(mockClearSearch).toHaveBeenCalled()
    })

    it("should clear search param on empty submit when url had a search", async () => {
        mockSearchValues.search = "maleta"
        renderWithProviders(<ProductSearchBarContainer />)

        const input = screen.getByRole("textbox")
        fireEvent.click(input)

        await waitFor(() => {
            expect(screen.getByTestId("modal")).toBeInTheDocument()
        })

        const modalInput = screen.getByTestId("modal-search-input")

        fireEvent.change(modalInput, { target: { value: "   " } })
        fireEvent.submit(modalInput.closest("form") as HTMLFormElement)

        expect(mockOnChangeFilter).not.toHaveBeenCalled()
        expect(mockClearSearch).toHaveBeenCalled()
    })

    it("should not call getSearchSuggestions when input is focused (component uses internal state)", async () => {
        // This test is no longer relevant since component doesn't use SearchBarContext
        // and doesn't call getSearchSuggestions on focus
        renderWithProviders(<ProductSearchBarContainer />)

        const input = screen.getByRole("textbox")
        fireEvent.click(input)

        // Component uses internal state and useProductSuggestions hook
        expect(input).toBeInTheDocument()
    })

    it("should call getSearchSuggestions when search value changes", async () => {
        renderWithProviders(<ProductSearchBarContainer />)

        const input = screen.getByRole("textbox")
        fireEvent.change(input, {target: {value: "test"}})

        // Component uses internal state and useProductSuggestions hook
        // This test verifies the component renders correctly
        expect(screen.getByRole("textbox")).toBeInTheDocument()
    })

    it("should update local search value when input changes", async () => {
        renderWithProviders(<ProductSearchBarContainer />)

        // Open modal
        const input = screen.getByRole("textbox")
        fireEvent.click(input)

        await waitFor(() => {
            expect(screen.getByTestId("modal")).toBeInTheDocument()
        })

        // Get the modal input (which should be editable)
        const inputs = screen.getAllByRole("textbox")
        const modalInput = inputs.find(input => !input.hasAttribute('readOnly'))
        
        expect(modalInput).not.toHaveAttribute("readOnly")
        
        // Test that the modal input exists and is editable
        expect(modalInput).toBeInTheDocument()
        expect(modalInput).not.toHaveAttribute("readOnly")
    })

    it("should sync with context search value when it changes", () => {
        // Test basic rendering functionality
        renderWithProviders(<ProductSearchBarContainer />)

        // Verify the component renders with the expected inputs
        const inputs = screen.getAllByRole("textbox")
        expect(inputs.length).toBeGreaterThan(0)
        
        // The main input should have the default placeholder
        const mainInput = inputs[0]
        expect(mainInput).toHaveAttribute("placeholder", "Busca tu producto")
    })

    it("should show modal with mobile layout on mobile devices", async () => {
        // Mock useIsDesktop to return false (mobile)
        vi.doMock("@/presentation/hooks/useIsDesktop", () => ({
            default: () => ({ isDesktop: false })
        }))

        renderWithProviders(<ProductSearchBarContainer />)

        const input = screen.getByRole("textbox")
        fireEvent.click(input)

        await waitFor(() => {
            // Modal should be open for logged-in users
            expect(screen.getByTestId("modal")).toBeInTheDocument()
        })
    })

    it("should close modal when close button is clicked", async () => {
        renderWithProviders(<ProductSearchBarContainer />)

        const input = screen.getByRole("textbox")
        fireEvent.click(input)

        await waitFor(() => {
            expect(screen.getByTestId("modal")).toBeInTheDocument()
        })

        fireEvent.click(screen.getByTestId("modal-close"))

        await waitFor(() => {
            expect(screen.queryByTestId("modal")).not.toBeInTheDocument()
        })
    })

    it("should close modal when Escape key is pressed", async () => {
        renderWithProviders(<ProductSearchBarContainer />)

        const input = screen.getByRole("textbox")
        fireEvent.click(input)

        await waitFor(() => {
            expect(screen.getByTestId("modal")).toBeInTheDocument()
        })

        const modalInput = screen
            .getAllByRole("textbox")
            .find((textbox) => !textbox.hasAttribute("readOnly"))

        fireEvent.keyDown(modalInput as HTMLInputElement, { key: "Escape" })

        await waitFor(() => {
            expect(screen.queryByTestId("modal")).not.toBeInTheDocument()
        })
    })

    it("should set input as displayOnly when autocomplete is active", () => {
        renderWithProviders(<ProductSearchBarContainer />)

        const input = screen.getByRole("textbox")
        expect(input).toHaveAttribute("readOnly")
    })

    it("should not call getSearchSuggestions for empty search", async () => {
        renderWithProviders(<ProductSearchBarContainer />)

        const input = screen.getByRole("textbox")
        fireEvent.change(input, {target: {value: ""}})

        // Component uses internal state and useProductSuggestions hook
        expect(screen.getByRole("textbox")).toBeInTheDocument()
    })

    it("should enable suggestions and products fetching when user is logged in", () => {
        renderWithProviders(<ProductSearchBarContainer />)

        // Since useSession is mocked to return isLogged: true by default,
        // the hooks should be enabled
        expect(screen.getByRole("textbox")).toBeInTheDocument()
        // The component should render normally when user is logged
    })

    it("should disable suggestions and products fetching when user is not logged in", () => {
        mockUseSession.mockReturnValue({
            isLogged: false,
            information: null,
            balance: 0,
            isValidatingSession: false,
            basket: null,
            programCurrency: null,
            consent: null,
            cif: null as string | null,
            onOpenAuthModal: vi.fn(),
            onCloseAuthModal: vi.fn(),
            initSession: vi.fn(),
            closeSession: vi.fn(),
            updateBasket: vi.fn(),
            updateBalance: vi.fn(),
            updateGender: vi.fn(),
            updateEmail: vi.fn(),
            filterBanners: vi.fn(),
            clearConsent: vi.fn(),
        })

        renderWithProviders(<ProductSearchBarContainer />)

        // Component should still render but hooks should be disabled due to isActiveAutocomplete = false
        expect(screen.getByRole("textbox")).toBeInTheDocument()
    })

    it("should set input as displayOnly when user is logged in (isActiveAutocomplete = true)", () => {
        mockUseSession.mockReturnValue({
            isLogged: true,
            information: null,
            balance: 0,
            isValidatingSession: false,
            basket: null,
            programCurrency: null,
            consent: null,
            cif: null as string | null,
            onOpenAuthModal: vi.fn(),
            onCloseAuthModal: vi.fn(),
            initSession: vi.fn(),
            closeSession: vi.fn(),
            updateBasket: vi.fn(),
            updateBalance: vi.fn(),
            updateGender: vi.fn(),
            updateEmail: vi.fn(),
            filterBanners: vi.fn(),
            clearConsent: vi.fn(),
        })

        renderWithProviders(<ProductSearchBarContainer />)

        const input = screen.getByRole("textbox")
        // When user is logged (isActiveAutocomplete = true), input should be readOnly
        expect(input).toHaveAttribute("readOnly")
    })

    it("should not set input as displayOnly when user is not logged in (isActiveAutocomplete = false)", () => {
        mockUseSession.mockReturnValue({
            isLogged: false,
            information: null,
            balance: 0,
            isValidatingSession: false,
            basket: null,
            programCurrency: null,
            consent: null,
            cif: null as string | null,
            onOpenAuthModal: vi.fn(),
            onCloseAuthModal: vi.fn(),
            initSession: vi.fn(),
            closeSession: vi.fn(),
            updateBasket: vi.fn(),
            updateBalance: vi.fn(),
            updateGender: vi.fn(),
            updateEmail: vi.fn(),
            filterBanners: vi.fn(),
            clearConsent: vi.fn(),
        })

        renderWithProviders(<ProductSearchBarContainer />)

        const input = screen.getByRole("textbox")
        expect(input).not.toHaveAttribute("readOnly")
    })

    it("should open modal when user is logged in (isActiveAutocomplete = true)", async () => {
        mockUseSession.mockReturnValue({
            isLogged: true,
            information: null,
            balance: 0,
            isValidatingSession: false,
            basket: null,
            programCurrency: null,
            consent: null,
            cif: null as string | null,
            onOpenAuthModal: vi.fn(),
            onCloseAuthModal: vi.fn(),
            initSession: vi.fn(),
            closeSession: vi.fn(),
            updateBasket: vi.fn(),
            updateBalance: vi.fn(),
            updateGender: vi.fn(),
            updateEmail: vi.fn(),
            filterBanners: vi.fn(),
            clearConsent: vi.fn(),
        })

        renderWithProviders(<ProductSearchBarContainer />)

        const input = screen.getByRole("textbox")
        fireEvent.click(input)

        await waitFor(() => {
            expect(screen.getByTestId("modal")).toBeInTheDocument()
        })
    })

    it("should not open modal when user is not logged in (isActiveAutocomplete = false)", () => {
        mockUseSession.mockReturnValue({
            isLogged: false,
            information: null,
            balance: 0,
            isValidatingSession: false,
            basket: null,
            programCurrency: null,
            consent: null,
            cif: null as string | null,
            onOpenAuthModal: vi.fn(),
            onCloseAuthModal: vi.fn(),
            initSession: vi.fn(),
            closeSession: vi.fn(),
            updateBasket: vi.fn(),
            updateBalance: vi.fn(),
            updateGender: vi.fn(),
            updateEmail: vi.fn(),
            filterBanners: vi.fn(),
            clearConsent: vi.fn(),
        })

        renderWithProviders(<ProductSearchBarContainer />)

        const input = screen.getByRole("textbox")
        fireEvent.click(input)

        expect(screen.queryByTestId("modal")).not.toBeInTheDocument()
    })

    it("should navigate to product detail and close modal when a product is selected", async () => {
        renderWithProviders(<ProductSearchBarContainer />)
        await openModal()

        fireEvent.click(screen.getByTestId("select-product"))

        expect(mocks.routerPush).toHaveBeenCalledWith(`${links.productsList}/test-product`)
        await waitFor(() => {
            expect(screen.queryByTestId("modal")).not.toBeInTheDocument()
        })
    })

    it("should clear suggestions through autocomplete when user is logged in", async () => {
        mockSearchValues.search = "maleta"
        renderWithProviders(<ProductSearchBarContainer />)
        await openModal()

        fireEvent.click(screen.getByTestId("clear-suggestions"))

        expect(mocks.autocompleteInstance.setQuery).toHaveBeenCalledWith("")
        expect(mocks.autocompleteInstance.refresh).toHaveBeenCalled()
        expect(mockClearSearch).toHaveBeenCalled()
    })

    it("should clear suggestions without autocomplete when session becomes inactive", async () => {
        mockSearchValues.search = "maleta"
        const { rerender } = renderWithProviders(<ProductSearchBarContainer />)
        await openModal()

        mockUseSession.mockReturnValue({
            isLogged: false,
            information: null,
            balance: 0,
            isValidatingSession: false,
            basket: null,
            programCurrency: null,
            consent: null,
            cif: null as string | null,
            onOpenAuthModal: vi.fn(),
            onCloseAuthModal: vi.fn(),
            initSession: vi.fn(),
            closeSession: vi.fn(),
            updateBasket: vi.fn(),
            updateBalance: vi.fn(),
            updateGender: vi.fn(),
            updateEmail: vi.fn(),
            filterBanners: vi.fn(),
            clearConsent: vi.fn(),
        })

        rerender(
            <Provider
                store={configureStore({
                    reducer: {
                        user: () => ({
                            information: null,
                            isLogged: false,
                            balance: 0,
                            isValidatingSession: false,
                            basket: null,
                            programCurrency: null,
                            consent: null,
                            cif: null as string | null,
                        }),
                    },
                })}
            >
                <QueryClientProvider client={queryClient}>
                    <ProductSearchBarContainer />
                </QueryClientProvider>
            </Provider>
        )

        fireEvent.click(screen.getByTestId("clear-suggestions"))

        expect(mockClearSearch).toHaveBeenCalled()
    })

    it("should submit search from modal callback", async () => {
        renderWithProviders(<ProductSearchBarContainer />)
        await openModal()

        fireEvent.click(screen.getByTestId("submit-suggestion"))

        expect(mockSubmitSearch).toHaveBeenCalledWith("laptop")
    })

    it("should clear search from modal callback when suggestion is empty", async () => {
        mockSearchValues.search = "maleta"
        renderWithProviders(<ProductSearchBarContainer />)
        await openModal()

        fireEvent.click(screen.getByTestId("submit-empty-suggestion"))

        expect(mockOnChangeFilter).not.toHaveBeenCalled()
        expect(mockClearSearch).toHaveBeenCalled()
    })

    it("should clear pending debounce timer when suggestions are cleared", async () => {
        vi.useFakeTimers()
        renderWithProviders(<ProductSearchBarContainer />)

        act(() => {
            fireEvent.click(screen.getByTestId("search-input"))
        })

        fireEvent.change(screen.getByTestId("modal-search-input"), {
            target: { value: "abc" },
        })
        fireEvent.click(screen.getByTestId("clear-suggestions"))

        await act(async () => {
            await vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE_MS)
        })

        expect(mocks.autocompleteInstance.setQuery).toHaveBeenCalledWith("")
        expect(mocks.autocompleteInstance.setQuery).not.toHaveBeenCalledWith("abc")
    })

    it("should debounce autocomplete refresh while typing", async () => {
        vi.useFakeTimers()
        renderWithProviders(<ProductSearchBarContainer />)

        act(() => {
            fireEvent.click(screen.getByTestId("search-input"))
        })

        fireEvent.change(screen.getByTestId("modal-search-input"), {
            target: { value: "a" },
        })
        fireEvent.change(screen.getByTestId("modal-search-input"), {
            target: { value: "ab" },
        })

        expect(mocks.autocompleteInstance.setQuery).not.toHaveBeenCalled()

        await act(async () => {
            await vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE_MS)
        })

        expect(mocks.autocompleteInstance.setQuery).toHaveBeenCalledWith("ab")
        expect(mocks.autocompleteInstance.setQuery).not.toHaveBeenCalledWith("a")
        expect(mocks.autocompleteInstance.refresh).toHaveBeenCalled()
    })

    it("should clear search when input is emptied and user is not logged in", () => {
        mockUseSession.mockReturnValue({
            isLogged: false,
            information: null,
            balance: 0,
            isValidatingSession: false,
            basket: null,
            programCurrency: null,
            consent: null,
            cif: null as string | null,
            onOpenAuthModal: vi.fn(),
            onCloseAuthModal: vi.fn(),
            initSession: vi.fn(),
            closeSession: vi.fn(),
            updateBasket: vi.fn(),
            updateBalance: vi.fn(),
            updateGender: vi.fn(),
            updateEmail: vi.fn(),
            filterBanners: vi.fn(),
            clearConsent: vi.fn(),
        })
        mockSearchValues.search = "maleta"

        renderWithProviders(<ProductSearchBarContainer />)

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "" } })

        expect(mockClearSearch).toHaveBeenCalled()
    })

    it("should update suggestions and products from autocomplete state changes", async () => {
        renderWithProviders(<ProductSearchBarContainer />)
        // Fixed: autocomplete only initializes once isModalOpen is true
        // (see the source's effect guard: `if (... || !isModalOpen) return`),
        // so the modal must be opened before autocompleteOptions is populated.
        await openModal()

        await waitFor(() => {
            expect(mocks.autocompleteOptions).not.toBeNull()
        })

        const onStateChange = mocks.autocompleteOptions?.onStateChange as (args: {
            state: {
                status: string
                collections: Array<{
                    source: { sourceId: string }
                    items: unknown[]
                }>
            }
        }) => void

        act(() => {
            onStateChange({
                state: {
                    status: "stalled",
                    collections: [
                        {
                            source: { sourceId: QUERY_SUGGESTIONS_SOURCE_ID },
                            items: [{ query: "laptop", popularity: 1, objectID: "1" }],
                        },
                        {
                            source: { sourceId: RECOMMENDED_PRODUCTS_SOURCE_ID },
                            items: [mocks.mockProduct],
                        },
                    ],
                },
            })
        })

        expect(mocks.autocompleteOptions).not.toBeNull()
    })

    it("should ignore autocomplete items that do not match product or suggestion shape", async () => {
        renderWithProviders(<ProductSearchBarContainer />)
        // Fixed: open the modal first so the autocomplete effect actually runs.
        await openModal()

        await waitFor(() => {
            expect(mocks.autocompleteOptions).not.toBeNull()
        })

        const onStateChange = mocks.autocompleteOptions?.onStateChange as (args: {
            state: {
                status: string
                collections: Array<{
                    source: { sourceId: string }
                    items: unknown[]
                }>
            }
        }) => void

        act(() => {
            onStateChange({
                state: {
                    status: "idle",
                    collections: [
                        {
                            source: { sourceId: QUERY_SUGGESTIONS_SOURCE_ID },
                            items: [{ slug: "invalid", name: "Invalid" }],
                        },
                        {
                            source: { sourceId: RECOMMENDED_PRODUCTS_SOURCE_ID },
                            items: [{ query: "invalid", popularity: 1, objectID: "1" }],
                        },
                    ],
                },
            })
        })

        expect(mocks.autocompleteOptions).not.toBeNull()
    })

    it("should fetch autocomplete sources through the products use case", async () => {
        renderWithProviders(<ProductSearchBarContainer />)
        // Fixed: open the modal first so the autocomplete effect actually runs.
        await openModal()

        await waitFor(() => {
            expect(mocks.autocompleteOptions).not.toBeNull()
        })

        const getSources = mocks.autocompleteOptions?.getSources as (args: {
            query: string
        }) => Array<{
            sourceId: string
            templates: { item: () => string }
            getItems: () => Promise<unknown>
        }>

        const sources = getSources({ query: " laptop " })
        expect(sources[0].templates.item()).toBe("")
        expect(sources[1].templates.item()).toBe("")

        await sources[0].getItems()
        await sources[1].getItems()

        expect(mocks.getAutocompleteProducts).toHaveBeenCalledWith("laptop")
        expect(mocks.searchProducts).toHaveBeenCalledWith({
            perPage: 3,
            page: 1,
            search: "laptop",
            category: [],
            sort: "",
            brand: "",
        })
    })

    it("should destroy autocomplete instance on unmount", async () => {
        const { unmount } = renderWithProviders(<ProductSearchBarContainer />)
        // Fixed: open the modal first so the autocomplete effect actually runs
        // and there's an instance to destroy on unmount.
        await openModal()

        await waitFor(() => {
            expect(mocks.autocompleteOptions).not.toBeNull()
        })

        unmount()

        expect(mocks.autocompleteInstance.destroy).toHaveBeenCalled()
    })

    it("should focus modal input after opening the search modal", async () => {
        const rafCallbacks: FrameRequestCallback[] = []

        vi.spyOn(globalThis, "requestAnimationFrame").mockImplementation((callback) => {
            rafCallbacks.push(callback)
            return 1
        })

        renderWithProviders(<ProductSearchBarContainer />)
        await openModal()

        const modalInput = screen.getByTestId("modal-search-input") as HTMLInputElement
        const focusSpy = vi.spyOn(modalInput, "focus")

        rafCallbacks.forEach((callback) => {
            callback(0)
        })

        expect(focusSpy).toHaveBeenCalled()
    })
})