import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import React from "react"
import type {FormRef} from "@/presentation/components/Form/context/Form"

const mockFormRef: React.RefObject<FormRef | null> = {current: null}

vi.mock("@/presentation/components/Form/context/Form", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require("react")
    const MockForm = React.forwardRef(({children}: {children: React.ReactNode}, ref: unknown) => {
        React.useImperativeHandle(ref, () => ({
            submitForm: vi.fn(),
            reset: vi.fn(),
            addAlert: vi.fn(),
            clearAlert: vi.fn(),
            disableForm: vi.fn(),
        }))
        return React.createElement("form", {"data-testid": "form"}, children)
    })
    MockForm.displayName = "MockForm"
    return {default: MockForm}
})

vi.mock("@/presentation/pages/Help/Contact/Form/components/ContactFormFields", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require("react")
    const MockFields = () => React.createElement("div", {"data-testid": "contact-form-fields"}, "Fields")
    MockFields.displayName = "MockContactFormFields"
    return {default: MockFields}
})

vi.mock("@/presentation/pages/Help/Contact/Form/components/ContactFormSubmitButton", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require("react")
    const MockSubmitButton = () => React.createElement("button", {"data-testid": "submit-button"}, "Enviar")
    MockSubmitButton.displayName = "MockContactFormSubmitButton"
    return {default: MockSubmitButton}
})

vi.mock("@/presentation/pages/Help/Contact/Form/components/ContactFormSuccessModal", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require("react")
    const MockSuccessModal = ({isOpen}: {isOpen: boolean}) => isOpen ? React.createElement("div", {"data-testid": "success-modal"}, "Success") : null
    MockSuccessModal.displayName = "MockContactFormSuccessModal"
    return {default: MockSuccessModal}
})

import ContactForm from "@/presentation/pages/Help/Contact/Form/ContactForm"

describe("ContactForm", () => {
    const baseProps = {
        memberInformation: {
            fullname: "Juan Pérez",
            email: "juan@example.com",
            identificationType: "CI",
            identificationNumber: "1234567890",
        },
        onCreateRequeriment: vi.fn(),
        formRef: mockFormRef,
        requierimentTypes: [{id: "type-1", name: "Type one", subtypes: []}],
        isSuccessOpen: false,
        onOpenSuccessChange: vi.fn(),
    }

    it("should render the form, fields, submit button and hide success modal by default", () => {
        render(<ContactForm {...baseProps} />)
        expect(screen.getByTestId("form")).toBeInTheDocument()
        expect(screen.getByTestId("contact-form-fields")).toBeInTheDocument()
        expect(screen.getByTestId("submit-button")).toBeInTheDocument()
        expect(screen.queryByTestId("success-modal")).not.toBeInTheDocument()
    })

    it("should render the success modal when isSuccessOpen is true", () => {
        render(<ContactForm {...baseProps} isSuccessOpen={true} />)
        expect(screen.getByTestId("success-modal")).toBeInTheDocument()
    })
})
