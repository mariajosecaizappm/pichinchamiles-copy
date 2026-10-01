import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { BannerCategory } from "@/domain/entity/Banner/banner"

vi.mock("@heroui/react", () => ({
    cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
    Skeleton: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div data-testid="skeleton" className={className}>{children}</div>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/HeroCarousel", () => ({
    default: () => <div data-testid="hero-carousel">HeroCarousel</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Featured", () => ({
    default: ({ category, title }: { category: string; title: string }) => (
        <div data-testid="featured-items" data-category={category}>{title}</div>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/TravelDeals", () => ({
    default: () => <div data-testid="travel-deals">TravelDeals</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/BodyBanners", () => ({
    default: () => <div data-testid="body-banners">BodyBanners</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Featured/FeaturedItemsSkeleton", () => ({
    default: () => <div data-testid="featured-skeleton">FeaturedSkeleton</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/TravelDeals/TravelDealsSkeleton", () => ({
    default: () => <div data-testid="travel-deals-skeleton">TravelDealsSkeleton</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/BodyBanners/BodyBannersSkeleton", () => ({
    default: () => <div data-testid="body-banners-skeleton">BodyBannersSkeleton</div>,
}))

import UltraViajesPage from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/UltraViajesPage/UltraViajesPage"

describe("UltraViajesPage", () => {
    it("should render all sections", () => {
        render(<UltraViajesPage title="Vuelos recomendados" category={BannerCategory.UV_FLIGHTS} />)

        expect(screen.getByTestId("hero-carousel")).toBeInTheDocument()
        expect(screen.getByTestId("featured-items")).toBeInTheDocument()
        expect(screen.getByTestId("travel-deals")).toBeInTheDocument()
        expect(screen.getByTestId("body-banners")).toBeInTheDocument()
    })

    it("should pass category and title to FeaturedItems", () => {
        render(<UltraViajesPage title="Vuelos recomendados" category={BannerCategory.UV_FLIGHTS} />)

        const featured = screen.getByTestId("featured-items")
        expect(featured).toHaveAttribute("data-category", BannerCategory.UV_FLIGHTS)
        expect(featured).toHaveTextContent("Vuelos recomendados")
    })

    it("should render with different category", () => {
        render(<UltraViajesPage title="Hoteles recomendados" category={BannerCategory.UV_HOTELS} />)

        const featured = screen.getByTestId("featured-items")
        expect(featured).toHaveAttribute("data-category", BannerCategory.UV_HOTELS)
        expect(featured).toHaveTextContent("Hoteles recomendados")
    })
})
