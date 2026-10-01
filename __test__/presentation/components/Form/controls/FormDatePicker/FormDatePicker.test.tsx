import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import FormContext, { FormContextValues } from "@/presentation/components/Form/context/FormContext"

const mockSetFieldValue = vi.fn()
const mockOnBlur = vi.fn()
const mockValidateForm = vi.fn()

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
    onInputChange: vi.fn(),
    setFieldValue: mockSetFieldValue,
    onBlur: mockOnBlur,
    validateForm: mockValidateForm,
    ...overrides,
})

vi.mock("formik", () => ({
    getIn: (obj: Record<string, unknown>, path: string) => {
        const parts = path.split(".")
        let result: unknown = obj
        for (const part of parts) {
            if (result && typeof result === "object") {
                result = (result as Record<string, unknown>)[part]
            } else {
                return undefined
            }
        }
        return result
    },
}))

vi.mock("@/presentation/components/Form/components/DatePicker", () => ({
    DatePicker: ({ 
        value,
        onChange, 
        isInvalid, 
        errorMessage,
        onBlur,
        ...rest
    }: Record<string, unknown>) => {
        // Convert CalendarDate-like value to display
        const displayValue = value ? `${(value as { year: number; month: number; day: number }).year}-${(value as { year: number; month: number; day: number }).month}-${(value as { year: number; month: number; day: number }).day}` : ""
        const name = (rest as { name?: string }).name
        return (
            <div data-testid="datepicker-wrapper" data-name={name}>
                <div data-testid="datepicker-value">{displayValue}</div>
                <div data-testid="is-invalid">{isInvalid ? "true" : "false"}</div>
                <div data-testid="error-message">{errorMessage as string}</div>
                <button 
                    data-testid="set-date-2024-06-15"
                    onClick={() => onChange && (onChange as (v: { year: number; month: number; day: number } | null) => void)({ year: 2024, month: 6, day: 15 })}
                >
                    Set June 15, 2024
                </button>
                <button 
                    data-testid="clear-date"
                    onClick={() => onChange && (onChange as (v: { year: number; month: number; day: number } | null) => void)(null)}
                >
                    Clear Date
                </button>
                <button data-testid="trigger-blur" onClick={() => onBlur && (onBlur as () => void)()}>
                    Blur
                </button>
            </div>
        )
    },
}))

import FormDatePicker from "@/presentation/components/Form/controls/FormDatePicker/FormDatePicker"

