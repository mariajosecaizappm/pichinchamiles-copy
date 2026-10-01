import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
 
vi.mock("@/presentation/pages/Home/components/Header/components/Menu/components/Icons/ArrowIcon", () => ({
    default: () => <span data-testid="arrow-icon">ArrowIcon</span>,
}))
 
import SubmenuBackButton from "@/presentation/pages/Home/components/Header/components/Menu/components/SubMenuBackButton"
 
describe("SubmenuBackButton", () => {
    it("should render a button with correct aria-label", () => {
        render(<SubmenuBackButton setActiveSubmenu={vi.fn()} />)
        expect(screen.getByLabelText("Volver al menú principal")).toBeInTheDocument()
    })
 
    it("should render 'Menú principal' text", () => {
        render(<SubmenuBackButton setActiveSubmenu={vi.fn()} />)
        expect(screen.getByText("Menú principal")).toBeInTheDocument()
    })
 
    it("should render the ArrowIcon", () => {
        render(<SubmenuBackButton setActiveSubmenu={vi.fn()} />)
        expect(screen.getByTestId("arrow-icon")).toBeInTheDocument()
    })
 
    it("should call setActiveSubmenu with null when clicked", () => {
        const mockSetActiveSubmenu = vi.fn()
        render(<SubmenuBackButton setActiveSubmenu={mockSetActiveSubmenu} />)
        fireEvent.click(screen.getByLabelText("Volver al menú principal"))
        expect(mockSetActiveSubmenu).toHaveBeenCalledWith(null)
    })
})
 

