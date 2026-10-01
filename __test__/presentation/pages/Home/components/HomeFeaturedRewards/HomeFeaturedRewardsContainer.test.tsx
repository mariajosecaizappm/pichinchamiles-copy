import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import type {Campaign} from "@/domain/entity/Campaign/campaign"
import {CampaignType, CampaignStatus} from "@/domain/entity/Campaign/campaign"
import {MarketingPositions} from "@/domain/entity/Marketing/marketing"

const mockGetFeaturedRewards = vi.fn()

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: () => ({
            getFeaturedRewards: mockGetFeaturedRewards,
        }),
    },
}))

vi.mock("@/presentation/pages/Home/components/HomeFeaturedRewards/HomeFeaturedRewards", () => ({
    default: ({rewards}: {rewards: Campaign[]}) => (
        <div data-testid="featured-rewards">{rewards.length} rewards</div>
    ),
}))

vi.mock("@/presentation/pages/Home/components/HomeFeaturedRewards/componenets/HomeFeaturedRewardsSkeleton", () => ({
    default: () => <div data-testid="skeleton">Skeleton</div>,
}))

import HomeFeaturedRewardsContainer from "@/presentation/pages/Home/components/HomeFeaturedRewards/HomeFeaturedRewardsContainer"

const mockCampaigns: Campaign[] = [
    {
        id: "c-1",
        mainTitle: "Producto destacado",
        secondaryTitle: "5000",
        slug: "producto-destacado",
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
]

describe("HomeFeaturedRewardsContainer", () => {
    it("should render HomeFeaturedRewards when data is returned", async () => {
        mockGetFeaturedRewards.mockResolvedValue({data: mockCampaigns})
        const Component = await HomeFeaturedRewardsContainer()
        render(Component)
        expect(screen.getByTestId("featured-rewards")).toBeInTheDocument()
    })

    it("should render skeleton when fetch throws", async () => {
        mockGetFeaturedRewards.mockRejectedValue(new Error("Network error"))
        const Component = await HomeFeaturedRewardsContainer()
        render(Component)
        expect(screen.getByTestId("skeleton")).toBeInTheDocument()
    })
})
