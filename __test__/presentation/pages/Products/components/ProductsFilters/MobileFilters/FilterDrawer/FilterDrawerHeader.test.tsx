import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import FilterDrawerHeader from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/FilterDrawer/FilterDrawerHeader"

vi.mock("@heroui/react", async () => {
    const actual = await vi.importActual<Record<string, unknown>>("@heroui/react")
    return {
        ...actual,
        DrawerHeader: ({ children, className }: { children: React.ReactNode; className?: string }) => (
            <div data-testid="drawer-header" className={className}>{children}</div>
        ),
    }
})

describe("FilterDrawerHeader", () => {
    it("should render Filtros title", () => {
        render(<FilterDrawerHeader onClose={vi.fn()} />)
        expect(screen.getByText("Filtros")).toBeInTheDocument()
    })

    it("should render close button", () => {
        render(<FilterDrawerHeader onClose={vi.fn()} />)
        expect(screen.getByRole("button")).toBeInTheDocument()
    })

    it("should call onClose when close button is clicked", () => {
        const onClose = vi.fn()
        render(<FilterDrawerHeader onClose={onClose} />)
        fireEvent.click(screen.getByRole("button"))
        expect(onClose).toHaveBeenCalledTimes(1)
    })
})
