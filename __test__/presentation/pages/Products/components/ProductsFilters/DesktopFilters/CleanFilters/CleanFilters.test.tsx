import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"

let mockSearchParams = new URLSearchParams()

vi.mock("@/presentation/hooks/useProductSearch", () => ({
    default: () => ({
        searchParams: mockSearchParams,
    }),
}))

vi.mock("@/presentation/components/Form/components/Button", () => ({
    Button: ({
        children,
        onPress,
        isLoading,
        className,
    }: {
        children: React.ReactNode
        onPress: () => void
        isLoading?: boolean
        className?: string
    }) => (
        <button
            data-testid="clean-btn"
            data-loading={String(isLoading)}
            className={className}
            onClick={onPress}
        >
            {children}
        </button>
    ),
}))

vi.mock(
    "@/presentation/pages/Home/components/Header/components/Menu/components/Icons/CloseIcon",
    () => ({
        default: ({ className }: { className?: string }) => (
            <span data-testid="close-icon" className={className} />
        ),
    }),
)

import CleanFilters from "@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/CleanFilters/CleanFilters"

describe("CleanFilters", () => {
    beforeEach(() => {
        mockSearchParams = new URLSearchParams()
    })

    it("should return null when searchParams has no meaningful keys", () => {
        mockSearchParams = new URLSearchParams()
        const { container } = render(<CleanFilters onClearFilters={vi.fn()} />)

        expect(container.firstChild).toBeNull()
    })

    it("should return null when only 'page' key is present", () => {
        mockSearchParams = new URLSearchParams("page=2")
        const { container } = render(<CleanFilters onClearFilters={vi.fn()} />)

        expect(container.firstChild).toBeNull()
    })

    it("should return null when only 'sort' key is present", () => {
        mockSearchParams = new URLSearchParams("sort=points-asc")
        const { container } = render(<CleanFilters onClearFilters={vi.fn()} />)

        expect(container.firstChild).toBeNull()
    })

    it("should return null when only 'page' and 'sort' keys are present", () => {
        mockSearchParams = new URLSearchParams("page=1&sort=points-asc")
        const { container } = render(<CleanFilters onClearFilters={vi.fn()} />)

        expect(container.firstChild).toBeNull()
    })

    it("should render the button when a meaningful filter key is present", () => {
        mockSearchParams = new URLSearchParams("brand=nike")
        render(<CleanFilters onClearFilters={vi.fn()} />)

        expect(screen.getByTestId("clean-btn")).toBeInTheDocument()
        expect(screen.getByTestId("clean-btn")).toHaveTextContent("Eliminar filtros")
    })

    it("should render when category key is present alongside page and sort", () => {
        mockSearchParams = new URLSearchParams("page=1&sort=points-asc&category=cat-1")
        render(<CleanFilters onClearFilters={vi.fn()} />)

        expect(screen.getByTestId("clean-btn")).toBeInTheDocument()
    })

    it("should call onClearFilters when button is pressed", () => {
        const onClearFilters = vi.fn()
        mockSearchParams = new URLSearchParams("brand=nike")
        render(<CleanFilters onClearFilters={onClearFilters} />)

        fireEvent.click(screen.getByTestId("clean-btn"))

        expect(onClearFilters).toHaveBeenCalledTimes(1)
    })

    it("should show CloseIcon when isLoading is false", () => {
        mockSearchParams = new URLSearchParams("brand=nike")
        render(<CleanFilters onClearFilters={vi.fn()} isLoading={false} />)

        expect(screen.getByTestId("close-icon")).toBeInTheDocument()
    })

    it("should not show CloseIcon when isLoading is true", () => {
        mockSearchParams = new URLSearchParams("brand=nike")
        render(<CleanFilters onClearFilters={vi.fn()} isLoading={true} />)

        expect(screen.queryByTestId("close-icon")).not.toBeInTheDocument()
    })

    it("should pass isLoading to Button", () => {
        mockSearchParams = new URLSearchParams("brand=nike")
        render(<CleanFilters onClearFilters={vi.fn()} isLoading={true} />)

        expect(screen.getByTestId("clean-btn")).toHaveAttribute("data-loading", "true")
    })
})
