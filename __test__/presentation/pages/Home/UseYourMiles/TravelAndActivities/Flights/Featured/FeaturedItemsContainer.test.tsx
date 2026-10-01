import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { Banner, BannerCategory } from "@/domain/entity/Banner/banner"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"

const mockGetRecommendedItems = vi.fn()
const mockContainerGet = vi.fn()

vi.mock("@/presentation/config/inversify.config", () => ({
    default: { get: (...args: unknown[]) => mockContainerGet(...args) },
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Featured/FeaturedItems", () => ({
    default: ({ items, title }: { items: Banner[]; title: string }) => (
        <div data-testid="featured-items" data-count={items.length}>{title}</div>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Featured/FeaturedItemsSkeleton", () => ({
    default: () => <div data-testid="featured-items-skeleton">Skeleton</div>,
}))

import FeaturedItemsContainer from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Featured/FeaturedItemsContainer"

describe("FeaturedItemsContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockContainerGet.mockReturnValue({ getRecommendedItems: mockGetRecommendedItems })
    })

    it("should render FeaturedItems when items are returned", async () => {
        mockGetRecommendedItems.mockResolvedValue({
            data: [{ id: "1" }, { id: "2" }],
        })

        const ui = await FeaturedItemsContainer({ title: "Vuelos destacados", category: BannerCategory.UV_FLIGHTS })
        render(ui)

        expect(screen.getByTestId("featured-items")).toBeInTheDocument()
        expect(screen.getByText("Vuelos destacados")).toBeInTheDocument()
        expect(screen.getByTestId("featured-items")).toHaveAttribute("data-count", "2")
    })

    it("should render FeaturedItems with an empty array when no items come back", async () => {
        mockGetRecommendedItems.mockResolvedValue({ data: [] })

        const ui = await FeaturedItemsContainer({ title: "Vuelos destacados", category: BannerCategory.UV_FLIGHTS })
        render(ui)

        expect(screen.getByTestId("featured-items")).toBeInTheDocument()
        expect(screen.getByTestId("featured-items")).toHaveAttribute("data-count", "0")
    })

    it("should render the skeleton when the use case throws", async () => {
        mockGetRecommendedItems.mockRejectedValue(new Error("network error"))

        const ui = await FeaturedItemsContainer({ title: "Vuelos destacados", category: BannerCategory.UV_FLIGHTS })
        render(ui)

        expect(screen.getByTestId("featured-items-skeleton")).toBeInTheDocument()
    })

    it("should render the skeleton when the response has no data field", async () => {
        mockGetRecommendedItems.mockResolvedValue(undefined)

        const ui = await FeaturedItemsContainer({ title: "Vuelos destacados", category: BannerCategory.UV_FLIGHTS })
        render(ui)

        expect(screen.getByTestId("featured-items-skeleton")).toBeInTheDocument()
    })

    it("should call getRecommendedItems with the given category", async () => {
        mockGetRecommendedItems.mockResolvedValue({ data: [] })

        await FeaturedItemsContainer({ title: "Hoteles", category: BannerCategory.UV_HOTELS })

        expect(mockGetRecommendedItems).toHaveBeenCalledWith({ category: BannerCategory.UV_HOTELS })
    })

    it("should resolve the use case from the container with the correct type", async () => {
        mockGetRecommendedItems.mockResolvedValue({ data: [] })

        await FeaturedItemsContainer({ title: "Autos", category: BannerCategory.UV_CARS })

        expect(mockContainerGet).toHaveBeenCalledWith(UseCaseTypes.GetTravelsContentUseCase)
    })

    it("should pass correct title prop through to FeaturedItems", async () => {
        mockGetRecommendedItems.mockResolvedValue({
            data: [{ id: "1" }],
        })

        const ui = await FeaturedItemsContainer({ title: "Autos", category: BannerCategory.UV_CARS })
        render(ui)

        expect(screen.getByText("Autos")).toBeInTheDocument()
    })
})