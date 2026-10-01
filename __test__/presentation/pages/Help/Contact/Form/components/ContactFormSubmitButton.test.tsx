import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import React from "react"
import FormContext from "@/presentation/components/Form/context/FormContext"
import ContactFormSubmitButton from "@/presentation/pages/Help/Contact/Form/components/ContactFormSubmitButton"
import type {FormContextValues} from "@/presentation/components/Form/context/FormContext"

vi.mock("@heroui/react", () => ({
    Spinner: ({size, variant}: {size: string; variant: string}) => <span data-testid="spinner">{size}-{variant}</span>,
}))

vi.mock("@/presentation/components/Form/controls/FormButton", () => ({
    default: ({children, className, alwaysEnabled, spinner}: {children: React.ReactNode; className: string; alwaysEnabled: boolean; spinner: React.ReactNode}) => (
        <button data-testid="form-button" className={className} data-always-enabled={alwaysEnabled}>
            {children}
            {spinner}
        </button>
    ),
}))

const renderWithContext = (isSubmitting: boolean) => {
    const value: FormContextValues = {
        values: {},
        errors: {},
        touched: {},
        onInputChange: vi.fn(),
        setFieldValue: vi.fn(),
        setFieldTouched: vi.fn(),
        setFieldError: vi.fn(),
        onBlur: vi.fn(),
        validateForm: vi.fn(),
        isSubmitting,
        submitCount: 0,
        disabled: false,
        hasErrors: false,
        hasVisibleErrors: false,
        alert: null,
    }

    return render(
        <FormContext.Provider value={value}>
            <ContactFormSubmitButton />
        </FormContext.Provider>,
    )
}

describe("ContactFormSubmitButton", () => {
    it("should render the button label when not submitting", () => {
        renderWithContext(false)

        const button = screen.getByTestId("form-button")
        expect(button).toHaveTextContent("Enviar requerimiento")
        expect(button).toHaveAttribute("data-always-enabled", "true")
        expect(button).toHaveClass("w-full")
    })

    it("should not render label but show spinner when submitting", () => {
        renderWithContext(true)

        const button = screen.getByTestId("form-button")
        expect(button).not.toHaveTextContent("Enviar requerimiento")
        expect(screen.getByTestId("spinner")).toHaveTextContent("sm-simple")
    })
})
