import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import React from "react"
import FormContext from "@/presentation/components/Form/context/FormContext"
import ContactFormFields from "@/presentation/pages/Help/Contact/Form/components/ContactFormFields"
import type {FormContextValues} from "@/presentation/components/Form/context/FormContext"

const mockSetFieldValue = vi.fn()
const mockOnInputChange = vi.fn()

const baseContext: FormContextValues = {
    values: {
        fullname: "Juan Pérez",
        identificationType: "CI",
        identificationNumber: "1234567890",
        email: "juan@example.com",
        pqrsRequirementTypeId: "",
        pqrsRequirementSubTypeId: "",
        description: "",
    },
    errors: {},
    touched: {},
    onInputChange: mockOnInputChange,
    setFieldValue: mockSetFieldValue,
    setFieldTouched: vi.fn(),
    setFieldError: vi.fn(),
    onBlur: vi.fn(),
    validateForm: vi.fn(),
    isSubmitting: false,
    submitCount: 0,
    disabled: false,
    hasErrors: false,
    hasVisibleErrors: false,
    alert: null,
}

vi.mock("@/presentation/components/Form/controls/FormInput", () => ({
    default: (props: Record<string, unknown>) => (
        <input
            data-testid={`input-${props.name}`}
            type={props.type as string | undefined}
            inputMode={props.inputMode as string | undefined}
            autoComplete={props.autoComplete as string | undefined}
        />
    ),
}))

vi.mock("@/presentation/components/Form/controls/FormSelect", () => ({
    default: (props: Record<string, unknown>) => <select data-testid={`select-${props.name}`}><option>{props.name as string}</option></select>,
}))

vi.mock("@/presentation/components/Form/controls/FormTextArea", () => ({
    default: (props: Record<string, unknown>) => <textarea data-testid={`textarea-${props.name}`} />,
}))

const renderWithContext = (ctx: Partial<FormContextValues> = {}) => {
    const value = {...baseContext, ...ctx}
    return render(
        <FormContext.Provider value={value}>
            <ContactFormFields requierimentTypes={[
                {id: "type-1", name: "Type one", subtypes: [
                    {id: "sub-1", name: "Subtype one"},
                    {id: "sub-2", name: "Subtype two"},
                ]},
                {id: "type-2", name: "Type two", subtypes: [{id: "sub-3", name: "Subtype three"}]},
            ]} />
        </FormContext.Provider>,
    )
}

describe("ContactFormFields", () => {
    it("should render all form fields", () => {
        renderWithContext()

        expect(screen.getByTestId("input-fullname")).toBeInTheDocument()
        expect(screen.getByTestId("input-identificationType")).toBeInTheDocument()
        expect(screen.getByTestId("input-identificationNumber")).toBeInTheDocument()
        expect(screen.getByTestId("input-email")).toBeInTheDocument()
        expect(screen.getByTestId("select-pqrsRequirementTypeId")).toBeInTheDocument()
        expect(screen.getByTestId("select-pqrsRequirementSubTypeId")).toBeInTheDocument()
        expect(screen.getByTestId("textarea-description")).toBeInTheDocument()
    })

    it("should use the email keyboard attributes on the email field", () => {
        renderWithContext()

        const emailInput = screen.getByTestId("input-email")
        expect(emailInput).toHaveAttribute("type", "email")
        expect(emailInput).toHaveAttribute("inputmode", "email")
        expect(emailInput).toHaveAttribute("autocomplete", "email")
    })

    it("should reset subtype when requirement type changes to another type", () => {
        const {rerender} = renderWithContext({
            values: {
                ...baseContext.values,
                pqrsRequirementTypeId: "type-1",
                pqrsRequirementSubTypeId: "sub-1",
            },
        })

        expect(mockSetFieldValue).not.toHaveBeenCalledWith("pqrsRequirementSubTypeId", "")

        const updatedContext: FormContextValues = {
            ...baseContext,
            values: {
                ...baseContext.values,
                pqrsRequirementTypeId: "type-2",
                pqrsRequirementSubTypeId: "sub-1",
            },
        }

        rerender(
            <FormContext.Provider value={updatedContext}>
                <ContactFormFields requierimentTypes={[
                    {id: "type-1", name: "Type one", subtypes: [
                        {id: "sub-1", name: "Subtype one"},
                    ]},
                    {id: "type-2", name: "Type two", subtypes: [{id: "sub-3", name: "Subtype three"}]},
                ]} />
            </FormContext.Provider>,
        )

        expect(mockSetFieldValue).toHaveBeenCalledWith("pqrsRequirementSubTypeId", "")
    })

    it("should not reset subtype when requirement type is cleared", () => {
        mockSetFieldValue.mockClear()

        const {rerender} = renderWithContext({
            values: {
                ...baseContext.values,
                pqrsRequirementTypeId: "type-1",
                pqrsRequirementSubTypeId: "sub-1",
            },
        })

        rerender(
            <FormContext.Provider value={{
                ...baseContext,
                values: {
                    ...baseContext.values,
                    pqrsRequirementTypeId: "",
                    pqrsRequirementSubTypeId: "",
                },
            }}>
                <ContactFormFields requierimentTypes={[
                    {id: "type-1", name: "Type one", subtypes: [
                        {id: "sub-1", name: "Subtype one"},
                    ]},
                ]} />
            </FormContext.Provider>,
        )

        expect(mockSetFieldValue).not.toHaveBeenCalled()
    })
})
