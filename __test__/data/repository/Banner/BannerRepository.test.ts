import {describe, it, expect, vi, beforeEach} from "vitest"
import {MarketingPositions} from "@/domain/entity/Marketing/marketing"

const algoliaSearchMock = vi.fn()
vi.mock("@/data/provider/algolia/algoliaClient", () => ({
    default: class {
        search = algoliaSearchMock
    },
}))

vi.mock("@/data/adapters/Banner/bannerAdapter", () => ({
    getBannerAdapter: vi.fn((hit) => ({
        id: hit.objectID,
        title: hit.title,
        subtitle: hit.subtitle,
        description: hit.description,
        summary: hit.summary,
        link: hit.link,
        linkText: hit.callToAction,
        textColor: hit.textColor,
        isOutstanding: hit.isOutstanding,
        segmentCodes: hit.segmentCodes || [],
        positions: hit.positions || [],
        priority: hit.priority || 0,
        image: {
            desktopUrl: hit.desktopBackgroundImageUrl || "",
            mobileUrl: hit.mobileBackgroundImageUrl || "",
        },
    })),
}))

describe("when interacting with BannerRepository", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        process.env.NEXT_PUBLIC_PROGRAM_ID = "test-program-id"
    })

    describe("getBanners", () => {
        it("should call algoliaClient.search with correct params", async () => {
            vi.resetModules()

            algoliaSearchMock.mockResolvedValue({
                list: {
                    data: [],
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        total: 0,
                        totalPages: 0,
                    },
                },
            })

            const {default: BannerRepository} = await import("@/data/repository/Banner/BannerRepository")
            const repository = new BannerRepository()

            await repository.getBanners({
                page: 1,
                pageSize: 10,
                positions: [MarketingPositions.HOME_NOT_LOGGED_MAIN_CAROUSEL],
            })

            expect(algoliaSearchMock).toHaveBeenCalledWith({
                params: {
                    page: 1,
                    pageSize: 10,
                    positions: [MarketingPositions.HOME_NOT_LOGGED_MAIN_CAROUSEL],
                    componentType: "banner",
                    programId: "test-program-id",
                },
                adapter: expect.any(Function),
                nameMap: {
                    positions: "positions.name",
                    category: "bannerCategory.slug",
                },
            })
        })

        it("should return list of banners from algolia response", async () => {
            vi.resetModules()

            const mockBanners = [
                {
                    objectID: "banner-1",
                    title: "Acumula Millas",
                    subtitle: "Gana hasta 5x millas",
                    description: "Compra en nuestros aliados",
                    summary: "Promoción especial",
                    link: "/promotions",
                    callToAction: "Ver más",
                    textColor: "#FFFFFF",
                    isOutstanding: true,
                    segmentCodes: ["premium"],
                    positions: [MarketingPositions.HOME_NOT_LOGGED_MAIN_CAROUSEL],
                    priority: 1,
                    desktopBackgroundImageUrl: "https://example.com/desktop.jpg",
                    mobileBackgroundImageUrl: "https://example.com/mobile.jpg",
                },
                {
                    objectID: "banner-2",
                    title: "Viaja por el Mundo",
                    subtitle: "Destinos exclusivos",
                    description: "Canjea tus millas",
                    summary: "Programa de viajes",
                    link: "/travel",
                    callToAction: "Explorar",
                    textColor: "#000000",
                    isOutstanding: false,
                    segmentCodes: ["standard"],
                    positions: [MarketingPositions.HOME_NOT_LOGGED_MAIN_CAROUSEL],
                    priority: 2,
                    desktopBackgroundImageUrl: "https://example.com/desktop2.jpg",
                    mobileBackgroundImageUrl: "https://example.com/mobile2.jpg",
                },
            ]

            algoliaSearchMock.mockResolvedValue({
                list: {
                    data: mockBanners.map((banner) => ({
                        id: banner.objectID,
                        title: banner.title,
                        subtitle: banner.subtitle,
                        description: banner.description,
                        summary: banner.summary,
                        link: banner.link,
                        linkText: banner.callToAction,
                        textColor: banner.textColor,
                        isOutstanding: banner.isOutstanding,
                        segmentCodes: banner.segmentCodes,
                        positions: banner.positions,
                        priority: banner.priority,
                        image: {
                            desktopUrl: banner.desktopBackgroundImageUrl,
                            mobileUrl: banner.mobileBackgroundImageUrl,
                        },
                    })),
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        total: 2,
                        totalPages: 1,
                    },
                },
            })

            const {default: BannerRepository} = await import("@/data/repository/Banner/BannerRepository")
            const repository = new BannerRepository()

            const result = await repository.getBanners({
                page: 1,
                pageSize: 10,
            })

            expect(result.data).toHaveLength(2)
            expect(result.data[0].id).toBe("banner-1")
            expect(result.data[0].title).toBe("Acumula Millas")
            expect(result.data[1].id).toBe("banner-2")
            expect(result.pagination.page).toBe(1)
            expect(result.pagination.total).toBe(2)
        })

        it("should pass priority filter to algolia", async () => {
            vi.resetModules()

            algoliaSearchMock.mockResolvedValue({
                list: {
                    data: [],
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        total: 0,
                        totalPages: 0,
                    },
                },
            })

            const {default: BannerRepository} = await import("@/data/repository/Banner/BannerRepository")
            const repository = new BannerRepository()

            await repository.getBanners({
                page: 1,
                pageSize: 10,
                priority: 1,
            })

            expect(algoliaSearchMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    params: expect.objectContaining({
                        priority: 1,
                    }),
                })
            )
        })

        it("should pass isOutstanding filter to algolia", async () => {
            vi.resetModules()

            algoliaSearchMock.mockResolvedValue({
                list: {
                    data: [],
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        total: 0,
                        totalPages: 0,
                    },
                },
            })

            const {default: BannerRepository} = await import("@/data/repository/Banner/BannerRepository")
            const repository = new BannerRepository()

            await repository.getBanners({
                page: 1,
                pageSize: 10,
                isOutstanding: true,
            })

            expect(algoliaSearchMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    params: expect.objectContaining({
                        isOutstanding: true,
                    }),
                })
            )
        })

        it("should always include componentType as banner", async () => {
            vi.resetModules()

            algoliaSearchMock.mockResolvedValue({
                list: {
                    data: [],
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        total: 0,
                        totalPages: 0,
                    },
                },
            })

            const {default: BannerRepository} = await import("@/data/repository/Banner/BannerRepository")
            const repository = new BannerRepository()

            await repository.getBanners({
                page: 1,
                pageSize: 10,
            })

            expect(algoliaSearchMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    params: expect.objectContaining({
                        componentType: "banner",
                    }),
                })
            )
        })

        it("should include programId from environment", async () => {
            vi.resetModules()

            algoliaSearchMock.mockResolvedValue({
                list: {
                    data: [],
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        total: 0,
                        totalPages: 0,
                    },
                },
            })

            const {default: BannerRepository} = await import("@/data/repository/Banner/BannerRepository")
            const repository = new BannerRepository()

            await repository.getBanners({
                page: 1,
                pageSize: 10,
            })

            expect(algoliaSearchMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    params: expect.objectContaining({
                        programId: "test-program-id",
                    }),
                })
            )
        })

        it("should use getBannerAdapter for mapping hits", async () => {
            vi.resetModules()

            const {getBannerAdapter} = await import("@/data/adapters/Banner/bannerAdapter")

            algoliaSearchMock.mockResolvedValue({
                list: {
                    data: [],
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        total: 0,
                        totalPages: 0,
                    },
                },
            })

            const {default: BannerRepository} = await import("@/data/repository/Banner/BannerRepository")
            const repository = new BannerRepository()

            await repository.getBanners({
                page: 1,
                pageSize: 10,
            })

            expect(algoliaSearchMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    adapter: getBannerAdapter,
                })
            )
        })

        it("should apply nameMap for positions field", async () => {
            vi.resetModules()

            algoliaSearchMock.mockResolvedValue({
                list: {
                    data: [],
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        total: 0,
                        totalPages: 0,
                    },
                },
            })

            const {default: BannerRepository} = await import("@/data/repository/Banner/BannerRepository")
            const repository = new BannerRepository()

            await repository.getBanners({
                page: 1,
                pageSize: 10,
            })

            expect(algoliaSearchMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    nameMap: {
                        positions: "positions.name",
                        category: "bannerCategory.slug",
                    },
                })
            )
        })
    })
})
