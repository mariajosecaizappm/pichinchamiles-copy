import { describe, it, expect, vi, beforeEach } from "vitest"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"
import { CampaignType, CampaignStatus } from "@/domain/entity/Campaign/campaign"
import type { ProductsCampaign, Campaign } from "@/domain/entity/Campaign/campaign"
import type { Product } from "@/domain/entity/Product/product"
import type IBannerRepository from "@/domain/repository/Banner/IBannerRepository"
import type ICampaignRepository from "@/domain/repository/Campaign/ICampaignRepository"
import type IProductRepository from "@/domain/repository/Product/IProductRepository"
import GetExploreProductsContentUseCase from "@/domain/interactors/Home/UseYourMiles/Products/GetExploreProductsContentUseCase"

const emptyPagination = { page: 1, pageSize: 10, total: 0, totalPages: 0 }

const buildCampaign = (overrides: Partial<ProductsCampaign> & { id: string }): ProductsCampaign => ({
    mainTitle: "Campaign",
    secondaryTitle: "",
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
    campaignType: CampaignType.PRODUCTS,
    categories: [],
    productIds: [],
    priorityProducts: [],
    ...overrides,
})

const buildProduct = (overrides: Partial<Product> & { id: string }): Product => ({
    name: "Product",
    slug: "product",
    description: "",
    brand: { id: "b1", name: "Brand" },
    categories: [],
    minPrice: 100,
    recommended: false,
    segmentCodes: [],
    store: { id: "s1", name: "Store" },
    supplierId: "sup1",
    priority: 1,
    maxPrice: 200,
    minPointsPrice: 1000,
    maxPointsPrice: 2000,
    assets: [],
    features: [],
    mostWanted: false,
    productType: "physicalproduct" as never,
    searchEngine: {} as never,
    unitPointsPriceWithoutDiscount: 1500,
    ...overrides,
})

const buildBanner = (overrides: Partial<{ id: string; title: string; priority: number; campaignId: string }> = {}) => ({
    id: overrides.id ?? "ban-1",
    title: overrides.title ?? "Banner",
    subtitle: "",
    description: "",
    summary: "",
    link: "#",
    textColor: "",
    isOutstanding: false,
    segmentCodes: [],
    positions: [],
    priority: overrides.priority ?? 1,
    image: { desktopUrl: "", mobileUrl: "" },
    campaignId: overrides.campaignId ?? "",
})

