import { ErrorSnackbarIcon } from "@/presentation/pages/Products/ProductDetails/components/ProductForm/components/Snackbar"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@iconify/react", () => ({
    Icon: ({ icon, className }: { icon: string; className?: string }) => (
        <span data-testid="icon" data-icon={icon} className={className} />
    ),
}))

describe("ErrorSnackbarIcon", () => {
    it("should render warning icon with danger styles", () => {
        const { container } = render(<ErrorSnackbarIcon />)

        expect(screen.getByTestId("icon")).toHaveAttribute("data-icon", "ic:round-warning")
        expect(container.firstChild).toHaveClass("bg-danger-50")
    })
})
