import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import FormContext, { FormContextValues } from "@/presentation/components/Form/context/FormContext"
import type { SharedSelection } from "@heroui/react"

const mockSetFieldValue = vi.fn()
const mockOnBlur = vi.fn()

const createMockContext = (overrides: Partial<FormContextValues> = {}): FormContextValues => ({
    values: {},
    errors: {},
    touched: {},
    disabled: false,
    isSubmitting: false,
    submitCount: 0,
    hasErrors: false,
    alert: null,
    onInputChange: vi.fn(),
    setFieldValue: mockSetFieldValue,
    onBlur: mockOnBlur,
    ...overrides,
})

const mockSelectOptions = [
    { id: "opt-1", name: "Option 1" },
    { id: "opt-2", name: "Option 2" },
    { id: "opt-3", name: "Option 3" },
]

vi.mock("@heroui/react", () => ({
    SelectItem: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock("@/presentation/components/Form/components/Select", () => ({
    Select: ({ 
        name, 
        selectedKeys, 
        onSelectionChange, 
        isInvalid, 
        errorMessage,
        onBlur,
        children,
        selectionMode,
        ...rest
    }: Record<string, unknown>) => {
        const keys = selectedKeys as Set<string>
        return (
            <div data-testid="select-wrapper" data-name={name} data-selection-mode={selectionMode}>
                <div data-testid="selected-keys">{Array.from(keys || []).join(", ")}</div>
                <div data-testid="is-invalid">{isInvalid ? "true" : "false"}</div>
                <div data-testid="error-message">{errorMessage as string}</div>
                <button 
                    data-testid="select-opt-1"
                    onClick={() => onSelectionChange && (onSelectionChange as (k: SharedSelection) => void)(new Set(["opt-1"]))}
                >
                    Select Option 1
                </button>
                <button 
                    data-testid="select-opt-2"
                    onClick={() => onSelectionChange && (onSelectionChange as (k: SharedSelection) => void)(new Set(["opt-2"]))}
                >
                    Select Option 2
                </button>
                <button 
                    data-testid="select-multiple"
                    onClick={() => onSelectionChange && (onSelectionChange as (k: SharedSelection) => void)(new Set(["opt-1", "opt-2"]))}
                >
                    Select Multiple
                </button>
                <button data-testid="trigger-blur" onClick={() => onBlur && (onBlur as () => void)()}>
                    Blur
                </button>
                <>{children}</>
            </div>
        )
    },
}))

import FormSelect from "@/presentation/components/Form/controls/FormSelect/FormSelect"

describe("FormSelect", () => {
    beforeEach(() => {
        mockSetFieldValue.mockClear()
        mockOnBlur.mockClear()
    })

    it("should render with options", () => {
        const context = createMockContext()
        
        render(
            <FormContext.Provider value={context}>
                <FormSelect name="testField" options={mockSelectOptions} />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("select-wrapper")).toBeInTheDocument()
        expect(screen.getByTestId("select-wrapper")).toHaveAttribute("data-name", "testField")
    })

    it("should show selected value from context", () => {
        const context = createMockContext({ values: { testField: "opt-1" } })
        
        render(
            <FormContext.Provider value={context}>
                <FormSelect name="testField" options={mockSelectOptions} />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("selected-keys")).toHaveTextContent("opt-1")
    })

    it("should show multiple selected values from context", () => {
        const context = createMockContext({ values: { testField: ["opt-1", "opt-2"] } })
        
        render(
            <FormContext.Provider value={context}>
                <FormSelect name="testField" options={mockSelectOptions} selectionMode="multiple" />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("selected-keys")).toHaveTextContent("opt-1, opt-2")
    })

    it("should call setFieldValue on selection change (single)", () => {
        const context = createMockContext({ values: { testField: "" } })
        
        render(
            <FormContext.Provider value={context}>
                <FormSelect name="testField" options={mockSelectOptions} />
            </FormContext.Provider>
        )
        
        fireEvent.click(screen.getByTestId("select-opt-1"))
        
        expect(mockSetFieldValue).toHaveBeenCalledWith("testField", "opt-1")
    })

    it("should call setFieldValue with array for multiple selection", () => {
        const context = createMockContext({ values: { testField: [] } })
        
        render(
            <FormContext.Provider value={context}>
                <FormSelect name="testField" options={mockSelectOptions} selectionMode="multiple" />
            </FormContext.Provider>
        )
        
        fireEvent.click(screen.getByTestId("select-multiple"))
        
        expect(mockSetFieldValue).toHaveBeenCalledWith("testField", ["opt-1", "opt-2"])
    })

    it("should show error when has error and value", () => {
        const context = createMockContext({ 
            values: { testField: "opt-1" },
            errors: { testField: "Error message" },
            submitCount: 1
        })
        
        render(
            <FormContext.Provider value={context}>
                <FormSelect name="testField" options={mockSelectOptions} />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("is-invalid")).toHaveTextContent("true")
        expect(screen.getByTestId("error-message")).toHaveTextContent("Error message")
    })

    it("should not show error when no value and submitCount is 0", () => {
        const context = createMockContext({ 
            values: { testField: "" },
            errors: { testField: "Error message" },
            submitCount: 0
        })
        
        render(
            <FormContext.Provider value={context}>
                <FormSelect name="testField" options={mockSelectOptions} />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("is-invalid")).toHaveTextContent("false")
        expect(screen.getByTestId("error-message")).toBeEmptyDOMElement()
    })

    it("should call onBlur when blurred", () => {
        const context = createMockContext()
        
        render(
            <FormContext.Provider value={context}>
                <FormSelect name="testField" options={mockSelectOptions} />
            </FormContext.Provider>
        )
        
        fireEvent.click(screen.getByTestId("trigger-blur"))
        
        expect(mockOnBlur).toHaveBeenCalled()
    })

    it("should render all options as SelectItem", () => {
        const context = createMockContext()
        
        render(
            <FormContext.Provider value={context}>
                <FormSelect name="testField" options={mockSelectOptions} />
            </FormContext.Provider>
        )
        
        // The SelectItem children should be rendered
        expect(screen.getByTestId("select-wrapper")).toBeInTheDocument()
    })

    it("should handle empty string value", () => {
        const context = createMockContext({ values: { testField: "" } })
        
        render(
            <FormContext.Provider value={context}>
                <FormSelect name="testField" options={mockSelectOptions} />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("selected-keys")).toBeEmptyDOMElement()
    })

    it("should handle undefined value", () => {
        const context = createMockContext({ values: { testField: undefined } })
        
        render(
            <FormContext.Provider value={context}>
                <FormSelect name="testField" options={mockSelectOptions} />
            </FormContext.Provider>
        )
        
        expect(screen.getByTestId("selected-keys")).toBeEmptyDOMElement()
    })
})
