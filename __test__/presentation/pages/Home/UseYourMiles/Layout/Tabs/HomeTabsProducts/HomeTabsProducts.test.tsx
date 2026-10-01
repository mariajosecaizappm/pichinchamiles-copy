import React from "react"
import {render, screen} from "@testing-library/react"
import { Provider } from "react-redux"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { configureStore } from "@reduxjs/toolkit"
import {describe, it, expect, vi} from "vitest"
import HomeTabsProducts from "@/presentation/pages/Home/UseYourMiles/Layout/Tabs/HomeTabsProducts/HomeTabsProducts"
import { Category } from "@/domain/entity/Category/structure/category"

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

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar", () => ({
    default: () => <div data-testid="product-search-bar">ProductSearchBar</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/Categories/ProductCategories", () => ({
    default: ({categories}: {categories: Category[]}) => (
        <div data-testid="product-categories">{categories.length} categories</div>
    ),
}))

// Mock the ProductSearchBarContainer to prevent actual component rendering
vi.mock("@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar/ProductSearchBarContainer", () => ({
    default: () => <div data-testid="product-search-bar">ProductSearchBar</div>,
}))

// Mock the SearchBarProvider
vi.mock("@/presentation/pages/Products/components/SearchBar/context/SearchBarProvider", () => ({
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="search-bar-provider">{children}</div>
    )
}))

const mockCategories: Category[] = [
    {
        id: "cat-1",
        name: "Electrónica",
        slug: "electronica",
        description: "Productos electrónicos",
        showName: "Electrónica",
        icon: "icon-electronics",
        parent: null,
        programCategories: [],
    },
    {
        id: "cat-2",
        name: "Hogar",
        slug: "hogar",
        description: "Productos para el hogar",
        showName: "Hogar",
        icon: "icon-home",
        parent: null,
        programCategories: [],
    },
]

describe("HomeTabsProducts", () => {
    it("should render ProductSearchBarContainer with correct structure", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Provider store={mockStore}>
                    <HomeTabsProducts categories={mockCategories} />
                </Provider>
            </QueryClientProvider>
        )

        expect(screen.getByTestId("product-search-bar")).toBeInTheDocument()
    })

    it("should render ProductSearchBar component", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Provider store={mockStore}>
                    <HomeTabsProducts categories={mockCategories} />
                </Provider>
            </QueryClientProvider>
        )

        expect(screen.getByTestId("product-search-bar")).toBeInTheDocument()
    })

    it("should render ProductCategories with provided categories", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Provider store={mockStore}>
                    <HomeTabsProducts categories={mockCategories} />
                </Provider>
            </QueryClientProvider>
        )

        expect(screen.getByTestId("product-categories")).toBeInTheDocument()
        expect(screen.getByTestId("product-categories")).toHaveTextContent("2 categories")
    })

    it("should render with empty categories", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Provider store={mockStore}>
                    <HomeTabsProducts categories={[]} />
                </Provider>
            </QueryClientProvider>
        )

        expect(screen.getByTestId("product-categories")).toHaveTextContent("0 categories")
    })

    it("should apply correct layout classes", () => {
        const {container} = render(
            <QueryClientProvider client={queryClient}>
                <Provider store={mockStore}>
                    <HomeTabsProducts categories={mockCategories} />
                </Provider>
            </QueryClientProvider>
        )

        const wrapper = container.querySelector(".base-container")
        expect(wrapper).toBeInTheDocument()
        expect(wrapper).toHaveClass("flex")
        expect(wrapper).toHaveClass("flex-col-reverse")
        expect(wrapper).toHaveClass("lg:flex-row")
    })

    it("should pass categories to ProductCategories", () => {
        const customCategories: Category[] = [
            {
                id: "cat-3",
                name: "Custom",
                slug: "custom",
                description: "Custom category",
                showName: "Custom",
                icon: "icon-custom",
                parent: null,
                programCategories: [],
            },
        ]

        render(
            <QueryClientProvider client={queryClient}>
                <Provider store={mockStore}>
                    <HomeTabsProducts categories={customCategories} />
                </Provider>
            </QueryClientProvider>
        )

        expect(screen.getByTestId("product-categories")).toHaveTextContent("1 categories")
    })
})
