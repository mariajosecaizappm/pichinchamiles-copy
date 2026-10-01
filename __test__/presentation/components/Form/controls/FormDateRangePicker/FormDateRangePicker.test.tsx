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

vi.mock("@/presentation/components/Form/components/DateRangePicker", () => ({
    DateRangePicker: ({ 
        value,
        onChange, 
        isInvalid, 
        errorMessage,
        onBlur,
    }: Record<string, unknown>) => {
        const startValue = value && (value as { start?: { year: number; month: number; day: number } }).start 
            ? `${(value as { start: { year: number; month: number; day: number } }).start.year}-${(value as { start: { year: number; month: number; day: number } }).start.month}-${(value as { start: { year: number; month: number; day: number } }).start.day}` 
            : ""
        const endValue = value && (value as { end?: { year: number; month: number; day: number } }).end 
            ? `${(value as { end: { year: number; month: number; day: number } }).end.year}-${(value as { end: { year: number; month: number; day: number } }).end.month}-${(value as { end: { year: number; month: number; day: number } }).end.day}` 
            : ""
        return (
            <div data-testid="daterange-wrapper">
                <div data-testid="range-start">{startValue}</div>
                <div data-testid="range-end">{endValue}</div>
                <div data-testid="is-invalid">{isInvalid ? "true" : "false"}</div>
                <div data-testid="error-message">{errorMessage as string}</div>
                <button 
                    data-testid="set-range"
                    onClick={() => onChange && (onChange as (v: { start: { year: number; month: number; day: number }; end: { year: number; month: number; day: number } } | null) => void)({ 
                        start: { year: 2024, month: 6, day: 15 }, 
                        end: { year: 2024, month: 6, day: 20 } 
                    })}
                >
                    Set Range
                </button>
                <button 
                    data-testid="clear-range"
                    onClick={() => onChange && (onChange as (v: null) => void)(null)}
                >
                    Clear Range
                </button>
                <button data-testid="trigger-blur" onClick={() => onBlur && (onBlur as () => void)()}>
                    Blur
                </button>
            </div>
        )
    },
}))

import FormDateRangePicker from "@/presentation/components/Form/controls/FormDateRangePicker/FormDateRangePicker"

