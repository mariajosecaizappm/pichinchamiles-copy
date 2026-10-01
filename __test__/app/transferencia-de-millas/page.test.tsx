import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@/presentation/pages/TransferMiles", () => ({
    default: () => <div data-testid="transfer-miles-container" />,
}))

import TransferMilesPage from "@/app/transferencia-de-millas/page"

describe("TransferMilesPage", () => {
    it("renders transfer miles container", () => {
        render(<TransferMilesPage />)

        expect(screen.getByTestId("transfer-miles-container")).toBeInTheDocument()
    })
})
