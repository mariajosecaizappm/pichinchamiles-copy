import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn() }),
}))

vi.mock("@/presentation/components/AssetImage", () => ({
    default: ({ alt, className }: { alt: string; className?: string }) => (
        <img data-testid="asset-image" alt={alt} data-class={className} />
    ),
}))

vi.mock("@heroui/react", () => ({
    cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/ProductCard/ProductCardTag", () => ({
    default: ({ tag }: { tag: string }) => <span data-testid="product-card-tag">{tag}</span>,
}))

import ExperienceItemCard from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/ExperienceItemCard/ExperienceItemCard"

const defaultProps = {
    href: "/test-link",
    asset: { desktopUrl: "https://example.com/d.jpg", mobileUrl: "https://example.com/m.jpg" },
    title: "Spa Premium",
    address: "Quito, Ecuador",
    points: 8000,
}

describe("ExperienceItemCard", () => {
    it("should render the title", () => {
        render(<ExperienceItemCard {...defaultProps} />)
        expect(screen.getByText("Spa Premium")).toBeInTheDocument()
    })

    it("should render a link with the correct href", () => {
        render(<ExperienceItemCard {...defaultProps} />)
        const link = screen.getByRole("link")
        expect(link).toHaveAttribute("href", "/test-link")
    })

    it("should render the asset image with correct alt", () => {
        render(<ExperienceItemCard {...defaultProps} />)
        expect(screen.getByTestId("asset-image")).toHaveAttribute("alt", "Spa Premium")
    })

    it("should render formatted points with Desde label", () => {
        render(<ExperienceItemCard {...defaultProps} />)
        expect(screen.getByText(/Desde/)).toBeInTheDocument()
        expect(screen.getByText(/8.000 millas/)).toBeInTheDocument()
    })

    it("should render the payment note", () => {
        render(<ExperienceItemCard {...defaultProps} />)
        expect(screen.getByText("Puedes utilizar millas + tarjeta")).toBeInTheDocument()
    })

    it("should render the address", () => {
        render(<ExperienceItemCard {...defaultProps} />)
        expect(screen.getByText("Quito, Ecuador")).toBeInTheDocument()
    })

    it("should not render address when not provided", () => {
        const { address: _address, ...propsWithoutAddress } = defaultProps
        render(<ExperienceItemCard {...propsWithoutAddress} />)
        expect(screen.queryByText("Quito, Ecuador")).not.toBeInTheDocument()
    })

    it("should not render previous price with line-through", () => {
        render(<ExperienceItemCard {...defaultProps} />)
        expect(screen.queryByText(/Antes/)).not.toBeInTheDocument()
    })

    it("should render tag when provided", () => {
        render(<ExperienceItemCard {...defaultProps} tag="Nuevo" />)
        expect(screen.getByTestId("product-card-tag")).toBeInTheDocument()
        expect(screen.getByText("Nuevo")).toBeInTheDocument()
    })

    it("should not render tag when not provided", () => {
        render(<ExperienceItemCard {...defaultProps} />)
        expect(screen.queryByTestId("product-card-tag")).not.toBeInTheDocument()
    })

    it("should apply 311px height on desktop for vertical orientation", () => {
        const { container } = render(<ExperienceItemCard {...defaultProps} />)
        const card = container.querySelector(".lg\\:h-\\[311px\\]")
        expect(card).toBeInTheDocument()
    })

    it("should not apply 311px height on desktop for horizontal orientation", () => {
        const { container } = render(<ExperienceItemCard {...defaultProps} orientation="horizontal" />)
        const card = container.querySelector(".lg\\:h-\\[311px\\]")
        expect(card).not.toBeInTheDocument()
    })

    it("should apply custom className", () => {
        const { container } = render(<ExperienceItemCard {...defaultProps} className="custom-class" />)
        const card = container.querySelector(".custom-class")
        expect(card).toBeInTheDocument()
    })

    it("should apply custom classNameImage", () => {
        render(<ExperienceItemCard {...defaultProps} classNameImage="max-w-none" />)

        expect(screen.getByTestId("asset-image")).toHaveAttribute(
            "data-class",
            expect.stringContaining("max-w-none"),
        )
    })

    it("should use default image width when classNameImage is not provided", () => {
        render(<ExperienceItemCard {...defaultProps} />)

        expect(screen.getByTestId("asset-image")).toHaveAttribute(
            "data-class",
            expect.stringContaining("max-w-[250px]"),
        )
    })

    it("should render the horizontal orientation with tag", () => {
        render(
            <ExperienceItemCard
                {...defaultProps}
                orientation="horizontal"
                tag="Nuevo"
            />,
        )

        expect(screen.getByText("Spa Premium")).toBeInTheDocument()
        expect(screen.getByText("Quito, Ecuador")).toBeInTheDocument()
        expect(screen.getByText(/Desde/)).toBeInTheDocument()
        expect(screen.getByText(/8.000 millas/)).toBeInTheDocument()
        expect(screen.getByText("Puedes utilizar millas + tarjeta")).toBeInTheDocument()
        expect(screen.getByTestId("product-card-tag")).toBeInTheDocument()
        expect(screen.queryByText(/Antes/)).not.toBeInTheDocument()
    })

    it("should render the horizontal orientation without tag", () => {
        render(<ExperienceItemCard {...defaultProps} orientation="horizontal" />)

        expect(screen.getByText("Spa Premium")).toBeInTheDocument()
        expect(screen.queryByTestId("product-card-tag")).not.toBeInTheDocument()
        expect(screen.queryByText(/Antes/)).not.toBeInTheDocument()
    })

    it("should apply minimum height to horizontal image container", () => {
        const { container } = render(<ExperienceItemCard {...defaultProps} orientation="horizontal" />)

        expect(container.querySelector(".min-h-\\[150px\\]")).toBeInTheDocument()
    })
})
