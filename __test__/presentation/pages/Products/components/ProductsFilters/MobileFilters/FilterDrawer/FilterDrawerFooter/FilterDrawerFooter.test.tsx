import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import FilterDrawerFooter from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/FilterDrawer/FilterDrawerFooter/FilterDrawerFooter"

vi.mock("@heroui/react", async () => {
    const actual = await vi.importActual<Record<string, unknown>>("@heroui/react")
    return {
        ...actual,
        DrawerFooter: ({ children, className }: { children: React.ReactNode; className?: string }) => (
            <div data-testid="drawer-footer" className={className}>{children}</div>
        ),
    }
})

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/FilterDrawer/FilterDrawerFooter/ClearFiltersAction", () => ({
    default: ({ onClearFilters }: { onClearFilters: () => void }) => (
        <button data-testid="clear" onClick={onClearFilters}>clear</button>
    ),
}))

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/FilterDrawer/FilterDrawerFooter/ApplyFiltersAction", () => ({
    default: ({ onApplyFilters }: { onApplyFilters: () => void }) => (
        <button data-testid="apply" onClick={onApplyFilters}>apply</button>
    ),
}))

describe("FilterDrawerFooter", () => {
    it("should render ClearFiltersAction and ApplyFiltersAction", () => {
        render(<FilterDrawerFooter onClearFilters={vi.fn()} onApplyFilters={vi.fn()} />)
        expect(screen.getByTestId("clear")).toBeInTheDocument()
        expect(screen.getByTestId("apply")).toBeInTheDocument()
    })

    it("should forward onClearFilters to ClearFiltersAction", () => {
        const onClearFilters = vi.fn()
        render(<FilterDrawerFooter onClearFilters={onClearFilters} onApplyFilters={vi.fn()} />)
        screen.getByTestId("clear").click()
        expect(onClearFilters).toHaveBeenCalled()
    })

    it("should forward onApplyFilters to ApplyFiltersAction", () => {
        const onApplyFilters = vi.fn()
        render(<FilterDrawerFooter onClearFilters={vi.fn()} onApplyFilters={onApplyFilters} />)
        screen.getByTestId("apply").click()
        expect(onApplyFilters).toHaveBeenCalled()
    })
})
