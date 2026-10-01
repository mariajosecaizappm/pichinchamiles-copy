import { describe, it, expect } from "vitest"
import { Banner } from "@/domain/entity/Banner/banner"
import { getFeaturedBannerCardFields } from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Featured/utils"

const createBanner = (overrides: Partial<Banner> = {}): Banner => ({
    id: "b1",
    title: "Item 1",
    subtitle: "Tag",
    description: "Miami, Florida",
    summary: "10000",
    link: "/item-1",
    textColor: "",
    isOutstanding: false,
    segmentCodes: [],
    positions: [],
    priority: 1,
    image: { desktopUrl: "", mobileUrl: "" },
    campaignId: "",
    ...overrides,
})

describe("getFeaturedBannerCardFields", () => {
    it("maps legacy banners with numeric summary as miles and description as address", () => {
        expect(getFeaturedBannerCardFields(createBanner({
            summary: "31166",
            description: "Colombia",
        }))).toEqual({
            address: "Colombia",
            points: 31166,
        })
    })

    it("maps ticket convention with summary as address and description as miles", () => {
        expect(getFeaturedBannerCardFields(createBanner({
            summary: "QATestQuito",
            description: "31166",
        }))).toEqual({
            address: "QATestQuito",
            points: 31166,
        })
    })

    it("uses summary as address and zero points when description is not numeric", () => {
        expect(getFeaturedBannerCardFields(createBanner({
            summary: "Quito",
            description: "Colombia",
        }))).toEqual({
            address: "Quito",
            points: 0,
        })
    })

    it("trims whitespace before mapping fields", () => {
        expect(getFeaturedBannerCardFields(createBanner({
            summary: "  25000  ",
            description: "  Medellín  ",
        }))).toEqual({
            address: "Medellín",
            points: 25000,
        })
    })

    it("returns undefined address when legacy description is empty", () => {
        expect(getFeaturedBannerCardFields(createBanner({
            summary: "10000",
            description: "",
        }))).toEqual({
            address: undefined,
            points: 10000,
        })
    })

    it("returns undefined address when ticket-convention summary is empty", () => {
        expect(getFeaturedBannerCardFields(createBanner({
            summary: "",
            description: "15000",
        }))).toEqual({
            address: undefined,
            points: 15000,
        })
    })

    it("returns zero points when both fields are empty", () => {
        expect(getFeaturedBannerCardFields(createBanner({
            summary: "",
            description: "",
        }))).toEqual({
            address: undefined,
            points: 0,
        })
    })

    it("treats whitespace-only summary as empty and uses description as miles", () => {
        expect(getFeaturedBannerCardFields(createBanner({
            summary: "   ",
            description: "8000",
        }))).toEqual({
            address: undefined,
            points: 8000,
        })
    })
})
