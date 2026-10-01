import {describe, it, expect, vi, beforeEach} from "vitest"
import {CampaignType, CampaignStatus} from "@/domain/entity/Campaign/campaign"
import {MarketingPositions} from "@/domain/entity/Marketing/marketing"

const algoliaSearchMock = vi.fn()

vi.mock("@/data/provider/algolia/algoliaClient", () => ({
    default: class {
        search = algoliaSearchMock
    },
}))

describe("CampaignRepository", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        process.env.NEXT_PUBLIC_PROGRAM_ID = "test-program-id"
    })

    describe("getCampaigns", () => {
        it("should call algoliaClient.search with correct params", async () => {
            vi.resetModules()

            algoliaSearchMock.mockResolvedValue({
                list: {
                    data: [],
                    pagination: {page: 1, pageSize: 10, total: 0, totalPages: 0},
                },
            })

            const {default: CampaignRepository} = await import("@/data/repository/Campaign/CampaignRepository")
            const repository = new CampaignRepository()

            await repository.getCampaigns({
                positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
                page: 1,
                pageSize: 10,
            })

            expect(algoliaSearchMock).toHaveBeenCalledWith({
                params: {
                    positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
                    page: 1,
                    pageSize: 10,
                    componentType: "campaign",
                    programId: "test-program-id",
                },
                adapter: expect.any(Function),
                nameMap: {
                    positions: "positions.name"
                }
            })
        })

        it("should return list of campaigns", async () => {
            vi.resetModules()

            const mockCampaigns = [
                {
                    id: "c-1",
                    mainTitle: "Producto A",
                    slug: "producto-a",
                    isOutstanding: true,
                    positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
                    segmentCodes: [],
                    hasLanding: false,
                    image: {desktopUrl: "https://example.com/d.jpg", mobileUrl: "https://example.com/m.jpg"},
                    numberElementsSlide: 3,
                    order: 1,
                    status: CampaignStatus.ACTIVE,
                    priority: 1,
                    campaignType: CampaignType.PRODUCTS,
                    categories: [],
                    productIds: [],
                    priorityProducts: [],
                },
                {
                    id: "c-2",
                    mainTitle: "Producto B",
                    slug: "producto-b",
                    isOutstanding: true,
                    positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
                    segmentCodes: [],
                    hasLanding: false,
                    image: {desktopUrl: "https://example.com/d2.jpg", mobileUrl: "https://example.com/m2.jpg"},
                    numberElementsSlide: 3,
                    order: 2,
                    status: CampaignStatus.ACTIVE,
                    priority: 2,
                    campaignType: CampaignType.PRODUCTS,
                    categories: [],
                    productIds: [],
                    priorityProducts: [],
                },
            ]

            algoliaSearchMock.mockResolvedValue({
                list: {
                    data: mockCampaigns,
                    pagination: {page: 1, pageSize: 10, total: 2, totalPages: 1},
                },
            })

            const {default: CampaignRepository} = await import("@/data/repository/Campaign/CampaignRepository")
            const repository = new CampaignRepository()

            const result = await repository.getCampaigns({
                positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
                page: 1,
                pageSize: 10,
            })

            expect(result.data).toEqual(mockCampaigns)
            expect(result.data).toHaveLength(2)
            expect(result.pagination.total).toBe(2)
        })

        it("should return empty list when no campaigns found", async () => {
            vi.resetModules()

            algoliaSearchMock.mockResolvedValue({
                list: {
                    data: [],
                    pagination: {page: 1, pageSize: 10, total: 0, totalPages: 0},
                },
            })

            const {default: CampaignRepository} = await import("@/data/repository/Campaign/CampaignRepository")
            const repository = new CampaignRepository()

            const result = await repository.getCampaigns({
                positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
                page: 1,
                pageSize: 10,
            })

            expect(result.data).toEqual([])
            expect(result.data).toHaveLength(0)
        })

        it("should handle algolia search errors", async () => {
            vi.resetModules()

            algoliaSearchMock.mockRejectedValue(new Error("Algolia search failed"))

            const {default: CampaignRepository} = await import("@/data/repository/Campaign/CampaignRepository")
            const repository = new CampaignRepository()

            await expect(
                repository.getCampaigns({
                    positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
                    page: 1,
                    pageSize: 10,
                })
            ).rejects.toThrow("Algolia search failed")
        })

        it("should include componentType campaign in params", async () => {
            vi.resetModules()

            algoliaSearchMock.mockResolvedValue({
                list: {
                    data: [],
                    pagination: {page: 1, pageSize: 10, total: 0, totalPages: 0},
                },
            })

            const {default: CampaignRepository} = await import("@/data/repository/Campaign/CampaignRepository")
            const repository = new CampaignRepository()

            await repository.getCampaigns({
                positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
                page: 1,
                pageSize: 10,
            })

            expect(algoliaSearchMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    params: expect.objectContaining({
                        componentType: "campaign",
                    }),
                })
            )
        })

        it("should include programId from environment in params", async () => {
            vi.resetModules()

            algoliaSearchMock.mockResolvedValue({
                list: {
                    data: [],
                    pagination: {page: 1, pageSize: 10, total: 0, totalPages: 0},
                },
            })

            const {default: CampaignRepository} = await import("@/data/repository/Campaign/CampaignRepository")
            const repository = new CampaignRepository()

            await repository.getCampaigns({
                positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
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

        it("should use nameMap for positions field", async () => {
            vi.resetModules()

            algoliaSearchMock.mockResolvedValue({
                list: {
                    data: [],
                    pagination: {page: 1, pageSize: 10, total: 0, totalPages: 0},
                },
            })

            const {default: CampaignRepository} = await import("@/data/repository/Campaign/CampaignRepository")
            const repository = new CampaignRepository()

            await repository.getCampaigns({
                positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
                page: 1,
                pageSize: 10,
            })

            expect(algoliaSearchMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    nameMap: {
                        positions: "positions.name"
                    }
                })
            )
        })

        it("should pass adapter function to algolia search", async () => {
            vi.resetModules()

            algoliaSearchMock.mockResolvedValue({
                list: {
                    data: [],
                    pagination: {page: 1, pageSize: 10, total: 0, totalPages: 0},
                },
            })

            const {default: CampaignRepository} = await import("@/data/repository/Campaign/CampaignRepository")
            const repository = new CampaignRepository()

            await repository.getCampaigns({
                positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
                page: 1,
                pageSize: 10,
            })

            expect(algoliaSearchMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    adapter: expect.any(Function),
                })
            )
        })
    })
})
