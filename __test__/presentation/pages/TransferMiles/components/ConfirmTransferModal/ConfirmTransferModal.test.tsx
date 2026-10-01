import { fireEvent, render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import ConfirmTransferModal from "@/presentation/pages/TransferMiles/components/ConfirmTransferModal/ConfirmTransferModal"

describe("ConfirmTransferModal", () => {
    it("renders confirmation content and actions", () => {
        const onConfirm = vi.fn()
        const onCancel = vi.fn()

        render(
            <ConfirmTransferModal
                isOpen
                miles={18000}
                beneficiaryName="Guadalupe Bedoya"
                onConfirm={onConfirm}
                onCancel={onCancel}
            />
        )

        expect(screen.getByRole("heading", { name: "¿Confirmas la transferencia?" })).toBeInTheDocument()
        expect(
            screen.getByText(/Estás a punto de transferir/, { exact: false })
        ).toBeInTheDocument()
        expect(screen.getByText(/18.000 millas a Guadalupe Bedoya/)).toBeInTheDocument()

        fireEvent.click(screen.getByRole("button", { name: "Cancelar transferencia" }))
        expect(onCancel).toHaveBeenCalled()

        fireEvent.click(screen.getByRole("button", { name: "Confirmar transferencia" }))
        expect(onConfirm).toHaveBeenCalled()
    })
})
