import {describe, it, expect, vi, beforeEach} from "vitest"
import {MarketingPositions} from "@/domain/entity/Marketing/marketing"
import type IBannerRepository from "@/domain/repository/Banner/IBannerRepository"
import type ICampaignRepository from "@/domain/repository/Campaign/ICampaignRepository"
import GetHomeContentUseCase from "@/domain/interactors/Home/GetHomeContentUseCase"

describe("GetHomeContentUseCase", () => {
    let bannerRepository: IBannerRepository
    let campaignRepository: ICampaignRepository
    let useCase: GetHomeContentUseCase

    beforeEach(() => {
        bannerRepository = {
            getBanners: vi.fn(),
        } as unknown as IBannerRepository

        campaignRepository = {
            getCampaigns: vi.fn(),
        } as unknown as ICampaignRepository

        useCase = new GetHomeContentUseCase(bannerRepository, campaignRepository)
    })

    describe("getBanners", () => {
        it("should call bannerRepository.getBanners with correct params", async () => {
            const mockBannerList = {
                data: [],
                pagination: {
                    page: 1,
                    pageSize: 10,
                    total: 0,
                    totalPages: 0,
                },
            }

            vi.mocked(bannerRepository.getBanners).mockResolvedValue(mockBannerList)

            await useCase.getBanners()

            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                positions: [MarketingPositions.HOME_NOT_LOGGED_MAIN_CAROUSEL],
                page: 1,
                pageSize: 10,
            })
        })

        it("should return the banner list from repository", async () => {
            const mockBanners = [
                {
                    id: "banner-1",
                    title: "Acumula Millas",
                    subtitle: "Gana hasta 5x millas",
                    description: "Compra en nuestros aliados",
                    summary: "Promoción especial",
                    link: "/promotions",
                    linkText: "Ver más",
                    textColor: "#FFFFFF",
                    isOutstanding: true,
                    segmentCodes: ["premium"],
                    positions: [MarketingPositions.HOME_NOT_LOGGED_MAIN_CAROUSEL],
                    priority: 1,
                    image: {
                        desktopUrl: "https://example.com/desktop.jpg",
                        mobileUrl: "https://example.com/mobile.jpg",
                    },
                    campaignId: "campaign-1",
                },
                {
                    id: "banner-2",
                    title: "Viaja por el Mundo",
                    subtitle: "Destinos exclusivos",
                    description: "Canjea tus millas",
                    summary: "Programa de viajes",
                    link: "/travel",
                    linkText: "Explorar",
                    textColor: "#000000",
                    isOutstanding: false,
                    segmentCodes: ["standard"],
                    positions: [MarketingPositions.HOME_NOT_LOGGED_MAIN_CAROUSEL],
                    priority: 2,
                    image: {
                        desktopUrl: "https://example.com/desktop2.jpg",
                        mobileUrl: "https://example.com/mobile2.jpg",
                    },
                    campaignId: "campaign-2",
                },
            ]

            const mockBannerList = {
                data: mockBanners,
                pagination: {
                    page: 1,
                    pageSize: 10,
                    total: 2,
                    totalPages: 1,
                },
            }

            vi.mocked(bannerRepository.getBanners).mockResolvedValue(mockBannerList)

            const result = await useCase.getBanners()

            expect(result).toEqual(mockBannerList)
            expect(result.data).toHaveLength(2)
            expect(result.data[0].id).toBe("banner-1")
            expect(result.data[1].id).toBe("banner-2")
        })

        it("should return empty list when no banners are found", async () => {
            const mockBannerList = {
                data: [],
                pagination: {
                    page: 1,
                    pageSize: 10,
                    total: 0,
                    totalPages: 0,
                },
            }

            vi.mocked(bannerRepository.getBanners).mockResolvedValue(mockBannerList)

            const result = await useCase.getBanners()

            expect(result.data).toHaveLength(0)
            expect(result.pagination.total).toBe(0)
        })

        it("should always request HOME_NOT_LOGGED_MAIN_CAROUSEL position", async () => {
            const mockBannerList = {
                data: [],
                pagination: {
                    page: 1,
                    pageSize: 10,
                    total: 0,
                    totalPages: 0,
                },
            }

            vi.mocked(bannerRepository.getBanners).mockResolvedValue(mockBannerList)

            await useCase.getBanners()

            expect(bannerRepository.getBanners).toHaveBeenCalledWith(
                expect.objectContaining({
                    positions: [MarketingPositions.HOME_NOT_LOGGED_MAIN_CAROUSEL],
                })
            )
        })

        it("should always request page 1 with 10 items per page", async () => {
            const mockBannerList = {
                data: [],
                pagination: {
                    page: 1,
                    pageSize: 10,
                    total: 0,
                    totalPages: 0,
                },
            }

            vi.mocked(bannerRepository.getBanners).mockResolvedValue(mockBannerList)

            await useCase.getBanners()

            expect(bannerRepository.getBanners).toHaveBeenCalledWith(
                expect.objectContaining({
                    page: 1,
                    pageSize: 10,
                })
            )
        })

        it("should propagate errors from repository", async () => {
            const error = new Error("Repository error")
            vi.mocked(bannerRepository.getBanners).mockRejectedValue(error)

            await expect(useCase.getBanners()).rejects.toThrow("Repository error")
        })
    })

    describe("getMainBanner", () => {
        it("should call bannerRepository.getBanners with pageSize 1", async () => {
            const mockBannerList = {
                data: [],
                pagination: { page: 1, pageSize: 1, total: 0, totalPages: 0 },
            }

            vi.mocked(bannerRepository.getBanners).mockResolvedValue(mockBannerList)

            await useCase.getMainBanner()

            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                positions: [MarketingPositions.HOME_NOT_LOGGED_MAIN_CAROUSEL],
                page: 1,
                pageSize: 1,
            })
        })

        it("should return the first banner when banners exist", async () => {
            const mockBanner = {
                id: "banner-1",
                title: "Main banner",
                subtitle: "",
                description: "",
                summary: "",
                link: "/",
                linkText: "",
                textColor: "#fff",
                isOutstanding: true,
                segmentCodes: [],
                positions: [MarketingPositions.HOME_NOT_LOGGED_MAIN_CAROUSEL],
                priority: 1,
                image: { desktopUrl: "https://example.com/d.jpg", mobileUrl: "https://example.com/m.jpg" },
                campaignId: "campaign-1",
            }
            const mockBannerList = {
                data: [mockBanner],
                pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
            }

            vi.mocked(bannerRepository.getBanners).mockResolvedValue(mockBannerList)

            const result = await useCase.getMainBanner()

            expect(result).toEqual(mockBanner)
        })

        it("should return null when no banners are found", async () => {
            const mockBannerList = {
                data: [],
                pagination: { page: 1, pageSize: 1, total: 0, totalPages: 0 },
            }

            vi.mocked(bannerRepository.getBanners).mockResolvedValue(mockBannerList)

            const result = await useCase.getMainBanner()

            expect(result).toBeNull()
        })

        it("should propagate errors from repository", async () => {
            vi.mocked(bannerRepository.getBanners).mockRejectedValue(new Error("Fetch error"))

            await expect(useCase.getMainBanner()).rejects.toThrow("Fetch error")
        })
    })

    describe("getHomeRedemptionCategories", () => {
        it("should call bannerRepository.getBanners with redemption categories position", async () => {
            const mockBannerList = {
                data: [],
                pagination: {page: 1, pageSize: 10, total: 0, totalPages: 0},
            }

            vi.mocked(bannerRepository.getBanners).mockResolvedValue(mockBannerList)

            await useCase.getHomeRedemptionCategories()

            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                positions: [MarketingPositions.HOME_NOT_LOGGED_REDEMPTION_CATEGORIES],
                page: 1,
                pageSize: 10,
            })
        })

        it("should return the redemption categories from repository", async () => {
            const mockBannerList = {
                data: [{
                    id: "cat-1",
                    title: "Productos",
                    subtitle: "Sub",
                    description: "Desc",
                    summary: "Summary",
                    link: "/productos",
                    linkText: "Ver productos",
                    textColor: "#000",
                    isOutstanding: false,
                    segmentCodes: [],
                    positions: [MarketingPositions.HOME_NOT_LOGGED_REDEMPTION_CATEGORIES],
                    priority: 1,
                    image: {desktopUrl: "https://example.com/d.jpg", mobileUrl: "https://example.com/m.jpg"},
                }],
                pagination: {page: 1, pageSize: 10, total: 1, totalPages: 1},
            }

            vi.mocked(bannerRepository.getBanners).mockResolvedValue(mockBannerList)

            const result = await useCase.getHomeRedemptionCategories()

            expect(result).toEqual(mockBannerList)
            expect(result.data).toHaveLength(1)
        })

        it("should propagate errors from repository", async () => {
            vi.mocked(bannerRepository.getBanners).mockRejectedValue(new Error("Fetch error"))

            await expect(useCase.getHomeRedemptionCategories()).rejects.toThrow("Fetch error")
        })
    })

    describe("getFeaturedRewards", () => {
        it("should call bannerRepository.getBanners with correct params", async () => {
            const mockBannerList = {
                data: [],
                pagination: {page: 1, pageSize: 10, total: 0, totalPages: 0},
            }

            vi.mocked(bannerRepository.getBanners).mockResolvedValue(mockBannerList)

            await useCase.getFeaturedRewards()

            expect(bannerRepository.getBanners).toHaveBeenCalledWith({
                positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
                page: 1,
                pageSize: 10,
            })
        })

        it("should return banners from repository", async () => {
            const mockBanners = [
                {
                    id: "b-1",
                    title: "Banner 1",
                    subtitle: "5000",
                    description: "",
                    summary: "",
                    link: "#",
                    textColor: "",
                    isOutstanding: true,
                    positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
                    segmentCodes: [],
                    image: {desktopUrl: "https://example.com/d1.jpg", mobileUrl: "https://example.com/m1.jpg"},
                    priority: 1,
                    campaignId: "campaign-1",
                },
                {
                    id: "b-2",
                    title: "Banner 2",
                    subtitle: "3000",
                    description: "",
                    summary: "",
                    link: "#",
                    textColor: "",
                    isOutstanding: true,
                    positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
                    segmentCodes: [],
                    image: {desktopUrl: "https://example.com/d2.jpg", mobileUrl: "https://example.com/m2.jpg"},
                    priority: 2,
                    campaignId: "campaign-2",
                },
            ]

            const mockBannerList = {
                data: mockBanners,
                pagination: {page: 1, pageSize: 10, total: 2, totalPages: 1},
            }

            vi.mocked(bannerRepository.getBanners).mockResolvedValue(mockBannerList)

            const result = await useCase.getFeaturedRewards()

            expect(result.data).toHaveLength(2)
            expect(result.data[0].id).toBe("b-1")
            expect(result.data[1].id).toBe("b-2")
        })

        it("should return empty list when no banners are found", async () => {
            const mockBannerList = {
                data: [],
                pagination: {page: 1, pageSize: 10, total: 0, totalPages: 0},
            }

            vi.mocked(bannerRepository.getBanners).mockResolvedValue(mockBannerList)

            const result = await useCase.getFeaturedRewards()

            expect(result.data).toHaveLength(0)
            expect(result.pagination.total).toBe(0)
        })

        it("should propagate errors from repository", async () => {
            vi.mocked(bannerRepository.getBanners).mockRejectedValue(new Error("Banner fetch error"))

            await expect(useCase.getFeaturedRewards()).rejects.toThrow("Banner fetch error")
        })

        it("should preserve pagination data in response", async () => {
            const mockBannerList = {
                data: [],
                pagination: {page: 1, pageSize: 10, total: 25, totalPages: 3},
            }

            vi.mocked(bannerRepository.getBanners).mockResolvedValue(mockBannerList)

            const result = await useCase.getFeaturedRewards()

            expect(result.pagination).toEqual({
                page: 1,
                pageSize: 10,
                total: 25,
                totalPages: 3,
            })
        })
    })
})
