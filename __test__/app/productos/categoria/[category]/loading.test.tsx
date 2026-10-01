import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import Loading from "@/app/productos/(catalog)/categoria/[category]/loading"

vi.mock("@/presentation/pages/Products/components/skeletons/ProductsContentSkeleton", () => ({
    default: () => <div data-testid="products-content-skeleton">Loading...</div>,
}))

describe("Loading (category)", () => {
    it("should render without crashing", () => {
        const { container } = render(<Loading />)
        expect(container.firstChild).not.toBeNull()
    })

    it("should render ProductsContentSkeleton", () => {
        render(<Loading />)
        expect(screen.getByTestId("products-content-skeleton")).toBeInTheDocument()
    })
})
