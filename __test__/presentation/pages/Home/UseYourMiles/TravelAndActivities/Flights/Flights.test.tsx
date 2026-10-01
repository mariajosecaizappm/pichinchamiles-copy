import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("react-responsive-carousel/lib/styles/carousel.min.css", () => ({}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form", () => ({
    default: () => <div data-testid="flights-form">FlightsForm</div>,
}))

import Flights from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights"

describe("Flights barrel export", () => {
    it("should re-export FlightsForm as default", () => {
        render(<Flights />)
        expect(screen.getByTestId("flights-form")).toBeInTheDocument()
    })
})
