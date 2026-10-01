import { beforeEach, describe, expect, it, vi } from "vitest"
import { CampaignStatus, CampaignType, ExperienceCampaign } from "@/domain/entity/Campaign/campaign"
import { Banner } from "@/domain/entity/Banner/banner"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"
import type IBannerRepository from "@/domain/repository/Banner/IBannerRepository"
import type ICampaignRepository from "@/domain/repository/Campaign/ICampaignRepository"
import GetOfferCampaignUseCase from "@/domain/interactors/Offers/GetOfferCampaignUseCase"

const emptyPagination = { page: 1, pageSize: 20, total: 0, totalPages: 0 }

const buildExperience = (name: string) => ({
    name,
    slug: name.toLowerCase(),
    address: "",
    experience: "",
    description: "",
    url: "",
    type: "international" as never,
    image: { desktopUrl: "", mobileUrl: "" },
    validTo: new Date(),
})

const buildExperienceCampaign = ({ id, ...overrides }: Partial<ExperienceCampaign> & { id: string }): ExperienceCampaign => ({
    id,
    mainTitle: "Campaign",
    slug: "campaign",
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
    ...overrides,
})

describe("GetOfferCampaignUseCase", () => {
    let campaignRepository: ICampaignRepository
    let bannerRepository: IBannerRepository
    let useCase: GetOfferCampaignUseCase

    beforeEach(() => {
        campaignRepository = { getCampaigns: vi.fn() } as unknown as ICampaignRepository
        bannerRepository = { getBanners: vi.fn() } as unknown as IBannerRepository
        useCase = new GetOfferCampaignUseCase(campaignRepository, bannerRepository)
    })

    it("should request experience campaigns by slug", async () => {
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: [], pagination: emptyPagination })

        await useCase.execute("cyber-days")

        expect(campaignRepository.getCampaigns).toHaveBeenCalledWith({
            slug: "cyber-days",
            campaignType: CampaignType.EXPERIENCES,
            page: 1,
            pageSize: 20,
        })
    })

    it("should request product campaigns when campaign type is products", async () => {
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: [], pagination: emptyPagination })

        await useCase.execute("product-offer", 1, CampaignType.PRODUCTS)

        expect(campaignRepository.getCampaigns).toHaveBeenCalledWith({
            slug: "product-offer",
            campaignType: CampaignType.PRODUCTS,
            page: 1,
            pageSize: 20,
        })
    })

    it("should merge active campaign parts sorted by priority", async () => {
        const second = buildExperienceCampaign({
            id: "c-1",
            priority: 2,
            numberElementsSlide: 10,
            experiences: [buildExperience("Rome")],
        })
        const first = buildExperienceCampaign({
            id: "c-1",
            priority: 1,
            mainTitle: "Main Campaign",
            numberElementsSlide: 10,
            experiences: [buildExperience("Paris")],
        })
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
            data: [second, first],
            pagination: emptyPagination,
        })

        const result = await useCase.execute("campaign")

        expect(result?.campaign.mainTitle).toBe("Main Campaign")
        expect(result?.campaign.experiences.map((experience) => experience.name)).toEqual(["Paris", "Rome"])
    })

    it("should treat missing priority as zero when sorting campaign parts", async () => {
        const withoutPriority = buildExperienceCampaign({
            id: "c-1",
            priority: undefined as never,
            numberElementsSlide: 10,
            experiences: [buildExperience("Berlin")],
        })
        const withPriority = buildExperienceCampaign({
            id: "c-1",
            priority: 1,
            numberElementsSlide: 10,
            mainTitle: "Main Campaign",
            experiences: [buildExperience("Paris")],
        })
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
            data: [withPriority, withoutPriority],
            pagination: emptyPagination,
        })

        const result = await useCase.execute("campaign")

        expect(result?.campaign.experiences.map((experience) => experience.name)).toEqual(["Berlin", "Paris"])
    })

    it("should sort campaign parts when all priorities are missing", async () => {
        const firstPart = buildExperienceCampaign({
            id: "c-1",
            priority: undefined as never,
            numberElementsSlide: 10,
            experiences: [buildExperience("Madrid")],
        })
        const secondPart = buildExperienceCampaign({
            id: "c-1",
            priority: undefined as never,
            numberElementsSlide: 10,
            experiences: [buildExperience("Lisbon")],
        })
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
            data: [firstPart, secondPart],
            pagination: emptyPagination,
        })

        const result = await useCase.execute("campaign")

        expect(result?.campaign.experiences.map((experience) => experience.name)).toEqual(["Madrid", "Lisbon"])
    })

    it("should return null when only inactive campaigns are found", async () => {
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
            data: [buildExperienceCampaign({ id: "c-1", status: CampaignStatus.INACTIVE })],
            pagination: emptyPagination,
        })

        const result = await useCase.execute("inactive")

        expect(result).toBeNull()
    })

    it("should paginate experiences using numberElementsSlide", async () => {
        const experiences = Array.from({ length: 5 }, (_, index) => buildExperience(`Exp ${index + 1}`))
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
            data: [buildExperienceCampaign({ id: "c-1", numberElementsSlide: 2, experiences })],
            pagination: emptyPagination,
        })

        const firstPage = await useCase.execute("campaign", 1)
        const secondPage = await useCase.execute("campaign", 2)

        expect(firstPage?.campaign.experiences).toHaveLength(2)
        expect(firstPage?.pagination).toEqual({
            page: 1,
            pageSize: 2,
            total: 5,
            totalPages: 3,
        })
        expect(secondPage?.campaign.experiences.map((experience) => experience.name)).toEqual(["Exp 3", "Exp 4"])
    })

    it("should clamp invalid page numbers to the last available page", async () => {
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
            data: [buildExperienceCampaign({
                id: "c-1",
                numberElementsSlide: 2,
                experiences: [buildExperience("Exp 1"), buildExperience("Exp 2"), buildExperience("Exp 3")],
            })],
            pagination: emptyPagination,
        })

        const result = await useCase.execute("campaign", 99)

        expect(result?.pagination.page).toBe(2)
        expect(result?.campaign.experiences).toHaveLength(1)
    })

    it("should use default page size when numberElementsSlide is zero", async () => {
        const experiences = Array.from({ length: 13 }, (_, index) => buildExperience(`Exp ${index + 1}`))
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
            data: [buildExperienceCampaign({ id: "c-1", numberElementsSlide: 0, experiences })],
            pagination: emptyPagination,
        })

        const result = await useCase.execute("campaign", 1)

        expect(result?.campaign.experiences).toHaveLength(12)
        expect(result?.pagination.pageSize).toBe(12)
        expect(result?.pagination.totalPages).toBe(2)
    })

    it("should return empty pagination when campaign has no experiences", async () => {
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
            data: [buildExperienceCampaign({ id: "c-1", experiences: [] })],
            pagination: emptyPagination,
        })

        const result = await useCase.execute("campaign", 1)

        expect(result?.campaign.experiences).toEqual([])
        expect(result?.pagination).toEqual({
            page: 1,
            pageSize: 1,
            total: 0,
            totalPages: 0,
        })
    })

    it("should clamp page numbers below 1 to the first page", async () => {
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
            data: [buildExperienceCampaign({
                id: "c-1",
                numberElementsSlide: 2,
                experiences: [buildExperience("Exp 1"), buildExperience("Exp 2"), buildExperience("Exp 3")],
            })],
            pagination: emptyPagination,
        })

        const result = await useCase.execute("campaign", 0)

        expect(result?.pagination.page).toBe(1)
        expect(result?.campaign.experiences.map((experience) => experience.name)).toEqual(["Exp 1", "Exp 2"])
    })

    it("should return null when repository returns no campaigns", async () => {
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
            data: [],
            pagination: emptyPagination,
        })

        const result = await useCase.execute("missing")

        expect(result).toBeNull()
    })

    describe("getOfferCampaignBanner", () => {
        const buildBanner = (): Banner => ({
            id: "b-1",
            title: "Campaign Banner",
            subtitle: "",
            description: "",
            summary: "",
            link: "",
            textColor: "#ffffff",
            image: { desktopUrl: "", mobileUrl: "" },
            positions: [],
            segmentCodes: [],
            priority: 1,
            isOutstanding: false,
            campaignId: "c-1",
        })

        it("should request experience campaign and guest banner by slug", async () => {
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
                data: [buildExperienceCampaign({ id: "c-1" })],
                pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
            })
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({
                data: [buildBanner()],
                pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
            })

            const result = await useCase.getOfferCampaignBanner("cyber-days", false)

            expect(campaignRepository.getCampaigns).toHaveBeenCalledWith({
                slug: "cyber-days",
                campaignType: CampaignType.EXPERIENCES,
                page: 1,
                pageSize: 1,
            })
            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                page: 1,
                pageSize: 1,
                campaignId: ["c-1"],
                positions: [MarketingPositions.OFFER_GUEST_CAMPAIGN_BANNER, MarketingPositions.OFFERS_HIDDEN_CAMPAIGN],
            })
            expect(result).toEqual(buildBanner())
        })

        it("should request auth campaign banner position when user is logged in", async () => {
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
                data: [buildExperienceCampaign({ id: "c-1" })],
                pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
            })
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({
                data: [buildBanner()],
                pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
            })

            await useCase.getOfferCampaignBanner("cyber-days", true)

            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                page: 1,
                pageSize: 1,
                campaignId: ["c-1"],
                positions: [MarketingPositions.OFFER_AUTH_CAMPAIGN_BANNER, MarketingPositions.OFFERS_HIDDEN_CAMPAIGN],
            })
        })

        it("should request product campaign when campaign type is products", async () => {
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
                data: [buildExperienceCampaign({ id: "c-1" })],
                pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
            })
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({
                data: [buildBanner()],
                pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
            })

            await useCase.getOfferCampaignBanner("cyber-days", false, CampaignType.PRODUCTS)

            expect(campaignRepository.getCampaigns).toHaveBeenCalledWith({
                slug: "cyber-days",
                campaignType: CampaignType.PRODUCTS,
                page: 1,
                pageSize: 1,
            })
        })

        it("should return null when campaign is not found", async () => {
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
                data: [],
                pagination: emptyPagination,
            })

            const result = await useCase.getOfferCampaignBanner("missing", false)

            expect(result).toBeNull()
            expect(bannerRepository.getBanners).not.toHaveBeenCalled()
        })

        it("should return null when banner is not found", async () => {
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
                data: [buildExperienceCampaign({ id: "c-1" })],
                pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
            })
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({
                data: [],
                pagination: emptyPagination,
            })

            const result = await useCase.getOfferCampaignBanner("cyber-days", false)

            expect(result).toBeNull()
        })

        it("should return null when campaign list response is missing", async () => {
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue(null as never)

            const result = await useCase.getOfferCampaignBanner("cyber-days", false)

            expect(result).toBeNull()
            expect(bannerRepository.getBanners).not.toHaveBeenCalled()
        })

        it("should return null when banner list response is missing", async () => {
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
                data: [buildExperienceCampaign({ id: "c-1" })],
                pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
            })
            vi.mocked(bannerRepository.getBanners).mockResolvedValue(null as never)

            const result = await useCase.getOfferCampaignBanner("cyber-days", false)

            expect(result).toBeNull()
        })

        it("should return null when banner data entry is missing", async () => {
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
                data: [buildExperienceCampaign({ id: "c-1" })],
                pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
            })
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({
                data: [undefined as never],
                pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
            })

            const result = await useCase.getOfferCampaignBanner("cyber-days", false)

            expect(result).toBeNull()
        })
    })
})

