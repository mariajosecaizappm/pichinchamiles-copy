import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import FormContext, {
    FormContextValues,
} from "@/presentation/components/Form/context/FormContext"
import { TripType } from "@/domain/entity/Travel/structure/flight"
import { createDefaultTrip } from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form/FlightsFormConfig"

vi.mock("@/presentation/components/Form/controls/FormButton", () => ({
    default: ({ children }: Record<string, unknown>) => (
        <button data-testid="form-button" type="submit">
            {children as React.ReactNode}
        </button>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form/components/FlightsFormBaseFields", () => ({
    default: () => <div data-testid="flights-form-base-fields">FlightsFormBaseFields</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form/components/MultiStepTravelFields", () => ({
    default: ({ index }: { index: number }) => <div data-testid={`multi-step-${index}`}>MultiStepTravelFields {index}</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form/components/AdvancedOptionsFormFieldsTrigger", () => ({
    default: () => <div data-testid="advanced-options-trigger">AdvancedOptionsTrigger</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form/components/AdvanceOptionsFormFields", () => ({
    default: () => <div data-testid="advanced-options-fields">AdvancedOptionsFields</div>,
}))

vi.mock("@/presentation/components/Form/components/Button", () => ({
    Button: ({ children, onPress, ...props }: Record<string, unknown>) => {
        const btnType = (props.type as "submit" | "reset" | "button") ?? "button"
        return (
            <button
                data-testid={`button-${props.className}`}
                type={btnType}
                aria-label={props["aria-label"] as string}
                onClick={onPress as () => void}
            >
                {children as React.ReactNode}
            </button>
        )
    },
}))

import FlightsFormFields from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form/components/FlightsFormFields"

const makeFormContext = (overrides: Partial<FormContextValues> = {}): FormContextValues => ({
    values: {
        flightTravelType: TripType.SINGLE,
        oneWayTrip: { ...createDefaultTrip(), endDate: null },
        multidestinationTrips: [createDefaultTrip()],
        showAdvancedOptions: false,
        passengersInfo: "1 Pasajero",
        adults: 1,
        childrens: 0,
        infants: 0,
        stops: "all-stops",
        class: "any",
        airline: "all",
        ...overrides.values,
    },
    errors: overrides.errors ?? {},
    touched: overrides.touched ?? {},
    disabled: overrides.disabled ?? false,
    isSubmitting: overrides.isSubmitting ?? false,
    submitCount: overrides.submitCount ?? 0,
    hasErrors: overrides.hasErrors ?? false,
    hasVisibleErrors: overrides.hasVisibleErrors ?? false,
    alert: overrides.alert ?? null,
    onInputChange: overrides.onInputChange ?? vi.fn(),
    setFieldValue: overrides.setFieldValue ?? vi.fn(),
    onBlur: overrides.onBlur ?? vi.fn(),
})

const renderWithContext = (ctx: Partial<FormContextValues> = {}) => {
    const context = makeFormContext(ctx)
    return render(
        <FormContext.Provider value={context}>
            <FlightsFormFields />
        </FormContext.Provider>,
    )
}

describe("FlightsFormFields", () => {
    it("should render FlightsFormBaseFields", () => {
        renderWithContext()
        expect(screen.getByTestId("flights-form-base-fields")).toBeInTheDocument()
    })

    it("should render the search button with 'Buscar' text", () => {
        renderWithContext()
        expect(screen.getByText("Buscar")).toBeInTheDocument()
        expect(
            screen.getByLabelText("Buscar resultados según la información del formulario"),
        ).toBeInTheDocument()
    })

    it("should render the search icon when isSubmitting is false", () => {
        const { container } = renderWithContext({ isSubmitting: false })
        const svgs = container.querySelectorAll("svg")
        expect(svgs.length).toBeGreaterThan(0)
    })

    it("should hide the search icon when isSubmitting is true", () => {
        renderWithContext({ isSubmitting: true })
        // Button mock uses className in testid: button-${className}
        const button = screen.getByTestId("button-h-8 md:h-10 xl:w-12 xl:min-w-12 xl:h-12")
        // When isSubmitting is true, the search icon span is not rendered
        expect(button.textContent).toBe("Buscar")
    })

    it("should render AdvancedOptionsTrigger", () => {
        renderWithContext()
        expect(screen.getByTestId("advanced-options-trigger")).toBeInTheDocument()
    })

    it("should not render AdvancedOptionsFields when showAdvancedOptions is false", () => {
        renderWithContext()
        expect(screen.queryByTestId("advanced-options-fields")).not.toBeInTheDocument()
    })

    it("should render AdvancedOptionsFields when showAdvancedOptions is true", () => {
        renderWithContext({ values: { showAdvancedOptions: true } })
        expect(screen.getByTestId("advanced-options-fields")).toBeInTheDocument()
    })

    it("should not render multidestination section when flightTravelType is SINGLE", () => {
        renderWithContext()
        expect(screen.queryByTestId("multi-step-0")).not.toBeInTheDocument()
    })

    it("should render multidestination trips when flightTravelType is MULTIPLE", () => {
        const trip1 = createDefaultTrip()
        const trip2 = createDefaultTrip()
        renderWithContext({
            values: {
                flightTravelType: TripType.MULTIPLE,
                multidestinationTrips: [trip1, trip2],
            },
        })
        expect(screen.getByTestId("multi-step-0")).toBeInTheDocument()
        expect(screen.getByTestId("multi-step-1")).toBeInTheDocument()
    })

    it("should render 'Añadir vuelo' button for the first multidestination trip", () => {
        const trip = createDefaultTrip()
        renderWithContext({
            values: {
                flightTravelType: TripType.MULTIPLE,
                multidestinationTrips: [trip],
            },
        })
        expect(screen.getByText("Añadir vuelo")).toBeInTheDocument()
    })

    it("should render 'Eliminar' button for non-first multidestination trips", () => {
        const trip1 = createDefaultTrip()
        const trip2 = createDefaultTrip()
        renderWithContext({
            values: {
                flightTravelType: TripType.MULTIPLE,
                multidestinationTrips: [trip1, trip2],
            },
        })
        expect(screen.getByText("Eliminar")).toBeInTheDocument()
    })

    it("should apply items-end when there are no visible errors", () => {
        const { container } = renderWithContext({ hasVisibleErrors: false })

        const outerDiv = container.querySelector(".xl\\:flex-row")
        expect(outerDiv).toHaveClass("items-end")
        expect(outerDiv).not.toHaveClass("items-center")

        const gridDiv = container.querySelector(".grid")
        expect(gridDiv).toHaveClass("items-end")
        expect(gridDiv).not.toHaveClass("items-start")
    })

    it("should apply alignment classes when there are visible errors", () => {
        const { container } = renderWithContext({ hasVisibleErrors: true })

        const outerDiv = container.querySelector(".xl\\:flex-row")
        expect(outerDiv).toHaveClass("items-center")
        expect(outerDiv).not.toHaveClass("items-end")

        const gridDiv = container.querySelector(".grid")
        expect(gridDiv).toHaveClass("items-start")
        expect(gridDiv).not.toHaveClass("items-end")
    })
})
