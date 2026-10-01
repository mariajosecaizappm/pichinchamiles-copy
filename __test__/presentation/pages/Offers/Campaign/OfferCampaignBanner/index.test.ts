import { describe, expect, it } from "vitest"
import OfferCampaignBanner from "@/presentation/pages/Offers/Campaign/OfferCampaignBanner"
import OfferCampaignBannerView from "@/presentation/pages/Offers/Campaign/OfferCampaignBanner/OfferCampaignBanner"

describe("OfferCampaignBanner index", () => {
    it("should re-export OfferCampaignBanner as default", () => {
        expect(OfferCampaignBanner).toBe(OfferCampaignBannerView)
    })
})
