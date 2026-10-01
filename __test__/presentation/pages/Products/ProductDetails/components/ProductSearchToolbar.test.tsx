import { render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import ProductSearchToolbar from "@/presentation/pages/Products/ProductDetails/components/ProductSearchToolbar/ProductSearchToolbar"

const mocks = vi.hoisted(() => ({
    lastProductSearchBarProps: null as Record<string, unknown> | null,
}))

vi.mock("@/presentation/hooks/useIsDesktop", () => ({
    default: () => ({ isDesktop: false }),
}))

vi.mock("@/presentation/pages/Products/ProductDetails/components/ProductSearchToolbar/ProductSearchToolbarSkeleton", () => ({
    default: () => <div data-testid="product-search-toolbar-skeleton" />,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar", () => ({
    default: (props: Record<string, unknown>) => {
        mocks.lastProductSearchBarProps = props
        return <div data-testid="product-search-bar" />
    },
}))

describe("ProductSearchToolbar", () => {
    it("should render search bar after hydration", async () => {
        render(<ProductSearchToolbar />)

        await waitFor(() => {
            expect(screen.getByTestId("product-search-bar")).toBeInTheDocument()
        })
    })

    it("should pass displaySubmitButton when not on desktop", async () => {
        render(<ProductSearchToolbar />)

        await waitFor(() => {
            expect(mocks.lastProductSearchBarProps?.displaySubmitButton).toBe(true)
        })
    })
})
