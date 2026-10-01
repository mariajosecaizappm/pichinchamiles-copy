import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@/presentation/components/Form/controls/FormAutocomplete", () => ({
    default: ({ name, label, testId, ...rest }: Record<string, unknown>) => (
        <div data-testid={testId as string} data-aria-label={rest["aria-label"] as string}>{label as string} ({name as string})</div>
    ),
}))

vi.mock("@/presentation/components/Form/controls/FormDatePicker/FormDatePicker", () => ({
    default: ({ name, label, ...rest }: Record<string, unknown>) => (
        <div data-testid={`datepicker-${name}`} data-aria-label={rest["aria-label"] as string}>{label as string}</div>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form/actions", () => ({
    searchLocations: vi.fn().mockResolvedValue([]),
}))

import MultiStepTravelFields from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form/components/MultiStepTravelFields"

describe("MultiStepTravelFields", () => {
    it("should render origin autocomplete with correct name for index 0", () => {
        render(<MultiStepTravelFields index={0} />)
        expect(screen.getByTestId("origin")).toBeInTheDocument()
        expect(screen.getByText("Origen (multidestinationTrips[0].origin)")).toBeInTheDocument()
        expect(screen.getByTestId("origin")).toHaveAttribute("data-aria-label", "Origen del viaje")
    })

    it("should render destination autocomplete with correct name for index 0", () => {
        render(<MultiStepTravelFields index={0} />)
        expect(screen.getByTestId("destination")).toBeInTheDocument()
        expect(screen.getByText("Destino (multidestinationTrips[0].destination)")).toBeInTheDocument()
        expect(screen.getByTestId("destination")).toHaveAttribute("data-aria-label", "Destino del viaje")
    })

    it("should render date picker with correct name for index 0", () => {
        render(<MultiStepTravelFields index={0} />)
        expect(screen.getByTestId("datepicker-multidestinationTrips[0].startDate")).toBeInTheDocument()
        expect(screen.getByText("Fecha de salida")).toBeInTheDocument()
        expect(screen.getByTestId("datepicker-multidestinationTrips[0].startDate")).toHaveAttribute(
            "data-aria-label",
            "Escoge las fechas de vuelo",
        )
    })

    it("should render fields with correct index for index 2", () => {
        render(<MultiStepTravelFields index={2} />)
        expect(screen.getByText("Origen (multidestinationTrips[2].origin)")).toBeInTheDocument()
        expect(screen.getByText("Destino (multidestinationTrips[2].destination)")).toBeInTheDocument()
        expect(screen.getByTestId("datepicker-multidestinationTrips[2].startDate")).toBeInTheDocument()
    })
})
