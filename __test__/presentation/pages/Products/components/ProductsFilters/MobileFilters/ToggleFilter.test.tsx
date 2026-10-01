import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import ToggleFilter from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/ToggleFilter"

vi.mock("@/presentation/components/Form/components/Button", () => ({
    Button: ({
        children,
        onPress,
        ...props
    }: {
        children: React.ReactNode
        onPress?: () => void
    } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button onClick={onPress} {...props}>
            {children}
        </button>
    ),
}))

describe("ToggleFilter", () => {
    it("should render children", () => {
        render(<ToggleFilter>Label</ToggleFilter>)
        expect(screen.getByText("Label")).toBeInTheDocument()
    })

    it("should set data-active=true when isActive is true", () => {
        render(<ToggleFilter isActive={true}>Label</ToggleFilter>)
        expect(screen.getByRole("button")).toHaveAttribute("data-active", "true")
    })

    it("should set data-active=false when isActive is false", () => {
        render(<ToggleFilter isActive={false}>Label</ToggleFilter>)
        expect(screen.getByRole("button")).toHaveAttribute("data-active", "false")
    })

    it("should call onPress when clicked", () => {
        const onPress = vi.fn()
        render(<ToggleFilter onPress={onPress}>Label</ToggleFilter>)
        fireEvent.click(screen.getByRole("button"))
        expect(onPress).toHaveBeenCalled()
    })

    it("should apply custom className", () => {
        render(<ToggleFilter className="custom-class">Label</ToggleFilter>)
        expect(screen.getByRole("button").className).toContain("custom-class")
    })
})
