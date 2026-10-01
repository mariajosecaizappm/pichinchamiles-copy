import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Disney/Form", () => ({
    default: () => <div data-testid="disney-form">DisneyForm</div>,
}))

import Disney from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Disney"

describe("Disney barrel export", () => {
    it("should re-export DisneyForm as default", () => {
        render(<Disney />)
        expect(screen.getByTestId("disney-form")).toBeInTheDocument()
    })
})
