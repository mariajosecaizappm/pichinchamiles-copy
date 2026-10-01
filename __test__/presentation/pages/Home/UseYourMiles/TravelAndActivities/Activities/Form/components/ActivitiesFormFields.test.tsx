import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import FormContext, { FormContextValues } from "@/presentation/components/Form/context/FormContext"
import ActivitiesFormFields from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Activities/Form/components/ActivitiesFormFields"

const mockSetFieldValue = vi.fn()
const mockOnBlur = vi.fn()
const mockHandleChange = vi.fn()

const createMockContext = (overrides: Partial<FormContextValues> = {}): FormContextValues => ({
    values: {},
    errors: {},
    touched: {},
    disabled: false,
    isSubmitting: false,
    submitCount: 0,
    hasErrors: false,
    hasVisibleErrors: false,
    alert: null,
    onInputChange: mockHandleChange,
    setFieldValue: mockSetFieldValue,
    onBlur: mockOnBlur,
    ...overrides,
})

vi.mock("@internationalized/date", () => ({
    getLocalTimeZone: () => "UTC",
    today: () => ({ 
        year: 2024, 
        month: 6, 
        day: 15, 
        add: ({ days }: { days: number }) => ({ 
            year: 2024, 
            month: 6, 
            day: 15 + days 
        }) 
    })
}))

vi.mock("@/presentation/components/Form/controls/FormAutocomplete/FormAutocompleteContainer", () => ({
    default: ({ name, label, placeholder, valueAsObject, startContent, ...rest }: Record<string, unknown>) => (
        <div data-testid="form-autocomplete" data-name={name as string} data-aria-label={rest["aria-label"] as string}>
            <div data-testid="autocomplete-label">{label}</div>
            <div data-testid="autocomplete-placeholder">{placeholder}</div>
            <div data-testid="autocomplete-value-as-object">{String(valueAsObject)}</div>
            <div data-testid="autocomplete-start-content">{startContent ? "yes" : "no"}</div>
        </div>
    )
}))

vi.mock("@/presentation/components/Form/controls/FormDatePicker/FormDatePicker", () => ({
    default: ({ name, label, minValue, ...rest }: Record<string, unknown>) => (
        <div data-testid="form-datepicker" data-name={name as string} data-aria-label={rest["aria-label"] as string}>
            <div data-testid="datepicker-label">{label}</div>
            <div data-testid="datepicker-has-min-value">{minValue ? JSON.stringify(minValue) : "no"}</div>
        </div>
    )
}))

vi.mock("@/presentation/components/Form/controls/FormInput/FormInputContainer", () => ({
    default: ({ name, label, placeholder, type, classNames, ...rest }: Record<string, unknown>) => (
        <div data-testid="form-input" data-name={name as string} data-aria-label={rest["aria-label"] as string}>
            <div data-testid="input-label">{label}</div>
            <div data-testid="input-placeholder">{placeholder}</div>
            <div data-testid="input-type">{type}</div>
            <div data-testid="input-wrapper-class">{(classNames as { inputWrapper?: string } | undefined)?.inputWrapper}</div>
        </div>
    )
}))

vi.mock("@/presentation/components/Form/components/Button", () => ({
    Button: ({ type, color, className, children, ...rest }: Record<string, unknown>) => (
        <button data-testid="submit-button" type={type as "submit" | "button" | "reset"} data-color={color as string} className={className as string} aria-label={rest["aria-label"] as string}>
            {children}
        </button>
    ),
    default: ({ type, color, className, children, ...rest }: Record<string, unknown>) => (
        <button data-testid="submit-button" type={type as "submit" | "button" | "reset"} data-color={color as string} className={className as string} aria-label={rest["aria-label"] as string}>
            {children}
        </button>
    )
}))

vi.mock("@/presentation/components/icons/IconSearch", () => ({
    default: () => <div data-testid="icon-search">Search Icon</div>
}))

vi.mock("@/presentation/components/icons/IconPing", () => ({
    default: () => <div data-testid="icon-ping">Ping Icon</div>
}))

vi.mock("../ActivitiesFormConfig", () => ({
    mapAutocompleteLocations: vi.fn(),
    MIN_DAYS_AHEAD: 3
}))

