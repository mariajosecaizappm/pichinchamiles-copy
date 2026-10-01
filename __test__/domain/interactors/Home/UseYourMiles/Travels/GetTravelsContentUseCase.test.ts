import { describe, it, expect, vi, beforeEach } from "vitest"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"
import { CampaignType, CampaignStatus } from "@/domain/entity/Campaign/campaign"
import { BannerCategory } from "@/domain/entity/Banner/banner"
import type { ExperienceCampaign } from "@/domain/entity/Campaign/campaign"
import type { Banner } from "@/domain/entity/Banner/banner"
import type IBannerRepository from "@/domain/repository/Banner/IBannerRepository"
import type ICampaignRepository from "@/domain/repository/Campaign/ICampaignRepository"
import GetTravelsContentUseCase from "@/domain/interactors/Home/UseYourMiles/Travels/GetTravelsContentUseCase"


const emptyPagination = { page: 1, pageSize: 10, total: 0, totalPages: 0 }

const buildBanner = (overrides: Partial<Banner> = {}): Banner => ({
    id: "ban-1",
    title: "Banner",
    subtitle: "",
    description: "",
    summary: "",
    link: "#",
    textColor: "",
    isOutstanding: false,
    segmentCodes: [],
    positions: [],
    priority: 1,
    image: { desktopUrl: "", mobileUrl: "" },
    campaignId: "",
    ...overrides,
})

const buildExperienceCampaign = (overrides: Partial<ExperienceCampaign> & { id: string }): ExperienceCampaign => ({
    mainTitle: "Campaign",
    slug: "campaign",
    isOutstanding: false,
    positions: [],
    segmentCodes: [],
    hasLanding: false,
    image: { desktopUrl: "", mobileUrl: "" },
    numberElementsSlide: 1,
    order: 1,
    status: CampaignStatus.ACTIVE,
    priority: 1,
    campaignType: CampaignType.EXPERIENCES,
    experiences: [],
    ...overrides,
})

