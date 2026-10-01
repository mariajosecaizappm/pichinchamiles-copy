import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { Banner } from "@/domain/entity/Banner/banner"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"

const mockUseSession = vi.fn()

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

vi.mock("react-responsive-carousel/lib/styles/carousel.min.css", () => ({}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/Banners/MarketingBanners", () => ({
    default: ({ banners }: { banners: Banner[] }) => (
        <div data-testid="marketing-banners">{banners.length} banners</div>
    ),
}))

import BodyBanners from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/BodyBanners/BodyBanners"

const createBanner = (overrides: Partial<Banner> = {}): Banner => ({
    id: "b1",
    title: "Banner 1",
    subtitle: "",
    description: "",
    summary: "",
    link: "/link",
    textColor: "",
    isOutstanding: false,
    segmentCodes: [],
    positions: [MarketingPositions.HOME_UV_GUEST_BODY_BANNERS],
    priority: 1,
    image: { desktopUrl: "", mobileUrl: "" },
    campaignId: "",
    ...overrides,
})

describe("BodyBanners", () => {
    beforeEach(() => {
        mockUseSession.mockReturnValue({ isLogged: false })
    })

    it("should render MarketingBanners with banners matching the guest position", () => {
        render(<BodyBanners banners={[createBanner()]} />)
        expect(screen.getByTestId("marketing-banners")).toBeInTheDocument()
        expect(screen.getByText("1 banners")).toBeInTheDocument()
    })

    it("should have correct wrapper classes", () => {
        const { container } = render(<BodyBanners banners={[createBanner()]} />)
        expect(container.firstChild).toHaveClass("p-6", "w-full", "max-w-330", "mx-auto")
    })

    it("should pass multiple matching banners to MarketingBanners", () => {
        const banners = [createBanner(), createBanner({ id: "b2" })]
        render(<BodyBanners banners={banners} />)
        expect(screen.getByText("2 banners")).toBeInTheDocument()
    })

    it("should filter out banners that don't match the guest position", () => {
        const banners = [createBanner({ positions: [MarketingPositions.HOME_UV_AUTH_BODY_BANNERS] })]
        const { container } = render(<BodyBanners banners={banners} />)
        expect(container.firstChild).toBeNull()
    })

    it("should use the auth position when the user is logged in", () => {
        mockUseSession.mockReturnValue({ isLogged: true })
        const banners = [createBanner({ positions: [MarketingPositions.HOME_UV_AUTH_BODY_BANNERS] })]
        render(<BodyBanners banners={banners} />)
        expect(screen.getByText("1 banners")).toBeInTheDocument()
    })
})