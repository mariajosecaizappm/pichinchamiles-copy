import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        refresh: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        prefetch: vi.fn(),
    }),
    usePathname: () => "/",
    useSearchParams: () => new URLSearchParams(),
}))

vi.mock("react-redux", () => ({
    useDispatch: () => vi.fn(),
    useSelector: (selector: (state: unknown) => unknown) => {
        const mockState = {
            user: {
                information: null,
                isLogged: false,
                balance: 0,
                isValidatingSession: false,
                basket: null,
                programCurrency: null,
                consent: null,
                cif: '',
            }
        }
        return selector(mockState)
    },
}))

const mockUseSession = vi.hoisted(() => vi.fn())

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

vi.mock("next/link", () => ({
    default: ({ children, href, ...rest }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
        <a href={href} {...rest}>{children}</a>
    ),
}))

vi.mock("@heroui/badge", () => ({
    Badge: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

import CartButton from "@/presentation/pages/Home/components/Header/components/Cart/CartButton"

describe("CartButton", () => {
    beforeEach(() => {
        mockUseSession.mockReturnValue({ isLogged: true, basket: null })
    })

    it("should render a link to the shopping cart", () => {
        render(<CartButton />)
        const link = screen.getByRole("link", { name: "Carrito" })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute("href", "/carrito-de-compra")
    })

    it("should have correct CSS classes", () => {
        render(<CartButton />)
        const link = screen.getByRole("link", { name: "Carrito" })
        expect(link).toHaveClass("cursor", "pointer", "bg-darkGrayishBlue-200", "rounded-sm", "border", "border-darkGrayishBlue-300", "p-2", "flex", "gap-2.5", "items-center", "lg:px-4", "lg:py-2")
    })

    it("should contain the IconCart component", () => {
        render(<CartButton />)
        const svg = screen.getByRole("link", { name: "Carrito" }).querySelector("svg")
        expect(svg).toBeInTheDocument()
    })

    it("should display 'Carrito' text on large screens", () => {
        render(<CartButton />)
        const span = screen.getByText("Carrito")
        expect(span).toBeInTheDocument()
        expect(span).toHaveClass("hidden", "lg:block", "text-sm", "font-semibold", "font-sans", "text-blue-500")
    })
})
