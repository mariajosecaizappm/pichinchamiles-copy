import { describe, it, expect, vi, beforeEach } from "vitest"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"
import type IBannerRepository from "@/domain/repository/Banner/IBannerRepository"
import GetOffersPromoBannersUseCase from "@/domain/interactors/Offers/GetOffersPromoBannersUseCase"

describe("GetOffersPromoBannersUseCase", () => {
    let bannerRepository: IBannerRepository
    let useCase: GetOffersPromoBannersUseCase

    const mockBannerList = {
        data: [
            {
                id: "banner-1",
                title: "Promo Banner",
                subtitle: "Subtitle",
                description: "",
                summary: "",
                link: "",
                textColor: "",
                isOutstanding: false,
                segmentCodes: [],
                positions: [],
                priority: 1,
                image: { desktopUrl: "/desktop.jpg", mobileUrl: "/mobile.jpg" },
                campaignId: "c-1",
            },
        ],
        pagination: { page: 1, pageSize: 4, total: 1, totalPages: 1 },
    }

    const emptyBannerList = {
        data: [],
        pagination: { page: 1, pageSize: 4, total: 0, totalPages: 0 },
    }

    beforeEach(() => {
        bannerRepository = {
            getBanners: vi.fn(),
        } as unknown as IBannerRepository

        useCase = new GetOffersPromoBannersUseCase(bannerRepository)
    })

    describe("getPromotionBanners", () => {
        it("should call getBanners with OFFERS_GUEST_BANNER_PROMOTIONAL_PRODUCTS when not logged and type is products", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue(emptyBannerList)

            await useCase.getPromotionBanners(false, "products")

            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                positions: [MarketingPositions.OFFERS_GUEST_BANNER_PROMOTIONAL_PRODUCTS],
                page: 1,
                pageSize: 4,
            })
        })

        it("should call getBanners with OFFERS_GUEST_BANNER_PROMOTIONAL_ACTIVITIES when not logged and type is activities", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue(emptyBannerList)

            await useCase.getPromotionBanners(false, "activities")

            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                positions: [MarketingPositions.OFFERS_GUEST_BANNER_PROMOTIONAL_ACTIVITIES],
                page: 1,
                pageSize: 4,
            })
        })

        it("should call getBanners with OFFERS_AUTH_BANNER_PROMOTIONAL_PRODUCTS when logged and type is products", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue(emptyBannerList)

            await useCase.getPromotionBanners(true, "products")

            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                positions: [MarketingPositions.OFFERS_AUTH_BANNER_PROMOTIONAL_PRODUCTS],
                page: 1,
                pageSize: 4,
            })
        })

        it("should call getBanners with OFFERS_AUTH_BANNER_PROMOTIONAL_ACTIVITIES when logged and type is activities", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue(emptyBannerList)

            await useCase.getPromotionBanners(true, "activities")

            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                positions: [MarketingPositions.OFFERS_AUTH_BANNER_PROMOTIONAL_ACTIVITIES],
                page: 1,
                pageSize: 4,
            })
        })

        it("should return the banner list from the repository", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue(mockBannerList)

            const result = await useCase.getPromotionBanners(false, "products")

            expect(result).toEqual(mockBannerList)
            expect(result.data).toHaveLength(1)
            expect(result.data[0].id).toBe("banner-1")
        })

        it("should always request page 1 with 4 items per page", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue(emptyBannerList)

            await useCase.getPromotionBanners(true, "activities")

            expect(bannerRepository.getBanners).toHaveBeenCalledWith(
                expect.objectContaining({ page: 1, pageSize: 4 }),
            )
        })

        it("should propagate errors from the repository", async () => {
            vi.mocked(bannerRepository.getBanners).mockRejectedValue(new Error("Repository error"))

            await expect(useCase.getPromotionBanners(false, "products")).rejects.toThrow("Repository error")
        })
    })
})
