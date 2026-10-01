import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import "@testing-library/jest-dom"

const mockUseIsDesktop = vi.fn()

vi.mock("@/presentation/hooks/useIsDesktop", () => ({
    default: () => mockUseIsDesktop(),
}))

vi.mock("@/presentation/components/AssetImage", () => ({
    default: ({ alt, className }: { alt: string; className?: string }) => (
        <img data-testid="asset-image" alt={alt} className={className} />
    ),
}))

import OffersBanner from "@/presentation/pages/Offers/components/banner/OffersBanner"
import { Banner } from "@/domain/entity/Banner/banner"

const mockBanner: Banner = {
    id: "banner-1",
    title: "Gran Oferta",
    subtitle: "Solo por hoy",
    description: "",
    summary: "",
    link: "",
    textColor: "",
    isOutstanding: false,
    segmentCodes: [],
    positions: [],
    priority: 1,
    image: { desktopUrl: "/desktop.jpg", mobileUrl: "/mobile.jpg" },
    campaignId: "c-1",
}

describe("OffersBanner", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockUseIsDesktop.mockReturnValue({ isDesktop: false })
    })

    it("should render the banner title", () => {
        render(<OffersBanner banner={mockBanner} />)

        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Gran Oferta")
    })

    it("should render subtitle when present", () => {
        render(<OffersBanner banner={mockBanner} />)

        expect(screen.getByText("Solo por hoy")).toBeInTheDocument()
    })

    it("should not render subtitle when absent", () => {
        const bannerNoSubtitle: Banner = { ...mockBanner, subtitle: "" }

        render(<OffersBanner banner={bannerNoSubtitle} />)

        expect(screen.queryByText("Solo por hoy")).not.toBeInTheDocument()
    })

    it("should render the AssetImage with correct alt", () => {
        render(<OffersBanner banner={mockBanner} />)

        expect(screen.getByTestId("asset-image")).toHaveAttribute("alt", "Gran Oferta")
    })

    it("should render gradient overlay div", () => {
        const { container } = render(<OffersBanner banner={mockBanner} />)

        const overlay = container.querySelector(".absolute.inset-0")
        expect(overlay).toBeInTheDocument()
        expect((overlay as HTMLElement).style.background).toContain("linear-gradient")
    })

    it("should render AssetImage with full cover classes", () => {
        render(<OffersBanner banner={mockBanner} />)

        expect(screen.getByTestId("asset-image")).toHaveClass("w-full", "h-full", "object-cover")
    })

    it("should pass desktop dimensions when isDesktop is true", () => {
        mockUseIsDesktop.mockReturnValue({ isDesktop: true })

        render(<OffersBanner banner={mockBanner} />)

        expect(screen.getByTestId("asset-image")).toBeInTheDocument()
    })
})
