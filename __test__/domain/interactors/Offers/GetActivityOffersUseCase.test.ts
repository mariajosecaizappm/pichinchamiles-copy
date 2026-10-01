import { describe, it, expect, vi, beforeEach } from "vitest"
import type IBannerRepository from "@/domain/repository/Banner/IBannerRepository"
import type ICampaignRepository from "@/domain/repository/Campaign/ICampaignRepository"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"
import { CampaignType } from "@/domain/entity/Campaign/campaign"
import GetActivityOffersUseCase from "@/domain/interactors/Offers/GetActivityOffersUseCase"

const BANNER_POSITIONS = [
    MarketingPositions.OFFERS_AUTH_MAIN_BANNER_ACTIVITIES,
    MarketingPositions.OFFERS_GUEST_MAIN_BANNER_ACTIVITIES,
    MarketingPositions.OFFERS_AUTH_BANNER_PROMOTIONAL_ACTIVITIES,
    MarketingPositions.OFFERS_GUEST_BANNER_PROMOTIONAL_ACTIVITIES,
    MarketingPositions.HOME_UV_AUTH_OFFERS,
    MarketingPositions.HOME_UV_GUEST_OFFERS,
]

const CAMPAIGN_POSITIONS = [
    MarketingPositions.HOME_UV_AUTH_OFFERS,
    MarketingPositions.HOME_UV_GUEST_OFFERS,
]

const makeBanner = (opts: { id: string; campaignId?: string; positions?: MarketingPositions[] }) => ({
    id: opts.id,
    title: "",
    subtitle: "",
    description: "",
    summary: "",
    link: "",
    priority: 1,
    textColor: "",
    isOutstanding: false,
    segmentCodes: [],
    positions: opts.positions ?? [MarketingPositions.OFFERS_AUTH_MAIN_BANNER_ACTIVITIES],
    linkText: "",
    image: { desktopUrl: "", mobileUrl: "" },
    campaignId: opts.campaignId ?? "",
})

const makeCampaign = (opts: { id: string; positions?: MarketingPositions[] }) => ({
    id: opts.id,
    isOutstanding: false,
    positions: opts.positions ?? [MarketingPositions.HOME_UV_AUTH_OFFERS],
    segmentCodes: [],
    slug: `experience-${opts.id}`,
    mainTitle: `Experience ${opts.id}`,
    hasLanding: false,
    image: { alt: "", assetUrl: "" },
    numberElementsSlide: 1,
    order: 1,
    status: "active" as never,
    priority: 1,
    campaignType: CampaignType.EXPERIENCES,
    experiences: [
        {
            name: "E1",
            slug: "e1",
            address: "",
            experience: "",
            description: "",
            validTo: new Date("2026-12-31"),
            url: "",
            type: "national" as never,
            image: { alt: "", assetUrl: "" },
        },
    ],
})

const pagination = { page: 1, pageSize: 50, total: 0, totalPages: 0 }

describe("GetActivityOffersUseCase", () => {
    let bannerRepository: IBannerRepository
    let campaignRepository: ICampaignRepository
    let useCase: GetActivityOffersUseCase

    beforeEach(() => {
        bannerRepository = { getBanners: vi.fn() } as unknown as IBannerRepository
        campaignRepository = { getCampaigns: vi.fn() } as unknown as ICampaignRepository
        useCase = new GetActivityOffersUseCase(bannerRepository, campaignRepository)
    })

    it("should request banners with activities-related positions", async () => {
        vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: [], pagination })
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: [], pagination })

        await useCase.getActivityOffers()

        expect(bannerRepository.getBanners).toHaveBeenCalledWith({
            positions: BANNER_POSITIONS,
            page: 1,
            pageSize: 50,
        })
    })

    it("should request campaigns with experience positions and EXPERIENCES type", async () => {
        vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: [], pagination })
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: [], pagination })

        await useCase.getActivityOffers()

        expect(campaignRepository.getCampaigns).toHaveBeenCalledWith({
            positions: CAMPAIGN_POSITIONS,
            campaignType: CampaignType.EXPERIENCES,
            pageSize: 50,
            page: 1,
        })
    })

    it("should build offers pairing campaign with its banner by campaignId", async () => {
        const campaigns = [
            makeCampaign({ id: "exp-1" }),
            makeCampaign({ id: "exp-2" }),
        ]
        const banners = [
            makeBanner({ id: "b-exp1", campaignId: "exp-1", positions: [MarketingPositions.HOME_UV_AUTH_OFFERS] }),
            makeBanner({ id: "b-exp2", campaignId: "exp-2", positions: [MarketingPositions.HOME_UV_AUTH_OFFERS] }),
        ]

        vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: { ...pagination, total: banners.length } })
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: { ...pagination, total: campaigns.length } })

        const result = await useCase.getActivityOffers()

        expect(result.offers).toHaveLength(2)
        expect(result.offers[0].campaign.id).toBe("exp-1")
        expect(result.offers[0].banner.id).toBe("b-exp1")
        expect(result.offers[1].campaign.id).toBe("exp-2")
        expect(result.offers[1].banner.id).toBe("b-exp2")
    })

    it("should filter out HOME_UV_*_OFFERS banners from returned banners", async () => {
        const banners = [
            makeBanner({ id: "b-main", campaignId: "", positions: [MarketingPositions.OFFERS_AUTH_MAIN_BANNER_ACTIVITIES] }),
            makeBanner({ id: "b-promo", campaignId: "", positions: [MarketingPositions.OFFERS_AUTH_BANNER_PROMOTIONAL_ACTIVITIES] }),
            makeBanner({ id: "b-auth", campaignId: "c1", positions: [MarketingPositions.HOME_UV_AUTH_OFFERS] }),
            makeBanner({ id: "b-guest", campaignId: "c2", positions: [MarketingPositions.HOME_UV_GUEST_OFFERS] }),
        ]

        vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: { ...pagination, total: banners.length } })
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: [], pagination })

        const result = await useCase.getActivityOffers()

        expect(result.banners.map(b => b.id)).toEqual(["b-main", "b-promo"])
    })
})
