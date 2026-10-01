import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { Banner } from "@/domain/entity/Banner/banner"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"

const mockUseSession = vi.fn()

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

type AssetImageProps = {
    asset?: { desktopUrl?: string; mobileUrl?: string }
    alt: string
    width: number
    height: number
    breakpoint?: number
    sizes?: string
    priority?: boolean
    fetchPriority?: "high" | "auto"
    className?: string
}

vi.mock("@/presentation/components/AssetImage", () => ({
    default: ({ asset, alt, width, height, breakpoint, sizes, priority, fetchPriority, className }: AssetImageProps) => (
        <div
            data-testid="asset-image"
            data-alt={alt}
            data-width={width}
            data-height={height}
            data-breakpoint={breakpoint}
            data-sizes={sizes}
            data-priority={String(priority)}
            data-fetchpriority={fetchPriority}
            className={className}
        >
            {asset?.desktopUrl || asset?.mobileUrl}
        </div>
    ),
}))

type ButtonProps = {
    as?: React.ElementType
    children: React.ReactNode
    href?: string
    className?: string
    [key: string]: unknown
}

vi.mock("@/presentation/pages/Home/components/Button", () => ({
    default: ({ as: AsComponent, children, href, className, ...props }: ButtonProps) => {
        if (AsComponent) {
            return (
                <AsComponent href={href ?? ""} className={className} data-testid="button" {...props}>
                    {children}
                </AsComponent>
            )
        }
        return (
            <button data-testid="button" className={className} {...props}>
                {children}
            </button>
        )
    },
}))

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn() }),
}))

vi.mock("@/presentation/pages/Home/components/Button/LoginButton", () => ({
    default: ({ size }: { size?: string }) => (
        mockUseSession().isLogged
            ? null
            : <button data-testid="login-button" data-size={size}>Ingresar</button>
    ),
}))

type LinkProps = {
    href: string
    children: React.ReactNode
    "aria-label"?: string
}

vi.mock("next/link", () => ({
    default: ({ href, children, "aria-label": ariaLabel }: LinkProps) => (
        <a data-testid="link" href={href} aria-label={ariaLabel}>{children}</a>
    ),
}))

import BannerSlide from "@/presentation/pages/Home/components/HomeBannerCarousel/components/BannerSlide"

const mockBanner: Banner = {
    id: "banner-1",
    title: "Banner Title",
    subtitle: "Banner Subtitle",
    description: "",
    summary: "",
    link: "/banner-link",
    linkText: "Ver más",
    textColor: "#FF0000",
    isOutstanding: false,
    segmentCodes: [],
    positions: [MarketingPositions.HOME_LOGGED_MAIN_SLIDER],
    priority: 1,
    image: { desktopUrl: "https://example.com/desktop.jpg", mobileUrl: "https://example.com/mobile.jpg" },
    campaignId: "",
}

const buildBanner = (overrides: Partial<Banner> = {}): Banner => ({ ...mockBanner, ...overrides })

