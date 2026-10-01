import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import FormContext, { FormContextValues } from "@/presentation/components/Form/context/FormContext"
import { TransferBeneficiary } from "@/domain/entity/Transfer/structure/transfer"
import BeneficiaryValidationFields from "@/presentation/pages/TransferMiles/Form/components/BeneficiaryValidationFields"

const mocks = vi.hoisted(() => ({
    onDocumentChange: vi.fn(),
    validateButtonProps: null as { disabled: boolean; isLoading?: boolean } | null,
    formInputProps: null as {
        onValueChange?: (value: string) => void
        isDisabled?: boolean
    } | null,
    setFieldError: vi.fn(),
    setFieldTouched: vi.fn(),
}))

const beneficiary: TransferBeneficiary = {
    id: "1",
    status: "active",
    firstName: "Guadalupe",
    secondName: "",
    firstLastName: "Bedoya",
    secondLastName: "",
    identificationNumber: "12345678",
}

vi.mock("@/presentation/components/Form/controls/FormInput", () => ({
    default: ({
        endContent,
        onValueChange,
        isDisabled,
    }: {
        endContent: React.ReactNode
        onValueChange?: (value: string) => void
        isDisabled?: boolean
    }) => {
        mocks.formInputProps = { onValueChange, isDisabled }
        return <div data-testid="form-input">{endContent}</div>
    },
}))

vi.mock(
    "@/presentation/pages/TransferMiles/Form/components/ValidateBeneficiaryButton",
    () => ({
        default: (props: { disabled: boolean; isLoading?: boolean }) => {
            mocks.validateButtonProps = props
            return <button type="submit">Validar</button>
        },
    })
)

const renderWithContext = (
    ctx: Partial<FormContextValues>,
    props?: Partial<React.ComponentProps<typeof BeneficiaryValidationFields>>
) => {
    const value: FormContextValues = {
        values: { identificationNumber: "" },
        errors: {},
        touched: {},
        disabled: false,
        isSubmitting: false,
        submitCount: 0,
        hasErrors: false,
        hasVisibleErrors: false,
        alert: null,
        onInputChange: vi.fn(),
        onBlur: vi.fn(),
        setFieldValue: vi.fn(),
        setFieldError: mocks.setFieldError,
        setFieldTouched: mocks.setFieldTouched,
        validateForm: vi.fn(),
        ...ctx,
    }

    return render(
        <FormContext.Provider value={value}>
            <BeneficiaryValidationFields
                beneficiary={null}
                beneficiaryNotFound={false}
                identificationFieldError={null}
                onDocumentChange={mocks.onDocumentChange}
                {...props}
            />
        </FormContext.Provider>
    )
}

describe("BeneficiaryValidationFields", () => {
    beforeEach(() => {
        mocks.onDocumentChange.mockReset()
        mocks.setFieldError.mockReset()
        mocks.setFieldTouched.mockReset()
        mocks.validateButtonProps = null
        mocks.formInputProps = null
    })

    it("syncs identification field error from container", () => {
        renderWithContext(
            {},
            { identificationFieldError: "Este usuario no está registrado en Pichincha Miles." }
        )

        expect(mocks.setFieldError).toHaveBeenCalledWith(
            "identificationNumber",
            "Este usuario no está registrado en Pichincha Miles."
        )
        expect(mocks.setFieldTouched).toHaveBeenCalledWith("identificationNumber", true, false)
    })

    it("clears field error when document changes", () => {
        renderWithContext({ values: { identificationNumber: "1234" } })

        mocks.formInputProps?.onValueChange?.("5678")

        expect(mocks.setFieldError).toHaveBeenCalledWith("identificationNumber", undefined)
        expect(mocks.onDocumentChange).toHaveBeenCalledWith("5678")
    })

    it("notifies document changes through onValueChange", () => {
        renderWithContext({ values: { identificationNumber: "1234" } })

        mocks.formInputProps?.onValueChange?.("5678")

        expect(mocks.onDocumentChange).toHaveBeenCalledWith("5678")
    })

    it("disables validate button when form has errors", () => {
        renderWithContext({ hasErrors: true })

        expect(mocks.validateButtonProps?.disabled).toBe(true)
    })

    it("disables validate button when document is already validated", () => {
        renderWithContext(
            { values: { identificationNumber: "12345678" } },
            { beneficiary }
        )

        expect(mocks.validateButtonProps?.disabled).toBe(true)
    })

    it("disables validate button when beneficiary was not found", () => {
        renderWithContext({}, { beneficiaryNotFound: true })

        expect(mocks.validateButtonProps?.disabled).toBe(true)
    })

    it("passes loading state to validate button and disables input", () => {
        renderWithContext({ isSubmitting: true })

        expect(mocks.validateButtonProps?.isLoading).toBe(true)
        expect(mocks.formInputProps?.isDisabled).toBe(true)
        expect(screen.getByRole("button", { name: "Validar" })).toBeInTheDocument()
    })

    it("re-applies identification field error when Formik cleared it", () => {
        const message = "Este usuario no está registrado en Pichincha Miles."

        const { rerender } = renderWithContext(
            {
                errors: { identificationNumber: message },
            },
            { identificationFieldError: message }
        )

        mocks.setFieldError.mockClear()

        rerender(
            <FormContext.Provider
                value={{
                    values: { identificationNumber: "12345678" },
                    errors: {},
                    touched: {},
                    disabled: false,
                    isSubmitting: false,
                    submitCount: 1,
                    hasErrors: false,
                    hasVisibleErrors: false,
                    alert: null,
                    onInputChange: vi.fn(),
                    onBlur: vi.fn(),
                    setFieldValue: vi.fn(),
                    setFieldError: mocks.setFieldError,
                    setFieldTouched: mocks.setFieldTouched,
                    validateForm: vi.fn(),
                }}
            >
                <BeneficiaryValidationFields
                    beneficiary={null}
                    beneficiaryNotFound={false}
                    identificationFieldError={message}
                    onDocumentChange={mocks.onDocumentChange}
                />
            </FormContext.Provider>
        )

        expect(mocks.setFieldError).toHaveBeenCalledWith("identificationNumber", message)
        expect(mocks.setFieldTouched).toHaveBeenCalledWith("identificationNumber", true, false)
    })
})
