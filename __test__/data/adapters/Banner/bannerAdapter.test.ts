import {describe, it, expect} from "vitest"
import {getBannerAdapter} from "@/data/adapters/Banner/bannerAdapter"
import {MarketingPositions} from "@/domain/entity/Marketing/marketing"

describe("bannerAdapter", () => {
    describe("when getBannerAdapter receives a valid hit", () => {
        it("should map all fields correctly", () => {
            const hit = {
                id: "banner-1",
                title: "Acumula Millas",
                subtitle: "Gana hasta 5x millas",
                description: "Compra en nuestros aliados",
                summary: "Promoción especial",
                link: "/promotions",
                priority: 1,
                textColor: "#FFFFFF",
                isOutstanding: true,
                segmentCodes: ["premium", "gold"],
                positions: [
                    {
                        name: MarketingPositions.HOME_NOT_LOGGED_MAIN_CAROUSEL,
                        positionId: "pos-1",
                    },
                ],
                callToAction: "Ver más",
                desktopBackgroundImageUrl: "https://example.com/desktop.jpg",
                mobileBackgroundImageUrl: "https://example.com/mobile.jpg",
                campaignId: "camp-1",
                componentType: "",
                objectID: "banner-1",
                programId: "prog-1",
                status: true,
            }

            const result = getBannerAdapter(hit)

            expect(result).toEqual({
                id: "banner-1",
                title: "Acumula Millas",
                subtitle: "Gana hasta 5x millas",
                description: "Compra en nuestros aliados",
                summary: "Promoción especial",
                link: "/promotions",
                priority: 1,
                textColor: "#FFFFFF",
                isOutstanding: true,
                segmentCodes: ["premium", "gold"],
                positions: [MarketingPositions.HOME_NOT_LOGGED_MAIN_CAROUSEL],
                linkText: "Ver más",
                image: {
                    desktopUrl: "https://example.com/desktop.jpg",
                    mobileUrl: "https://example.com/mobile.jpg",
                },
                campaignId: "camp-1",
            })
        })

        it("should map multiple positions extracting name property", () => {
            const hit = {
                id: "banner-2",
                title: "",
                subtitle: "",
                description: "",
                summary: "",
                link: "",
                priority: 2,
                textColor: "",
                isOutstanding: false,
                segmentCodes: [],
                positions: [
                    { name: MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_BANNER_OFFERS, positionId: "1" },
                    { name: MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_OFFERS, positionId: "2" },
                ],
                callToAction: "",
                desktopBackgroundImageUrl: "",
                mobileBackgroundImageUrl: "",
                campaignId: "",
                componentType: "",
                objectID: "banner-2",
                programId: "",
                status: false,
            }

            const result = getBannerAdapter(hit)

            expect(result.positions).toEqual([
                MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_BANNER_OFFERS,
                MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_OFFERS,
            ])
        })
    })

    describe("when getBannerAdapter receives a hit with empty values", () => {
        it("should pass through empty strings and empty arrays as-is", () => {
            const hit = {
                id: "",
                title: "",
                subtitle: "",
                description: "",
                summary: "",
                link: "",
                priority: 0,
                textColor: "",
                isOutstanding: false,
                segmentCodes: [],
                positions: [],
                callToAction: "",
                desktopBackgroundImageUrl: "",
                mobileBackgroundImageUrl: "",
                campaignId: "",
                componentType: "",
                objectID: "",
                programId: "",
                status: false,
            }

            const result = getBannerAdapter(hit)

            expect(result).toEqual({
                id: "",
                title: "",
                subtitle: "",
                description: "",
                summary: "",
                link: "",
                priority: 0,
                textColor: "",
                isOutstanding: false,
                segmentCodes: [],
                positions: [],
                linkText: "",
                image: {
                    desktopUrl: "",
                    mobileUrl: "",
                },
                campaignId: "",
            })
        })
    })
})
