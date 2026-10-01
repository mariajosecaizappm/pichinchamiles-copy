import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"

vi.mock("next/image", () => ({
    getImageProps: (options: { src: string; alt?: string; width: number; height: number }) => ({
        props: { src: options.src, srcSet: options.src, alt: options.alt || "", width: options.width, height: options.height }
    }),
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    default: (props: Record<string, unknown>) => <img {...props} />,
}))

vi.mock("next/link", () => ({
    default: ({children, href, "aria-label": ariaLabel}: {children: React.ReactNode; href: string; "aria-label"?: string}) => (
        <a href={href} data-testid="mock-link" aria-label={ariaLabel}>{children}</a>
    ),
}))

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
    }),
}))

const mockUseSession = vi.fn()
vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

import Logo from "@/presentation/pages/Home/components/Header/components/Logo/Logo"

describe("Logo", () => {
    beforeEach(() => {
        // Default mock for user not logged in
        mockUseSession.mockReturnValue({
            isLogged: false,
            member: null,
            balance: 0,
            basket: null,
            programCurrency: null,
            isValidatingSession: false,
            onOpenAuthModal: vi.fn(),
            onCloseAuthModal: vi.fn(),
            initSession: vi.fn(),
            closeSession: vi.fn(),
            updateBasket: vi.fn(),
            updateBalance: vi.fn(),
            updateGender: vi.fn(),
            updateEmail: vi.fn(),
            filterBanners: vi.fn(),
        })
    })

    it("should render a logo container", () => {
        const {container} = render(<Logo />)
        const logoContainer = container.querySelector("div")
        expect(logoContainer).toBeInTheDocument()
        expect(logoContainer).toHaveClass("mx-auto")
    })

    it("should render the Pichincha Miles logo image", () => {
        render(<Logo />)
        const img = screen.getByAltText("Pichincha Miles Logo")
        expect(img).toBeInTheDocument()
        expect(img).toHaveAttribute("src", "/pm-logo.svg")
    })

    it("should render a link to home page wrapping the logo", () => {
        render(<Logo />)
        const link = screen.getByTestId("mock-link")
        expect(link).toHaveAttribute("href", "/")
    })

    it("should apply correct image dimensions", () => {
        render(<Logo />)
        const img = screen.getByAltText("Pichincha Miles Logo")
        expect(img).toHaveAttribute("width", "155")
        expect(img).toHaveAttribute("height", "32")
        expect(img).toHaveClass("h-7.75 md:h-12 w-auto")
    })

    it("should apply margin classes when user is not logged in", () => {
        const {container} = render(<Logo />)
        const logoContainer = container.querySelector("div")
        expect(logoContainer).toHaveClass("lg:mx-auto")
    })

    it("should apply different margin classes when user is logged in", () => {
        // Mock user logged in state
        mockUseSession.mockReturnValue({
            isLogged: true,
            member: { name: "Test User" },
            balance: 1000,
            basket: null,
            programCurrency: null,
            isValidatingSession: false,
            onOpenAuthModal: vi.fn(),
            onCloseAuthModal: vi.fn(),
            initSession: vi.fn(),
            closeSession: vi.fn(),
            updateBasket: vi.fn(),
            updateBalance: vi.fn(),
            updateGender: vi.fn(),
            updateEmail: vi.fn(),
            filterBanners: vi.fn(),
        })
        
        const {container} = render(<Logo />)
        const logoContainer = container.querySelector("div")
        
        expect(logoContainer).toHaveClass("mx-auto")
        expect(logoContainer).toHaveClass("lg:mr-auto")
        expect(logoContainer).toHaveClass("lg:ml-0")
        expect(logoContainer).not.toHaveClass("lg:mx-auto")
    })

    it("should have accessible logo link with proper aria-label", () => {
        render(<Logo />)
        const logoLink = screen.getByRole("link", { name: "Ir al inicio de Pichincha Miles" })
        expect(logoLink).toBeInTheDocument()
        expect(logoLink).toHaveAttribute("href", "/")
    })

    it("should be accessible by screen readers", () => {
        render(<Logo />)
        
        // Check that logo image is properly accessible
        expect(screen.getByRole("img", { name: "Pichincha Miles Logo" })).toBeInTheDocument()
        
        // Check that link is accessible
        expect(screen.getByRole("link", { name: "Ir al inicio de Pichincha Miles" })).toBeInTheDocument()
    })
})
