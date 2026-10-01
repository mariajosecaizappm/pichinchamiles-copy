import { describe, it, expect } from "vitest"
import {
    getCampaignExperienceCardImage,
    getCampaignLandingUrl,
} from "@/presentation/pages/Offers/Activities/helpers"

describe("travelCampaigns helpers", () => {
    describe("getCampaignExperienceCardImage", () => {
        it("should remove s3 domain from image url", () => {
            const url = "https://bucket.s3.us-east-2.amazonaws.com/image.jpg"
            expect(getCampaignExperienceCardImage(url)).toBe("https://bucket/image.jpg")
        })
    })

    describe("getCampaignLandingUrl", () => {
        it("should build campaign landing url under ofertas/viajes-y-actividades", () => {
            expect(getCampaignLandingUrl("summer-deals")).toBe(
                "/ofertas/viajes-y-actividades/summer-deals",
            )
        })
    })
})
