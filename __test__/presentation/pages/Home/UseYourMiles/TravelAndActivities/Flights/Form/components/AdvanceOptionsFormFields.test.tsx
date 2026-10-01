import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@/presentation/components/Form/controls/FormSelect", () => ({
    default: ({ name, label, testId, ...rest }: Record<string, unknown>) => (
        <div data-testid={testId as string} data-aria-label={rest["aria-label"] as string}>
            {label as string} ({name as string})
        </div>
    ),
}))

import AdvancedOptionsFields from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form/components/AdvanceOptionsFormFields"

describe("AdvancedOptionsFields", () => {
    it("should render stops select", () => {
        render(<AdvancedOptionsFields />)
        expect(screen.getByTestId("stops")).toBeInTheDocument()
        expect(screen.getByText("Escalas (stops)")).toBeInTheDocument()
        expect(screen.getByTestId("stops")).toHaveAttribute("data-aria-label", "Escoge las escalas de tu viaje")
    })

    it("should render class select", () => {
        render(<AdvancedOptionsFields />)
        expect(screen.getByTestId("class")).toBeInTheDocument()
        expect(screen.getByText("Clase (class)")).toBeInTheDocument()
        expect(screen.getByTestId("class")).toHaveAttribute("data-aria-label", "Escoge la clase de tu viaje")
    })

    it("should render airline select", () => {
        render(<AdvancedOptionsFields />)
        expect(screen.getByTestId("airline")).toBeInTheDocument()
        expect(screen.getByText("Aerolínea (airline)")).toBeInTheDocument()
        expect(screen.getByTestId("airline")).toHaveAttribute("data-aria-label", "Escoge la aerolínea de tu viaje")
    })
})
