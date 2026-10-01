import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Activities/Form/ActivitiesForm", () => ({
    default: () => <div data-testid="activities-form">ActivitiesForm</div>,
}))

import Activities from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Activities"

describe("Activities barrel export", () => {
    it("should re-export ActivitiesForm as default", () => {
        render(<Activities />)
        expect(screen.getByTestId("activities-form")).toBeInTheDocument()
    })
})
