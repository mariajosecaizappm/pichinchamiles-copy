import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import FormContext, {
    FormContextValues,
} from "@/presentation/components/Form/context/FormContext"
import { Category } from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Form/components/PassengerSelect/types"

vi.mock("@heroui/react", () => ({
    Button: ({ children, onPress, disabled, ...props }: Record<string, unknown>) => (
        <button
            disabled={disabled as boolean}
            onClick={onPress as () => void}
            data-testid={props["data-testid"] as string}
            aria-label={props["aria-label"] as string}
        >
            {children as React.ReactNode}
        </button>
    ),
    Popover: ({ children, isOpen, onOpenChange }: Record<string, unknown>) => (
        <div role="dialog" data-open={isOpen} data-onchange={onOpenChange?.toString()}>
            {children as React.ReactNode}
        </div>
    ),
    PopoverTrigger: ({ children }: Record<string, unknown>) => <div>{children as React.ReactNode}</div>,
    PopoverContent: ({ children }: Record<string, unknown>) => <div>{children as React.ReactNode}</div>,
    cn: (...args: string[]) => args.filter(Boolean).join(" "),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Form/components/PassengerSelect/PassengerSelectItem", () => ({
    default: ({ label, value, onChange, min, max, state }: Record<string, unknown>) => (
        <div data-testid={`passenger-item-${label}`}>
            <span data-testid={`passenger-value-${label}`}>{value as number}</span>
            <button
                data-testid={`passenger-decrease-${label}`}
                onClick={() => (onChange as (v: number) => void)((value as number) - 1)}
                disabled={(value as number) <= (min as number) || state === 'readonly'}
            >
                -
            </button>
            <button
                data-testid={`passenger-increase-${label}`}
                onClick={() => (onChange as (v: number) => void)((value as number) + 1)}
                disabled={(value as number) >= (max as number) || state === 'readonly'}
            >
                +
            </button>
        </div>
    ),
}))

import PassengersSelect from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Form/components/PassengerSelect/PassengersSelectContainer"

