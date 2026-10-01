import { describe, it, expect, vi, beforeEach } from "vitest"
import type IBannerRepository from "@/domain/repository/Banner/IBannerRepository"
import type ICampaignRepository from "@/domain/repository/Campaign/ICampaignRepository"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"
import { CampaignType } from "@/domain/entity/Campaign/campaign"
import GetProductOffersUseCase from "@/domain/interactors/Offers/GetProductOffersUseCase"
import type IProductRepository from "@/domain/repository/Product/IProductRepository"

const BANNER_POSITIONS = [
    MarketingPositions.OFFERS_AUTH_MAIN_BANNER_PRODUCTS,
    MarketingPositions.OFFERS_GUEST_MAIN_BANNER_PRODUCTS,
    MarketingPositions.OFFERS_AUTH_BANNER_PROMOTIONAL_PRODUCTS,
    MarketingPositions.OFFERS_GUEST_BANNER_PROMOTIONAL_PRODUCTS,
    MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_BANNER_OFFERS,
    MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_OFFERS,
]

const CAMPAIGN_POSITIONS = [
    MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_OFFERS,
    MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_OFFERS,
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
    positions: opts.positions ?? [MarketingPositions.OFFERS_AUTH_MAIN_BANNER_PRODUCTS],
    linkText: "",
    image: { desktopUrl: "", mobileUrl: "" },
    campaignId: opts.campaignId ?? "",
})

const makeCampaign = (opts: { id: string; priorityProducts?: string[]; positions?: MarketingPositions[] }) => ({
    id: opts.id,
    isOutstanding: false,
    positions: opts.positions ?? [MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_OFFERS],
    segmentCodes: [],
    slug: `campaign-${opts.id}`,
    mainTitle: `Campaign ${opts.id}`,
    hasLanding: false,
    image: { alt: "", assetUrl: "" },
    numberElementsSlide: 1,
    order: 1,
    status: "active" as never,
    priority: 1,
    campaignType: CampaignType.PRODUCTS,
    categories: [],
    productIds: opts.priorityProducts ?? [],
    priorityProducts: opts.priorityProducts ?? [],
})

const makeProduct = (id: string) => ({
    id,
    name: `Product ${id}`,
    shortDescription: "",
    longDescription: "",
    stock: 1,
    prices: { pointsPrice: 0, coinPrice: 0, regularPrice: 0, currencySymbol: "" },
    assets: [],
    categories: [],
    brand: { id: "br", name: "Brand" },
    variations: [],
    status: "active",
})

const pagination = { page: 1, pageSize: 50, total: 0, totalPages: 0 }

