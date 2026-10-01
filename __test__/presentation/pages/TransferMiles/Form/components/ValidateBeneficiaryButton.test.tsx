import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import ValidateBeneficiaryButton from "@/presentation/pages/TransferMiles/Form/components/ValidateBeneficiaryButton"

describe("ValidateBeneficiaryButton", () => {
    it("renders enabled submit button", () => {
        render(<ValidateBeneficiaryButton disabled={false} />)

        const button = screen.getByRole("button", { name: "Validar documento del beneficiario" })
        expect(button).toBeEnabled()
        expect(button).toHaveTextContent("Validar")
    })

    it("disables button when disabled prop is true", () => {
        render(<ValidateBeneficiaryButton disabled isLoading={false} />)

        expect(screen.getByRole("button", { name: "Validar documento del beneficiario" })).toBeDisabled()
    })

    it("shows spinner instead of button while loading", () => {
        render(<ValidateBeneficiaryButton disabled={false} isLoading />)

        expect(
            screen.queryByRole("button", { name: "Validar documento del beneficiario" })
        ).not.toBeInTheDocument()
        expect(screen.getByTestId("validateBeneficiaryLoading")).toHaveAttribute("aria-busy", "true")
        expect(screen.getByLabelText("Validando documento del beneficiario")).toBeInTheDocument()
    })
})
