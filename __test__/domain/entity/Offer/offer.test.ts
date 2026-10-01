import { describe, it, expect } from "vitest"
import { Banner } from "@/domain/entity/Banner/banner"
import { ProductsCampaign, ExperienceCampaign } from "@/domain/entity/Campaign/campaign"
import { Product } from "@/domain/entity/Product/product"
import type { ProductOffer, ActivityOffer } from "@/domain/entity/Offer/offer"

const buildBanner = (id: string): Banner => ({
    id,
    title: `Banner ${id}`,
    subtitle: "",
    description: "",
    summary: "",
    link: "",
    textColor: "",
    isOutstanding: false,
    segmentCodes: [],
    positions: [],
    priority: 1,
    image: { desktopUrl: "", mobileUrl: "" },
    campaignId: "",
})

describe("Offer entity types", () => {
    describe("ProductOffer type", () => {
        it("should satisfy the shape with banner, campaign and products", () => {
            const offer: ProductOffer = {
                banner: buildBanner("b-1"),
                campaign: {
                    id: "c-1",
                    isOutstanding: false,
                    positions: [],
                    segmentCodes: [],
                    slug: "campaign",
                    mainTitle: "Campaign",
                    hasLanding: false,
                    image: { alt: "", assetUrl: "" },
                    numberElementsSlide: 1,
                    order: 1,
                    status: "active" as never,
                    priority: 1,
                    campaignType: "products" as never,
                    categories: [],
                    productIds: ["p-1", "p-2"],
                    priorityProducts: ["p-1"],
                } as ProductsCampaign,
                products: [
                    {
                        id: "p-1",
                        name: "Product 1",
                        shortDescription: "",
                        longDescription: "",
                        stock: 10,
                        prices: { pointsPrice: 0, coinPrice: 0, regularPrice: 0, currencySymbol: "" },
                        assets: [],
                        categories: [],
                        brand: { id: "b", name: "Brand" },
                        variations: [],
                        status: "active",
                    } as Product,
                ],
            }

            expect(offer.banner.id).toBe("b-1")
            expect(offer.campaign.campaignType).toBe("products")
            expect(offer.products[0].id).toBe("p-1")
        })
    })

    describe("ActivityOffer type", () => {
        it("should satisfy the shape with banner and campaign", () => {
            const offer: ActivityOffer = {
                banner: buildBanner("b-2"),
                campaign: {
                    id: "c-2",
                    isOutstanding: false,
                    positions: [],
                    segmentCodes: [],
                    slug: "experience-campaign",
                    mainTitle: "Experience",
                    hasLanding: false,
                    image: { alt: "", assetUrl: "" },
                    numberElementsSlide: 1,
                    order: 1,
                    status: "active" as never,
                    priority: 1,
                    campaignType: "experiences" as never,
                    experiences: [
                        {
                            name: "Skydiving",
                            slug: "skydiving",
                            address: "",
                            experience: "",
                            description: "",
                            validTo: new Date("2026-12-31"),
                            url: "",
                            type: "national" as never,
                            image: { alt: "", assetUrl: "" },
                        },
                    ],
                } as ExperienceCampaign,
            }

            expect(offer.banner.id).toBe("b-2")
            expect(offer.campaign.campaignType).toBe("experiences")
            expect(offer.campaign.experiences[0].name).toBe("Skydiving")
        })
    })
})
