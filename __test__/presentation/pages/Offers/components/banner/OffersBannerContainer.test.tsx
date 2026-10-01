import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import "@testing-library/jest-dom"

const mockUseSession = vi.fn()
const mockUseQuery = vi.fn()

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

vi.mock("@tanstack/react-query", () => ({
    useQuery: (options: { queryKey: unknown[] }) => mockUseQuery(options),
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: { get: vi.fn() },
}))

vi.mock("@/presentation/pages/Home/components/HomeBannerCarousel/HomeBannerCarouselSkeleton", () => ({
    default: ({ className }: { className?: string }) => (
        <div data-testid="banner-skeleton" className={className}>Skeleton</div>
    ),
}))

vi.mock("@/presentation/pages/Offers/components/banner/OffersBanner", () => ({
    default: ({ banner }: { banner: { title: string } }) => (
        <div data-testid="offers-banner">{banner.title}</div>
    ),
}))

import OffersBannerContainer from "@/presentation/pages/Offers/components/banner/OffersBannerContainer"

const mockBanner = {
    id: "banner-1",
    title: "Oferta Especial",
    subtitle: "Subtitle",
    description: "",
    summary: "",
    link: "",
    textColor: "",
    isOutstanding: false,
    segmentCodes: [],
    positions: [],
    priority: 1,
    image: { desktopUrl: "/desktop.jpg", mobileUrl: "/mobile.jpg" },
    campaignId: "c-1",
}

const mockListWithData = {
    data: [mockBanner],
    pagination: { page: 1, pageSize: 10, total: 1, totalPages: 1 },
}

const mockListEmpty = {
    data: [],
    pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
}

describe("OffersBannerContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockUseSession.mockReturnValue({ isLogged: false })
    })

    it("should show skeleton while loading", () => {
        mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, error: null })

        render(<OffersBannerContainer type="products" />)

        expect(screen.getByTestId("banner-skeleton")).toBeInTheDocument()
        expect(screen.getByTestId("banner-skeleton")).toHaveClass("h-40", "sm:h-77.5")
    })

    it("should show skeleton on error", () => {
        mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, error: new Error("fetch error") })

        render(<OffersBannerContainer type="products" />)

        expect(screen.getByTestId("banner-skeleton")).toBeInTheDocument()
    })

    it("should return null when pagination total is 0", () => {
        mockUseQuery.mockReturnValue({ data: mockListEmpty, isLoading: false, error: null })

        const { container } = render(<OffersBannerContainer type="products" />)

        expect(container).toBeEmptyDOMElement()
    })

    it("should render OffersBanner with first banner when data is present", () => {
        mockUseQuery.mockReturnValue({ data: mockListWithData, isLoading: false, error: null })

        render(<OffersBannerContainer type="products" />)

        expect(screen.getByTestId("offers-banner")).toBeInTheDocument()
        expect(screen.getByText("Oferta Especial")).toBeInTheDocument()
    })

    it("should use correct queryKey for type=products and isLogged=false", () => {
        mockUseSession.mockReturnValue({ isLogged: false })
        mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, error: null })

        render(<OffersBannerContainer type="products" />)

        expect(mockUseQuery).toHaveBeenCalledWith(
            expect.objectContaining({ queryKey: ["top-banner", "products", false] })
        )
    })

    it("should use correct queryKey for type=activities and isLogged=true", () => {
        mockUseSession.mockReturnValue({ isLogged: true })
        mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, error: null })

        render(<OffersBannerContainer type="activities" />)

        expect(mockUseQuery).toHaveBeenCalledWith(
            expect.objectContaining({ queryKey: ["top-banner", "activities", true] })
        )
    })

    it("should render skeleton for type=activities while loading", () => {
        mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, error: null })

        render(<OffersBannerContainer type="activities" />)

        expect(screen.getByTestId("banner-skeleton")).toBeInTheDocument()
    })

    it("should render banner for type=activities when data is present", () => {
        mockUseQuery.mockReturnValue({ data: mockListWithData, isLoading: false, error: null })

        render(<OffersBannerContainer type="activities" />)

        expect(screen.getByTestId("offers-banner")).toBeInTheDocument()
    })
})
