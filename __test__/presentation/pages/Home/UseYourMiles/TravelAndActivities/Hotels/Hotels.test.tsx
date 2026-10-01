import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Hotels/Form/HotelsForm", () => ({
    default: () => <div data-testid="hotels-form">HotelsForm</div>,
}))

import Hotels from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Hotels"

describe("Hotels barrel export", () => {
    it("should re-export HotelsForm as default", () => {
        render(<Hotels />)
        expect(screen.getByTestId("hotels-form")).toBeInTheDocument()
    })
})
