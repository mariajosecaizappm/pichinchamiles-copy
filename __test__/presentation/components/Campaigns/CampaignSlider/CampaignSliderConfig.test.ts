import { describe, it, expect } from "vitest"
import {
    CampaignType,
    CampaignStatus,
    ExperienceCampaignBanner,
    ProductsCampaignBanner,
} from "@/domain/entity/Campaign/campaign"
import { getCampaignHref, isExperienceOffer } from "@/presentation/components/Campaigns/CampaignSlider/CampaignSliderConfig"

const baseExperienceOffer: ExperienceCampaignBanner = {
    banner: {
        id: "b1",
        title: "Banner",
        subtitle: "",
        description: "",
        summary: "",
        link: "/link",
        linkText: "Ver",
        textColor: "",
        isOutstanding: false,
        segmentCodes: [],
        positions: [],
        priority: 1,
        image: { desktopUrl: "/d.jpg", mobileUrl: "/m.jpg" },
        campaignId: "c1",
    },
    campaign: {
        id: "c1",
        mainTitle: "My Campaign",
        slug: "my-campaign",
        shortDescription: "",
        isOutstanding: false,
        positions: [],
        segmentCodes: [],
        hasLanding: true,
        image: { desktopUrl: "", mobileUrl: "" },
        numberElementsSlide: 1,
        order: 1,
        status: CampaignStatus.ACTIVE,
        priority: 1,
        campaignType: CampaignType.EXPERIENCES,
        experiences: [],
    },
    experiences: [],
}

const baseProductOffer: ProductsCampaignBanner = {
    banner: baseExperienceOffer.banner,
    campaign: {
        id: "cp1",
        mainTitle: "Top Products",
        slug: "top-products",
        shortDescription: "",
        isOutstanding: false,
        positions: [],
        segmentCodes: [],
        hasLanding: true,
        image: { desktopUrl: "", mobileUrl: "" },
        numberElementsSlide: 1,
        order: 1,
        status: CampaignStatus.ACTIVE,
        priority: 1,
        campaignType: CampaignType.PRODUCTS,
        categories: [],
        productIds: [],
        priorityProducts: [],
    },
    products: [],
}

describe("CampaignSliderConfig", () => {
    describe("isExperienceOffer", () => {
        it("should return true for experience offer", () => {
            expect(isExperienceOffer(baseExperienceOffer)).toBe(true)
        })

        it("should return false for product offer", () => {
            expect(isExperienceOffer(baseProductOffer)).toBe(false)
        })
    })

    describe("getCampaignHref", () => {
        it("should return travel-and-activities path for experience offer", () => {
            expect(getCampaignHref(baseExperienceOffer)).toBe("/ofertas/viajes-y-actividades/my-campaign")
        })

        it("should return products path for product offer", () => {
            expect(getCampaignHref(baseProductOffer)).toBe("/ofertas/productos/top-products")
        })

        it("should include the campaign slug in the href", () => {
            const offer: ExperienceCampaignBanner = {
                ...baseExperienceOffer,
                campaign: { ...baseExperienceOffer.campaign, slug: "summer-adventures" },
            }

            expect(getCampaignHref(offer)).toBe("/ofertas/viajes-y-actividades/summer-adventures")
        })
    })
})