describe("ActivitiesFormFields", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render all form fields", () => {
        const context = createMockContext()
        
        render(
            <FormContext.Provider value={context}>
                <ActivitiesFormFields />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("form-autocomplete")).toBeInTheDocument()
        expect(screen.getByTestId("form-datepicker")).toBeInTheDocument()
        expect(screen.getByTestId("form-input")).toBeInTheDocument()
        expect(screen.getByTestId("submit-button")).toBeInTheDocument()
    })

    it("should render destination autocomplete with correct props", () => {
        const context = createMockContext()
        
        render(
            <FormContext.Provider value={context}>
                <ActivitiesFormFields />
            </FormContext.Provider>
        )
        
        const autocomplete = screen.getByTestId("form-autocomplete")
        expect(autocomplete).toHaveAttribute("data-name", "destination")
        expect(screen.getByTestId("autocomplete-label")).toHaveTextContent("Ciudad")
        expect(screen.getByTestId("autocomplete-placeholder")).toHaveTextContent("Destino o lugar")
        expect(screen.getByTestId("autocomplete-value-as-object")).toHaveTextContent("true")
        expect(screen.getByTestId("autocomplete-start-content")).toHaveTextContent("yes")
        expect(autocomplete).toHaveAttribute("data-aria-label", "Destino o lugar.")
    })

    it("should render date picker with correct props", () => {
        const context = createMockContext()
        
        render(
            <FormContext.Provider value={context}>
                <ActivitiesFormFields />
            </FormContext.Provider>
        )
        
        const datepicker = screen.getByTestId("form-datepicker")
        expect(datepicker).toHaveAttribute("data-name", "endDate")
        expect(datepicker).toHaveAttribute("data-aria-label", "Escoge la fecha de la actividad.")
        expect(screen.getByTestId("datepicker-label")).toHaveTextContent("Fecha de la actividad")
        const minValueText = screen.getByTestId("datepicker-has-min-value").textContent
        expect(minValueText).toContain("year")
        expect(minValueText).toContain("month")
        expect(minValueText).toContain("day")
    })

    it("should render age input with correct props", () => {
        const context = createMockContext()
        
        render(
            <FormContext.Provider value={context}>
                <ActivitiesFormFields />
            </FormContext.Provider>
        )
        
        const input = screen.getByTestId("form-input")
        expect(input).toHaveAttribute("data-name", "age")
        expect(input).toHaveAttribute("data-aria-label", "Ingresa la edad del participante")
        expect(screen.getByTestId("input-label")).toHaveTextContent("Edad del participante")
        expect(screen.getByTestId("input-placeholder")).toHaveTextContent("Ingresa tu edad")
        expect(screen.getByTestId("input-type")).toHaveTextContent("number")
        expect(screen.getByTestId("input-wrapper-class")).toHaveTextContent("border-[1px] shadow-none")
    })

    it("should render submit button with correct props", () => {
        const context = createMockContext({ isSubmitting: false })
        
        render(
            <FormContext.Provider value={context}>
                <ActivitiesFormFields />
            </FormContext.Provider>
        )
        
        const button = screen.getByTestId("submit-button")
        expect(button).toHaveAttribute("type", "submit")
        expect(button).toHaveAttribute("data-color", "primary")
        expect(button).toHaveAttribute("aria-label", "Buscar resultados según la información del formulario")
        expect(screen.getByText("Buscar")).toBeInTheDocument()
        expect(screen.getByTestId("icon-search")).toBeInTheDocument()
    })

    it("should show loading state when submitting", () => {
        const context = createMockContext({ isSubmitting: true })
        
        render(
            <FormContext.Provider value={context}>
                <ActivitiesFormFields />
            </FormContext.Provider>
        )
        
        expect(screen.getByText("Buscar")).toBeInTheDocument()
        expect(screen.queryByTestId("icon-search")).not.toBeInTheDocument()
    })

    it("should apply correct CSS classes based on hasVisibleErrors", () => {
        const contextWithErrors = createMockContext({ hasVisibleErrors: true })
        const contextWithoutErrors = createMockContext({ hasVisibleErrors: false })
        
        const { container } = render(
            <FormContext.Provider value={contextWithoutErrors}>
                <ActivitiesFormFields />
            </FormContext.Provider>
        )
        
        // Test without errors - check the outer container
        const outerDiv = container.querySelector('.flex-col')
        expect(outerDiv).toHaveClass("items-end")
        
        // Test with errors
        const { container: containerWithErrors } = render(
            <FormContext.Provider value={contextWithErrors}>
                <ActivitiesFormFields />
            </FormContext.Provider>
        )
        
        const outerDivWithError = containerWithErrors.querySelector('.flex-col')
        expect(outerDivWithError).toHaveClass("items-center")
    })

    it("should apply correct grid classes based on hasVisibleErrors", () => {
        const contextWithErrors = createMockContext({ hasVisibleErrors: true })
        const contextWithoutErrors = createMockContext({ hasVisibleErrors: false })
        
        const { container } = render(
            <FormContext.Provider value={contextWithoutErrors}>
                <ActivitiesFormFields />
            </FormContext.Provider>
        )
        
        // Test without errors - check the grid container
        const gridDiv = container.querySelector('.grid')
        expect(gridDiv).toHaveClass("items-end")
        
        // Test with errors
        const { container: containerWithErrors } = render(
            <FormContext.Provider value={contextWithErrors}>
                <ActivitiesFormFields />
            </FormContext.Provider>
        )
        
        const gridDivWithError = containerWithErrors.querySelector('.grid')
        expect(gridDivWithError).toHaveClass("items-start")
    })

    it("should have correct responsive grid layout", () => {
        const context = createMockContext()
        
        render(
            <FormContext.Provider value={context}>
                <ActivitiesFormFields />
            </FormContext.Provider>
        )
        
        const gridDiv = screen.getByTestId("form-autocomplete").parentElement
        expect(gridDiv).toHaveClass("grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3")
    })

    it("should have correct responsive layout for outer container", () => {
        const context = createMockContext()
        
        const { container } = render(
            <FormContext.Provider value={context}>
                <ActivitiesFormFields />
            </FormContext.Provider>
        )
        
        const outerDiv = container.querySelector('.flex-col')
        expect(outerDiv).toHaveClass("flex-col", "xl:flex-row")
    })
})
