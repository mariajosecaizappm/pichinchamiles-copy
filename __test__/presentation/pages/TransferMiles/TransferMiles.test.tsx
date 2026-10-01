import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { MemberType, PersonalMember } from "@/domain/entity/Member/member"
import { TransferBeneficiary } from "@/domain/entity/Transfer/structure/transfer"
import TransferMiles from "@/presentation/pages/TransferMiles/TransferMiles"

vi.mock("@/presentation/pages/TransferMiles/components/TransferSummaryCard/TransferSummaryCard", () => ({
    default: ({ memberName }: { memberName: string }) => (
        <div data-testid="transfer-summary-card">{memberName}</div>
    ),
}))

vi.mock("@/presentation/pages/TransferMiles/Form/BeneficiaryValidationForm", () => ({
    default: () => <div data-testid="beneficiary-validation-form" />,
}))

vi.mock("@/presentation/pages/TransferMiles/components/TransferMilesActions/TransferMilesActions", () => ({
    default: ({ isTransferEnabled }: { isTransferEnabled: boolean }) => (
        <div data-testid="transfer-miles-actions">{String(isTransferEnabled)}</div>
    ),
}))

describe("TransferMiles", () => {
    const member: PersonalMember = {
        memberType: MemberType.PERSONAL,
        firstName: "Valentina",
        secondName: "",
        firstLastName: "Bustamante",
        secondLastName: "",
        acceptLopd: true,
        acceptedTermsAndCondition: true,
        cellPhone: "",
        enrollmentEmail: "",
        gender: "",
        birthDay: "",
        state: "",
        city: "",
        address: "",
        identificationNumber: "111",
        identificationType: "CI",
        phone: "",
        country: "",
        registrationDate: "",
        segment: "",
    }

    const beneficiary: TransferBeneficiary = {
        id: "1",
        status: "active",
        firstName: "Guadalupe",
        secondName: "",
        firstLastName: "Bedoya",
        secondLastName: "",
        identificationNumber: "1723456789",
    }

    it("renders page content and child sections", () => {
        render(
            <TransferMiles
                member={member}
                balance={250490}
                beneficiary={beneficiary}
                beneficiaryNotFound={false}
                identificationFieldError={null}
                identificationNumber=""
                miles=""
                onValidate={vi.fn()}
                onDocumentChange={vi.fn()}
                onMilesChange={vi.fn()}
                onTransfer={vi.fn()}
            />
        )

        expect(screen.getByRole("heading", { name: "Transferencia de millas" })).toBeInTheDocument()
        expect(
            screen.getByText(
                "Ingresa el documento del beneficiario. Solo puedes transferir a socios Pichincha Miles."
            )
        ).toBeInTheDocument()
        expect(screen.getByTestId("transfer-summary-card")).toHaveTextContent("Valentina Bustamante")
        expect(screen.getByTestId("beneficiary-validation-form")).toBeInTheDocument()
        expect(screen.getByTestId("transfer-miles-actions")).toHaveTextContent("true")
    })

    it("keeps transfer actions disabled without beneficiary", () => {
        render(
            <TransferMiles
                member={member}
                balance={250490}
                beneficiary={null}
                beneficiaryNotFound={false}
                identificationFieldError={null}
                identificationNumber=""
                miles=""
                onValidate={vi.fn()}
                onDocumentChange={vi.fn()}
                onMilesChange={vi.fn()}
                onTransfer={vi.fn()}
            />
        )

        expect(screen.getByTestId("transfer-miles-actions")).toHaveTextContent("false")
    })
})
