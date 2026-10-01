import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("next/navigation", () => ({
    notFound: vi.fn(),
}))

vi.mock("react-responsive-carousel/lib/styles/carousel.min.css", () => ({}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Disney/Form", () => ({
    default: () => <div data-testid="disney-component">Disney Component</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form", () => ({
    default: () => <div>Flights</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Hotels/Form/HotelsForm", () => ({
    default: () => <div>Hotels</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Cars/Form/CarsForm", () => ({
    default: () => <div>Cars</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Activities/Form/ActivitiesForm", () => ({
    default: () => <div>Activities</div>,
}))

import TravelAndActivities from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/TravelAndActivities"

describe("Disney page", () => {
    it("should render the Disney component", async () => {
        const result = await TravelAndActivities({ activity: "disney" })
        render(result)
        expect(screen.getByTestId("disney-component")).toBeInTheDocument()
    })
})
