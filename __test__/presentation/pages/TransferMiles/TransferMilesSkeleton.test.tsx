import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import TransferMilesSkeleton from "@/presentation/pages/TransferMiles/TransferMilesSkeleton"

describe("TransferMilesSkeleton", () => {
    it("renders loading placeholder matching transfer page structure", () => {
        const { container } = render(<TransferMilesSkeleton />)

        expect(screen.getByTestId("transfer-miles-skeleton")).toHaveAttribute("aria-busy", "true")
        expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThanOrEqual(10)
        expect(container.querySelector("section")).toBeInTheDocument()
        expect(screen.queryByText("Transferencia de millas")).not.toBeInTheDocument()
    })
})