const buildCampaignEntry = (id: string): ExperienceCampaign => ({
    id,
    mainTitle: "Campaign",
    slug: "campaign",
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
})

const buildBanner = (id: string) => ({
    id,
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
    campaignId: id,
})

describe("GetOfferCampaignUseCase.getOfferCampaignBanner", () => {
    let campaignRepository: ICampaignRepository
    let bannerRepository: { getBanners: ReturnType<typeof vi.fn> }
    let useCase: GetOfferCampaignUseCase

    beforeEach(() => {
        campaignRepository = { getCampaigns: vi.fn() } as unknown as ICampaignRepository
        bannerRepository = { getBanners: vi.fn() }
        useCase = new GetOfferCampaignUseCase(
            campaignRepository,
            bannerRepository as never,
            {} as never,
        )
    })

    it("should return null when getCampaigns returns total 0", async () => {
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
            data: [],
            pagination: { page: 1, pageSize: 1, total: 0, totalPages: 0 },
        })

        const result = await useCase.getOfferCampaignBanner("slug", false)

        expect(result).toBeNull()
    })

    it("should return null when getBanners returns total 0", async () => {
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
            data: [buildCampaignEntry("c1")],
            pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
        })
        bannerRepository.getBanners.mockResolvedValue({
            data: [],
            pagination: { page: 1, pageSize: 1, total: 0, totalPages: 0 },
        })

        const result = await useCase.getOfferCampaignBanner("slug", false)

        expect(result).toBeNull()
    })

    it("should return the first banner on success", async () => {
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
            data: [buildCampaignEntry("c1")],
            pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
        })
        bannerRepository.getBanners.mockResolvedValue({
            data: [buildBanner("b1"), buildBanner("b2")],
            pagination: { page: 1, pageSize: 1, total: 2, totalPages: 1 },
        })

        const result = await useCase.getOfferCampaignBanner("slug", false)

        expect(result?.id).toBe("b1")
    })

    it("should pass OFFER_AUTH positions when isLogged is true", async () => {
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
            data: [buildCampaignEntry("c1")],
            pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
        })
        bannerRepository.getBanners.mockResolvedValue({
            data: [buildBanner("b1")],
            pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
        })

        await useCase.getOfferCampaignBanner("slug", true)

        expect(bannerRepository.getBanners).toHaveBeenCalledWith(
            expect.objectContaining({
                positions: expect.arrayContaining([
                    MarketingPositions.OFFER_AUTH_CAMPAIGN_BANNER,
                    MarketingPositions.OFFERS_HIDDEN_CAMPAIGN,
                ]),
            }),
        )
    })

    it("should pass OFFER_GUEST positions when isLogged is false", async () => {
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
            data: [buildCampaignEntry("c1")],
            pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
        })
        bannerRepository.getBanners.mockResolvedValue({
            data: [buildBanner("b1")],
            pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
        })

        await useCase.getOfferCampaignBanner("slug", false)

        expect(bannerRepository.getBanners).toHaveBeenCalledWith(
            expect.objectContaining({
                positions: expect.arrayContaining([
                    MarketingPositions.OFFER_GUEST_CAMPAIGN_BANNER,
                    MarketingPositions.OFFERS_HIDDEN_CAMPAIGN,
                ]),
            }),
        )
    })

    it("should pass campaignId from the fetched campaign to getBanners", async () => {
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
            data: [buildCampaignEntry("campaign-123")],
            pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
        })
        bannerRepository.getBanners.mockResolvedValue({
            data: [buildBanner("b1")],
            pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
        })

        await useCase.getOfferCampaignBanner("slug", false)

        expect(bannerRepository.getBanners).toHaveBeenCalledWith(
            expect.objectContaining({ campaignId: ["campaign-123"] }),
        )
    })
})

