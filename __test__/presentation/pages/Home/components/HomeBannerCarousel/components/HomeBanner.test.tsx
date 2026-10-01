import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import {Banner} from "@/domain/entity/Banner/banner"
import {MarketingPositions} from "@/domain/entity/Marketing/marketing"

vi.mock("next/image", () => ({
    getImageProps: (options: any) => ({
        props: { src: options.src, srcSet: options.src, alt: options.alt || "", width: options.width, height: options.height }
    }),
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    default: (props: Record<string, unknown>) => <img {...props} />,
}))

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn() }),
}))

vi.mock("next/link", () => ({
    default: ({children, href, 'aria-label': ariaLabel}: {children: React.ReactNode; href: string; 'aria-label'?: string}) => (
        <a href={href} aria-label={ariaLabel} data-testid="mock-link">{children}</a>
    ),
}))

const mockDispatch = vi.fn()
const mockSelector = vi.fn()
vi.mock("react-redux", () => ({
    useDispatch: () => mockDispatch,
    useSelector: () => mockSelector(),
}))

let mockIsLogged = false
vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => ({
        isLogged: mockIsLogged,
        information: null,
        balance: null,
        isValidatingSession: false,
        basket: null,
    }),
}))

vi.mock("@heroui/react", () => ({
    cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
    extendVariants: () => {
        const MockButton = ({children, ...rest}: Record<string, unknown>) => (
            <button data-testid="mock-button" {...rest}>
                {children as React.ReactNode}
            </button>
        )
        return MockButton
    },
    Button: ({children, ...rest}: Record<string, unknown>) => (
        <button {...rest}>{children as React.ReactNode}</button>
    ),
}))

import HomeBanner from "@/presentation/pages/Home/components/HomeBannerCarousel/components/HomeBanner"

const baseBanner: Banner = {
    id: "banner-1",
    campaignId: "campaign-1",
    title: "Acumula Millas",
    subtitle: "Gana hasta 5x millas",
    description: "Compra en nuestros aliados",
    summary: "Promoción especial",
    link: "/promotions",
    linkText: "Ver más",
    textColor: "#FFFFFF",
    isOutstanding: true,
    segmentCodes: ["premium"],
    positions: [MarketingPositions.HOME_NOT_LOGGED_MAIN_CAROUSEL],
    priority: 1,
    image: {
        desktopUrl: "https://example.com/desktop.jpg",
        mobileUrl: "https://example.com/mobile.jpg",
    },
}

