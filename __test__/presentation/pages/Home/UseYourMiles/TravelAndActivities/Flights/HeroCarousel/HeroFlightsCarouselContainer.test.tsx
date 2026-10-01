import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { Banner } from "@/domain/entity/Banner/banner"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"

const mockGetTopBanners = vi.fn()
const mockContainerGet = vi.fn()

vi.mock("@/presentation/config/inversify.config", () => ({
    default: { get: (...args: unknown[]) => mockContainerGet(...args) },
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/HeroCarousel/HeroFlightsCarouselClient", () => ({
    default: ({ banners }: { banners: Banner[] }) => (
        <div data-testid="hero-carousel">{banners.length} banners</div>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/HeroCarousel/HeroBannersCarouselSkeleton", () => ({
    default: () => <div data-testid="hero-skeleton">Skeleton</div>,
}))

import HeroFlightsCarouselContainer from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/HeroCarousel/HeroFlightsCarouselContainer"

describe("HeroFlightsCarouselContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockContainerGet.mockReturnValue({ getTopBanners: mockGetTopBanners })
    })

    it("should render HeroFlightsCarouselClient when banners are returned", async () => {
        mockGetTopBanners.mockResolvedValue({
            data: [{ id: "banner-1" }],
        })

        const ui = await HeroFlightsCarouselContainer()
        render(ui)

        expect(screen.getByTestId("hero-carousel")).toBeInTheDocument()
        expect(screen.getByText("1 banners")).toBeInTheDocument()
    })

    it("should render HeroFlightsCarouselClient with an empty array when no banners come back", async () => {
        mockGetTopBanners.mockResolvedValue({ data: [] })

        const ui = await HeroFlightsCarouselContainer()
        render(ui)

        expect(screen.getByTestId("hero-carousel")).toBeInTheDocument()
        expect(screen.getByText("0 banners")).toBeInTheDocument()
    })

    it("should render the skeleton when the use case throws", async () => {
        mockGetTopBanners.mockRejectedValue(new Error("network error"))

        const ui = await HeroFlightsCarouselContainer()
        render(ui)

        expect(screen.getByTestId("hero-skeleton")).toBeInTheDocument()
    })

    it("should render the skeleton when the response has no data field", async () => {
        mockGetTopBanners.mockResolvedValue(undefined)

        const ui = await HeroFlightsCarouselContainer()
        render(ui)

        expect(screen.getByTestId("hero-skeleton")).toBeInTheDocument()
    })

    it("should resolve the use case from the container with the correct type", async () => {
        mockGetTopBanners.mockResolvedValue({ data: [] })

        await HeroFlightsCarouselContainer()

        expect(mockContainerGet).toHaveBeenCalledWith(UseCaseTypes.GetTravelsContentUseCase)
    })
})