describe("GetOfferCampaignUseCase.getOfferCampaignProducts", () => {
    let campaignRepository: ICampaignRepository
    let fetchProductsByCampaign: ReturnType<typeof vi.fn>
    let useCase: GetOfferCampaignUseCase

    const buildProductsCampaign = (id: string, categories: string[] = ["cat-1", "cat-2", "cat-empty"]) => ({
        id,
        mainTitle: "Campaign",
        slug: "campaign",
        isOutstanding: false,
        positions: [],
        segmentCodes: [],
        hasLanding: true,
        image: { desktopUrl: "", mobileUrl: "" },
        numberElementsSlide: 1,
        order: 1,
        status: CampaignStatus.ACTIVE,
        priority: 1,
        campaignType: CampaignType.PRODUCTS as const,
        categories,
        productIds: ["p1"],
        priorityProducts: [],
    })

    beforeEach(() => {
        fetchProductsByCampaign = vi.fn()
        campaignRepository = { getCampaigns: vi.fn() } as unknown as ICampaignRepository
        useCase = new GetOfferCampaignUseCase(
            campaignRepository,
            {} as never,
            { fetchProductsByCampaign } as never,
        )
    })

    it("should call getCampaigns with CampaignType.PRODUCTS", async () => {
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
            data: [buildProductsCampaign("c1")],
            pagination: emptyPagination,
        })
        fetchProductsByCampaign.mockResolvedValue(new Map())

        await useCase.getOfferCampaignProducts("my-slug")

        expect(campaignRepository.getCampaigns).toHaveBeenCalledWith(
            expect.objectContaining({ slug: "my-slug", campaignType: CampaignType.PRODUCTS }),
        )
    })

    it("should return the campaign for the given slug", async () => {
        const campaign = buildProductsCampaign("c1")
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
            data: [campaign],
            pagination: emptyPagination,
        })

        const result = await useCase.getOfferCampaignProducts("slug")

        expect(result).toEqual(campaign)
    })

    it("should not call fetchProductsByCampaign", async () => {
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
            data: [buildProductsCampaign("c1")],
            pagination: emptyPagination,
        })

        await useCase.getOfferCampaignProducts("slug")

        expect(fetchProductsByCampaign).not.toHaveBeenCalled()
    })

    it("should return null when campaign list is empty", async () => {
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
            data: [],
            pagination: emptyPagination,
        })

        const result = await useCase.getOfferCampaignProducts("slug")

        expect(result).toBeNull()
        expect(fetchProductsByCampaign).not.toHaveBeenCalled()
    })

    it("should keep the campaign categories as returned by the repository", async () => {
        const campaign = buildProductsCampaign("c1", ["cat-1", "cat-2", "cat-empty"])
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({
            data: [campaign],
            pagination: emptyPagination,
        })

        const result = await useCase.getOfferCampaignProducts("slug")

        expect(result?.categories).toEqual(["cat-1", "cat-2", "cat-empty"])
    })
})
