import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { TransferBeneficiary } from "@/domain/entity/Transfer/structure/transfer"
import BeneficiaryValidationForm from "@/presentation/pages/TransferMiles/Form/BeneficiaryValidationForm"

const mocks = vi.hoisted(() => ({
    onSubmit: vi.fn(),
    onDocumentChange: vi.fn(),
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

vi.mock("@/presentation/components/Form/context/Form", () => ({
    default: ({
        children,
        onSubmit,
        ariaLabel,
    }: {
        children: React.ReactNode
        onSubmit: (values: { identificationNumber: string }) => Promise<void>
        ariaLabel?: string
    }) => (
        <form
            aria-label={ariaLabel}
            onSubmit={(event) => {
                event.preventDefault()
                void onSubmit({ identificationNumber: "12345678" })
            }}
        >
            {children}
        </form>
    ),
}))

vi.mock(
    "@/presentation/pages/TransferMiles/Form/components/BeneficiaryValidationFields",
    () => ({
        default: () => <div data-testid="beneficiary-validation-fields" />,
    })
)

describe("BeneficiaryValidationForm", () => {
    it("renders validation fields inside the form", () => {
        render(
            <BeneficiaryValidationForm
                beneficiary={beneficiary}
                beneficiaryNotFound={false}
                identificationNumber="12345678"
                identificationFieldError={null}
                onValidate={mocks.onSubmit}
                onDocumentChange={mocks.onDocumentChange}
            />
        )

        expect(screen.getByTestId("beneficiary-validation-fields")).toBeInTheDocument()
        expect(screen.getByRole("form", { name: "Formulario de validación del beneficiario" })).toBeInTheDocument()
    })

    it("supports empty beneficiary initial value", () => {
        render(
            <BeneficiaryValidationForm
                beneficiary={null}
                beneficiaryNotFound={false}
                identificationNumber=""
                identificationFieldError={null}
                onValidate={mocks.onSubmit}
                onDocumentChange={mocks.onDocumentChange}
            />
        )

        expect(screen.getByTestId("beneficiary-validation-fields")).toBeInTheDocument()
    })
})