describe("GetTravelsContentUseCase", () => {
    let bannerRepository: IBannerRepository
    let campaignRepository: ICampaignRepository
    let useCase: GetTravelsContentUseCase

    beforeEach(() => {
        bannerRepository = { getBanners: vi.fn() } as unknown as IBannerRepository
        campaignRepository = { getCampaigns: vi.fn() } as unknown as ICampaignRepository

        useCase = new GetTravelsContentUseCase(
            bannerRepository,
            campaignRepository,
        )
    })

    describe("getTopBanners", () => {
        it("should request both guest and auth positions in a single call", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: [], pagination: emptyPagination })

            await useCase.getTopBanners()

            expect(bannerRepository.getBanners).toHaveBeenCalledTimes(1)
            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                positions: [MarketingPositions.HOME_UV_AUTH_BANNER_TOP, MarketingPositions.HOME_UV_GUEST_BANNER_TOP],
                page: 1,
                pageSize: 20,
            })
        })

        it("should return banner list", async () => {
            const banners = [buildBanner({ id: "b1" }), buildBanner({ id: "b2" })]
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({
                data: banners,
                pagination: { ...emptyPagination, total: 2 },
            })

            const result = await useCase.getTopBanners()
            expect(result.data).toHaveLength(2)
        })

        it("should propagate errors from bannerRepository", async () => {
            vi.mocked(bannerRepository.getBanners).mockRejectedValue(new Error("Banner error"))

            await expect(useCase.getTopBanners()).rejects.toThrow("Banner error")
        })
    })

    describe("getRecommendedItems", () => {
        it("should request both guest and auth positions in a single call", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: [], pagination: emptyPagination })

            await useCase.getRecommendedItems({ category: BannerCategory.UV_FLIGHTS })

            expect(bannerRepository.getBanners).toHaveBeenCalledTimes(1)
            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                category: [BannerCategory.UV_FLIGHTS],
                positions: [MarketingPositions.HOME_UV_AUTH_RECOMMENDED_ITEMS, MarketingPositions.HOME_UV_GUEST_RECOMMENDED_ITEMS],
                page: 1,
                pageSize: 8,
                isOutstanding: true,
            })
        })

        it("should propagate errors from repository", async () => {
            vi.mocked(bannerRepository.getBanners).mockRejectedValue(new Error("Repo error"))

            await expect(useCase.getRecommendedItems({ category: BannerCategory.UV_FLIGHTS })).rejects.toThrow("Repo error")
        })
    })

    describe("getOffers", () => {
        it("should request both guest and auth positions in a single call", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: [], pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: [], pagination: emptyPagination })

            await useCase.getOffers()

            expect(bannerRepository.getBanners).toHaveBeenCalledTimes(1)
            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                positions: [MarketingPositions.HOME_UV_AUTH_OFFERS, MarketingPositions.HOME_UV_GUEST_OFFERS],
                page: 1,
                pageSize: 10,
            })
        })

        it("should call campaignRepository with banner campaignIds", async () => {
            const banners = [buildBanner({ id: "ban-1", campaignId: "c-1" })]
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: [], pagination: emptyPagination })

            await useCase.getOffers()

            expect(campaignRepository.getCampaigns).toHaveBeenCalledTimes(1)
            expect(campaignRepository.getCampaigns).toHaveBeenCalledWith({
                id: ["c-1"],
                positions: [MarketingPositions.HOME_UV_AUTH_OFFERS, MarketingPositions.HOME_UV_GUEST_OFFERS],
                campaignType: CampaignType.EXPERIENCES,
                pageSize: 10,
                page: 1,
            })
        })

        it("should return experience campaign banners for active campaigns with experiences", async () => {
            const banners = [buildBanner({ id: "ban-1", campaignId: "c-1", priority: 1 })]
            const campaigns = [
                buildExperienceCampaign({
                    id: "c-1",
                    status: CampaignStatus.ACTIVE,
                    experiences: [{ name: "Spa", slug: "spa", address: "", experience: "", description: "", url: "", type: "national" as never, image: { desktopUrl: "", mobileUrl: "" }, validTo: new Date() }],
                }),
            ]
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })

            const result = await useCase.getOffers()

            expect(result).toHaveLength(1)
            expect(result[0].banner.id).toBe("ban-1")
            expect(result[0].experiences).toHaveLength(1)
        })

        it("should exclude inactive campaigns", async () => {
            const banners = [buildBanner({ id: "ban-1", campaignId: "c-1" })]
            const campaigns = [
                buildExperienceCampaign({ id: "c-1", status: CampaignStatus.INACTIVE, experiences: [{ name: "Spa", slug: "spa", address: "", experience: "", description: "", url: "", type: "national" as never, image: { desktopUrl: "", mobileUrl: "" }, validTo: new Date() }] }),
            ]
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })

            const result = await useCase.getOffers()

            expect(result).toHaveLength(0)
        })

        it("should exclude campaigns with no experiences", async () => {
            const banners = [buildBanner({ id: "ban-1", campaignId: "c-1" })]
            const campaigns = [
                buildExperienceCampaign({ id: "c-1", status: CampaignStatus.ACTIVE, experiences: [] }),
            ]
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })

            const result = await useCase.getOffers()

            expect(result).toHaveLength(0)
        })

        it("should limit experiences to 12 per campaign", async () => {
            const experiences = Array.from({ length: 15 }, (_, i) => ({
                name: `Exp ${i}`, slug: `exp-${i}`, address: "", experience: "", description: "", url: "", type: "national" as never, image: { desktopUrl: "", mobileUrl: "" }, validTo: new Date(),
            }))
            const banners = [buildBanner({ id: "ban-1", campaignId: "c-1" })]
            const campaigns = [buildExperienceCampaign({ id: "c-1", experiences })]

            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })

            const result = await useCase.getOffers()

            expect(result[0].experiences).toHaveLength(12)
        })

        it("should sort results by banner priority ascending", async () => {
            const exp = [{ name: "E", slug: "e", address: "", experience: "", description: "", url: "", type: "national" as never, image: { desktopUrl: "", mobileUrl: "" }, validTo: new Date() }]
            const banners = [
                buildBanner({ id: "ban-2", campaignId: "c-2", priority: 2 }),
                buildBanner({ id: "ban-1", campaignId: "c-1", priority: 1 }),
            ]
            const campaigns = [
                buildExperienceCampaign({ id: "c-1", experiences: exp }),
                buildExperienceCampaign({ id: "c-2", experiences: exp }),
            ]

            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })

            const result = await useCase.getOffers()

            expect(result[0].banner.id).toBe("ban-1")
            expect(result[1].banner.id).toBe("ban-2")
        })

        it("should exclude hidden travel campaigns", async () => {
            const exp = [{ name: "E", slug: "e", address: "", experience: "", description: "", url: "", type: "national" as never, image: { desktopUrl: "", mobileUrl: "" }, validTo: new Date() }]
            const banners = [buildBanner({ id: "ban-1", campaignId: "c-1" })]
            const campaigns = [
                buildExperienceCampaign({
                    id: "c-1",
                    positions: [MarketingPositions.OFFERS_HIDDEN_TRAVEL_CAMPAIGN],
                    experiences: exp,
                }),
            ]

            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })

            const result = await useCase.getOffers()

            expect(result).toHaveLength(0)
        })

        it("should return empty array when no banners exist", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: [], pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: [], pagination: emptyPagination })

            const result = await useCase.getOffers()

            expect(result).toHaveLength(0)
        })

        it("should skip banners without campaignId", async () => {
            const banners = [buildBanner({ id: "ban-1", campaignId: "" })]
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: [], pagination: emptyPagination })

            const result = await useCase.getOffers()

            expect(result).toHaveLength(0)
        })
    })

    describe("getBodyBanners", () => {
        it("should request both guest and auth positions in a single call", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: [], pagination: emptyPagination })

            await useCase.getBodyBanners()

            expect(bannerRepository.getBanners).toHaveBeenCalledTimes(1)
            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                positions: [MarketingPositions.HOME_UV_AUTH_BODY_BANNERS, MarketingPositions.HOME_UV_GUEST_BODY_BANNERS],
                page: 1,
                pageSize: 6,
            })
        })

        it("should return banner list", async () => {
            const banners = [buildBanner({ id: "bb-1" })]
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({
                data: banners,
                pagination: { ...emptyPagination, total: 1 },
            })

            const result = await useCase.getBodyBanners()
            expect(result.data).toHaveLength(1)
        })

        it("should propagate errors from repository", async () => {
            vi.mocked(bannerRepository.getBanners).mockRejectedValue(new Error("Body error"))

            await expect(useCase.getBodyBanners()).rejects.toThrow("Body error")
        })
    })
})