describe("BannerSlide", () => {
    beforeEach(() => {
        mockUseSession.mockReturnValue({ isLogged: false })
    })

    it("should render the banner image with correct alt text", () => {
        render(<BannerSlide banner={mockBanner} />)
        expect(screen.getByTestId("asset-image")).toHaveAttribute("data-alt", "Banner Title")
    })

    it("should render the title and subtitle when provided", () => {
        render(<BannerSlide banner={mockBanner} />)
        expect(screen.getByRole("heading", { name: /Banner Title/i })).toBeInTheDocument()
        expect(screen.getByText("Banner Subtitle")).toBeInTheDocument()
    })

    it("should render title without subtitle when subtitle is empty", () => {
        const banner = buildBanner({ subtitle: "" })
        render(<BannerSlide banner={banner} />)
        expect(screen.getByRole("heading", { name: /Banner Title/i })).toBeInTheDocument()
        expect(screen.queryByText("Banner Subtitle")).not.toBeInTheDocument()
    })

    it("should render login button when user is not logged in", () => {
        render(<BannerSlide banner={mockBanner} />)
        expect(screen.getByTestId("login-button")).toBeInTheDocument()
        expect(screen.queryByRole("link")).not.toBeInTheDocument()
    })

    it("should render link button when user is logged in and banner has link and linkText", () => {
        mockUseSession.mockReturnValue({ isLogged: true })
        render(<BannerSlide banner={mockBanner} />)
        expect(screen.queryByTestId("login-button")).not.toBeInTheDocument()
        const link = screen.getByRole("link")
        expect(link).toHaveAttribute("href", "/banner-link")
        expect(link).toHaveAttribute("aria-label", "Ver más: Banner Title")
        expect(link).toHaveTextContent("Ver más")
    })

    it("should not render a button when user is logged in but banner lacks link", () => {
        mockUseSession.mockReturnValue({ isLogged: true })
        const banner = buildBanner({ link: "", linkText: "Ver más" })
        render(<BannerSlide banner={banner} />)
        expect(screen.queryByRole("link")).not.toBeInTheDocument()
        expect(screen.queryByTestId("login-button")).not.toBeInTheDocument()
    })

    it("should not render a button when user is logged in but banner lacks linkText", () => {
        mockUseSession.mockReturnValue({ isLogged: true })
        const banner = buildBanner({ linkText: "" })
        render(<BannerSlide banner={banner} />)
        expect(screen.queryByRole("link")).not.toBeInTheDocument()
        expect(screen.queryByTestId("login-button")).not.toBeInTheDocument()
    })

    it("should apply the default container className", () => {
        const { container } = render(<BannerSlide banner={mockBanner} />)
        expect(container.firstChild).toHaveClass("relative", "h-150", "sm:h-120")
    })

    it("should apply custom container className when provided", () => {
        const { container } = render(<BannerSlide banner={mockBanner} containerClassName="custom-class" />)
        expect(container.firstChild).toHaveClass("custom-class")
    })

    it("should render mobile and desktop gradient overlays", () => {
        const { container } = render(<BannerSlide banner={mockBanner} />)
        expect(container.querySelector(".absolute.inset-0.top-0.left-0.sm\\:hidden")).toBeInTheDocument()
        expect(container.querySelector(".absolute.inset-0.top-0.left-0.hidden.sm\\:block")).toBeInTheDocument()
    })

    it("should render with custom title component", () => {
        const { container } = render(<BannerSlide banner={mockBanner} TitleComponent="h1" />)
        expect(container.querySelector("h1")).toBeInTheDocument()
        expect(container.querySelector("h2")).not.toBeInTheDocument()
    })

    it("should apply banner text color to the title", () => {
        const { container } = render(<BannerSlide banner={mockBanner} />)
        const title = container.querySelector("h2")
        expect(title).toHaveStyle("color: rgb(255, 0, 0)")
    })

    it("should default title color to white when textColor is not provided", () => {
        const banner = buildBanner({ textColor: "" })
        const { container } = render(<BannerSlide banner={banner} />)
        const title = container.querySelector("h2")
        expect(title).toHaveStyle("color: rgb(255, 255, 255)")
    })

    it("should pass image props to AssetImage", () => {
        render(<BannerSlide banner={mockBanner} priority={true} fetchPriority="high" imageHeight={620} imageBreakpoint={768} />)
        const image = screen.getByTestId("asset-image")
        expect(image).toHaveAttribute("data-priority", "true")
        expect(image).toHaveAttribute("data-fetchpriority", "high")
        expect(image).toHaveAttribute("data-height", "620")
    })

    it("should pass image breakpoint and sizes to AssetImage", () => {
        render(<BannerSlide banner={mockBanner} imageBreakpoint={768} />)
        const image = screen.getByTestId("asset-image")
        expect(image).toHaveAttribute("data-breakpoint", "768")
        expect(image).toHaveAttribute("data-sizes", "100vw")
    })

    it("should pass the fixed image width to AssetImage", () => {
        render(<BannerSlide banner={mockBanner} />)
        expect(screen.getByTestId("asset-image")).toHaveAttribute("data-width", "1920")
    })

    it("should apply custom overlayInnerClassName", () => {
        const { container } = render(<BannerSlide banner={mockBanner} overlayInnerClassName="custom-overlay" />)
        expect(container.querySelector(".custom-overlay")).toBeInTheDocument()
    })

    it("should apply custom textWrapperClassName", () => {
        const { container } = render(<BannerSlide banner={mockBanner} textWrapperClassName="custom-text-wrapper" />)
        expect(container.querySelector(".custom-text-wrapper")).toBeInTheDocument()
    })

    it("should apply custom titleClassName", () => {
        const { container } = render(<BannerSlide banner={mockBanner} titleClassName="custom-title" />)
        expect(container.querySelector(".custom-title")).toBeInTheDocument()
    })

    it("should apply custom titleContainerClassName", () => {
        const { container } = render(<BannerSlide banner={mockBanner} titleContainerClassName="custom-title-container" />)
        expect(container.querySelector(".custom-title-container")).toBeInTheDocument()
    })

    it("should apply custom mobile gradient", () => {
        const { container } = render(<BannerSlide banner={mockBanner} mobileGradient="linear-gradient(red, blue)" />)
        const gradient = container.querySelector(".absolute.inset-0.top-0.left-0.sm\\:hidden")
        expect(gradient).toHaveStyle("background: linear-gradient(red, blue)")
    })

    it("should apply custom desktop gradient", () => {
        const { container } = render(<BannerSlide banner={mockBanner} desktopGradient="linear-gradient(blue, red)" />)
        const gradient = container.querySelector(".absolute.inset-0.top-0.left-0.hidden.sm\\:block")
        expect(gradient).toHaveStyle("background: linear-gradient(blue, red)")
    })

    it("should apply custom mobile gradient className", () => {
        const { container } = render(<BannerSlide banner={mockBanner} mobileGradientClassName="custom-mobile-gradient" />)
        expect(container.querySelector(".custom-mobile-gradient")).toBeInTheDocument()
    })

    it("should apply custom desktop gradient className", () => {
        const { container } = render(<BannerSlide banner={mockBanner} desktopGradientClassName="custom-desktop-gradient" />)
        expect(container.querySelector(".custom-desktop-gradient")).toBeInTheDocument()
    })
})
