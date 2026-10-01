import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Asset } from "@/domain/entity/Asset/asset"

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

import OfferCampaignBanner from "@/presentation/pages/Offers/Campaign/OfferCampaignBanner/OfferCampaignBanner"

const buildAsset = (overrides: Partial<Asset> = {}): Asset => ({
    desktopUrl: "https://bucket.s3.us-east-2.amazonaws.com/banner.jpg",
    mobileUrl: "https://bucket.s3.us-east-2.amazonaws.com/banner-mobile.jpg",
    ...overrides,
})

describe("OfferCampaignBanner", () => {
    it("should render banner image and title", () => {
        render(<OfferCampaignBanner image={buildAsset()} title="Cyber Days" />)

        expect(screen.getByRole("heading", { level: 1, name: "Cyber Days" })).toBeInTheDocument()
        expect(screen.getByTestId("asset-image")).toHaveAttribute("alt", "Cyber Days")
        expect(screen.getByTestId("asset-image")).toHaveAttribute("data-width", "1320")
        expect(screen.getByTestId("asset-image")).toHaveAttribute("data-height", "320")
        expect(screen.getByTestId("asset-image")).toHaveClass(
            "absolute",
            "inset-0",
            "h-full",
            "w-full",
            "object-cover",
        )
    })

    it("should render subtitle when provided", () => {
        render(<OfferCampaignBanner image={buildAsset()} title="Cyber Days" subtitle="Hasta 50% off" />)

        expect(screen.getByText("Hasta 50% off")).toBeInTheDocument()
    })

    it("should not render subtitle when omitted", () => {
        render(<OfferCampaignBanner image={buildAsset()} title="Cyber Days" />)

        expect(screen.queryByText("Hasta 50% off")).not.toBeInTheDocument()
    })
})
