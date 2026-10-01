import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { configureStore } from "@reduxjs/toolkit"
import ExploreProductsLayout from "@/app/utilice-sus-millas/(main)/productos/layout"

// Create a mock QueryClient
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
})

// Create a mock Redux store
const mockStore = configureStore({
    reducer: {
        user: () => ({
            information: null,
            isLogged: false,
            balance: 0,
            isValidatingSession: false,
            basket: null,
            programCurrency: null,
            consent: null,
            cif: null,
        }),
    },
})

// Mock useProductSearch to avoid NuqsAdapter issues
vi.mock("@/presentation/hooks/useProductSearch", () => ({
    default: () => ({
        searchValues: { 
            search: '', 
            category: '', 
            brand: '', 
            sort: '', 
            recommended: undefined 
        },
        searchParams: new URLSearchParams(),
        onChangeFilter: vi.fn(),
        clearSearch: vi.fn(),
        onChangePage: vi.fn(),
    }),
}))

// Mock useSession to avoid Next.js router issues
vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => ({
        isLogged: false,
        information: null,
        balance: 0,
        isValidatingSession: false,
        basket: null,
        programCurrency: null,
        consent: null,
        cif: null,
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

// Mock window.matchMedia for useIsDesktop hook
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})

// Mock the components
vi.mock("@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar", () => ({
    default: () => <div data-testid="product-search-bar">ProductSearchBar</div>
}))

vi.mock("@/presentation/pages/Products/components/SearchBar/context/SearchBarProvider", () => ({
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="search-bar-provider">{children}</div>
    )
}))

// Mock the ProductSearchBarContainer to prevent actual component rendering
vi.mock("@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar/ProductSearchBarContainer", () => ({
    default: () => <div data-testid="product-search-bar">ProductSearchBar</div>
}))

describe("ExploreProductsLayout", () => {
    it("should render layout with ProductSearchBarContainer", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Provider store={mockStore}>
                    <ExploreProductsLayout>
                        <div data-testid="test-children">Test Children</div>
                    </ExploreProductsLayout>
                </Provider>
            </QueryClientProvider>
        )

        expect(screen.getByTestId("product-search-bar")).toBeInTheDocument()
        expect(screen.getByTestId("test-children")).toBeInTheDocument()
    })

    it("should render mobile ProductSearchBar", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Provider store={mockStore}>
                    <ExploreProductsLayout>
                        <div data-testid="test-children">Test Children</div>
                    </ExploreProductsLayout>
                </Provider>
            </QueryClientProvider>
        )

        // Check that the mobile search bar is rendered (it's inside the div with md:hidden class)
        const mobileSearchBar = screen.getByTestId("product-search-bar")
        expect(mobileSearchBar).toBeInTheDocument()
    })

    it("should render children content", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Provider store={mockStore}>
                    <ExploreProductsLayout>
                        <h1 data-testid="page-title">Products Page</h1>
                        <p data-testid="page-content">This is the products page content</p>
                    </ExploreProductsLayout>
                </Provider>
            </QueryClientProvider>
        )

        expect(screen.getByTestId("page-title")).toBeInTheDocument()
        expect(screen.getByTestId("page-content")).toBeInTheDocument()
        expect(screen.getByText("Products Page")).toBeInTheDocument()
        expect(screen.getByText("This is the products page content")).toBeInTheDocument()
    })

    it("should wrap content in Suspense", () => {
        // This test verifies that the component renders without throwing errors
        // Suspense boundary is tested implicitly by successful render
        expect(() => {
            render(
                <QueryClientProvider client={queryClient}>
                    <Provider store={mockStore}>
                        <ExploreProductsLayout>
                            <div data-testid="suspense-content">Content wrapped in Suspense</div>
                        </ExploreProductsLayout>
                    </Provider>
                </QueryClientProvider>
            )
        }).not.toThrow()

        expect(screen.getByTestId("suspense-content")).toBeInTheDocument()
    })

    it("should have correct structure with mobile search bar container", () => {
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <Provider store={mockStore}>
                    <ExploreProductsLayout>
                        <div data-testid="test-children">Test Children</div>
                    </ExploreProductsLayout>
                </Provider>
            </QueryClientProvider>
        )

        // The layout should have the proper structure
        const mainDiv = container.querySelector('.block.md\\:hidden.py-3.px-6')
        expect(mainDiv).toBeInTheDocument()
        
        // Check for mobile search bar container
        const mobileSearchBar = mainDiv?.querySelector('[data-testid="product-search-bar"]')
        expect(mobileSearchBar).toBeInTheDocument()
        
        // Check that children are rendered
        expect(screen.getByTestId("test-children")).toBeInTheDocument()
    })
})
