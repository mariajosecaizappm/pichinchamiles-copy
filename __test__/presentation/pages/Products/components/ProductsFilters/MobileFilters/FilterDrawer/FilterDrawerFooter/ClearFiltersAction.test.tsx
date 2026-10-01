import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import ClearFiltersAction from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/FilterDrawer/FilterDrawerFooter/ClearFiltersAction"

vi.mock("@/presentation/components/Form/components/Button", () => ({
    Button: ({
        children,
        onPress,
        startContent,
        isLoading: _isLoading,
        ...props
    }: {
        children: React.ReactNode
        onPress?: () => void
        startContent?: React.ReactNode
        isLoading?: boolean
    } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button onClick={onPress} {...props}>
            {startContent}
            {children}
        </button>
    ),
}))

describe("ClearFiltersAction", () => {
    it("should render 'Eliminar filtros' label", () => {
        render(<ClearFiltersAction onClearFilters={vi.fn()} />)
        expect(screen.getByText("Eliminar filtros")).toBeInTheDocument()
    })

    it("should call onClearFilters when pressed", () => {
        const onClearFilters = vi.fn()
        render(<ClearFiltersAction onClearFilters={onClearFilters} />)
        fireEvent.click(screen.getByRole("button"))
        expect(onClearFilters).toHaveBeenCalled()
    })
})
