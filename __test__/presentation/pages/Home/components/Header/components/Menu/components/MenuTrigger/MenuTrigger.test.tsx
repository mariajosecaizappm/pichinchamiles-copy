import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import MenuTrigger from "@/presentation/pages/Home/components/Header/components/Menu/components/MenuTrigger/MenuTrigger"

vi.mock("@/presentation/pages/Home/components/Header/components/Icons/MenuIcon", () => ({
    default: ({ className }: { className?: string }) => (
        <svg data-testid="menu-icon" className={className} />
    ),
}))

vi.mock("@heroui/react", () => ({
    cn: (...args: (string | boolean | undefined)[]) => args.filter(Boolean).join(" "),
}))

describe("MenuTrigger", () => {
    it("should render the button with default props", () => {
        render(<MenuTrigger />)

        const button = screen.getByRole("button", { name: "Abrir menú de navegación" })
        expect(button).toBeInTheDocument()
        expect(button).toHaveAttribute("aria-expanded", "false")
        expect(button).toHaveAttribute("aria-controls", "navigation-menu")
        expect(button).not.toBeDisabled()
    })

    it("should call onClick when clicked", () => {
        const handleClick = vi.fn()
        render(<MenuTrigger onClick={handleClick} />)

        const button = screen.getByRole("button")
        fireEvent.click(button)

        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it("should set aria-expanded to true when isOpen is true", () => {
        render(<MenuTrigger isOpen={true} />)

        const button = screen.getByRole("button")
        expect(button).toHaveAttribute("aria-expanded", "true")
    })

    it("should disable the button when isDisabled is true", () => {
        render(<MenuTrigger isDisabled={true} />)

        const button = screen.getByRole("button")
        expect(button).toBeDisabled()
    })

    it("should not call onClick when disabled", () => {
        const handleClick = vi.fn()
        render(<MenuTrigger onClick={handleClick} isDisabled={true} />)

        const button = screen.getByRole("button")
        fireEvent.click(button)

        expect(handleClick).not.toHaveBeenCalled()
    })

    it("should render MenuIcon with correct className", () => {
        render(<MenuTrigger />)

        const icon = screen.getByTestId("menu-icon")
        expect(icon).toHaveClass("w-4.5", "h-3")
    })

    it("should render 'Menú' text on desktop", () => {
        render(<MenuTrigger />)

        expect(screen.getByText("Menú")).toBeInTheDocument()
    })
})
