import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import SectionBanner from "@/presentation/components/Banner/SectionBanner/SectionBanner"

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn() }),
}))

vi.mock("next/link", () => ({
    default: ({ href, children, className, ...props }: { href: string; children: React.ReactNode; className: string; "aria-label"?: string }) => (
        <a data-testid="link" href={href} className={className} {...props}>
            {children}
        </a>
    ),
}))

vi.mock("@/presentation/components/AssetImage", () => ({
    default: ({ asset, alt, className }: { asset: { desktopUrl?: string; mobileUrl?: string } | undefined; alt: string; className: string }) => (
        <div data-testid="asset-image" className={className} data-alt={alt}>
            {asset?.desktopUrl || asset?.mobileUrl}
        </div>
    ),
}))

vi.mock("@/presentation/pages/Home/components/Button", () => ({
    default: ({
        as: AsComponent,
        variant,
        className,
        children,
        href,
        ...props
    }: {
        as?: React.ElementType
        variant: string
        className: string
        children: React.ReactNode
        href?: string
    }) => {
        if (AsComponent) {
            return (
                <AsComponent href={href ?? ""} className={className} data-testid="link" data-variant={variant} {...props}>
                    {children}
                </AsComponent>
            )
        }

        return (
            <button data-testid="button" data-variant={variant} className={className} {...props}>
                {children}
            </button>
        )
    },
}))

const mockBackgroundImage = {
    desktopUrl: "test-desktop.jpg",
    mobileUrl: "test-mobile.jpg"
}

describe("SectionBanner", () => {
    it("should render content without background image", () => {
        render(
            <SectionBanner
                title="Test Title"
                linkButton="/test-link"
                buttonText="Click Me"
            />
        )

        expect(screen.getByText("Test Title")).toBeInTheDocument()
        expect(screen.getByText("Click Me")).toBeInTheDocument()
        expect(screen.getByTestId("link")).toHaveAttribute("href", "/test-link")
        expect(screen.queryByTestId("asset-image")).not.toBeInTheDocument()
    })

    it("should render with background image", () => {
        render(
            <SectionBanner
                title="Test Title"
                linkButton="/test-link"
                buttonText="Click Me"
                backgroundImage={mockBackgroundImage}
            />
        )

        expect(screen.getByTestId("asset-image")).toBeInTheDocument()
        expect(screen.getByTestId("asset-image")).toHaveTextContent("test-desktop.jpg")
        expect(screen.getByText("Test Title")).toBeInTheDocument()
    })

    it("should render children content", () => {
        render(
            <SectionBanner
                title="Test Title"
                linkButton="/test-link"
                buttonText="Click Me"
            >
                <div data-testid="children-content">Child Content</div>
            </SectionBanner>
        )

        expect(screen.getByTestId("children-content")).toBeInTheDocument()
        expect(screen.getByText("Child Content")).toBeInTheDocument()
    })

    it("should use default button text when buttonText is not provided", () => {
        render(
            <SectionBanner
                title="Test Title"
                linkButton="/test-link"
            />
        )

        expect(screen.getByText("Ver más")).toBeInTheDocument()
    })

    it("should include subtitle in link aria-label when provided", () => {
        render(
            <SectionBanner
                title="Cocina"
                subtitle="recomendados"
                linkButton="/ofertas/cocina"
                buttonText="Explorar catálogo"
            />
        )

        expect(screen.getByTestId("link")).toHaveAttribute(
            "aria-label",
            "Explorar catálogo: Cocina - recomendados"
        )
    })

    it("should use default button text when buttonText is empty string", () => {
        render(
            <SectionBanner
                title="Test Title"
                linkButton="/test-link"
                buttonText=""
            />
        )

        expect(screen.getByText("Ver más")).toBeInTheDocument()
    })

    it("should apply custom className", () => {
        render(
            <SectionBanner
                title="Test Title"
                linkButton="/test-link"
                className="custom-class"
            />
        )

        const container = screen.getByText("Test Title").closest("div")
        expect(container).toHaveClass("custom-class")
    })

    it("should apply correct classes when background image is present", () => {
        render(
            <SectionBanner
                title="Test Title"
                linkButton="/test-link"
                backgroundImage={mockBackgroundImage}
            />
        )

        const container = screen.getByTestId("asset-image").parentElement?.parentElement
        expect(container).toHaveClass("relative", "p-3", "flex", "flex-col", "justify-end", "gap-3", "rounded-lg", "overflow-hidden")
    })

    it("should render background overlay when background image is present", () => {
        render(
            <SectionBanner
                title="Test Title"
                linkButton="/test-link"
                backgroundImage={mockBackgroundImage}
            />
        )

        const overlay = screen.getByTestId("asset-image").parentElement?.nextElementSibling
        expect(overlay).toHaveClass("absolute", "inset-0", "bg-linear-to-t", "from-black/60", "to-transparent")
    })

    it("should render content in relative z-10 container when background image is present", () => {
        render(
            <SectionBanner
                title="Test Title"
                linkButton="/test-link"
                backgroundImage={mockBackgroundImage}
            />
        )

        const contentContainer = screen.getByText("Test Title").parentElement?.parentElement
        expect(contentContainer).toHaveClass("relative", "z-10")
    })

    it("should pass correct props to Button component", () => {
        render(
            <SectionBanner
                title="Test Title"
                linkButton="/test-link"
                buttonText="Click Me"
                typeButton="bordered"
                buttonClassName="custom-button-class"
            />
        )

        const button = screen.getByTestId("link")
        expect(button).toHaveAttribute("data-variant", "bordered")
        expect(button).toHaveClass("py-2", "px-4", "md:py-2", "h-10", "md:h-10", "custom-button-class")
    })

    it("should use primary button type by default", () => {
        render(
            <SectionBanner
                title="Test Title"
                linkButton="/test-link"
                buttonText="Click Me"
            />
        )

        const button = screen.getByTestId("link")
        expect(button).toHaveAttribute("data-variant", "primary")
    })

    it("should render title with correct styling", () => {
        render(
            <SectionBanner
                title="Test Title"
                linkButton="/test-link"
            />
        )

        const title = screen.getByText("Test Title")
        expect(title.tagName).toBe("H2")
        expect(title).toHaveClass("text-white", "typo-banner-title")
    })

    it("should pass correct alt attribute to AssetImage", () => {
        render(
            <SectionBanner
                title="Test Title"
                linkButton="/test-link"
                backgroundImage={mockBackgroundImage}
            />
        )

        const assetImage = screen.getByTestId("asset-image")
        expect(assetImage).toHaveAttribute("data-alt", "Test Title")
    })

    it("should render link with correct href", () => {
        render(
            <SectionBanner
                title="Test Title"
                linkButton="/custom-path"
                buttonText="Custom Button"
            />
        )

        const link = screen.getByTestId("link")
        expect(link).toHaveAttribute("href", "/custom-path")
    })

    it("should render empty content when linkButton is empty but buttonText exists", () => {
        render(
            <SectionBanner
                title="Test Title"
                linkButton=""
                buttonText="Should Not Show"
            />
        )

        expect(screen.getByText("Ver más")).toBeInTheDocument()
    })
})
