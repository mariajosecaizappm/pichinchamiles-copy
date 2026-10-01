import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import TransferSummaryCard from "@/presentation/pages/TransferMiles/components/TransferSummaryCard/TransferSummaryCard"
import { TransferBeneficiary } from "@/domain/entity/Transfer/structure/transfer"

describe("TransferSummaryCard", () => {
    const beneficiary: TransferBeneficiary = {
        id: "1",
        status: "active",
        firstName: "Guadalupe",
        secondName: "",
        firstLastName: "Bedoya",
        secondLastName: "",
        identificationNumber: "1723456789",
    }

    it("renders sender summary without beneficiary section", () => {
        render(
            <TransferSummaryCard memberName="Valentina Bustamante" balance={250490} beneficiary={null} />
        )

        expect(screen.getByText("Tú envías")).toBeInTheDocument()
        expect(screen.getByText("Valentina Bustamante")).toBeInTheDocument()
        expect(screen.getByText("Saldo disponible")).toBeInTheDocument()
        expect(screen.getByText("250.490 millas")).toBeInTheDocument()
        expect(screen.queryByText("Beneficiario/a")).not.toBeInTheDocument()
    })

    it("renders beneficiary section when beneficiary exists", () => {
        render(
            <TransferSummaryCard
                memberName="Valentina Bustamante"
                balance={250490}
                beneficiary={beneficiary}
            />
        )

        expect(screen.getByText("Beneficiario/a")).toBeInTheDocument()
        expect(screen.getByText("Guadalupe Bedoya")).toBeInTheDocument()
        expect(screen.queryByText("Millas a transferir:")).not.toBeInTheDocument()
    })

    it("renders live miles to transfer in beneficiary section", () => {
        render(
            <TransferSummaryCard
                memberName="Valentina Bustamante"
                balance={250490}
                beneficiary={beneficiary}
                milesToTransfer={18000}
            />
        )

        expect(screen.getByText("Millas a transferir:")).toBeInTheDocument()
        expect(screen.getByText("18.000 millas")).toBeInTheDocument()
    })

    it("formats millions with apostrophe consistently for balance and transfer amount", () => {
        render(
            <TransferSummaryCard
                memberName="Andres Calderon"
                balance={1000000}
                beneficiary={beneficiary}
                milesToTransfer={1200000}
            />
        )

        expect(screen.getByText("1'000.000 millas")).toBeInTheDocument()
        expect(screen.getByText("1'200.000 millas")).toBeInTheDocument()
    })
})
