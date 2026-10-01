import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { Banner } from "@/domain/entity/Banner/banner"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"

const mockGetBodyBanners = vi.fn()
const mockContainerGet = vi.fn()

vi.mock("@/presentation/config/inversify.config", () => ({
    default: { get: (...args: unknown[]) => mockContainerGet(...args) },
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/BodyBanners/BodyBanners", () => ({
    default: ({ banners }: { banners: Banner[] }) => (
        <div data-testid="body-banners">{banners.length} banners</div>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/BodyBanners/BodyBannersSkeleton", () => ({
    default: () => <div data-testid="body-banners-skeleton">Skeleton</div>,
}))

import BodyBannersContainer from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/BodyBanners/BodyBannersContainer"

describe("BodyBannersContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockContainerGet.mockReturnValue({ getBodyBanners: mockGetBodyBanners })
    })

    it("should render BodyBanners when banners are returned", async () => {
        mockGetBodyBanners.mockResolvedValue({
            data: [{ id: "1" }, { id: "2" }],
        })

        const ui = await BodyBannersContainer()
        render(ui)

        expect(screen.getByTestId("body-banners")).toBeInTheDocument()
        expect(screen.getByText("2 banners")).toBeInTheDocument()
    })

    it("should render BodyBanners with an empty array when no banners come back", async () => {
        mockGetBodyBanners.mockResolvedValue({ data: [] })

        const ui = await BodyBannersContainer()
        render(ui)

        expect(screen.getByTestId("body-banners")).toBeInTheDocument()
        expect(screen.getByText("0 banners")).toBeInTheDocument()
    })

    it("should render the skeleton when the use case throws", async () => {
        mockGetBodyBanners.mockRejectedValue(new Error("network error"))

        const ui = await BodyBannersContainer()
        render(ui)

        expect(screen.getByTestId("body-banners-skeleton")).toBeInTheDocument()
    })

    it("should render the skeleton when the response has no data field", async () => {
        mockGetBodyBanners.mockResolvedValue(undefined)

        const ui = await BodyBannersContainer()
        render(ui)

        expect(screen.getByTestId("body-banners-skeleton")).toBeInTheDocument()
    })

    it("should resolve the use case from the container with the correct type", async () => {
        mockGetBodyBanners.mockResolvedValue({ data: [] })

        await BodyBannersContainer()

        expect(mockContainerGet).toHaveBeenCalledWith(UseCaseTypes.GetTravelsContentUseCase)
    })
})