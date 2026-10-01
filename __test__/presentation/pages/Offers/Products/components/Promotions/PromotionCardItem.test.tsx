import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { Banner } from "@/domain/entity/Banner/banner"

vi.mock("@/presentation/components/AssetImage", () => ({
    default: ({ alt, className }: { alt: string; className?: string }) => (
        <img data-testid="asset-image" alt={alt} className={className} />
    ),
}))

import PromotionCardItem from "@/presentation/pages/Offers/Products/components/Promotions/PromotionCardItem"

const mockBanner: Banner = {
    id: "banner-1",
    title: "Promo Title",
    subtitle: "",
    description: "Promo description",
    summary: "",
    link: "/ofertas/promo",
    textColor: "",
    isOutstanding: false,
    segmentCodes: [],
    positions: [],
    priority: 1,
    image: { desktopUrl: "/desktop.jpg", mobileUrl: "/mobile.jpg" },
    campaignId: "c-1",
}

describe("PromotionCardItem", () => {
    it("should render banner title and description", () => {
        render(<PromotionCardItem banner={mockBanner} />)

        expect(screen.getByText("Promo Title")).toBeInTheDocument()
        expect(screen.getByText("Promo description")).toBeInTheDocument()
    })

    it("should render link with banner url", () => {
        render(<PromotionCardItem banner={mockBanner} />)

        expect(screen.getByRole("link")).toHaveAttribute("href", "/ofertas/promo")
    })

    it("should preserve an absolute same-origin href", () => {
        const sameOriginBanner = {
            ...mockBanner,
            link: "https://www.pichinchamiles.com/ofertas/promo",
        }

        render(<PromotionCardItem banner={sameOriginBanner} />)

        expect(screen.getByRole("link")).toHaveAttribute(
            "href",
            "https://www.pichinchamiles.com/ofertas/promo",
        )
    })

    it("should preserve an external href", () => {
        const externalBanner = {
            ...mockBanner,
            link: "https://www.pichincha.com/promo",
        }

        render(<PromotionCardItem banner={externalBanner} />)

        expect(screen.getByRole("link")).toHaveAttribute(
            "href",
            "https://www.pichincha.com/promo",
        )
    })

    it("should render asset image with banner title as alt", () => {
        render(<PromotionCardItem banner={mockBanner} />)

        expect(screen.getByTestId("asset-image")).toHaveAttribute("alt", "Promo Title")
    })

    it("should truncate title when it exceeds 35 characters", () => {
        const longTitle = "A".repeat(36)

        render(<PromotionCardItem banner={{ ...mockBanner, title: longTitle }} />)

        expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(`${"A".repeat(35)}...`)
    })

    it("should not truncate title when it is 35 characters or less", () => {
        const title = "A".repeat(35)

        render(<PromotionCardItem banner={{ ...mockBanner, title }} />)

        expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(title)
    })

    it("should truncate description when it exceeds 104 characters", () => {
        const longDescription = "B".repeat(105)

        render(<PromotionCardItem banner={{ ...mockBanner, description: longDescription }} />)

        expect(screen.getByText(`${"B".repeat(104)}...`)).toBeInTheDocument()
    })

    it("should not truncate description when it is 104 characters or less", () => {
        const description = "B".repeat(104)

        render(<PromotionCardItem banner={{ ...mockBanner, description }} />)

        expect(screen.getByText(description)).toBeInTheDocument()
    })
})
