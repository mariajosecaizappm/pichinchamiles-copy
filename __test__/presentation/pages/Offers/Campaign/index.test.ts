import { describe, expect, it } from "vitest"
import CampaignIndex from "@/presentation/pages/Offers/Campaign"
import OfferCampaignLandingContainer from "@/presentation/pages/Offers/Campaign/OfferCampaignLandingContainer"

describe("Offers Campaign index", () => {
    it("should re-export OfferCampaignLandingContainer as default", () => {
        expect(CampaignIndex).toBe(OfferCampaignLandingContainer)
    })
})
