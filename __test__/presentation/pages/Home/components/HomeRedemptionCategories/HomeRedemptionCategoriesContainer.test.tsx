import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import {MarketingPositions} from "@/domain/entity/Marketing/marketing"
import type {Banner} from "@/domain/entity/Banner/banner"

const mockGetHomeRedemptionCategories = vi.fn()

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: () => ({
            getHomeRedemptionCategories: mockGetHomeRedemptionCategories,
        }),
    },
}))

vi.mock("@/presentation/pages/Home/components/HomeRedemptionCategories/HomeRedemptionCategories", () => ({
    default: ({redemptionCategories}: {redemptionCategories: Banner[]}) => (
        <div data-testid="redemption-categories">{redemptionCategories.length} categories</div>
    ),
}))

vi.mock("@/presentation/pages/Home/components/HomeRedemptionCategories/components/HomeRedemptionCategoriesSkeleton", () => ({
    default: () => <div data-testid="skeleton">Skeleton</div>,
}))

import HomeRedemptionsCategoriesContainer from "@/presentation/pages/Home/components/HomeRedemptionCategories/HomeRedemptionCategoriesContainer"

const mockBanners: Banner[] = [
    {
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
    },
]

describe("HomeRedemptionsCategoriesContainer", () => {
    it("should render categories when data is returned", async () => {
        mockGetHomeRedemptionCategories.mockResolvedValue({data: mockBanners})
        const Component = await HomeRedemptionsCategoriesContainer()
        render(Component!)
        expect(screen.getByTestId("redemption-categories")).toBeInTheDocument()
    })

    it("should return null when data is empty", async () => {
        mockGetHomeRedemptionCategories.mockResolvedValue({data: []})
        const Component = await HomeRedemptionsCategoriesContainer()
        expect(Component).toBeNull()
    })

    it("should render skeleton when fetch throws", async () => {
        mockGetHomeRedemptionCategories.mockRejectedValue(new Error("Network error"))
        const Component = await HomeRedemptionsCategoriesContainer()
        render(Component!)
        expect(screen.getByTestId("skeleton")).toBeInTheDocument()
    })
})
