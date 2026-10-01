import { describe, it, expect } from "vitest"
import { getCampaignExperienceCardImage } from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/TravelDeals/helpers"

describe("getCampaignExperienceCardImage", () => {
    it("should remove .s3.us-east-2.amazonaws.com from url", () => {
        const url = "https://bucket.s3.us-east-2.amazonaws.com/image.jpg"
        expect(getCampaignExperienceCardImage(url)).toBe("https://bucket/image.jpg")
    })

    it("should remove .s3.us-east-1.amazonaws.com from url", () => {
        const url = "https://bucket.s3.us-east-1.amazonaws.com/image.jpg"
        expect(getCampaignExperienceCardImage(url)).toBe("https://bucket/image.jpg")
    })

    it("should return the url unchanged when no s3 subdomain is present", () => {
        const url = "https://cdn.example.com/image.jpg"
        expect(getCampaignExperienceCardImage(url)).toBe("https://cdn.example.com/image.jpg")
    })

    it("should handle empty string", () => {
        expect(getCampaignExperienceCardImage("")).toBe("")
    })
})
