import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"
import ProductsBreadcrumbsSkeleton from "@/presentation/pages/Products/components/skeletons/ProductsBreadcrumbsSkeleton"

vi.mock("@heroui/react", () => ({
    Skeleton: ({ className }: { className?: string }) => (
        <div data-testid="skeleton" className={className} />
    ),
}))

describe("ProductsBreadcrumbsSkeleton", () => {
    it("should render without crashing", () => {
        const { container } = render(<ProductsBreadcrumbsSkeleton />)
        expect(container.firstChild).not.toBeNull()
    })

    it("should render three skeleton placeholders", () => {
        const { container } = render(<ProductsBreadcrumbsSkeleton />)
        const skeletons = container.querySelectorAll('[data-testid="skeleton"]')
        expect(skeletons).toHaveLength(3)
    })

    it("should have correct container structure", () => {
        const { container } = render(<ProductsBreadcrumbsSkeleton />)
        expect(container.querySelector(".flex.gap-4.items-center")).not.toBeNull()
        expect(container.querySelector(".max-w-96")).not.toBeNull()
    })
})
