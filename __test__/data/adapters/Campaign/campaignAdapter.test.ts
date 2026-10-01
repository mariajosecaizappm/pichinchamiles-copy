import {describe, it, expect} from "vitest"
import {getCampaignAdapter} from "@/data/adapters/Campaign/campaignAdapter"
import {CampaignType, CampaignStatus} from "@/domain/entity/Campaign/campaign"
import {MarketingPositions} from "@/domain/entity/Marketing/marketing"
import { AlgoliaHit } from "@/data/provider/algolia/types"

describe("getCampaignAdapter", () => {
    describe("Products Campaign", () => {
        it("should adapt a products campaign with all fields", () => {
            const hit = {
                id: "campaign-1",
                isOutstanding: true,
                positions: [{ name: MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS }],
                segmentCodes: ["premium", "gold"],
                slug: "producto-destacado",
                mainTitle: "Producto Destacado",
                secondaryTitle: "5000",
                hasLanding: true,
                desktopBannerImageUrl: "https://example.com/desktop.jpg",
                mobileBannerImageUrl: "https://example.com/mobile.jpg",
                shortDescription: "Descripción corta",
                longDescription: "Descripción larga",
                template: "template-1",
                numberElementsSlide: 3,
                order: 1,
                status: CampaignStatus.ACTIVE,
                priority: 5,
                campaignType: CampaignType.PRODUCTS,
                categories: ["electronics", "audio"],
                productIds: ["prod-1", "prod-2", "prod-3"],
                productsOrder: [],
            }

            const result = getCampaignAdapter(hit)

            expect(result).toEqual({
                id: "campaign-1",
                isOutstanding: true,
                positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
                segmentCodes: ["premium", "gold"],
                slug: "producto-destacado",
                mainTitle: "Producto Destacado",
                secondaryTitle: "5000",
                hasLanding: true,
                image: {
                    desktopUrl: "https://example.com/desktop.jpg",
                    mobileUrl: "https://example.com/mobile.jpg",
                },
                shortDescription: "Descripción corta",
                longDescription: "Descripción larga",
                template: "template-1",
                numberElementsSlide: 3,
                order: 1,
                status: CampaignStatus.ACTIVE,
                priority: 5,
                campaignType: CampaignType.PRODUCTS,
                categories: ["electronics", "audio"],
                productIds: ["prod-1", "prod-2", "prod-3"],
                priorityProducts: [],
            })
        })

        it("should handle priority products and filter them from productIds", () => {
            const hit = {
                id: "campaign-2",
                isOutstanding: false,
                positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
                segmentCodes: [],
                slug: "campaign-with-priority",
                mainTitle: "Campaign with Priority",
                hasLanding: false,
                desktopBannerImageUrl: "https://example.com/d.jpg",
                mobileBannerImageUrl: "https://example.com/m.jpg",
                numberElementsSlide: 3,
                order: 2,
                status: CampaignStatus.ACTIVE,
                priority: 0,
                campaignType: CampaignType.PRODUCTS,
                categories: [],
                productIds: ["prod-1", "prod-2", "prod-3", "prod-4"],
                productsOrder: [
                    {productId: "prod-1"},
                    {productId: "prod-3"},
                ],
            }

            const result = getCampaignAdapter(hit)

            expect(result.campaignType).toBe(CampaignType.PRODUCTS)
            if (result.campaignType === CampaignType.PRODUCTS) {
                expect(result.priorityProducts).toEqual(["prod-1", "prod-3"])
                expect(result.productIds).toEqual(["prod-2", "prod-4"])
            }
        })

        it("should handle productsOrder with invalid entries", () => {
            const hit = {
                id: "campaign-3",
                isOutstanding: false,
                positions: [],
                segmentCodes: [],
                slug: "test",
                mainTitle: "Test",
                hasLanding: false,
                desktopBannerImageUrl: "",
                mobileBannerImageUrl: "",
                numberElementsSlide: 3,
                order: 1,
                status: CampaignStatus.ACTIVE,
                priority: 0,
                campaignType: CampaignType.PRODUCTS,
                categories: [],
                productIds: ["prod-1", "prod-2"],
                productsOrder: [
                    {productId: "prod-1"},
                    "invalid-entry",
                    null,
                    {notProductId: "something"},
                ],
            }

            const result = getCampaignAdapter(hit)

            if (result.campaignType === CampaignType.PRODUCTS) {
                expect(result.priorityProducts).toEqual(["prod-1", "", "", ""])
                expect(result.productIds).toEqual(["prod-2"])
            }
        })

        it("should use empty array for priorityProducts when productsOrder is empty", () => {
            const hit = {
                id: "campaign-4",
                isOutstanding: false,
                positions: [],
                segmentCodes: [],
                slug: "test",
                mainTitle: "Test",
                hasLanding: false,
                desktopBannerImageUrl: "",
                mobileBannerImageUrl: "",
                numberElementsSlide: 3,
                order: 1,
                status: CampaignStatus.ACTIVE,
                priority: 0,
                campaignType: CampaignType.PRODUCTS,
                categories: [],
                productIds: ["prod-1", "prod-2"],
                productsOrder: [],
            }

            const result = getCampaignAdapter(hit)

            if (result.campaignType === CampaignType.PRODUCTS) {
                expect(result.priorityProducts).toEqual([])
                expect(result.productIds).toEqual(["prod-1", "prod-2"])
            }
        })
    })

    describe("Experience Campaign", () => {
        it("should adapt an experience campaign with all fields", () => {
            const hit = {
                id: "exp-1",
                isOutstanding: true,
                positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
                segmentCodes: ["vip"],
                slug: "experiencia-spa",
                mainTitle: "Experiencia Spa",
                secondaryTitle: "10000",
                hasLanding: true,
                desktopBannerImageUrl: "https://example.com/spa-d.jpg",
                mobileBannerImageUrl: "https://example.com/spa-m.jpg",
                shortDescription: "Relájate",
                longDescription: "Disfruta de un día de spa",
                template: "experience-template",
                numberElementsSlide: 2,
                order: 3,
                status: CampaignStatus.ACTIVE,
                priority: 10,
                campaignType: CampaignType.EXPERIENCES,
                campaignExperiences: [
                    {
                        name: "Spa Premium",
                        slug: "spa-premium",
                        address: "Av. Principal 123",
                        experience: "Masaje relajante",
                        description: "90 minutos de relajación",
                        pointsAmount: 8000,
                        validTo: "2024-12-31T23:59:59Z",
                        productUrl: "https://example.com/spa",
                        type: "national",
                        desktopImageUrl: "https://example.com/exp-d.jpg",
                        mobileImageUrl: "https://example.com/exp-m.jpg",
                    },
                ],
            }

            const result = getCampaignAdapter(hit)

            expect(result.campaignType).toBe(CampaignType.EXPERIENCES)
            if (result.campaignType === CampaignType.EXPERIENCES) {
                expect(result.experiences).toHaveLength(1)
                expect(result.experiences[0]).toEqual({
                    name: "Spa Premium",
                    slug: "spa-premium",
                    address: "Av. Principal 123",
                    experience: "Masaje relajante",
                    description: "90 minutos de relajación",
                    pointsAmount: 8000,
                    validTo: new Date("2024-12-31T23:59:59Z"),
                    url: "https://example.com/spa",
                    type: "national",
                    image: {
                        desktopUrl: "https://example.com/exp-d.jpg",
                        mobileUrl: "https://example.com/exp-m.jpg",
                    },
                })
            }
        })

        it("should handle multiple experiences", () => {
            const hit = {
                id: "exp-2",
                isOutstanding: false,
                positions: [],
                segmentCodes: [],
                slug: "multi-exp",
                mainTitle: "Multiple Experiences",
                hasLanding: false,
                desktopBannerImageUrl: "",
                mobileBannerImageUrl: "",
                numberElementsSlide: 3,
                order: 1,
                status: CampaignStatus.ACTIVE,
                priority: 0,
                campaignType: CampaignType.EXPERIENCES,
                campaignExperiences: [
                    {
                        name: "Experience 1",
                        slug: "exp-1",
                        address: "Address 1",
                        experience: "Exp 1",
                        description: "Desc 1",
                        pointsAmount: 5000,
                        validTo: "2024-06-30T23:59:59Z",
                        productUrl: "https://example.com/1",
                        type: "national",
                        desktopImageUrl: "d1.jpg",
                        mobileImageUrl: "m1.jpg",
                    },
                    {
                        name: "Experience 2",
                        slug: "exp-2",
                        address: "Address 2",
                        experience: "Exp 2",
                        description: "Desc 2",
                        pointsAmount: 7000,
                        validTo: "2024-07-31T23:59:59Z",
                        productUrl: "https://example.com/2",
                        type: "international",
                        desktopImageUrl: "d2.jpg",
                        mobileImageUrl: "m2.jpg",
                    },
                ],
            }

            const result = getCampaignAdapter(hit)

            if (result.campaignType === CampaignType.EXPERIENCES) {
                expect(result.experiences).toHaveLength(2)
                expect(result.experiences[0].name).toBe("Experience 1")
                expect(result.experiences[1].name).toBe("Experience 2")
            }
        })
    })

    describe("Edge cases", () => {
        it("should handle null or undefined input", () => {
            const result1 = getCampaignAdapter(null as unknown as AlgoliaHit)
            const result2 = getCampaignAdapter(undefined as unknown as AlgoliaHit)

            expect(result1.id).toBe("")
            expect(result2.id).toBe("")
        })

        it("should handle missing optional fields", () => {
            const hit = {
                id: "minimal",
                campaignType: CampaignType.PRODUCTS,
                productIds: [],
            }

            const result = getCampaignAdapter(hit)

            expect(result.id).toBe("minimal")
            expect(result.isOutstanding).toBe(false)
            expect(result.positions).toEqual([])
            expect(result.segmentCodes).toEqual([])
            expect(result.mainTitle).toBe("")
            expect(result.secondaryTitle).toBe("")
        })

        it("should default priority to 0 when not provided", () => {
            const hit = {
                id: "no-priority",
                campaignType: CampaignType.PRODUCTS,
                productIds: [],
            }

            const result = getCampaignAdapter(hit)

            expect(result.priority).toBe(0)
        })

        it("should handle empty arrays correctly", () => {
            const hit = {
                id: "empty-arrays",
                positions: [],
                segmentCodes: [],
                campaignType: CampaignType.PRODUCTS,
                categories: [],
                productIds: [],
                productsOrder: [],
            }

            const result = getCampaignAdapter(hit)

            expect(result.positions).toEqual([])
            expect(result.segmentCodes).toEqual([])
            if (result.campaignType === CampaignType.PRODUCTS) {
                expect(result.categories).toEqual([])
                expect(result.productIds).toEqual([])
                expect(result.priorityProducts).toEqual([])
            }
        })
    })
})
