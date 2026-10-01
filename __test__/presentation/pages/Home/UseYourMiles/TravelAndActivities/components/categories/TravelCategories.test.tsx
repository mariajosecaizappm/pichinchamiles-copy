import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest"

beforeAll(() => {
    global.IntersectionObserver = class IntersectionObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() { return [] }
    } as unknown as typeof IntersectionObserver
})

const mockTrack = vi.fn()

vi.mock("next/navigation", () => ({
    usePathname: vi.fn(),
}))

vi.mock("@/presentation/config/links", () => ({
    default: {
        travelAndActivities: "/travel",
        flights: "/flights",
        hotels: "/hotels",
        carRental: "/cars",
        activities: "/activities",
        disney: "/disney",
    },
}))

vi.mock("@/presentation/hooks/useAnalytics", () => ({
    default: () => ({ track: mockTrack }),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Layout/components/CategoryPill", () => ({
    default: ({ label, active, href, icon, ariaLabel, onClick }: Record<string, unknown>) => (
        <a href={href as string} data-active={active} data-testid={`category-${label}`} aria-label={ariaLabel as string} onClick={onClick as React.MouseEventHandler}>
            {icon as React.ReactNode}
            {label as string}
        </a>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Layout/Tabs/components/CarouselCategories", () => ({
    default: ({ items }: { items: React.ReactNode[] }) => (
        <div data-testid="carousel-categories">
            {items.map((item, index) => (
                <div key={index} data-testid={`carousel-item-${index}`}>{item}</div>
            ))}
        </div>
    ),
}))

import { usePathname } from "next/navigation"
import TravelCategories from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/categories/TravelCategories"

describe("TravelCategories", () => {
    beforeEach(() => {
        mockTrack.mockReset()
    })

    it("should render all 5 category items", () => {
        (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/travel")
        render(<TravelCategories />)
        
        expect(screen.getByTestId("carousel-categories")).toBeInTheDocument()
        expect(screen.getByTestId("carousel-item-0")).toBeInTheDocument()
        expect(screen.getByTestId("carousel-item-1")).toBeInTheDocument()
        expect(screen.getByTestId("carousel-item-2")).toBeInTheDocument()
        expect(screen.getByTestId("carousel-item-3")).toBeInTheDocument()
        expect(screen.getByTestId("carousel-item-4")).toBeInTheDocument()
    })

    it("should render Vuelos category with correct link", () => {
        (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/flights")
        render(<TravelCategories />)
        
        const vuelosLink = screen.getByTestId("category-Vuelos")
        expect(vuelosLink).toHaveAttribute("href", "/flights")
        expect(vuelosLink).toHaveAttribute("data-active", "true")
        expect(vuelosLink).toHaveAttribute("aria-label", "Categoría vuelos, seleccionado")
    })

    it("should render Hoteles category with correct link", () => {
        (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/hotels")
        render(<TravelCategories />)
        
        const hotelesLink = screen.getByTestId("category-Hoteles")
        expect(hotelesLink).toHaveAttribute("href", "/hotels")
        expect(hotelesLink).toHaveAttribute("data-active", "true")
        expect(hotelesLink).toHaveAttribute("aria-label", "Categoría hoteles, seleccionado")
    })

    it("should render Autos category with correct link", () => {
        (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/cars")
        render(<TravelCategories />)
        
        const autosLink = screen.getByTestId("category-Autos")
        expect(autosLink).toHaveAttribute("href", "/cars")
        expect(autosLink).toHaveAttribute("data-active", "true")
        expect(autosLink).toHaveAttribute("aria-label", "Categoría autos, seleccionado")
    })

    it("should render Actividades category with correct link", () => {
        (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/activities")
        render(<TravelCategories />)
        
        const actividadesLink = screen.getByTestId("category-Actividades")
        expect(actividadesLink).toHaveAttribute("href", "/activities")
        expect(actividadesLink).toHaveAttribute("data-active", "true")
        expect(actividadesLink).toHaveAttribute("aria-label", "Categoría actividades, seleccionado")
    })

    it("should render Disney category with correct link", () => {
        (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/disney")
        render(<TravelCategories />)
        
        const disneyLink = screen.getByTestId("category-Disney")
        expect(disneyLink).toHaveAttribute("href", "/disney")
        expect(disneyLink).toHaveAttribute("data-active", "true")
        expect(disneyLink).toHaveAttribute("aria-label", "Categoría disney, seleccionado")
    })

    it("should mark Vuelos as inactive when pathname does not match flights", () => {
        (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/hotels")
        render(<TravelCategories />)
        
        const vuelosLink = screen.getByTestId("category-Vuelos")
        expect(vuelosLink).toHaveAttribute("data-active", "false")
        expect(vuelosLink).toHaveAttribute("aria-label", "Categoría vuelos, no seleccionado")
    })

    it("should use startsWith for matching hotels, cars, activities, and disney", () => {
        (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/hotels/some-subpage")
        render(<TravelCategories />)
        
        const hotelesLink = screen.getByTestId("category-Hoteles")
        expect(hotelesLink).toHaveAttribute("data-active", "true")
    })

    it("should use exact match for flights pathname", () => {
        (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/flights/subpage")
        render(<TravelCategories />)
        
        const vuelosLink = screen.getByTestId("category-Vuelos")
        expect(vuelosLink).toHaveAttribute("data-active", "false")
    })

    describe("category click analytics", () => {
        it("should track analytics when Vuelos is clicked", () => {
            (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/flights")
            render(<TravelCategories />)
            
            fireEvent.click(screen.getByTestId("category-Vuelos"))
            expect(mockTrack).toHaveBeenCalledWith("CLICKED_REDEMPTION", { tab: "flights" })
        })

        it("should track analytics when Hoteles is clicked", () => {
            (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/hotels")
            render(<TravelCategories />)
            
            fireEvent.click(screen.getByTestId("category-Hoteles"))
            expect(mockTrack).toHaveBeenCalledWith("CLICKED_REDEMPTION", { tab: "hotels" })
        })

        it("should track analytics when Autos is clicked", () => {
            (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/cars")
            render(<TravelCategories />)
            
            fireEvent.click(screen.getByTestId("category-Autos"))
            expect(mockTrack).toHaveBeenCalledWith("CLICKED_REDEMPTION", { tab: "cars" })
        })

        it("should track analytics when Actividades is clicked", () => {
            (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/activities")
            render(<TravelCategories />)
            
            fireEvent.click(screen.getByTestId("category-Actividades"))
            expect(mockTrack).toHaveBeenCalledWith("CLICKED_REDEMPTION", { tab: "activities" })
        })

        it("should track analytics when Disney is clicked", () => {
            (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/disney")
            render(<TravelCategories />)
            
            fireEvent.click(screen.getByTestId("category-Disney"))
            expect(mockTrack).toHaveBeenCalledWith("CLICKED_REDEMPTION", { tab: "disney" })
        })
    })
})
