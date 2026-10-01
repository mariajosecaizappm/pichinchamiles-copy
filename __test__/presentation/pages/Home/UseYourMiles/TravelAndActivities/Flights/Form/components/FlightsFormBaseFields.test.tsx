import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import FormContext, {
    FormContextValues,
} from "@/presentation/components/Form/context/FormContext"
import { TripType } from "@/domain/entity/Travel/structure/flight"
import { createDefaultTrip } from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form/FlightsFormConfig"

vi.mock("@/presentation/components/Form/controls/FormSelect", () => ({
    default: ({ name, label, testId, ...rest }: Record<string, unknown>) => (
        <div data-testid={testId as string} data-aria-label={rest["aria-label"] as string}>{label as string} ({name as string})</div>
    ),
}))

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

vi.mock("@/presentation/components/Form/controls/FormDateRangePicker/FormDateRangePicker", () => ({
    default: ({ startName, endName, label, ...rest }: Record<string, unknown>) => (
        <div data-testid={`daterangepicker-${startName}-${endName}`} data-aria-label={rest["aria-label"] as string}>{label as string}</div>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form/components/PassengersSelect", () => ({
    default: ({ label, ...rest }: Record<string, unknown>) => (
        <div data-testid="passengers-select" data-trigger-aria-label={rest["triggerAriaLabel"] as string}>{label as string}</div>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form/components/MultiStepTravelFields", () => ({
    default: ({ index }: { index: number }) => (
        <div data-testid={`multi-step-${index}`}>MultiStepTravelFields {index}</div>
    ),
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
                data-testid={`btn-${btnType}`}
                type={btnType}
                onClick={onPress as () => void}
            >
                {children as React.ReactNode}
            </button>
        )
    },
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form/actions", () => ({
    searchLocations: vi.fn().mockResolvedValue([]),
}))

import FlightsFormBaseFields from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form/components/FlightsFormBaseFields"

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
    alert: overrides.alert ?? null,
    onInputChange: overrides.onInputChange ?? vi.fn(),
    setFieldValue: overrides.setFieldValue ?? vi.fn(),
    onBlur: overrides.onBlur ?? vi.fn(),
})

const renderWithContext = (ctx: Partial<FormContextValues> = {}) => {
    const context = makeFormContext(ctx)
    return {
        ...render(
            <FormContext.Provider value={context}>
                <FlightsFormBaseFields />
            </FormContext.Provider>,
        ),
        context,
    }
}

describe("FlightsFormBaseFields", () => {
    it("should render the flight travel type select", () => {
        renderWithContext()
        expect(screen.getByTestId("flightTravelType")).toBeInTheDocument()
        expect(screen.getByTestId("flightTravelType")).toHaveAttribute(
            "data-aria-label",
            "Elige el tipo de viaje que vas a realizar.",
        )
    })

    it("should render origin autocomplete", () => {
        renderWithContext()
        expect(screen.getByTestId("origin")).toBeInTheDocument()
        expect(screen.getByTestId("origin")).toHaveAttribute("data-aria-label", "Origen del viaje")
    })

    it("should render destination autocomplete", () => {
        renderWithContext()
        expect(screen.getByTestId("destination")).toBeInTheDocument()
        expect(screen.getByTestId("destination")).toHaveAttribute("data-aria-label", "Destino del viaje")
    })

    it("should render passengers select", () => {
        renderWithContext()
        expect(screen.getByTestId("passengers-select")).toBeInTheDocument()
        expect(screen.getByText("Número de pasajeros")).toBeInTheDocument()
        expect(screen.getByLabelText("Escoge el número de pasajeros")).toBeInTheDocument()
    })

    it("should render FormDatePicker for SINGLE trip type", () => {
        renderWithContext({ values: { flightTravelType: TripType.SINGLE } })
        expect(screen.getByTestId("datepicker-oneWayTrip.startDate")).toBeInTheDocument()
        expect(screen.getByText("Fecha de salida")).toBeInTheDocument()
        expect(screen.getByTestId("datepicker-oneWayTrip.startDate")).toHaveAttribute(
            "data-aria-label",
            "Escoge las fechas de vuelo",
        )
    })

    it("should render FormDateRangePicker for ROUND trip type", () => {
        renderWithContext({ values: { flightTravelType: TripType.ROUND } })
        expect(screen.getByTestId("daterangepicker-oneWayTrip.startDate-oneWayTrip.endDate")).toBeInTheDocument()
        expect(screen.getByText("Fechas del vuelo")).toBeInTheDocument()
        expect(screen.getByTestId("daterangepicker-oneWayTrip.startDate-oneWayTrip.endDate")).toHaveAttribute(
            "data-aria-label",
            "Escoge las fechas de vuelo",
        )
    })

    it("should render FormDatePicker for MULTIPLE trip type", () => {
        renderWithContext({ values: { flightTravelType: TripType.MULTIPLE } })
        expect(screen.getByTestId("datepicker-oneWayTrip.startDate")).toBeInTheDocument()
    })

    it("should not render multidestination trips for SINGLE type", () => {
        renderWithContext({ values: { flightTravelType: TripType.SINGLE } })
        expect(screen.queryByTestId("multi-step-0")).not.toBeInTheDocument()
    })

    it("should render multidestination trips for MULTIPLE type", () => {
        const trip1 = createDefaultTrip()
        renderWithContext({
            values: {
                flightTravelType: TripType.MULTIPLE,
                multidestinationTrips: [trip1],
            },
        })
        expect(screen.getByTestId("multi-step-0")).toBeInTheDocument()
    })

    it("should render 'Añadir vuelo' button for the first multidestination trip", () => {
        renderWithContext({
            values: {
                flightTravelType: TripType.MULTIPLE,
                multidestinationTrips: [createDefaultTrip()],
            },
        })
        expect(screen.getByText("Añadir vuelo")).toBeInTheDocument()
    })

    it("should render 'Eliminar vuelo' button for non-first multidestination trips", () => {
        renderWithContext({
            values: {
                flightTravelType: TripType.MULTIPLE,
                multidestinationTrips: [createDefaultTrip(), createDefaultTrip()],
            },
        })
        expect(screen.getByText("Eliminar vuelo")).toBeInTheDocument()
    })

    it("should call setFieldValue to add trip when 'Añadir vuelo' is clicked", () => {
        const setFieldValue = vi.fn()
        renderWithContext({
            values: {
                flightTravelType: TripType.MULTIPLE,
                multidestinationTrips: [createDefaultTrip()],
            },
            setFieldValue,
        })
        fireEvent.click(screen.getByText("Añadir vuelo"))
        expect(setFieldValue).toHaveBeenCalledWith(
            "multidestinationTrips",
            expect.arrayContaining([expect.objectContaining({ origin: null, destination: null })]),
        )
    })

    it("should call setFieldValue to remove trip when 'Eliminar vuelo' is clicked", () => {
        const setFieldValue = vi.fn()
        const trip1 = createDefaultTrip()
        const trip2 = createDefaultTrip()
        renderWithContext({
            values: {
                flightTravelType: TripType.MULTIPLE,
                multidestinationTrips: [trip1, trip2],
            },
            setFieldValue,
        })
        fireEvent.click(screen.getByText("Eliminar vuelo"))
        expect(setFieldValue).toHaveBeenCalledWith(
            "multidestinationTrips",
            [trip1],
        )
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
})
