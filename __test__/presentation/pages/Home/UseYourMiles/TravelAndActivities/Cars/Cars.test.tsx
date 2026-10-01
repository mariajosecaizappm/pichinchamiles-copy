import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Cars/Form/CarsForm", () => ({
    default: () => <div data-testid="cars-form">CarsForm</div>,
}))

import Cars from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Cars"

describe("Cars barrel export", () => {
    it("should re-export CarsForm as default", () => {
        render(<Cars />)
        expect(screen.getByTestId("cars-form")).toBeInTheDocument()
    })
})
