import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { CampaignStatus, CampaignType, ExperienceCampaign } from "@/domain/entity/Campaign/campaign"
import OfferCampaignLandingContainer from "@/presentation/pages/Offers/Campaign/OfferCampaignLandingContainer"

const mockExecute = vi.fn()
const mockContainerGet = vi.fn()
const mockNotFound = vi.fn()

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: () => mockContainerGet(),
    },
}))

vi.mock("next/navigation", () => ({
    notFound: () => {
        mockNotFound()
        throw new Error("NEXT_NOT_FOUND")
    },
}))

vi.mock("@/presentation/pages/Offers/Campaign/OfferCampaignLanding", () => ({
    default: ({
        campaign,
        pagination,
    }: {
        campaign: ExperienceCampaign
        pagination: { page: number }
    }) => (
        <div
            data-testid="offer-campaign-landing"
            data-slug={campaign.slug}
            data-page={pagination.page}
        />
    ),
}))

const buildCampaign = (): ExperienceCampaign => ({
    id: "c-1",
    mainTitle: "Cyber Days",
    slug: "cyber-days",
    isOutstanding: false,
    positions: [],
    segmentCodes: [],
    hasLanding: true,
    image: { desktopUrl: "", mobileUrl: "" },
    numberElementsSlide: 12,
    order: 1,
    status: CampaignStatus.ACTIVE,
    priority: 1,
    campaignType: CampaignType.EXPERIENCES,
    experiences: [],
})

describe("OfferCampaignLandingContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockContainerGet.mockReturnValue({
            execute: mockExecute,
        })
    })

    it("should fetch campaign by slug with default page", async () => {
        mockExecute.mockResolvedValue({
            campaign: buildCampaign(),
            pagination: { page: 1, pageSize: 12, total: 0, totalPages: 0 },
        })

        const result = await OfferCampaignLandingContainer({
            slug: "cyber-days",
        })

        render(result)

        expect(mockExecute).toHaveBeenCalledWith("cyber-days", 1, CampaignType.EXPERIENCES)
        expect(screen.getByTestId("offer-campaign-landing")).toHaveAttribute("data-slug", "cyber-days")
    })

    it("should parse page from searchParams", async () => {
        mockExecute.mockResolvedValue({
            campaign: buildCampaign(),
            pagination: { page: 2, pageSize: 12, total: 24, totalPages: 2 },
        })

        const result = await OfferCampaignLandingContainer({
            slug: "cyber-days",
            searchParams: { page: "2" },
        })

        render(result)

        expect(mockExecute).toHaveBeenCalledWith("cyber-days", 2, CampaignType.EXPERIENCES)
        expect(screen.getByTestId("offer-campaign-landing")).toHaveAttribute("data-page", "2")
    })

    it("should call notFound when campaign does not exist", async () => {
        mockExecute.mockResolvedValue(null)

        await expect(
            OfferCampaignLandingContainer({
                slug: "missing-campaign",
            }),
        ).rejects.toThrow("NEXT_NOT_FOUND")

        expect(mockNotFound).toHaveBeenCalled()
    })
})
