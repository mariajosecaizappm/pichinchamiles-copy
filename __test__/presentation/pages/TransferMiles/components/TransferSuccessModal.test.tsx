import { fireEvent, render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import TransferSuccessModal from "@/presentation/pages/TransferMiles/components/TransferSuccessModal/TransferSuccessModal"

describe("TransferSuccessModal", () => {
    it("renders success content, close button and side-by-side actions", () => {
        const onViewBalance = vi.fn()
        const onGoHome = vi.fn()
        const onClose = vi.fn()

        render(
            <TransferSuccessModal
                isOpen
                onViewBalance={onViewBalance}
                onGoHome={onGoHome}
                onClose={onClose}
            />
        )

        expect(screen.getByRole("heading", { name: "Transferencia exitosa" })).toBeInTheDocument()
        expect(
            screen.getByText("Tu transferencia de millas fue procesada con éxito.")
        ).toBeInTheDocument()
        expect(document.body.innerHTML).toContain("size-[27px]")
        expect(document.body.innerHTML).toContain("bg-success-500")
        expect(screen.getByTestId("closeModal")).toBeInTheDocument()

        fireEvent.click(screen.getByRole("button", { name: "Ver mi saldo" }))
        expect(onViewBalance).toHaveBeenCalled()

        fireEvent.click(screen.getByRole("button", { name: "Volver al home" }))
        expect(onGoHome).toHaveBeenCalled()

        fireEvent.click(screen.getByTestId("closeModal"))
        expect(onClose).toHaveBeenCalled()
    })
})