describe("GetProductOffersUseCase", () => {
    let bannerRepository: IBannerRepository
    let campaignRepository: ICampaignRepository
    let productRepository: IProductRepository
    let useCase: GetProductOffersUseCase

    beforeEach(() => {
        bannerRepository = { getBanners: vi.fn() } as unknown as IBannerRepository
        campaignRepository = { getCampaigns: vi.fn() } as unknown as ICampaignRepository
        productRepository = { getProducts: vi.fn() } as unknown as IProductRepository
        useCase = new GetProductOffersUseCase(bannerRepository, campaignRepository, productRepository)
    })

    it("should request banners with products-related positions", async () => {
        vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: [], pagination })
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: [], pagination })
        vi.mocked(productRepository.getProducts).mockResolvedValue({ data: [], pagination })

        await useCase.getProductOffers()

        expect(bannerRepository.getBanners).toHaveBeenCalledWith({
            positions: BANNER_POSITIONS,
            page: 1,
            pageSize: 50,
        })
    })

    it("should request campaigns with products positions and PRODUCTS type", async () => {
        vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: [], pagination })
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: [], pagination })
        vi.mocked(productRepository.getProducts).mockResolvedValue({ data: [], pagination })

        await useCase.getProductOffers()

        expect(campaignRepository.getCampaigns).toHaveBeenCalledWith({
            positions: CAMPAIGN_POSITIONS,
            campaignType: CampaignType.PRODUCTS,
            pageSize: 50,
            page: 1,
        })
    })

    it("should fetch products using priorityProducts ids from campaigns", async () => {
        const campaigns = [
            makeCampaign({ id: "c1", priorityProducts: ["p-1", "p-2"] }),
            makeCampaign({ id: "c2", priorityProducts: ["p-3"] }),
        ]
        const banners = [
            makeBanner({ id: "b1", campaignId: "c1", positions: [MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_BANNER_OFFERS] }),
            makeBanner({ id: "b2", campaignId: "c2", positions: [MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_OFFERS] }),
        ]
        vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: { ...pagination, total: banners.length } })
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: { ...pagination, total: campaigns.length } })
        vi.mocked(productRepository.getProducts).mockResolvedValue({ data: [], pagination })

        await useCase.getProductOffers()

        expect(productRepository.getProducts).toHaveBeenCalledWith({ id: ["p-1", "p-2"], pageSize: 12 })
        expect(productRepository.getProducts).toHaveBeenCalledWith({ id: ["p-3"], pageSize: 12 })
    })

    it("should build productOffers pairing campaign with banner and products", async () => {
        const campaigns = [
            makeCampaign({ id: "c1", priorityProducts: ["p-1", "p-2"] }),
        ]
        const banners = [
            makeBanner({ id: "b1", campaignId: "c1", positions: [MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_BANNER_OFFERS] }),
            makeBanner({ id: "b2", campaignId: "other", positions: [MarketingPositions.OFFERS_AUTH_MAIN_BANNER_PRODUCTS] }),
        ]
        const products = [makeProduct("p-1"), makeProduct("p-2")]

        vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: { ...pagination, total: banners.length } })
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: { ...pagination, total: campaigns.length } })
        vi.mocked(productRepository.getProducts).mockResolvedValue({ data: products, pagination: { ...pagination, total: products.length } })

        const result = await useCase.getProductOffers()

        expect(result.productOffers).toHaveLength(1)
        expect(result.productOffers[0].campaign.id).toBe("c1")
        expect(result.productOffers[0].banner.id).toBe("b1")
        expect(result.productOffers[0].products.map(p => p.id)).toEqual(["p-1", "p-2"])
    })

    it("should filter out HOME_*_USE_YOUR_MILES_BANNER_OFFERS banners from returned banners", async () => {
        const banners = [
            makeBanner({ id: "b-main", campaignId: "", positions: [MarketingPositions.OFFERS_AUTH_MAIN_BANNER_PRODUCTS] }),
            makeBanner({ id: "b-promo", campaignId: "", positions: [MarketingPositions.OFFERS_AUTH_BANNER_PROMOTIONAL_PRODUCTS] }),
            makeBanner({ id: "b-logged", campaignId: "c1", positions: [MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_BANNER_OFFERS] }),
            makeBanner({ id: "b-notlogged", campaignId: "c2", positions: [MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_OFFERS] }),
        ]
        vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: { ...pagination, total: banners.length } })
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: [], pagination })
        vi.mocked(productRepository.getProducts).mockResolvedValue({ data: [], pagination })

        const result = await useCase.getProductOffers()

        expect(result.banners.map(b => b.id)).toEqual(["b-main", "b-promo"])
    })

    it("should return null for campaign when no matching banner is found (if(!banner) branch)", async () => {
        const campaigns = [
            makeCampaign({ id: "c-without-banner", priorityProducts: ["p-1"] }),
        ]
        const banners = [
            makeBanner({ id: "b-unrelated", campaignId: "other-campaign", positions: [MarketingPositions.OFFERS_AUTH_MAIN_BANNER_PRODUCTS] }),
        ]
        const products = [makeProduct("p-1")]

        vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: { ...pagination, total: banners.length } })
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: { ...pagination, total: campaigns.length } })
        vi.mocked(productRepository.getProducts).mockResolvedValue({ data: products, pagination: { ...pagination, total: products.length } })

        const result = await useCase.getProductOffers()

        expect(result.productOffers).toEqual([])
    })

    it("should filter out null entries produced by unmatched campaigns (filter Boolean branch)", async () => {
        const campaigns = [
            makeCampaign({ id: "c1", priorityProducts: ["p-1"] }),
            makeCampaign({ id: "c2-no-banner", priorityProducts: ["p-2"] }),
            makeCampaign({ id: "c3", priorityProducts: ["p-3"] }),
        ]
        const banners = [
            makeBanner({ id: "b1", campaignId: "c1", positions: [MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_BANNER_OFFERS] }),
            makeBanner({ id: "b3", campaignId: "c3", positions: [MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_OFFERS] }),
        ]
        const products = [makeProduct("p-1"), makeProduct("p-2"), makeProduct("p-3")]

        vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: { ...pagination, total: banners.length } })
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: { ...pagination, total: campaigns.length } })
        vi.mocked(productRepository.getProducts).mockResolvedValue({ data: products, pagination: { ...pagination, total: products.length } })

        const result = await useCase.getProductOffers()

        expect(result.productOffers).toHaveLength(2)
        expect(result.productOffers.map(po => po.campaign.id)).toEqual(["c1", "c3"])
        expect(result.productOffers.map(po => po.banner.id)).toEqual(["b1", "b3"])
    })

    it("should filter out a banner containing both HOME_LOGGED and HOME_NOT_LOGGED UseYourMiles positions", async () => {
        const banners = [
            makeBanner({ id: "b-main", campaignId: "", positions: [MarketingPositions.OFFERS_AUTH_MAIN_BANNER_PRODUCTS] }),
            makeBanner({
                id: "b-both-positions",
                campaignId: "c1",
                positions: [
                    MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_BANNER_OFFERS,
                    MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_OFFERS,
                ],
            }),
        ]
        vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: { ...pagination, total: banners.length } })
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: [], pagination })
        vi.mocked(productRepository.getProducts).mockResolvedValue({ data: [], pagination })

        const result = await useCase.getProductOffers()

        expect(result.banners.map(b => b.id)).toEqual(["b-main"])
    })

    it("should build productOffer with empty products when priorityProducts are not returned by repository", async () => {
        const campaigns = [
            makeCampaign({ id: "c1", priorityProducts: ["p-missing-a", "p-missing-b"] }),
        ]
        const banners = [
            makeBanner({ id: "b1", campaignId: "c1", positions: [MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_OFFERS] }),
        ]
        const products = [makeProduct("p-different")]

        vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: { ...pagination, total: banners.length } })
        vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: { ...pagination, total: campaigns.length } })
        vi.mocked(productRepository.getProducts).mockResolvedValue({ data: products, pagination: { ...pagination, total: products.length } })

        const result = await useCase.getProductOffers()

        expect(result.productOffers).toHaveLength(1)
        expect(result.productOffers[0].campaign.id).toBe("c1")
        expect(result.productOffers[0].banner.id).toBe("b1")
        expect(result.productOffers[0].products).toEqual([])
    })
})