describe("GetExploreProductsContentUseCase", () => {
    let bannerRepository: IBannerRepository
    let campaignRepository: ICampaignRepository
    let productRepository: IProductRepository
    let useCase: GetExploreProductsContentUseCase

    beforeEach(() => {
        bannerRepository = { getBanners: vi.fn() } as unknown as IBannerRepository
        campaignRepository = { getCampaigns: vi.fn() } as unknown as ICampaignRepository
        productRepository = { getProductSearch: vi.fn() } as unknown as IProductRepository
        useCase = new GetExploreProductsContentUseCase(bannerRepository, campaignRepository, productRepository)
    })

    describe("getBanners", () => {
        it("should use guest position when not authenticated", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: [], pagination: emptyPagination })
            await useCase.getBanners()
            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                positions: [MarketingPositions.HOME_LOGGED_MAIN_SLIDER, MarketingPositions.HOME_NOT_LOGGED_MAIN_SLIDER],
                page: 1,
                pageSize: 10,
            })
        })

        it("should use logged position when authenticated", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: [], pagination: emptyPagination })
            await useCase.getBanners()
            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                positions: [MarketingPositions.HOME_LOGGED_MAIN_SLIDER, MarketingPositions.HOME_NOT_LOGGED_MAIN_SLIDER],
                page: 1,
                pageSize: 10,
            })
        })

        it("should return the banner list from repository", async () => {
            const mockBanners = [
                buildBanner({ id: "banner-1", priority: 1 }),
                buildBanner({ id: "banner-2", priority: 2 }),
            ]
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({
                data: mockBanners,
                pagination: { ...emptyPagination, total: 2, totalPages: 1 },
            })
            const result = await useCase.getBanners()
            expect(result.data).toHaveLength(2)
            expect(result.data[0].id).toBe("banner-1")
        })

        it("should return empty list when no banners are found", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: [], pagination: emptyPagination })
            const result = await useCase.getBanners()
            expect(result.data).toHaveLength(0)
        })

        it("should propagate errors from repository", async () => {
            vi.mocked(bannerRepository.getBanners).mockRejectedValue(new Error("Repository error"))
            await expect(useCase.getBanners()).rejects.toThrow("Repository error")
        })
    })

    describe("getNewProducts", () => {
        it("should use guest position when not authenticated", async () => {
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: [], pagination: emptyPagination })
            await useCase.getNewProducts()
            expect(campaignRepository.getCampaigns).toHaveBeenCalledWith({
                positions: [MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_NEW_ITEMS_FOR_YOU, MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_NEW_ITEMS_FOR_YOU],
                campaignType: CampaignType.PRODUCTS,
                page: 1,
                pageSize: 5,
            })
        })

        it("should use logged position when authenticated", async () => {
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: [], pagination: emptyPagination })
            await useCase.getNewProducts()
            expect(campaignRepository.getCampaigns).toHaveBeenCalledWith({
                positions: [MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_NEW_ITEMS_FOR_YOU, MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_NEW_ITEMS_FOR_YOU],
                campaignType: CampaignType.PRODUCTS,
                page: 1,
                pageSize: 5,
            })
        })

        it("should filter only active campaigns", async () => {
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", status: CampaignStatus.ACTIVE, productIds: ["p1"] }),
                buildCampaign({ id: "c-2", status: CampaignStatus.INACTIVE, productIds: ["p2"] }),
            ]
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({ list: { data: [buildProduct({ id: "p1" })], pagination: emptyPagination }, brandIds: [], categoryIds: [], categories: {} })

            const result = await useCase.getNewProducts()

            expect(result).toHaveLength(1)
            expect(result[0].campaign.id).toBe("c-1")
        })

        it("should sort campaigns by priority ascending", async () => {
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-3", priority: 3, productIds: ["p1"] }),
                buildCampaign({ id: "c-1", priority: 1, productIds: ["p2"] }),
                buildCampaign({ id: "c-2", priority: 2, productIds: ["p3"] }),
            ]
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({ list: { data: [], pagination: emptyPagination }, brandIds: [], categoryIds: [], categories: {} })

            const result = await useCase.getNewProducts()

            expect(result[0].campaign.id).toBe("c-1")
            expect(result[1].campaign.id).toBe("c-2")
            expect(result[2].campaign.id).toBe("c-3")
        })

        it("should treat missing priority as zero when sorting new product campaigns", async () => {
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-2", priority: 1, productIds: ["p1"] }),
                buildCampaign({ id: "c-1", priority: undefined as never, productIds: ["p2"] }),
            ]
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({ list: { data: [], pagination: emptyPagination }, brandIds: [], categoryIds: [], categories: {} })

            const result = await useCase.getNewProducts()

            expect(result[0].campaign.id).toBe("c-1")
            expect(result[1].campaign.id).toBe("c-2")
        })

        it("should treat missing priority as zero when first new product campaign has no priority", async () => {
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", priority: undefined as never, productIds: ["p1"] }),
                buildCampaign({ id: "c-2", priority: 1, productIds: ["p2"] }),
            ]
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({ list: { data: [], pagination: emptyPagination }, brandIds: [], categoryIds: [], categories: {} })

            const result = await useCase.getNewProducts()

            expect(result[0].campaign.id).toBe("c-1")
            expect(result[1].campaign.id).toBe("c-2")
        })

        it("should return empty products when fetchProductsByCampaign returns no data", async () => {
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", productIds: ["p1"] }),
            ]
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.spyOn(useCase, "fetchProductsByCampaign").mockResolvedValue(new Map())

            const result = await useCase.getNewProducts()

            expect(result[0].products).toHaveLength(0)
        })

        it("should fetch products for each active campaign", async () => {
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", productIds: ["p1", "p2"] }),
            ]
            const products = [buildProduct({ id: "p1" }), buildProduct({ id: "p2" })]
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({ list: { data: products, pagination: emptyPagination }, brandIds: [], categoryIds: [], categories: {} })

            const result = await useCase.getNewProducts()

            expect(productRepository.getProductSearch).toHaveBeenCalledWith({
                id: ["p1", "p2"],
                page: 1,
                pageSize: 2,
            })
            expect(result[0].products).toHaveLength(2)
        })

        it("should use priorityProducts when available", async () => {
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", productIds: ["p1", "p2", "p3"], priorityProducts: ["p2", "p1"] }),
            ]
            const products = [buildProduct({ id: "p1" }), buildProduct({ id: "p2" }), buildProduct({ id: "p3" })]
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({ list: { data: products, pagination: emptyPagination }, brandIds: [], categoryIds: [], categories: {} })

            await useCase.getNewProducts()

            expect(productRepository.getProductSearch).toHaveBeenCalledWith({
                id: ["p2", "p1", "p3"],
                page: 1,
                pageSize: 3,
            })
        })

        it("should order products by priorityProducts order", async () => {
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", productIds: ["p1", "p2", "p3"], priorityProducts: ["p3", "p1"] }),
            ]
            const products = [buildProduct({ id: "p3" }), buildProduct({ id: "p1" })]
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({ list: { data: products, pagination: emptyPagination }, brandIds: [], categoryIds: [], categories: {} })

            const result = await useCase.getNewProducts()

            expect(result[0].products[0].id).toBe("p3")
            expect(result[0].products[1].id).toBe("p1")
        })

        it("should return empty data when no campaigns exist", async () => {
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: [], pagination: emptyPagination })

            const result = await useCase.getNewProducts()

            expect(result).toHaveLength(0)
        })

        it("should return empty products for a campaign when product fetch returns empty", async () => {
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", productIds: ["p1"] }),
            ]
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({ list: { data: [], pagination: emptyPagination }, brandIds: [], categoryIds: [], categories: {} })

            const result = await useCase.getNewProducts()

            expect(result[0].products).toHaveLength(0)
        })

        it("should return empty products when campaign id is missing from fetched map", async () => {
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", productIds: ["p1"] }),
            ]
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.spyOn(useCase, "fetchProductsByCampaign").mockResolvedValue(new Map())

            const result = await useCase.getNewProducts()

            expect(result[0].products).toEqual([])
        })

        it("should treat null campaign priority as zero when sorting new product campaigns", async () => {
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-2", priority: 1, productIds: ["p1"] }),
                buildCampaign({ id: "c-1", priority: null as never, productIds: ["p2"] }),
            ]
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({
                list: { data: [], pagination: emptyPagination },
                brandIds: [],
                categoryIds: [],
                categories: {},
            })

            const result = await useCase.getNewProducts()

            expect(result[0].campaign.id).toBe("c-1")
            expect(result[1].campaign.id).toBe("c-2")
        })

        it("should keep campaign order when both priorities are null", async () => {
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", priority: null as never, productIds: ["p1"] }),
                buildCampaign({ id: "c-2", priority: null as never, productIds: ["p2"] }),
            ]
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({
                list: { data: [], pagination: emptyPagination },
                brandIds: [],
                categoryIds: [],
                categories: {},
            })

            const result = await useCase.getNewProducts()

            expect(result).toHaveLength(2)
            expect(result[0].campaign.id).toBe("c-1")
            expect(result[1].campaign.id).toBe("c-2")
        })

        it("should propagate errors from campaignRepository", async () => {
            vi.mocked(campaignRepository.getCampaigns).mockRejectedValue(new Error("Campaign error"))
            await expect(useCase.getNewProducts()).rejects.toThrow("Campaign error")
        })

        it("should propagate errors from productRepository", async () => {
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", productIds: ["p1"] }),
            ]
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockRejectedValue(new Error("Product error"))
            await expect(useCase.getNewProducts()).rejects.toThrow("Product error")
        })
    })

    describe("getOffers", () => {
        it("should use guest banner position when not authenticated", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: [], pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: [], pagination: emptyPagination })

            await useCase.getOffers(5)

            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                positions: [MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_BANNER_OFFERS, MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_OFFERS],
                page: 1,
                pageSize: 5,
            })
        })

        it("should use logged banner position when authenticated", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: [], pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: [], pagination: emptyPagination })

            await useCase.getOffers(5)

            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                positions: [MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_BANNER_OFFERS, MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_OFFERS],
                page: 1,
                pageSize: 5,
            })
        })

        it("should call campaignRepository with banner campaignIds", async () => {
            const banners = [buildBanner({ id: "ban-1", campaignId: "c-1" })]
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: [], pagination: emptyPagination })

            await useCase.getOffers(5)

            expect(campaignRepository.getCampaigns).toHaveBeenCalledWith({
                id: ["c-1"],
                positions: [MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_OFFERS, MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_OFFERS],
                campaignType: CampaignType.PRODUCTS,
                pageSize: 5,
                page: 1,
            })
        })

        it("should return campaign banners with products for active campaigns", async () => {
            const banners = [buildBanner({ id: "ban-1", campaignId: "c-1", priority: 1 })]
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", status: CampaignStatus.ACTIVE, productIds: ["p1"] }),
            ]
            const products = [buildProduct({ id: "p1" })]

            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({ list: { data: products, pagination: emptyPagination }, brandIds: [], categoryIds: [], categories: {} })

            const result = await useCase.getOffers(5)

            expect(result).toHaveLength(1)
            expect(result[0].banner.id).toBe("ban-1")
            expect(result[0].campaign.id).toBe("c-1")
            expect(result[0].products).toHaveLength(1)
        })

        it("should exclude inactive campaigns from results", async () => {
            const banners = [buildBanner({ id: "ban-1", campaignId: "c-1" })]
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", status: CampaignStatus.INACTIVE, productIds: ["p1"] }),
            ]

            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })

            const result = await useCase.getOffers(5)

            expect(result).toHaveLength(0)
        })

        it("should sort results by banner priority ascending", async () => {
            const banners = [
                buildBanner({ id: "ban-2", campaignId: "c-2", priority: 2 }),
                buildBanner({ id: "ban-1", campaignId: "c-1", priority: 1 }),
            ]
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", productIds: [] }),
                buildCampaign({ id: "c-2", productIds: [] }),
            ]

            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({ list: { data: [], pagination: emptyPagination }, brandIds: [], categoryIds: [], categories: {} })

            const result = await useCase.getOffers(5)

            expect(result[0].banner.id).toBe("ban-1")
            expect(result[1].banner.id).toBe("ban-2")
        })

        it("should limit products to 12 per campaign", async () => {
            const banners = [buildBanner({ id: "ban-1", campaignId: "c-1" })]
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", productIds: Array.from({ length: 15 }, (_, i) => `p${i}`) }),
            ]
            const products = Array.from({ length: 15 }, (_, i) => buildProduct({ id: `p${i}` }))

            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({ list: { data: products, pagination: emptyPagination }, brandIds: [], categoryIds: [], categories: {} })

            const result = await useCase.getOffers(5)

            expect(result[0].products).toHaveLength(12)
        })

        it("should return empty array when no banners exist", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: [], pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: [], pagination: emptyPagination })

            const result = await useCase.getOffers(5)

            expect(result).toHaveLength(0)
        })

        it("should use priorityProducts order for offers", async () => {
            const banners = [buildBanner({ id: "ban-1", campaignId: "c-1" })]
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", productIds: ["p1", "p2"], priorityProducts: ["p2", "p1"] }),
            ]
            const products = [buildProduct({ id: "p2" }), buildProduct({ id: "p1" })]

            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({ list: { data: products, pagination: emptyPagination }, brandIds: [], categoryIds: [], categories: {} })

            const result = await useCase.getOffers(5)

            expect(result[0].products[0].id).toBe("p2")
            expect(result[0].products[1].id).toBe("p1")
        })

        it("should propagate errors from campaignRepository", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: [buildBanner({ campaignId: "c-1" })], pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockRejectedValue(new Error("Campaign error"))
            await expect(useCase.getOffers(5)).rejects.toThrow("Campaign error")
        })

        it("should propagate errors from bannerRepository", async () => {
            vi.mocked(bannerRepository.getBanners).mockRejectedValue(new Error("Banner error"))
            await expect(useCase.getOffers(5)).rejects.toThrow("Banner error")
        })

        it("should skip banners without campaignId", async () => {
            const banners = [
                buildBanner({ id: "ban-1", campaignId: "" }),
                buildBanner({ id: "ban-2", campaignId: "c-1" }),
            ]
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", productIds: ["p1"] }),
            ]
            const products = [buildProduct({ id: "p1" })]

            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({ list: { data: products, pagination: emptyPagination }, brandIds: [], categoryIds: [], categories: {} })

            const result = await useCase.getOffers(5)

            expect(result).toHaveLength(1)
            expect(result[0].banner.id).toBe("ban-2")
        })

        it("should merge multiple campaign parts for the same banner", async () => {
            const banners = [buildBanner({ id: "ban-1", campaignId: "c-1" })]
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", priority: 2, productIds: ["p2"] }),
                buildCampaign({ id: "c-1", priority: 1, productIds: ["p1"] }),
            ]
            const products = [buildProduct({ id: "p1" }), buildProduct({ id: "p2" })]

            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({ list: { data: products, pagination: emptyPagination }, brandIds: [], categoryIds: [], categories: {} })

            const result = await useCase.getOffers(5)

            expect(productRepository.getProductSearch).toHaveBeenCalledWith({
                id: ["p1", "p2"],
                page: 1,
                pageSize: 2,
            })
            expect(result[0].products).toHaveLength(2)
        })

        it("should treat missing priority as zero when merging offer campaign parts", async () => {
            const banners = [buildBanner({ id: "ban-1", campaignId: "c-1" })]
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", priority: 1, productIds: ["p2"] }),
                buildCampaign({ id: "c-1", priority: undefined as never, productIds: ["p1"] }),
            ]
            const products = [buildProduct({ id: "p1" }), buildProduct({ id: "p2" })]

            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({ list: { data: products, pagination: emptyPagination }, brandIds: [], categoryIds: [], categories: {} })

            const result = await useCase.getOffers(5)

            expect(productRepository.getProductSearch).toHaveBeenCalledWith({
                id: ["p1", "p2"],
                page: 1,
                pageSize: 2,
            })
            expect(result[0].products).toHaveLength(2)
        })

        it("should treat missing priority as zero when first offer campaign part has no priority", async () => {
            const banners = [buildBanner({ id: "ban-1", campaignId: "c-1" })]
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", priority: undefined as never, productIds: ["p1"] }),
                buildCampaign({ id: "c-1", priority: 1, productIds: ["p2"] }),
            ]
            const products = [buildProduct({ id: "p1" }), buildProduct({ id: "p2" })]

            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({ list: { data: products, pagination: emptyPagination }, brandIds: [], categoryIds: [], categories: {} })

            const result = await useCase.getOffers(5)

            expect(productRepository.getProductSearch).toHaveBeenCalledWith({
                id: ["p1", "p2"],
                page: 1,
                pageSize: 2,
            })
            expect(result[0].products).toHaveLength(2)
        })

        it("should return empty products when offer fetchProductsByCampaign returns no data", async () => {
            const banners = [buildBanner({ id: "ban-1", campaignId: "c-1" })]
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", productIds: ["p1"] }),
            ]

            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.spyOn(useCase, "fetchProductsByCampaign").mockResolvedValue(new Map())

            const result = await useCase.getOffers(5)

            expect(result[0].products).toHaveLength(0)
        })

        it("should sort already ascending banner priorities without swaps", async () => {
            const banners = [
                buildBanner({ id: "ban-1", campaignId: "c-1", priority: 1 }),
                buildBanner({ id: "ban-2", campaignId: "c-2", priority: 2 }),
            ]
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", productIds: [] }),
                buildCampaign({ id: "c-2", productIds: [] }),
            ]

            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({ list: { data: [], pagination: emptyPagination }, brandIds: [], categoryIds: [], categories: {} })

            const result = await useCase.getOffers(5)

            expect(result[0].banner.id).toBe("ban-1")
            expect(result[1].banner.id).toBe("ban-2")
        })

        it("should sort offers by descending banner priority when first banner has higher priority", async () => {
            const banners = [
                buildBanner({ id: "ban-2", campaignId: "c-2", priority: 2 }),
                buildBanner({ id: "ban-1", campaignId: "c-1", priority: 1 }),
            ]
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", productIds: [] }),
                buildCampaign({ id: "c-2", productIds: [] }),
            ]

            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({ list: { data: [], pagination: emptyPagination }, brandIds: [], categoryIds: [], categories: {} })

            const result = await useCase.getOffers(5)

            expect(result[0].banner.id).toBe("ban-1")
            expect(result[1].banner.id).toBe("ban-2")
        })

        it("should keep banner order when priorities are equal", async () => {
            const banners = [
                buildBanner({ id: "ban-1", campaignId: "c-1", priority: 1 }),
                buildBanner({ id: "ban-2", campaignId: "c-2", priority: 1 }),
            ]
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", productIds: [] }),
                buildCampaign({ id: "c-2", productIds: [] }),
            ]

            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({ list: { data: [], pagination: emptyPagination }, brandIds: [], categoryIds: [], categories: {} })

            const result = await useCase.getOffers(5)

            expect(result[0].banner.id).toBe("ban-1")
            expect(result[1].banner.id).toBe("ban-2")
        })

        it("should return empty products for offers when campaign id is missing from fetched map", async () => {
            const banners = [buildBanner({ id: "ban-1", campaignId: "c-1", priority: 1 })]
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", productIds: ["p1"] }),
            ]

            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.spyOn(useCase, "fetchProductsByCampaign").mockResolvedValue(new Map())

            const result = await useCase.getOffers(5)

            expect(result[0].products).toEqual([])
        })

        it("should place higher priority banner after lower priority banner in sort comparator", async () => {
            const banners = [
                buildBanner({ id: "ban-high", campaignId: "c-high", priority: 5 }),
                buildBanner({ id: "ban-mid", campaignId: "c-mid", priority: 3 }),
                buildBanner({ id: "ban-low", campaignId: "c-low", priority: 1 }),
            ]
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-high", productIds: [] }),
                buildCampaign({ id: "c-mid", productIds: [] }),
                buildCampaign({ id: "c-low", productIds: [] }),
            ]

            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({
                list: { data: [], pagination: emptyPagination },
                brandIds: [],
                categoryIds: [],
                categories: {},
            })

            const result = await useCase.getOffers(5)

            expect(result.map(item => item.banner.id)).toEqual(["ban-low", "ban-mid", "ban-high"])
        })

        it("should treat null campaign priority as zero when merging offer campaign parts", async () => {
            const banners = [buildBanner({ id: "ban-1", campaignId: "c-1" })]
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", priority: 1, productIds: ["p2"] }),
                buildCampaign({ id: "c-1", priority: null as never, productIds: ["p1"] }),
            ]
            const products = [buildProduct({ id: "p1" }), buildProduct({ id: "p2" })]

            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({
                list: { data: products, pagination: emptyPagination },
                brandIds: [],
                categoryIds: [],
                categories: {},
            })

            const result = await useCase.getOffers(5)

            expect(productRepository.getProductSearch).toHaveBeenCalledWith({
                id: ["p1", "p2"],
                page: 1,
                pageSize: 2,
            })
            expect(result[0].products).toHaveLength(2)
        })

        it("should keep merged campaign parts order when both priorities are null", async () => {
            const banners = [buildBanner({ id: "ban-1", campaignId: "c-1" })]
            const campaigns: Campaign[] = [
                buildCampaign({ id: "c-1", priority: null as never, productIds: ["p1"] }),
                buildCampaign({ id: "c-1", priority: null as never, productIds: ["p2"] }),
            ]
            const products = [buildProduct({ id: "p1" }), buildProduct({ id: "p2" })]

            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: banners, pagination: emptyPagination })
            vi.mocked(campaignRepository.getCampaigns).mockResolvedValue({ data: campaigns, pagination: emptyPagination })
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({
                list: { data: products, pagination: emptyPagination },
                brandIds: [],
                categoryIds: [],
                categories: {},
            })

            const result = await useCase.getOffers(5)

            expect(productRepository.getProductSearch).toHaveBeenCalledWith({
                id: ["p1", "p2"],
                page: 1,
                pageSize: 2,
            })
            expect(result[0].products).toHaveLength(2)
        })
    })

    describe("getBodyBanners", () => {
        it("should use guest position when not authenticated", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: [], pagination: emptyPagination })
            await useCase.getBodyBanners()
            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                positions: [MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_BANNER_BODY, MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_BODY],
                page: 1,
                pageSize: 3,
            })
        })

        it("should use logged position when authenticated", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: [], pagination: emptyPagination })
            await useCase.getBodyBanners()
            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                positions: [MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_BANNER_BODY, MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_BODY],
                page: 1,
                pageSize: 3,
            })
        })

        it("should return the banner list from repository", async () => {
            const banners = [buildBanner({ id: "bb-1" }), buildBanner({ id: "bb-2" })]
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({
                data: banners,
                pagination: { ...emptyPagination, total: 2, totalPages: 1 },
            })
            const result = await useCase.getBodyBanners()
            expect(result.data).toHaveLength(2)
        })

        it("should return empty list when no banners exist", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue({ data: [], pagination: emptyPagination })
            const result = await useCase.getBodyBanners()
            expect(result.data).toHaveLength(0)
        })

        it("should propagate errors from repository", async () => {
            vi.mocked(bannerRepository.getBanners).mockRejectedValue(new Error("Body banner error"))
            await expect(useCase.getBodyBanners()).rejects.toThrow("Body banner error")
        })
    })

    describe("fetchProductsByCampaign", () => {
        it("should return empty map when no campaigns are provided", async () => {
            const result = await useCase.fetchProductsByCampaign([])
            expect(result.size).toBe(0)
        })

        it("should fetch products using productIds when no priorityProducts are set", async () => {
            const campaigns: ProductsCampaign[] = [
                buildCampaign({ id: "c-1", productIds: ["p1", "p2"] }),
            ]
            const products = [buildProduct({ id: "p1" }), buildProduct({ id: "p2" })]
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({
                list: { data: products, pagination: emptyPagination },
                brandIds: [],
                categoryIds: [],
                categories: {},
            })

            const result = await useCase.fetchProductsByCampaign(campaigns)

            expect(productRepository.getProductSearch).toHaveBeenCalledWith({
                id: ["p1", "p2"],
                page: 1,
                pageSize: 2,
            })
            expect(result.get("c-1")).toHaveLength(2)
            expect(result.get("c-1")?.[0].id).toBe("p1")
        })

        it("should fetch products using priorityProducts when available", async () => {
            const campaigns: ProductsCampaign[] = [
                buildCampaign({ id: "c-1", productIds: ["p1", "p2", "p3"], priorityProducts: ["p2", "p1"] }),
            ]
            const products = [buildProduct({ id: "p2" }), buildProduct({ id: "p1" }), buildProduct({ id: "p3" })]
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({
                list: { data: products, pagination: emptyPagination },
                brandIds: [],
                categoryIds: [],
                categories: {},
            })

            const result = await useCase.fetchProductsByCampaign(campaigns)

            expect(productRepository.getProductSearch).toHaveBeenCalledWith({
                id: ["p2", "p1", "p3"],
                page: 1,
                pageSize: 3,
            })
            expect(result.get("c-1")).toHaveLength(3)
        })

        it("should order products by priorityProducts order", async () => {
            const campaigns: ProductsCampaign[] = [
                buildCampaign({ id: "c-1", productIds: ["p1", "p2", "p3"], priorityProducts: ["p3", "p1"] }),
            ]
            const products = [buildProduct({ id: "p3" }), buildProduct({ id: "p1" })]
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({
                list: { data: products, pagination: emptyPagination },
                brandIds: [],
                categoryIds: [],
                categories: {},
            })

            const result = await useCase.fetchProductsByCampaign(campaigns)

            expect(result.get("c-1")?.[0].id).toBe("p3")
            expect(result.get("c-1")?.[1].id).toBe("p1")
        })

        it("should append non-priority products after priority products", async () => {
            const campaigns: ProductsCampaign[] = [
                buildCampaign({ id: "c-1", productIds: ["p1", "p2", "p3"], priorityProducts: ["p2"] }),
            ]
            const products = [buildProduct({ id: "p2" }), buildProduct({ id: "p1" }), buildProduct({ id: "p3" })]
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({
                list: { data: products, pagination: emptyPagination },
                brandIds: [],
                categoryIds: [],
                categories: {},
            })

            const result = await useCase.fetchProductsByCampaign(campaigns)

            expect(result.get("c-1")?.[0].id).toBe("p2")
            expect(result.get("c-1")?.[1].id).toBe("p1")
            expect(result.get("c-1")?.[2].id).toBe("p3")
        })

        it("should handle multiple campaigns", async () => {
            const campaigns: ProductsCampaign[] = [
                buildCampaign({ id: "c-1", productIds: ["p1"] }),
                buildCampaign({ id: "c-2", productIds: ["p2"] }),
            ]
            vi.mocked(productRepository.getProductSearch)
                .mockResolvedValueOnce({
                    list: { data: [buildProduct({ id: "p1" })], pagination: emptyPagination },
                    brandIds: [],
                    categoryIds: [],
                    categories: {},
                })
                .mockResolvedValueOnce({
                    list: { data: [buildProduct({ id: "p2" })], pagination: emptyPagination },
                    brandIds: [],
                    categoryIds: [],
                    categories: {},
                })

            const result = await useCase.fetchProductsByCampaign(campaigns)

            expect(result.get("c-1")).toHaveLength(1)
            expect(result.get("c-2")).toHaveLength(1)
            expect(result.get("c-1")?.[0].id).toBe("p1")
            expect(result.get("c-2")?.[0].id).toBe("p2")
        })

        it("should propagate errors from productRepository", async () => {
            const campaigns: ProductsCampaign[] = [
                buildCampaign({ id: "c-1", productIds: ["p1"] }),
            ]
            vi.mocked(productRepository.getProductSearch).mockRejectedValue(new Error("Product fetch error"))

            await expect(useCase.fetchProductsByCampaign(campaigns)).rejects.toThrow("Product fetch error")
        })
    })
})
