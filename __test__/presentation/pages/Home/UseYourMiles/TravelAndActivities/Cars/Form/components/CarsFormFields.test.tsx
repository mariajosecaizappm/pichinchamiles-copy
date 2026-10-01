import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import FormContext, { FormContextValues } from "@/presentation/components/Form/context/FormContext"
import { carsInitialValues } from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Cars/Form/CarsFormConfig"

vi.mock("@/presentation/components/Form/controls/FormAutocomplete", () => ({
    default: ({ name, label, placeholder, ...rest }: { name: string; label: string; placeholder: string; ["aria-label"]?: string }) => (
        <div data-testid={`autocomplete-${name}`} data-aria-label={rest["aria-label"]}>
            <span data-testid={`autocomplete-${name}-label`}>{label}</span>
            <span data-testid={`autocomplete-${name}-placeholder`}>{placeholder}</span>
        </div>
    ),
}))

vi.mock("@/presentation/components/Form/controls/FormDatePicker", () => ({
    FormDatePicker: ({ name, label, hourCycle, granularity, ...rest }: { name: string; label: string; hourCycle?: number; granularity?: string; ["aria-label"]?: string }) => (
        <div data-testid={`datepicker-${name}`} data-aria-label={rest["aria-label"]}>
            <span data-testid={`datepicker-${name}-label`}>{label}</span>
            <span data-testid={`datepicker-${name}-cycle`}>{hourCycle ?? ""}</span>
            <span data-testid={`datepicker-${name}-granularity`}>{granularity ?? ""}</span>
        </div>
    ),
}))

vi.mock("@/presentation/components/Form/controls/FormCheckbox", () => ({
    FormCheckbox: ({ name, label, ...rest }: { name: string; label: string; ["aria-label"]?: string }) => (
        <div data-testid={`checkbox-${name}`} data-aria-label={rest["aria-label"]}>{label}</div>
    ),
}))

vi.mock("@/presentation/pages/Home/components/Button", () => ({
    default: ({ children, type }: { children: React.ReactNode; type?: string }) => (
        <button data-testid="submit-button" type={(type as "submit" | "button") ?? "button"}>{children}</button>
    ),
}))

vi.mock("@/presentation/components/icons/IconCar", () => ({
    default: () => <svg data-testid="icon-car" />,
}))

vi.mock("@/presentation/components/icons/IconSearch", () => ({
    default: () => <svg data-testid="icon-search" />,
}))

import CarsFormFields from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Cars/Form/components/CarsFormFields"

const makeContext = (overrides: Partial<FormContextValues> = {}): FormContextValues => ({
    values: { ...carsInitialValues, ...(overrides.values ?? {}) },
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

const renderWith = (ctx: Partial<FormContextValues> = {}) =>
    render(
        <FormContext.Provider value={makeContext(ctx)}>
            <CarsFormFields />
        </FormContext.Provider>,
    )

describe("CarsFormFields", () => {
    it("should render the pickUp autocomplete and both date pickers", () => {
        renderWith()

        expect(screen.getByTestId("autocomplete-pickUpLocation")).toBeInTheDocument()
        expect(screen.getByTestId("datepicker-pickUpDateTime")).toBeInTheDocument()
        expect(screen.getByTestId("datepicker-returnDateTime")).toBeInTheDocument()
    })

    it("should render date pickers with 24h cycle and minute granularity", () => {
        renderWith()

        expect(screen.getByTestId("datepicker-pickUpDateTime-cycle")).toHaveTextContent("24")
        expect(screen.getByTestId("datepicker-pickUpDateTime-granularity")).toHaveTextContent("minute")
        expect(screen.getByTestId("datepicker-returnDateTime-cycle")).toHaveTextContent("24")
        expect(screen.getByTestId("datepicker-returnDateTime-granularity")).toHaveTextContent("minute")
        expect(screen.getByTestId("datepicker-pickUpDateTime")).toHaveAttribute("data-aria-label", "Escoge la fecha y hora de recogida.")
        expect(screen.getByTestId("datepicker-returnDateTime")).toHaveAttribute("data-aria-label", "Escoge la fecha y hora de devolución.")
    })

    it("should render the showDifferentDestination checkbox", () => {
        renderWith()

        expect(screen.getByTestId("checkbox-showDifferentDestination")).toHaveTextContent(
            "Devolver en otro lugar",
        )
        expect(screen.getByTestId("checkbox-showDifferentDestination")).toHaveAttribute(
            "data-aria-label",
            "Devolver en otro lugar despliega otra opción para definir el lugar de devolución.",
        )
    })

    it("should set pickup autocomplete aria label", () => {
        renderWith()
        expect(screen.getByTestId("autocomplete-pickUpLocation")).toHaveAttribute(
            "data-aria-label",
            "Ciudad o lugar de recogida.",
        )
    })

    it("should NOT render dropOffLocation when showDifferentDestination is false", () => {
        renderWith({ values: { showDifferentDestination: false } as FormContextValues["values"] })

        expect(screen.queryByTestId("autocomplete-dropOffLocation")).not.toBeInTheDocument()
    })

    it("should render dropOffLocation when showDifferentDestination is true", () => {
        renderWith({ values: { showDifferentDestination: true } as FormContextValues["values"] })

        expect(screen.getByTestId("autocomplete-dropOffLocation")).toBeInTheDocument()
    })

    it("should render the submit button with the search label and icon when not submitting", () => {
        renderWith({ isSubmitting: false })

        const button = screen.getByTestId("submit-button")
        expect(button).toHaveAttribute("type", "submit")
        expect(button).toHaveTextContent("Buscar")
        expect(screen.getByTestId("icon-search")).toBeInTheDocument()
    })

    it("should hide the search icon while submitting", () => {
        renderWith({ isSubmitting: true })

        expect(screen.queryByTestId("icon-search")).not.toBeInTheDocument()
    })

    it("should switch grid layout to 4 columns when showDifferentDestination is true", () => {
        const { container } = renderWith({
            values: { showDifferentDestination: true } as FormContextValues["values"],
        })

        const grid = container.firstChild as HTMLElement
        expect(grid.className).toContain("lg:grid-cols-4")
        expect(grid.className).not.toContain("lg:grid-cols-3")
    })

    it("should use 3-column grid when showDifferentDestination is false", () => {
        const { container } = renderWith()

        const grid = container.firstChild as HTMLElement
        expect(grid.className).toContain("lg:grid-cols-3")
    })

    it("should apply items-end when there are no visible errors", () => {
        const { container } = renderWith({ hasVisibleErrors: false })

        const grid = container.firstChild as HTMLElement
        expect(grid.className).toContain("items-end")
        expect(grid.className).not.toContain("items-start")
    })

    it("should apply items-start when there are visible errors", () => {
        const { container } = renderWith({ hasVisibleErrors: true })

        const grid = container.firstChild as HTMLElement
        expect(grid.className).toContain("items-start")
        expect(grid.className).not.toContain("items-end")
    })
})
