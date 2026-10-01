import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import HomeTabsProducts from "@/presentation/pages/Home/UseYourMiles/Layout/Tabs/HomeTabsProducts/HomeTabsProducts"
import type { Category } from "@/domain/entity/Category/structure/category"

// Mock useSession hook to avoid Redux dependency
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
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})

// Mock Next.js navigation hooks
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => '/test',
}))

// Component uses ProductSearchBarContainer, not ProductSearchBar directly
vi.mock("@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar/ProductSearchBarContainer", () => ({
    default: () => <div data-testid="product-search-bar">Product Search Bar</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/Categories/ProductCategories", () => ({
    default: ({ categories }: { categories: Category[] }) => (
        <div data-testid="product-categories">
            <div data-testid="categories-data">{JSON.stringify(categories)}</div>
        </div>
    ),
}))

const mockCategories: Category[] = [
    {
        id: "1",
        name: "Electronics",
        slug: "electronics",
        parent: null,
    },
    {
        id: "2",
        name: "Home",
        slug: "home",
        parent: null,
    },
]

const renderWithQueryClient = (ui: React.ReactElement) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    })
    return render(
        <QueryClientProvider client={queryClient}>
            {ui}
        </QueryClientProvider>
    )
}

describe("HomeTabsProducts", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render product search bar and categories", () => {
        renderWithQueryClient(<HomeTabsProducts categories={mockCategories} />)

        expect(screen.getByTestId("product-search-bar")).toBeInTheDocument()
        expect(screen.getByTestId("product-categories")).toBeInTheDocument()
        expect(screen.getByTestId("categories-data")).toHaveTextContent(JSON.stringify(mockCategories))
    })

    it("should render with correct layout structure", () => {
        const { container } = renderWithQueryClient(<HomeTabsProducts categories={mockCategories} />)

        // The Suspense boundary wraps the div, so firstChild may be the Suspense wrapper
        const mainDiv = container.querySelector(".base-container") as HTMLElement
        expect(mainDiv).toHaveClass("w-full", "base-container", "px-0", "lg:px-3.75", "xl:max-w-318.5", "flex", "flex-col-reverse", "lg:flex-row", "gap-3", "lg:gap-6", "items-center", "lg:items-start")
    })

    it("should pass categories to ProductCategories component", () => {
        renderWithQueryClient(<HomeTabsProducts categories={mockCategories} />)

        expect(screen.getByTestId("categories-data")).toHaveTextContent(JSON.stringify(mockCategories))
    })

    it("should render search bar with correct width classes", () => {
        renderWithQueryClient(<HomeTabsProducts categories={mockCategories} />)

        const searchBarContainer = screen.getByTestId("product-search-bar").parentElement
        expect(searchBarContainer).toHaveClass("w-full", "lg:w-[40%]", "px-6", "lg:p-0")
    })

    it("should render categories with correct width classes", () => {
        renderWithQueryClient(<HomeTabsProducts categories={mockCategories} />)

        const categoriesContainer = screen.getByTestId("product-categories").parentElement
        expect(categoriesContainer).toHaveClass("w-full", "lg:w-[60%]", "lg:-mt-12.5")
    })

    it("should work with empty categories array", () => {
        renderWithQueryClient(<HomeTabsProducts categories={[]} />)

        expect(screen.getByTestId("product-search-bar")).toBeInTheDocument()
        expect(screen.getByTestId("product-categories")).toBeInTheDocument()
        expect(screen.getByTestId("categories-data")).toHaveTextContent("[]")
    })
})
