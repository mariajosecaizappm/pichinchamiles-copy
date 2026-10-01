import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"
import ProductBreadcrumbsSkeleton from "@/presentation/pages/Products/ProductDetails/components/ProductBreadcrumbs/ProductBreadcrumbsSkeleton"

vi.mock("@heroui/react", () => ({
    Skeleton: ({ className }: { className?: string }) => (
        <div data-testid="skeleton" className={className} />
    ),
}))

describe("ProductBreadcrumbsSkeleton", () => {
    it("should render without crashing", () => {
        const { container } = render(<ProductBreadcrumbsSkeleton />)
        expect(container.firstChild).not.toBeNull()
    })

    it("should render five skeleton placeholders", () => {
        const { container } = render(<ProductBreadcrumbsSkeleton />)
        const skeletons = container.querySelectorAll('[data-testid="skeleton"]')
        expect(skeletons).toHaveLength(5)
    })

    it("should render the outer flex container", () => {
        const { container } = render(<ProductBreadcrumbsSkeleton />)
        expect(container.querySelector(".flex.gap-4.items-center")).not.toBeNull()
    })

    it("should render the desktop-only skeleton section", () => {
        const { container } = render(<ProductBreadcrumbsSkeleton />)
        expect(container.querySelector(".lg\\:flex")).not.toBeNull()
    })

    it("should render back-button icon skeleton", () => {
        const { container } = render(<ProductBreadcrumbsSkeleton />)
        const iconContainer = container.querySelector(".w-6.h-6")
        expect(iconContainer).not.toBeNull()
    })
})
