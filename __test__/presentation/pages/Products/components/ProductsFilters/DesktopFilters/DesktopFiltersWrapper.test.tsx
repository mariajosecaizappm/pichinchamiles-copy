import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import DesktopFiltersWrapper from "@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/DesktopFiltersWrapper"

vi.mock("@heroui/react", () => ({
    cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
}))

vi.mock(
    "@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/CleanFilters/CleanFilters",
    () => ({
        default: ({
            onClearFilters,
            isLoading,
        }: {
            onClearFilters: () => void
            isLoading?: boolean
        }) => (
            <button
                type="button"
                data-testid="clean-filters"
                data-loading={String(!!isLoading)}
                onClick={onClearFilters}
            >
                clean
            </button>
        ),
    })
)

describe("DesktopFiltersWrapper", () => {
    const onClearFilters = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renders title, children and CleanFilters", () => {
        render(
            <DesktopFiltersWrapper onClearFilters={onClearFilters}>
                <div data-testid="child">filters</div>
            </DesktopFiltersWrapper>
        )
        expect(screen.getByText("Filtros")).toBeInTheDocument()
        expect(screen.getByTestId("child")).toBeInTheDocument()
        expect(screen.getByTestId("clean-filters")).toBeInTheDocument()
    })

    it("forwards onClearFilters", () => {
        render(
            <DesktopFiltersWrapper onClearFilters={onClearFilters}>
                <span />
            </DesktopFiltersWrapper>
        )
        fireEvent.click(screen.getByTestId("clean-filters"))
        expect(onClearFilters).toHaveBeenCalledTimes(1)
    })

    it("forwards isLoading to CleanFilters", () => {
        render(
            <DesktopFiltersWrapper onClearFilters={onClearFilters} isLoading>
                <span />
            </DesktopFiltersWrapper>
        )
        expect(screen.getByTestId("clean-filters")).toHaveAttribute(
            "data-loading",
            "true"
        )
    })

    it("applies className via cn", () => {
        const { container } = render(
            <DesktopFiltersWrapper
                onClearFilters={onClearFilters}
                className="extra-class"
            >
                <span />
            </DesktopFiltersWrapper>
        )
        expect(container.firstChild).toHaveClass("extra-class")
    })
})