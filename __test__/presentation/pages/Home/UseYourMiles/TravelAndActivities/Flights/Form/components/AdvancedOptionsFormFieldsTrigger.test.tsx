import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import FormContext, {
    FormContextValues,
} from "@/presentation/components/Form/context/FormContext"

vi.mock("@heroui/react", () => ({
    Checkbox: ({ children, onValueChange, isSelected, ...rest }: Record<string, unknown>) => (
        <label>
            <input
                type="checkbox"
                data-testid="advanced-options-checkbox"
                checked={isSelected as boolean}
                aria-label={rest["aria-label"] as string}
                onChange={(e) => (onValueChange as (v: boolean) => void)(e.target.checked)}
            />
            {children as React.ReactNode}
        </label>
    ),
}))

import AdvancedOptionsTrigger from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form/components/AdvancedOptionsFormFieldsTrigger"

const makeFormContext = (overrides: Partial<FormContextValues> = {}): FormContextValues => ({
    values: {
        showAdvancedOptions: false,
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
                <AdvancedOptionsTrigger />
            </FormContext.Provider>,
        ),
        context,
    }
}

describe("AdvancedOptionsTrigger", () => {
    it("should render the checkbox with label text", () => {
        renderWithContext()
        expect(screen.getByText("Opciones avanzadas")).toBeInTheDocument()
        expect(screen.getByTestId("advanced-options-checkbox")).toHaveAttribute(
            "aria-label",
            expect.stringContaining("Opciones avanzadas despliegan 3 opciones adicionales para definir el número de escalas, la clase y la aerolínea."),
        )
    })

    it("should render checkbox unchecked when showAdvancedOptions is false", () => {
        renderWithContext({ values: { showAdvancedOptions: false } })
        const checkbox = screen.getByTestId("advanced-options-checkbox") as HTMLInputElement
        expect(checkbox.checked).toBe(false)
    })

    it("should render checkbox checked when showAdvancedOptions is true", () => {
        renderWithContext({ values: { showAdvancedOptions: true } })
        const checkbox = screen.getByTestId("advanced-options-checkbox") as HTMLInputElement
        expect(checkbox.checked).toBe(true)
    })

    it("should call setFieldValue when checkbox is toggled", () => {
        const setFieldValue = vi.fn()
        renderWithContext({ setFieldValue })
        fireEvent.click(screen.getByTestId("advanced-options-checkbox"))
        expect(setFieldValue).toHaveBeenCalledWith("showAdvancedOptions", true)
    })
})
