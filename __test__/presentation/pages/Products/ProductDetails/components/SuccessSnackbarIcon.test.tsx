import { SuccessSnackbarIcon } from "@/presentation/pages/Products/ProductDetails/components/ProductForm/components/Snackbar"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@iconify/react", () => ({
    Icon: ({ icon, className }: { icon: string; className?: string }) => (
        <span data-testid="icon" data-icon={icon} className={className} />
    ),
}))

describe("SuccessSnackbarIcon", () => {
    it("should render check icon with success styles", () => {
        const { container } = render(<SuccessSnackbarIcon />)

        expect(screen.getByTestId("icon")).toHaveAttribute("data-icon", "ic:round-check-circle")
        expect(container.firstChild).toHaveClass("bg-success-50")
    })
})
