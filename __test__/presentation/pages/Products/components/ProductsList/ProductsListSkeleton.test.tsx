import ProductsListSkeleton from "@/presentation/pages/Products/components/ProductsList/ProductsListSkeleton"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@heroui/react", () => ({
    Skeleton: ({ className }: { className?: string }) => (
        <div data-testid="skeleton" className={className} />
    ),
}))

describe("ProductsListSkeleton", () => {
    it("should render eight skeleton cards by default", () => {
        const { container } = render(<ProductsListSkeleton />)

        expect(container.querySelectorAll(String.raw`.flex.min-h-\[150px\]`)).toHaveLength(8)
        expect(container.querySelectorAll('[data-testid="skeleton"]')).toHaveLength(35)
    })

    it("should render the amount of cards from count prop", () => {
        const { container } = render(<ProductsListSkeleton count={3} />)

        expect(container.querySelectorAll(String.raw`.flex.min-h-\[150px\]`)).toHaveLength(3)
        expect(container.querySelectorAll('[data-testid="skeleton"]')).toHaveLength(15)
    })
})
