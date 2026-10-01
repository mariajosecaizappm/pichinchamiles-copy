import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

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
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar/ProductSearchBarContainer", () => ({
    default: () => <div data-testid="product-search-bar">ProductSearchBar</div>,
}))

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

// Helper function to render with QueryClient provider
const renderWithQueryClient = (ui: React.ReactElement) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    })
    return render(
        <QueryClientProvider client={queryClient}>
            {ui}
        </QueryClientProvider>
    )
}

import Default from "@/app/utilice-sus-millas/(main)/@subnav/default"
import ProductsSubnav from "@/app/utilice-sus-millas/(main)/@subnav/productos/page"
import ViajesSubnav from "@/app/utilice-sus-millas/(main)/@subnav/viajes-y-actividades/page"

describe("@subnav pages", () => {
    it("default should render null", () => {
        const { container } = render(<Default />)
        expect(container.innerHTML).toBe("")
    })

    it("productos page should render ProductSearchBar in a wrapper", () => {
        renderWithQueryClient(<ProductsSubnav />)
        expect(screen.getByTestId("product-search-bar")).toBeInTheDocument()
    })

    it("productos page should have pt-3 class on wrapper", () => {
        const { container } = renderWithQueryClient(<ProductsSubnav />)
        const wrapper = container.querySelector(".pt-3") as HTMLElement
        expect(wrapper).toHaveClass("pt-3")
    })

    it("viajes-y-actividades page should render null", () => {
        const { container } = render(<ViajesSubnav />)
        expect(container.innerHTML).toBe("")
    })
})
