import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import TransferMilesLayout from "@/app/transferencia-de-millas/layout"

const mocks = vi.hoisted(() => ({
    replace: vi.fn(),
    useSession: vi.fn(),
}))

vi.mock("next/navigation", () => ({
    useRouter: () => ({ replace: mocks.replace }),
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: mocks.useSession,
}))

describe("TransferMilesLayout", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.useSession.mockReturnValue({
            member: { identificationNumber: "123" },
            isValidatingSession: false,
        })
    })

    it("renders skeleton while session is validating", () => {
        mocks.useSession.mockReturnValue({
            member: null,
            isValidatingSession: true,
        })

        render(
            <TransferMilesLayout>
                <div data-testid="transfer-content" />
            </TransferMilesLayout>
        )

        expect(screen.getByTestId("transfer-miles-skeleton")).toBeInTheDocument()
        expect(screen.queryByTestId("transfer-content")).not.toBeInTheDocument()
    })

    it("redirects unauthenticated users to home", async () => {
        mocks.useSession.mockReturnValue({
            member: null,
            isValidatingSession: false,
        })

        render(
            <TransferMilesLayout>
                <div data-testid="transfer-content" />
            </TransferMilesLayout>
        )

        await waitFor(() => {
            expect(mocks.replace).toHaveBeenCalledWith("/")
        })
    })

    it("renders children for authenticated users", () => {
        render(
            <TransferMilesLayout>
                <div data-testid="transfer-content" />
            </TransferMilesLayout>
        )

        expect(screen.getByTestId("transfer-content")).toBeInTheDocument()
    })
})
