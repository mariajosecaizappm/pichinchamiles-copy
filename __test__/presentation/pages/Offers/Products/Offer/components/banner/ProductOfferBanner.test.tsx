import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Asset } from "@/domain/entity/Asset/asset"

const mockUseIsDesktop = vi.fn()

vi.mock("@/presentation/hooks/useIsDesktop", () => ({
    default: (breakpoint: number) => mockUseIsDesktop(breakpoint),
}))

vi.mock("@/presentation/components/AssetImage", () => ({
    default: ({
        alt,
        width,
        height,
        className,
    }: {
        alt: string
        width: number
        height: number
        className: string
    }) => (
        <img
            data-testid="asset-image"
            alt={alt}
            data-width={width}
            data-height={height}
            className={className}
        />
    ),
}))

import ProductOfferBanner from "@/presentation/pages/Offers/Products/Offer/components/Banner/ProductOfferBanner"

const buildImage = (overrides: Partial<Asset> = {}): Asset => ({
    desktopUrl: "/desktop.jpg",
    mobileUrl: "/mobile.jpg",
    ...overrides,
})

describe("ProductOfferBanner", () => {
    beforeEach(() => {
        mockUseIsDesktop.mockReturnValue({ isDesktop: true })
    })

    it("should render title and image on desktop", () => {
        render(<ProductOfferBanner image={buildImage()} title="Cyber Sale" />)

        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Cyber Sale")
        expect(screen.getByTestId("asset-image")).toHaveAttribute("data-width", "1272")
        expect(screen.getByTestId("asset-image")).toHaveAttribute("data-height", "620")
        expect(mockUseIsDesktop).toHaveBeenCalledWith(778)
    })

    it("should render mobile image dimensions when not desktop", () => {
        mockUseIsDesktop.mockReturnValue({ isDesktop: false })

        render(<ProductOfferBanner image={buildImage()} title="Cyber Sale" />)

        expect(screen.getByTestId("asset-image")).toHaveAttribute("data-width", "624")
        expect(screen.getByTestId("asset-image")).toHaveAttribute("data-height", "320")
    })

    it("should render subtitle when provided", () => {
        render(<ProductOfferBanner image={buildImage()} title="Cyber Sale" subtitle="Limited time" />)

        expect(screen.getByText("Limited time")).toBeInTheDocument()
    })

    it("should not render subtitle when not provided", () => {
        const { container } = render(<ProductOfferBanner image={buildImage()} title="Cyber Sale" />)

        expect(container.querySelector("p")).not.toBeInTheDocument()
    })

    it("should use title as image alt text", () => {
        render(<ProductOfferBanner image={buildImage()} title="Cyber Sale" />)

        expect(screen.getByTestId("asset-image")).toHaveAttribute("alt", "Cyber Sale")
    })
})
