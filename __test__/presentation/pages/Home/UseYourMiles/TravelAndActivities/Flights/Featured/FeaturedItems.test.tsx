import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { Banner } from "@/domain/entity/Banner/banner"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"

const mockUseSession = vi.fn()

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/CardsSliderWrapper/CardsSliderWrapper", () => ({
    default: ({ items, renderItem }: { items: unknown[]; renderItem: (item: unknown) => React.ReactNode }) => (
        <div data-testid="cards-slider">
            {items.map((item, i) => (
                <div key={i} data-testid="slider-item">{renderItem(item)}</div>
            ))}
        </div>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/ExperienceItemCard", () => ({
    default: ({ title, address, points }: { title: string; address?: string; points?: number }) => (
        <div data-testid="experience-card" data-address={address} data-points={points}>{title}</div>
    ),
}))

import FeaturedItems from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Featured/FeaturedItems"

const createBanner = (overrides: Partial<Banner> = {}): Banner => ({
    id: "b1",
    title: "Item 1",
    subtitle: "Tag",
    description: "Miami, Florida",
    summary: "10000",
    link: "/item-1",
    textColor: "",
    isOutstanding: false,
    segmentCodes: [],
    positions: [MarketingPositions.HOME_UV_GUEST_RECOMMENDED_ITEMS],
    priority: 1,
    image: { desktopUrl: "", mobileUrl: "" },
    campaignId: "",
    ...overrides,
})

const mockBanners: Banner[] = [createBanner()]

describe("FeaturedItems", () => {
    beforeEach(() => {
        mockUseSession.mockReturnValue({ isLogged: false })
    })

    it("should render the title", () => {
        render(<FeaturedItems items={mockBanners} title="Vuelos recomendados" />)
        expect(screen.getByText("Vuelos recomendados")).toBeInTheDocument()
    })

    it("should render CardsSliderWrapper", () => {
        render(<FeaturedItems items={mockBanners} title="Title" />)
        expect(screen.getByTestId("cards-slider")).toBeInTheDocument()
    })

    it("should render ExperienceItemCard for each item", () => {
        render(<FeaturedItems items={mockBanners} title="Title" />)
        expect(screen.getByTestId("experience-card")).toHaveTextContent("Item 1")
    })

    it("should pass destination and miles from banner fields to ExperienceItemCard", () => {
        render(<FeaturedItems items={mockBanners} title="Title" />)
        const card = screen.getByTestId("experience-card")
        expect(card).toHaveAttribute("data-address", "Miami, Florida")
        expect(card).toHaveAttribute("data-points", "10000")
    })

    it("should pass summary as address when summary is not a numeric value", () => {
        const ticketConventionBanner = createBanner({
            summary: "Medellín",
            description: "25000",
        })
        render(<FeaturedItems items={[ticketConventionBanner]} title="Title" />)
        const card = screen.getByTestId("experience-card")
        expect(card).toHaveAttribute("data-address", "Medellín")
        expect(card).toHaveAttribute("data-points", "25000")
    })

    it("should render multiple items", () => {
        const multipleItems = [...mockBanners, createBanner({ id: "b2" })]
        render(<FeaturedItems items={multipleItems} title="Title" />)
        const cards = screen.getAllByTestId("experience-card")
        expect(cards).toHaveLength(2)
    })

    it("should have correct wrapper classes", () => {
        const { container } = render(<FeaturedItems items={mockBanners} title="Title" />)
        expect(container.firstChild).toHaveClass("pb-6", "w-full", "max-w-330", "mx-auto")
    })

    it("should render h2 element for title", () => {
        render(<FeaturedItems items={mockBanners} title="Hoteles" />)
        const heading = screen.getByRole("heading", { level: 2 })
        expect(heading).toHaveTextContent("Hoteles")
    })

    it("should filter out items that don't match the guest position", () => {
        const items = [createBanner({ positions: [MarketingPositions.HOME_UV_AUTH_RECOMMENDED_ITEMS] })]
        const { container } = render(<FeaturedItems items={items} title="Title" />)
        expect(container.firstChild).toBeNull()
    })

    it("should use the auth position when the user is logged in", () => {
        mockUseSession.mockReturnValue({ isLogged: true })
        const items = [createBanner({ positions: [MarketingPositions.HOME_UV_AUTH_RECOMMENDED_ITEMS] })]
        render(<FeaturedItems items={items} title="Title" />)
        expect(screen.getByTestId("experience-card")).toBeInTheDocument()
    })
})