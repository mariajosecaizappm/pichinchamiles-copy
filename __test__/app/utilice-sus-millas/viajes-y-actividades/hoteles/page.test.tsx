import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("next/navigation", () => ({
    notFound: vi.fn(),
}))

vi.mock("react-responsive-carousel/lib/styles/carousel.min.css", () => ({}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Hotels/Form/HotelsForm", () => ({
    default: () => <div data-testid="hotels-component">Hotels Component</div>
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form", () => ({
    default: () => <div>Flights</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Cars/Form/CarsForm", () => ({
    default: () => <div>Cars</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Activities/Form/ActivitiesForm", () => ({
    default: () => <div>Activities</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Disney/Form", () => ({
    default: () => <div>Disney</div>,
}))

import TravelAndActivities from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/TravelAndActivities"
import HotelsPage from "@/app/utilice-sus-millas/(main)/viajes-y-actividades/[activity]/page"

describe("Hotels Page", () => {
    it("should render the Hotels component", async () => {
        const result = await TravelAndActivities({ activity: "hoteles" })
        render(result)
        
        expect(screen.getByTestId("hotels-component")).toBeInTheDocument()
        expect(screen.getByText("Hotels Component")).toBeInTheDocument()
    })

    it("should have correct default export", () => {
        expect(HotelsPage).toBeDefined()
        expect(typeof HotelsPage).toBe("function")
    })
})
