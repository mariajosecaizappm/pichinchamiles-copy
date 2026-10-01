import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form/FlightsForm", () => ({
    default: () => <div data-testid="flights-form" />,
}))

import FlightsFormContainer from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form/FlightsFormContainer"

describe("FlightsFormContainer", () => {
    it("should render FlightsForm inside body container", () => {
        const { container } = render(<FlightsFormContainer />)

        expect(container.querySelector(".body-container")).toBeInTheDocument()
        expect(screen.getByTestId("flights-form")).toBeInTheDocument()
    })
})
