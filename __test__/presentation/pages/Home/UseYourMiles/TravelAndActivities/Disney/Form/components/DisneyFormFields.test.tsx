import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import FormContext from "@/presentation/components/Form/context/FormContext"
import type { FormContextValues } from "@/presentation/components/Form/context/FormContext"

vi.mock("@/presentation/components/Form/components/Button", () => ({
    Button: ({ children, className, ...rest }: { children: React.ReactNode; className: string; ["aria-label"]?: string }) => (
        <button className={className} data-testid="form-button" type="button" aria-label={rest["aria-label"]}>{children}</button>
    ),
}))

vi.mock("@/presentation/components/Form/controls/FormDatePicker/FormDatePicker", () => ({
    default: ({ name, label, ...rest }: { name: string; label: string; ["aria-label"]?: string }) => (
        <div>
            <label>{label}</label>
            <input name={name} data-testid="date-picker" aria-label={rest["aria-label"]} />
        </div>
    ),
}))

vi.mock("@/presentation/components/icons/IconSearch", () => ({
    default: () => <div data-testid="search-icon">Search Icon</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Disney/Form/components/PassengersSelect", () => ({
    default: ({ label, testId }: { label: string; testId: string }) => (
        <div>
            <label>{label}</label>
            <div data-testid={testId}>Passengers Select</div>
        </div>
    ),
}))

import DisneyFormFields from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Disney/Form/components/DisneyFormFields"

const renderWithContext = (overrides: Partial<FormContextValues> = {}) => {
    return render(
        <FormContext.Provider value={{
            values: {},
            errors: {},
            touched: {},
            onInputChange: () => {},
            setFieldValue: () => {},
            onBlur: () => {},
            validateForm: async () => ({}),
            isSubmitting: false,
            submitCount: 0,
            disabled: false,
            hasErrors: false,
            hasVisibleErrors: false,
            alert: null,
            ...overrides
        }}>
            <DisneyFormFields />
        </FormContext.Provider>
    )
}

describe("DisneyFormFields", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render form fields with date picker and passengers select", () => {
        renderWithContext()
        
        expect(screen.getByText("Fecha de visita")).toBeInTheDocument()
        expect(screen.getByTestId("date-picker")).toBeInTheDocument()
        expect(screen.getByText("Número de visitantes")).toBeInTheDocument()
        expect(screen.getByTestId("disney-passengers-select")).toBeInTheDocument()
    })

    it("should render form button", () => {
        renderWithContext()
        
        expect(screen.getByTestId("form-button")).toBeInTheDocument()
        expect(screen.getByText("Buscar")).toBeInTheDocument()
    })

    it("should render search icon when not submitting", () => {
        renderWithContext()
        
        expect(screen.getByTestId("search-icon")).toBeInTheDocument()
    })

    it("should hide search icon when submitting", () => {
        renderWithContext({ isSubmitting: true })
        
        expect(screen.queryByTestId("search-icon")).not.toBeInTheDocument()
    })

    it("should apply correct CSS classes based on hasVisibleErrors", () => {
        const { container } = renderWithContext({ hasVisibleErrors: false })
        
        // Test without errors - check the outer container
        const outerDiv = container.querySelector('.flex-col')
        expect(outerDiv).toHaveClass("items-end")
        
        // Test with errors
        const { container: containerWithErrors } = renderWithContext({ hasVisibleErrors: true })
        
        const outerDivWithError = containerWithErrors.querySelector('.flex-col')
        expect(outerDivWithError).toHaveClass("items-center")
    })

    it("should apply correct grid classes based on hasVisibleErrors", () => {
        const { container } = renderWithContext({ hasVisibleErrors: false })
        
        // Test without errors - check the grid container
        const gridDiv = container.querySelector('.grid')
        expect(gridDiv).toHaveClass("items-end")
        
        // Test with errors
        const { container: containerWithErrors } = renderWithContext({ hasVisibleErrors: true })
        
        const gridDivWithError = containerWithErrors.querySelector('.grid')
        expect(gridDivWithError).toHaveClass("items-start")
    })

    it("should have correct responsive grid layout", () => {
        renderWithContext()
        
        const gridDiv = screen.getByTestId("date-picker").parentElement?.parentElement
        expect(gridDiv).toHaveClass("grid-cols-1", "md:grid-cols-2")
    })

    it("should have correct responsive layout for outer container", () => {
        const { container } = renderWithContext()
        
        const outerDiv = container.querySelector('.flex-col')
        expect(outerDiv).toHaveClass("flex-col", "xl:flex-row")
    })

    it("should render date picker with correct props", () => {
        renderWithContext()
        
        const datePicker = screen.getByTestId("date-picker")
        expect(datePicker).toHaveAttribute("name", "date")
        expect(screen.getByText("Fecha de visita")).toBeInTheDocument()
    })

    it("should render passengers select with correct props", () => {
        renderWithContext()
        
        expect(screen.getByText("Número de visitantes")).toBeInTheDocument()
        expect(screen.getByTestId("disney-passengers-select")).toBeInTheDocument()
    })

    it("should render submit button with correct props", () => {
        renderWithContext()
        
        const button = screen.getByTestId("form-button")
        expect(button).toHaveAttribute("type", "button")
        expect(button).toHaveAttribute("aria-label", "Buscar resultados según la información del formulario")
        expect(screen.getByText("Buscar")).toBeInTheDocument()
    })

    it("should expose aria labels for date and visitors controls", () => {
        renderWithContext()

        expect(screen.getByLabelText("Escoge la fecha de visita")).toBeInTheDocument()
        expect(screen.getByLabelText("Escoge el número de visitantes")).toBeInTheDocument()
    })
})
