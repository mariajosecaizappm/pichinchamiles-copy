import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import type { ComponentProps } from "react"
import { ScreenReaderProvider } from "@/presentation/components/providers/ScreenReaderProvider"
import TransferMilesActions from "@/presentation/pages/TransferMiles/components/TransferMilesActions/TransferMilesActions"

const renderActions = (props: Partial<ComponentProps<typeof TransferMilesActions>> = {}) =>
    render(
        <ScreenReaderProvider>
            <TransferMilesActions
                isTransferEnabled
                balance={250490}
                miles=""
                onMilesChange={vi.fn()}
                onTransfer={vi.fn()}
                {...props}
            />
        </ScreenReaderProvider>
    )

describe("TransferMilesActions", () => {
    it("hides miles input and disables transfer button when transfer is not enabled", () => {
        renderActions({ isTransferEnabled: false })

        expect(screen.queryByTestId("transferMilesAmount")).not.toBeInTheDocument()
        expect(screen.getByTestId("transferMilesSubmit")).toBeDisabled()
    })

    it("shows miles input and enables transfer when amount becomes valid", async () => {
        const onMilesChange = vi.fn()

        renderActions({ onMilesChange })

        expect(screen.getByTestId("transferMilesAmount")).toBeInTheDocument()
        expect(screen.getByTestId("transferMilesSubmit")).toBeDisabled()

        fireEvent.change(screen.getByTestId("transferMilesAmount"), {
            target: { value: "18000" },
        })
        expect(onMilesChange).toHaveBeenCalledWith("18000")

        await waitFor(() => {
            expect(screen.getByTestId("transferMilesSubmit")).toBeEnabled()
        })
    })

    it("shows min miles validation error", async () => {
        renderActions({ miles: "9" })

        fireEvent.blur(screen.getByTestId("transferMilesAmount"))

        expect(await screen.findByText("El mínimo a transferir es 10 millas.")).toBeInTheDocument()
        expect(screen.getByTestId("transferMilesSubmit")).toBeDisabled()
    })

    it("shows max miles validation error", async () => {
        renderActions({ balance: 2_000_000, miles: "1000001" })

        fireEvent.blur(screen.getByTestId("transferMilesAmount"))

        expect(
            await screen.findByText("El máximo a transferir es 1'000.000 millas.")
        ).toBeInTheDocument()
        expect(screen.getByTestId("transferMilesSubmit")).toBeDisabled()
    })

    it("shows insufficient balance validation error", async () => {
        renderActions({ balance: 100, miles: "101" })

        fireEvent.blur(screen.getByTestId("transferMilesAmount"))

        expect(
            await screen.findByText("Saldo insuficiente. Ingresa una cantidad menor.")
        ).toBeInTheDocument()
        expect(screen.getByTestId("transferMilesSubmit")).toBeDisabled()
    })

    it("calls onTransfer when amount is valid and button is pressed", async () => {
        const onTransfer = vi.fn()

        renderActions({ miles: "18000", onTransfer })

        await waitFor(() => {
            expect(screen.getByTestId("transferMilesSubmit")).toBeEnabled()
        })

        fireEvent.click(screen.getByTestId("transferMilesSubmit"))

        await waitFor(() => {
            expect(onTransfer).toHaveBeenCalledWith("18000")
        })
    })

    it("shows loading spinner on transfer button while processing", () => {
        renderActions({ miles: "18000", isTransferLoading: true })

        const button = screen.getByTestId("transferMilesSubmit")
        expect(button).toBeDisabled()
        expect(button).toHaveAttribute("aria-busy", "true")
        expect(screen.getByLabelText("Procesando transferencia")).toBeInTheDocument()
    })
})
