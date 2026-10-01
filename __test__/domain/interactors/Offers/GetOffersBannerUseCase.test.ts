import { describe, it, expect, vi, beforeEach } from "vitest"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"
import type IBannerRepository from "@/domain/repository/Banner/IBannerRepository"
import GetOffersBannerUseCase from "@/domain/interactors/Offers/GetOffersBannerUseCase"

describe("GetOffersBannerUseCase", () => {
    let bannerRepository: IBannerRepository
    let useCase: GetOffersBannerUseCase

    const mockBannerList = {
        data: [
            {
                id: "banner-1",
                title: "Ofertas Banner",
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
        pagination: { page: 1, pageSize: 10, total: 1, totalPages: 1 },
    }

    const emptyBannerList = {
        data: [],
        pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
    }

    beforeEach(() => {
        bannerRepository = {
            getBanners: vi.fn(),
        } as unknown as IBannerRepository

        useCase = new GetOffersBannerUseCase(bannerRepository)
    })

    describe("getTopBanner", () => {
        it("should call getBanners with OFFERS_GUEST_MAIN_BANNER_PRODUCTS when not logged and type is products", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue(emptyBannerList)

            await useCase.getTopBanner(false, "products")

            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                positions: [MarketingPositions.OFFERS_GUEST_MAIN_BANNER_PRODUCTS],
                page: 1,
                pageSize: 1,
            })
        })

        it("should call getBanners with OFFERS_GUEST_MAIN_BANNER_ACTIVITIES when not logged and type is activities", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue(emptyBannerList)

            await useCase.getTopBanner(false, "activities")

            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                positions: [MarketingPositions.OFFERS_GUEST_MAIN_BANNER_ACTIVITIES],
                page: 1,
                pageSize: 1,
            })
        })

        it("should call getBanners with OFFERS_AUTH_MAIN_BANNER_PRODUCTS when logged and type is products", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue(emptyBannerList)

            await useCase.getTopBanner(true, "products")

            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                positions: [MarketingPositions.OFFERS_AUTH_MAIN_BANNER_PRODUCTS],
                page: 1,
                pageSize: 1,
            })
        })

        it("should call getBanners with OFFERS_AUTH_MAIN_BANNER_ACTIVITIES when logged and type is activities", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue(emptyBannerList)

            await useCase.getTopBanner(true, "activities")

            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                positions: [MarketingPositions.OFFERS_AUTH_MAIN_BANNER_ACTIVITIES],
                page: 1,
                pageSize: 1,
            })
        })

        it("should return the banner list from the repository", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue(mockBannerList)

            const result = await useCase.getTopBanner(false, "products")

            expect(result).toEqual(mockBannerList)
            expect(result.data).toHaveLength(1)
            expect(result.data[0].id).toBe("banner-1")
        })

        it("should return empty list when no banners are found", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue(emptyBannerList)

            const result = await useCase.getTopBanner(false, "products")

            expect(result.data).toHaveLength(0)
            expect(result.pagination.total).toBe(0)
        })

        it("should always request page 1 with 1 item per page", async () => {
            vi.mocked(bannerRepository.getBanners).mockResolvedValue(emptyBannerList)

            await useCase.getTopBanner(true, "activities")

            expect(bannerRepository.getBanners).toHaveBeenCalledWith(
                expect.objectContaining({ page: 1, pageSize: 1 })
            )
        })

        it("should propagate errors from the repository", async () => {
            vi.mocked(bannerRepository.getBanners).mockRejectedValue(new Error("Repository error"))

            await expect(useCase.getTopBanner(false, "products")).rejects.toThrow("Repository error")
        })
    })
})
