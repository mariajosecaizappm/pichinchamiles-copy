import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import OfferCampaignBannerTitle from "@/presentation/pages/Offers/Campaign/OfferCampaignBanner/OfferCampaignBannerTitle"

describe("OfferCampaignBannerTitle", () => {
    it("should render the campaign title as heading level 1", () => {
        render(<OfferCampaignBannerTitle title="Cyber Days" />)

        const heading = screen.getByRole("heading", { level: 1, name: "Cyber Days" })
        expect(heading).toBeInTheDocument()
        expect(heading).toHaveClass("typo-banner-title")
    })

    it("should render subtitle when provided", () => {
        render(<OfferCampaignBannerTitle title="Cyber Days" subtitle="Hasta 50% off" />)

        expect(screen.getByText("Hasta 50% off")).toBeInTheDocument()
        expect(screen.getByText("Hasta 50% off")).toHaveClass("typo-banner-subtitle")
    })

    it("should not render subtitle when empty", () => {
        render(<OfferCampaignBannerTitle title="Cyber Days" />)

        expect(screen.queryByText("Hasta 50% off")).not.toBeInTheDocument()
    })
})