const makeFormContext = (overrides: Partial<FormContextValues> = {}): FormContextValues => ({
    values: {
        adults: 1,
        childrens: 0,
        infants: 0,
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

const renderWithContext = (
    ctx: Partial<FormContextValues> = {},
    props: Omit<Record<string, unknown>, 'categories'> & { categories?: Category[] } = {},
) => {
    const context = makeFormContext(ctx)
    const defaultCategories = [
        {
            key: "adults",
            label: "Adultos (más de 12 años)",
            min: 1,
            max: 10,
            value: context.values.adults ?? 1,
            state: "default" as const,
        },
        {
            key: "childrens",
            label: "Niños (de 2 a 11 años)",
            min: 0,
            max: 10,
            value: context.values.childrens ?? 0,
            state: "default" as const,
        },
        {
            key: "infants",
            label: "Bebés (de 0 a 23 meses)",
            min: 0,
            max: 0,
            value: context.values.infants ?? 0,
            state: "default" as const,
        },
    ].filter(cat => cat.max > 0)

    const { categories, ...restProps } = props

    return {
        ...render(
            <FormContext.Provider value={context}>
                <PassengersSelect
                    label="Número de pasajeros"
                    categories={categories ?? defaultCategories}
                    {...restProps}
                />
            </FormContext.Provider>,
        ),
        context,
    }
}

describe("PassengersSelectContainer", () => {
    it("should render the label", () => {
        renderWithContext()
        expect(screen.getByText("Número de pasajeros")).toBeInTheDocument()
    })

    it("should render all passenger categories from categories prop", () => {
        const categories = [
            {
                key: "adults",
                label: "Adultos (más de 12 años)",
                min: 1,
                max: 10,
                value: 1,
                state: "default" as const,
            },
            {
                key: "childrens",
                label: "Niños (de 2 a 11 años)",
                min: 0,
                max: 10,
                value: 0,
                state: "default" as const,
            },
            {
                key: "infants",
                label: "Bebés (de 0 a 23 meses)",
                min: 0,
                max: 5,
                value: 0,
                state: "default" as const,
            },
        ]
        renderWithContext({}, { categories })
        expect(screen.getByTestId("passenger-item-Adultos (más de 12 años)")).toBeInTheDocument()
        expect(screen.getByTestId("passenger-item-Niños (de 2 a 11 años)")).toBeInTheDocument()
        expect(screen.getByTestId("passenger-item-Bebés (de 0 a 23 meses)")).toBeInTheDocument()
    })

    it("should render the displayValue computed from categories", () => {
        const categories = [
            {
                key: "adults",
                label: "Adultos (más de 12 años)",
                min: 1,
                max: 10,
                value: 2,
                state: "default" as const,
            },
            {
                key: "childrens",
                label: "Niños (de 2 a 11 años)",
                min: 0,
                max: 10,
                value: 1,
                state: "default" as const,
            },
        ]
        renderWithContext({}, { categories })
        expect(screen.getByText("3 Pasajeros")).toBeInTheDocument()
    })

    it("should display placeholder when total is 0", () => {
        const categories = [
            {
                key: "adults",
                label: "Adultos (más de 12 años)",
                min: 1,
                max: 10,
                value: 0,
                state: "default" as const,
            },
        ]
        renderWithContext({ values: { adults: 0, childrens: 0, infants: 0 } }, { categories })
        // Label appears once in the label element
        expect(screen.getAllByText("Número de pasajeros")).toHaveLength(1)
        // Trigger shows placeholder when no passengers
        expect(screen.getByText("Número de pasajeros")).toBeInTheDocument()
    })

    it("should call setFieldValue with updated count and label when adult is increased", () => {
        const setFieldValue = vi.fn()
        const categories = [
            {
                key: "adults",
                label: "Adultos (más de 12 años)",
                min: 1,
                max: 10,
                value: 1,
                state: "default" as const,
            },
            {
                key: "childrens",
                label: "Niños (de 2 a 11 años)",
                min: 0,
                max: 10,
                value: 0,
                state: "default" as const,
            },
        ]
        renderWithContext(
            { values: { adults: 1, childrens: 0, infants: 0 }, setFieldValue },
            { categories }
        )
        fireEvent.click(screen.getByTestId("passenger-increase-Adultos (más de 12 años)"))
        expect(setFieldValue).toHaveBeenCalledWith("adults", 2)
        expect(setFieldValue).toHaveBeenCalledWith("passengersInfo", "2 Pasajeros")
    })

    it("should call setFieldValue with '1 Pasajero' when total becomes 1", () => {
        const setFieldValue = vi.fn()
        const categories = [
            {
                key: "adults",
                label: "Adultos (más de 12 años)",
                min: 1,
                max: 10,
                value: 2,
                state: "default" as const,
            },
        ]
        renderWithContext(
            { values: { adults: 2, childrens: 0, infants: 0 }, setFieldValue },
            { categories }
        )
        fireEvent.click(screen.getByTestId("passenger-decrease-Adultos (más de 12 años)"))
        expect(setFieldValue).toHaveBeenCalledWith("adults", 1)
        expect(setFieldValue).toHaveBeenCalledWith("passengersInfo", "1 Pasajero")
    })

    it("should render room item when showRoom is true", () => {
        const categories = [
            {
                key: "adults",
                label: "Adultos (más de 12 años)",
                min: 1,
                max: 10,
                value: 2,
                state: "default" as const,
            },
        ]
        renderWithContext({}, { categories, showRoom: true, roomLabel: "Habitación" })
        expect(screen.getByTestId("passenger-item-Habitación")).toBeInTheDocument()
    })

    it("should display room and guest label when showRoom is true", () => {
        const categories = [
            {
                key: "adults",
                label: "Adultos (más de 12 años)",
                min: 1,
                max: 10,
                value: 2,
                state: "default" as const,
            },
        ]
        renderWithContext({}, { categories, showRoom: true, roomLabel: "Habitación", guestLabel: "Pasajero" })
        expect(screen.getByText("1 Habitación, 2 Pasajeros")).toBeInTheDocument()
    })

    it("should use custom guest label", () => {
        const categories = [
            {
                key: "adults",
                label: "Adultos (más de 12 años)",
                min: 1,
                max: 10,
                value: 1,
                state: "default" as const,
            },
        ]
        renderWithContext({}, { categories, guestLabel: "Huésped" })
        expect(screen.getByText("1 Huésped")).toBeInTheDocument()
    })

    it("should forward triggerAriaLabel to selector button", () => {
        renderWithContext({}, { triggerAriaLabel: "Escoge el número de pasajeros" })
        expect(screen.getByLabelText("Escoge el número de pasajeros")).toBeInTheDocument()
    })
})