describe("HomeBanner", () => {
    it("should render the banner title", () => {
        render(<HomeBanner banner={baseBanner} />)
        expect(screen.getByText("Acumula Millas")).toBeInTheDocument()
    })

    it("should render the banner subtitle", () => {
        render(<HomeBanner banner={baseBanner} />)
        expect(screen.getByText("Gana hasta 5x millas")).toBeInTheDocument()
    })

    it("should apply textColor style to the heading", () => {
        const {container} = render(<HomeBanner banner={baseBanner} />)
        const h2 = container.querySelector("h2")
        expect(h2).toHaveStyle({color: "#FFFFFF"})
    })

    it("should default textColor to white when not provided", () => {
        const bannerNoColor = {...baseBanner, textColor: ""}
        const {container} = render(<HomeBanner banner={bannerNoColor} />)
        const h2 = container.querySelector("h2")
        expect(h2).toHaveStyle({color: "#fff"})
    })

    it("should render a link with button when logged in and link and linkText are present", () => {
        mockIsLogged = true
        render(<HomeBanner banner={baseBanner} />)
        const link = screen.getByTestId("mock-link")
        expect(link).toHaveAttribute("href", "/promotions")
        expect(screen.getByText("Ver más")).toBeInTheDocument()
        mockIsLogged = false
    })

    it("should render LoginButton when not logged in", () => {
        render(<HomeBanner banner={baseBanner} />)
        expect(screen.getByText("Ingresar")).toBeInTheDocument()
    })

    it("should not render link button when logged in but link is missing", () => {
        mockIsLogged = true
        const bannerNoLink = {...baseBanner, link: "", linkText: ""}
        render(<HomeBanner banner={bannerNoLink} />)
        expect(screen.queryByText("Ver más")).not.toBeInTheDocument()
        mockIsLogged = false
    })

    it("should not render link button when logged in but linkText is missing", () => {
        mockIsLogged = true
        const bannerNoLinkText = {...baseBanner, link: "/test", linkText: ""}
        render(<HomeBanner banner={bannerNoLinkText} />)
        expect(screen.queryByText("Ver más")).not.toBeInTheDocument()
        mockIsLogged = false
    })

    it("should render AssetImage with banner image data", () => {
        const {container} = render(<HomeBanner banner={baseBanner} />)
        const picture = container.querySelector("picture")
        expect(picture).toBeInTheDocument()
        const source = container.querySelector("source")
        expect(source).toHaveAttribute("srcSet", "https://example.com/mobile.jpg")
        const img = container.querySelector("img")
        expect(img).toHaveAttribute("src", "https://example.com/desktop.jpg")
    })

    it("should not render subtitle line break when subtitle is empty", () => {
        const bannerNoSubtitle = {...baseBanner, subtitle: ""}
        const {container} = render(<HomeBanner banner={bannerNoSubtitle} />)
        const br = container.querySelector("h2 br")
        expect(br).toBeNull()
    })

    it("should render gradient overlay divs", () => {
        const {container} = render(<HomeBanner banner={baseBanner} />)
        const overlays = container.querySelectorAll(".absolute.top-0.left-0")
        expect(overlays.length).toBeGreaterThanOrEqual(2)
    })

    it("should have accessible banner image with proper alt text", () => {
        render(<HomeBanner banner={baseBanner} />)
        const image = screen.getByAltText("Acumula Millas")
        expect(image).toBeInTheDocument()
    })

    it("should have proper heading structure", () => {
        render(<HomeBanner banner={baseBanner} />)
        const heading = screen.getByRole("heading", { name: "Acumula Millas" })
        expect(heading).toBeInTheDocument()
        expect(heading.tagName).toBe("H2")
        expect(screen.getByText("Gana hasta 5x millas")).toBeInTheDocument()
    })

    it("should have accessible link when present (logged in)", () => {
        mockIsLogged = true
        render(<HomeBanner banner={baseBanner} />)
        const link = screen.getByRole("link", { name: /Ver más/ })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute("href", "/promotions")
        mockIsLogged = false
    })

    it("should have accessible button when using LoginButton (not logged in)", () => {
        render(<HomeBanner banner={baseBanner} />)
        const button = screen.getByRole("button", { name: "Ingresar, iniciar sesión en Pichincha Miles" })
        expect(button).toBeInTheDocument()
    })

    it("should be accessible by screen readers (logged in with link)", () => {
        mockIsLogged = true
        render(<HomeBanner banner={baseBanner} />)
        
        // Check that all important elements are accessible
        expect(screen.getByRole("img", { name: "Acumula Millas" })).toBeInTheDocument()
        expect(screen.getByRole("heading", { name: "Acumula Millas" })).toBeInTheDocument()
        expect(screen.getByText("Gana hasta 5x millas")).toBeInTheDocument()
        expect(screen.getByRole("link", { name: /Ver más/ })).toBeInTheDocument()
        mockIsLogged = false
    })

    it("should be accessible by screen readers (not logged in)", () => {
        render(<HomeBanner banner={baseBanner} />)

        expect(screen.getByRole("img", { name: "Acumula Millas" })).toBeInTheDocument()
        expect(screen.getByRole("heading", { name: "Acumula Millas" })).toBeInTheDocument()
        expect(screen.getByText("Gana hasta 5x millas")).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Ingresar, iniciar sesión en Pichincha Miles" })).toBeInTheDocument()
    })

    describe("accessibility (ARIA)", () => {
        it("should mark gradient overlay divs as aria-hidden to avoid noise for screen readers", () => {
            const { container } = render(<HomeBanner banner={baseBanner} />)
            const hiddenDivs = container.querySelectorAll(".absolute.top-0.left-0[aria-hidden='true']")
            expect(hiddenDivs.length).toBeGreaterThanOrEqual(2)
        })

        it("should include banner title in CTA link aria-label when logged in", () => {
            mockIsLogged = true
            render(<HomeBanner banner={baseBanner} />)
            const link = screen.getByTestId("mock-link")
            expect(link).toHaveAttribute("aria-label", "Ver más: Acumula Millas")
            mockIsLogged = false
        })

        it("should not render CTA link when not logged in (no duplicate with LoginButton)", () => {
            render(<HomeBanner banner={baseBanner} />)
            expect(screen.queryByTestId("mock-link")).not.toBeInTheDocument()
        })
    })
})
