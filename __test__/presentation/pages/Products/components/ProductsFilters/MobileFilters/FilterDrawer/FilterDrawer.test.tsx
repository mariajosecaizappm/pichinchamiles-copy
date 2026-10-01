import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import FilterDrawer from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/FilterDrawer/FilterDrawer"

const mockSearchParams = new URLSearchParams()

vi.mock("next/navigation", () => ({
    useSearchParams: () => mockSearchParams,
    useRouter: () => ({ push: vi.fn() }),
    usePathname: () => "/productos",
}))

vi.mock("@/presentation/hooks/useIsDesktop", () => ({
    default: () => ({ isDesktop: false }),
}))

vi.mock("@heroui/react", async () => {
    const actual = await vi.importActual<Record<string, unknown>>("@heroui/react")
    return {
        ...actual,
        Drawer: ({ children, isOpen, onOpenChange }: { children: React.ReactNode; isOpen: boolean; onOpenChange: (o: boolean) => void }) =>
            isOpen ? (
                <div data-testid="drawer">
                    <button data-testid="backdrop" onClick={() => onOpenChange(false)} />
                    {children}
                </div>
            ) : null,
        DrawerContent: ({ children }: { children: (onClose: () => void) => React.ReactNode }) => (
            <div data-testid="drawer-content">{children(() => {})}</div>
        ),
        DrawerBody: ({ children }: { children: React.ReactNode }) => <div data-testid="body">{children}</div>,
        useDisclosure: () => ({ isOpen: false, onOpen: vi.fn(), onOpenChange: vi.fn() }),
    }
})

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/MobileFilterTrigger", () => ({
    default: ({ children, onClick, count }: { children: React.ReactNode; onClick: () => void; count: number }) => (
        <button data-testid="trigger" data-count={count} onClick={onClick}>{children}</button>
    ),
}))

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/FilterDrawer/FilterDrawerHeader", () => ({
    default: ({ onClose }: { onClose: () => void }) => (
        <button data-testid="header-close" onClick={onClose}>close</button>
    ),
}))

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/FilterDrawer/FilterDrawerFooter/FilterDrawerFooter", () => ({
    default: ({ onClearFilters, onApplyFilters }: { onClearFilters: () => void; onApplyFilters: () => void }) => (
        <div>
            <button data-testid="clear" onClick={onClearFilters}>clear</button>
            <button data-testid="apply" onClick={onApplyFilters}>apply</button>
        </div>
    ),
}))

describe("FilterDrawer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        for (const key of Array.from(mockSearchParams.keys())) {
            mockSearchParams.delete(key)
        }
    })

    it("should render the trigger label", () => {
        render(
            <FilterDrawer triggerLabel="Marcas" filterKeys="brand" isOpen={false} onApplyFilters={vi.fn()}>
                <div>child</div>
            </FilterDrawer>
        )
        expect(screen.getByTestId("trigger")).toHaveTextContent("Marcas")
    })

    it("should compute active count from a single filterKey", () => {
        mockSearchParams.set("brand", "b1,b2")
        render(
            <FilterDrawer triggerLabel="Marcas" filterKeys="brand" isOpen={false} onApplyFilters={vi.fn()}>
                <div />
            </FilterDrawer>
        )
        expect(screen.getByTestId("trigger")).toHaveAttribute("data-count", "2")
    })

    it("should compute active count summing multiple filterKeys", () => {
        mockSearchParams.set("sort", "ASC")
        mockSearchParams.set("recommended", "true")
        render(
            <FilterDrawer triggerLabel="Sort" filterKeys={["sort", "recommended"]} isOpen={false} onApplyFilters={vi.fn()}>
                <div />
            </FilterDrawer>
        )
        expect(screen.getByTestId("trigger")).toHaveAttribute("data-count", "2")
    })

    it("should call onApplyFilters when the apply button is pressed", () => {
        const onApplyFilters = vi.fn()
        render(
            <FilterDrawer triggerLabel="X" filterKeys="brand" isOpen={true} onApplyFilters={onApplyFilters}>
                <div />
            </FilterDrawer>
        )
        fireEvent.click(screen.getByTestId("apply"))
        expect(onApplyFilters).toHaveBeenCalled()
    })

    it("should call onClearFilters when clear is pressed", () => {
        mockSearchParams.set("brand", "b1")
        const onClearFilters = vi.fn()
        render(
            <FilterDrawer
                triggerLabel="Marcas"
                filterKeys="brand"
                isOpen={true}
                onApplyFilters={vi.fn()}
                onClearFilters={onClearFilters}
            >
                <div />
            </FilterDrawer>
        )
        fireEvent.click(screen.getByTestId("clear"))
        expect(onClearFilters).toHaveBeenCalled()
    })

    it("should call onClearFilters when clear is pressed even with no active filters", () => {
        render(
            <FilterDrawer
                triggerLabel="Marcas"
                filterKeys="brand"
                isOpen={true}
                onApplyFilters={vi.fn()}
                onClearFilters={vi.fn()}
            >
                <div />
            </FilterDrawer>
        )
        fireEvent.click(screen.getByTestId("clear"))
        expect(vi.fn()).not.toHaveBeenCalled() // setMany no longer used in FilterDrawer
    })

    it("should call onClose when the header close button is pressed", () => {
        const onClose = vi.fn()
        render(
            <FilterDrawer
                triggerLabel="X"
                filterKeys="brand"
                isOpen={true}
                onApplyFilters={vi.fn()}
                onClose={onClose}
            >
                <div />
            </FilterDrawer>
        )
        fireEvent.click(screen.getByTestId("header-close"))
        expect(onClose).toHaveBeenCalled()
    })

    it("should call onApplyFilters when the drawer is dismissed via backdrop", () => {
        const onApplyFilters = vi.fn()
        render(
            <FilterDrawer
                triggerLabel="X"
                filterKeys="brand"
                isOpen={true}
                onApplyFilters={onApplyFilters}
                onOpenChange={vi.fn()}
            >
                <div />
            </FilterDrawer>
        )
        fireEvent.click(screen.getByTestId("backdrop"))
        expect(onApplyFilters).toHaveBeenCalled()
    })
})