describe("FormDateRangePicker", () => {
    beforeEach(() => {
        mockSetFieldValue.mockClear()
        mockOnBlur.mockClear()
    })

    it("should render with startName and endName", () => {
        const context = createMockContext()
        
        render(
            <FormContext.Provider value={context}>
                <FormDateRangePicker startName="startDate" endName="endDate" />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("daterange-wrapper")).toBeInTheDocument()
    })

    it("should convert Date values to CalendarDate range", () => {
        const startDate = new Date(2024, 5, 15) // June 15, 2024
        const endDate = new Date(2024, 5, 20) // June 20, 2024
        const context = createMockContext({ 
            values: { startDate, endDate } 
        })
        
        render(
            <FormContext.Provider value={context}>
                <FormDateRangePicker startName="startDate" endName="endDate" />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("range-start")).toHaveTextContent("2024-6-15")
        expect(screen.getByTestId("range-end")).toHaveTextContent("2024-6-20")
    })

    it("should handle null values", () => {
        const context = createMockContext({ 
            values: { startDate: null, endDate: null } 
        })
        
        render(
            <FormContext.Provider value={context}>
                <FormDateRangePicker startName="startDate" endName="endDate" />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("range-start")).toBeEmptyDOMElement()
        expect(screen.getByTestId("range-end")).toBeEmptyDOMElement()
    })

    it("should call setFieldValue for both dates when range changes", () => {
        const context = createMockContext({ 
            values: { startDate: null, endDate: null } 
        })
        
        render(
            <FormContext.Provider value={context}>
                <FormDateRangePicker startName="startDate" endName="endDate" />
            </FormContext.Provider>
        )
        
        fireEvent.click(screen.getByTestId("set-range"))
        
        expect(mockSetFieldValue).toHaveBeenCalledWith("startDate", expect.any(Date), true)
        expect(mockSetFieldValue).toHaveBeenCalledWith("endDate", expect.any(Date), true)
        
        const startCall = mockSetFieldValue.mock.calls.find(call => call[0] === "startDate")
        const endCall = mockSetFieldValue.mock.calls.find(call => call[0] === "endDate")
        
        expect((startCall?.[1] as Date).getDate()).toBe(15)
        expect((endCall?.[1] as Date).getDate()).toBe(20)
    })

    it("should call setFieldValue with null when range cleared", () => {
        const startDate = new Date(2024, 5, 15)
        const endDate = new Date(2024, 5, 20)
        const context = createMockContext({ 
            values: { startDate, endDate } 
        })
        
        render(
            <FormContext.Provider value={context}>
                <FormDateRangePicker startName="startDate" endName="endDate" />
            </FormContext.Provider>
        )
        
        fireEvent.click(screen.getByTestId("clear-range"))
        
        expect(mockSetFieldValue).toHaveBeenCalledWith("startDate", null, true)
        expect(mockSetFieldValue).toHaveBeenCalledWith("endDate", null, true)
    })

    it("should show error when start date has error", () => {
        const startDate = new Date(2024, 5, 15)
        const context = createMockContext({ 
            values: { startDate, endDate: null },
            errors: { startDate: "Start date is required" },
            submitCount: 1
        })
        
        render(
            <FormContext.Provider value={context}>
                <FormDateRangePicker startName="startDate" endName="endDate" />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("is-invalid")).toHaveTextContent("true")
        expect(screen.getByTestId("error-message")).toHaveTextContent("Start date is required")
    })

    it("should show error when end date has error", () => {
        const endDate = new Date(2024, 5, 20)
        const context = createMockContext({ 
            values: { startDate: null, endDate },
            errors: { endDate: "End date is required" },
            submitCount: 1
        })
        
        render(
            <FormContext.Provider value={context}>
                <FormDateRangePicker startName="startDate" endName="endDate" />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("is-invalid")).toHaveTextContent("true")
        expect(screen.getByTestId("error-message")).toHaveTextContent("End date is required")
    })

    it("should prefer start error over end error", () => {
        const startDate = new Date(2024, 5, 15)
        const endDate = new Date(2024, 5, 20)
        const context = createMockContext({ 
            values: { startDate, endDate },
            errors: { startDate: "Start error", endDate: "End error" },
            submitCount: 1
        })
        
        render(
            <FormContext.Provider value={context}>
                <FormDateRangePicker startName="startDate" endName="endDate" />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("error-message")).toHaveTextContent("Start error")
    })

    it("should not show error when no values and submitCount is 0", () => {
        const context = createMockContext({ 
            values: { startDate: null, endDate: null },
            errors: { startDate: "Start date error" },
            submitCount: 0
        })
        
        render(
            <FormContext.Provider value={context}>
                <FormDateRangePicker startName="startDate" endName="endDate" />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("is-invalid")).toHaveTextContent("false")
        expect(screen.getByTestId("error-message")).toBeEmptyDOMElement()
    })

    it("should call onBlur when blurred", () => {
        const context = createMockContext()
        
        render(
            <FormContext.Provider value={context}>
                <FormDateRangePicker startName="startDate" endName="endDate" />
            </FormContext.Provider>
        )
        
        fireEvent.click(screen.getByTestId("trigger-blur"))
        
        expect(mockOnBlur).toHaveBeenCalled()
    })

    it("should handle nested field names", () => {
        const startDate = new Date(2024, 3, 10)
        const endDate = new Date(2024, 3, 15)
        const context = createMockContext({ 
            values: { trip: { departure: startDate, return: endDate } }
        })
        
        render(
            <FormContext.Provider value={context}>
                <FormDateRangePicker startName="trip.departure" endName="trip.return" />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("range-start")).toHaveTextContent("2024-4-10")
        expect(screen.getByTestId("range-end")).toHaveTextContent("2024-4-15")
    })

    it("should handle partial range (only start date)", () => {
        const startDate = new Date(2024, 5, 15)
        const context = createMockContext({ 
            values: { startDate, endDate: null } 
        })
        
        render(
            <FormContext.Provider value={context}>
                <FormDateRangePicker startName="startDate" endName="endDate" />
            </FormContext.Provider>
        )
        
        // When only start date is set, rangeValue is null because end is missing
        expect(screen.getByTestId("range-start")).toBeEmptyDOMElement()
        expect(screen.getByTestId("range-end")).toBeEmptyDOMElement()
    })

    it("should handle partial range (only end date)", () => {
        const endDate = new Date(2024, 5, 20)
        const context = createMockContext({ 
            values: { startDate: null, endDate } 
        })
        
        render(
            <FormContext.Provider value={context}>
                <FormDateRangePicker startName="startDate" endName="endDate" />
            </FormContext.Provider>
        )
        
        // When only end date is set, rangeValue is null because start is missing
        expect(screen.getByTestId("range-start")).toBeEmptyDOMElement()
        expect(screen.getByTestId("range-end")).toBeEmptyDOMElement()
    })
})