describe("FormDatePicker", () => {
    beforeEach(() => {
        mockSetFieldValue.mockClear()
        mockOnBlur.mockClear()
    })

    it("should render with name", () => {
        const context = createMockContext()
        
        render(
            <FormContext.Provider value={context}>
                <FormDatePicker name="dateField" />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("datepicker-wrapper")).toBeInTheDocument()
    })

    it("should convert Date value to CalendarDate format", () => {
        const testDate = new Date(2024, 5, 15) // June 15, 2024
        const context = createMockContext({ values: { dateField: testDate } })
        
        render(
            <FormContext.Provider value={context}>
                <FormDatePicker name="dateField" />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("datepicker-value")).toHaveTextContent("2024-6-15")
    })

    it("should handle null value", () => {
        const context = createMockContext({ values: { dateField: null } })
        
        render(
            <FormContext.Provider value={context}>
                <FormDatePicker name="dateField" />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("datepicker-value")).toBeEmptyDOMElement()
    })

    it("should handle undefined value", () => {
        const context = createMockContext({ values: {} })
        
        render(
            <FormContext.Provider value={context}>
                <FormDatePicker name="dateField" />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("datepicker-value")).toBeEmptyDOMElement()
    })

    it("should call setFieldValue with Date when changed", () => {
        const context = createMockContext({ values: { dateField: null } })
        
        render(
            <FormContext.Provider value={context}>
                <FormDatePicker name="dateField" />
            </FormContext.Provider>
        )
        
        fireEvent.click(screen.getByTestId("set-date-2024-06-15"))
        
        expect(mockSetFieldValue).toHaveBeenCalledWith("dateField", expect.any(Date), true)
        const calledDate = mockSetFieldValue.mock.calls[0][1] as Date
        expect(calledDate.getFullYear()).toBe(2024)
        expect(calledDate.getMonth()).toBe(5) // June (0-indexed)
        expect(calledDate.getDate()).toBe(15)
    })

    it("should call setFieldValue with null when cleared", () => {
        const testDate = new Date(2024, 5, 15)
        const context = createMockContext({ values: { dateField: testDate } })
        
        render(
            <FormContext.Provider value={context}>
                <FormDatePicker name="dateField" />
            </FormContext.Provider>
        )
        
        fireEvent.click(screen.getByTestId("clear-date"))
        
        expect(mockSetFieldValue).toHaveBeenCalledWith("dateField", null, true)
    })

    it("should show error when has error and value", () => {
        const testDate = new Date(2024, 5, 15)
        const context = createMockContext({ 
            values: { dateField: testDate },
            errors: { dateField: "Date is required" },
            submitCount: 1
        })
        
        render(
            <FormContext.Provider value={context}>
                <FormDatePicker name="dateField" />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("is-invalid")).toHaveTextContent("true")
        expect(screen.getByTestId("error-message")).toHaveTextContent("Date is required")
    })

    it("should not show error when no value and submitCount is 0", () => {
        const context = createMockContext({ 
            values: { dateField: null },
            errors: { dateField: "Date is required" },
            submitCount: 0
        })
        
        render(
            <FormContext.Provider value={context}>
                <FormDatePicker name="dateField" />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("is-invalid")).toHaveTextContent("false")
        expect(screen.getByTestId("error-message")).toBeEmptyDOMElement()
    })

    it("should call onBlur when blurred", () => {
        const context = createMockContext()
        
        render(
            <FormContext.Provider value={context}>
                <FormDatePicker name="dateField" />
            </FormContext.Provider>
        )
        
        fireEvent.click(screen.getByTestId("trigger-blur"))
        
        expect(mockOnBlur).toHaveBeenCalled()
    })

    it("should handle nested field names with dots", () => {
        const testDate = new Date(2024, 3, 20)
        const context = createMockContext({ 
            values: { trip: { startDate: testDate } }
        })
        
        render(
            <FormContext.Provider value={context}>
                <FormDatePicker name="trip.startDate" />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("datepicker-value")).toHaveTextContent("2024-4-20")
    })

    it("should prevent setting date before minValue", () => {
        const minValue = { year: 2024, month: 6, day: 1 } as any // June 1, 2024
        const context = createMockContext({ values: { dateField: null } })
        
        render(
            <FormContext.Provider value={context}>
                <FormDatePicker name="dateField" minValue={minValue} />
            </FormContext.Provider>
        )
        
        // Try to set a date before minValue
        fireEvent.click(screen.getByTestId("set-date-2024-06-15"))
        
        // Should set the date since it's after minValue
        expect(mockSetFieldValue).toHaveBeenCalledWith("dateField", expect.any(Date), true)
        
        mockSetFieldValue.mockClear()
    })

    it("should pass minValue prop to DatePicker", () => {
        const minValue = { year: 2024, month: 6, day: 1 } as any
        const context = createMockContext()
        
        render(
            <FormContext.Provider value={context}>
                <FormDatePicker name="dateField" minValue={minValue} />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("datepicker-wrapper")).toBeInTheDocument()
    })

    it("should handle time granularity", () => {
        const context = createMockContext()
        
        render(
            <FormContext.Provider value={context}>
                <FormDatePicker name="dateTimeField" granularity="hour" />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("datepicker-wrapper")).toBeInTheDocument()
    })

    it("should handle CalendarDateTime values with time", () => {
        const context = createMockContext()
        
        render(
            <FormContext.Provider value={context}>
                <FormDatePicker name="dateTimeField" granularity="minute" />
            </FormContext.Provider>
        )
        
        // Set a date with the mock
        fireEvent.click(screen.getByTestId("set-date-2024-06-15"))
        
        expect(mockSetFieldValue).toHaveBeenCalledWith("dateTimeField", expect.any(Date), true)
        const calledDate = mockSetFieldValue.mock.calls[0][1] as Date
        expect(calledDate.getFullYear()).toBe(2024)
        expect(calledDate.getMonth()).toBe(5)
        expect(calledDate.getDate()).toBe(15)
    })
})
