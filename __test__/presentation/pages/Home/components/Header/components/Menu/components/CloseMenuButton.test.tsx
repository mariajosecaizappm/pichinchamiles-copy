import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
 
vi.mock("@/presentation/pages/Home/components/Header/components/Menu/components/Icons/CloseIcon", () => ({
    default: () => <span data-testid="close-icon">CloseIcon</span>,
}))
 
import CloseMenuButton from "@/presentation/pages/Home/components/Header/components/Menu/components/CloseMenuButtont"
 
describe("CloseMenuButton", () => {
    it("should render the close button", () => {
        render(<CloseMenuButton onClick={vi.fn()} />)
        expect(screen.getByRole("button")).toBeInTheDocument()
    })
 
    it("should render the CloseIcon", () => {
        render(<CloseMenuButton onClick={vi.fn()} />)
        expect(screen.getByTestId("close-icon")).toBeInTheDocument()
    })
 
    it("should render 'Cerrar' text (hidden on mobile)", () => {
        render(<CloseMenuButton onClick={vi.fn()} />)
        expect(screen.getByText("Cerrar")).toBeInTheDocument()
    })
 
    it("should call onClick when clicked", () => {
        const handleClick = vi.fn()
        render(<CloseMenuButton onClick={handleClick} />)
        fireEvent.click(screen.getByRole("button"))
        expect(handleClick).toHaveBeenCalledOnce()
    })
})
 