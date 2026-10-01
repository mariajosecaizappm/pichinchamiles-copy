import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import ProductsSkeleton from "@/presentation/pages/Products/components/skeletons/ProductsSkeleton"

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/Categories/ProductCategoriesSkeleton", () => ({
    default: () => <div data-testid="product-categories-skeleton" />,
}))

vi.mock("@/presentation/pages/Products/components/skeletons/ProductsContentSkeleton", () => ({
    default: () => <div data-testid="products-content-skeleton" />,
}))

describe("ProductsSkeleton", () => {
    it("should render ProductCategoriesSkeleton", () => {
        render(<ProductsSkeleton />)
        expect(screen.getByTestId("product-categories-skeleton")).toBeInTheDocument()
    })

    it("should render ProductsContentSkeleton", () => {
        render(<ProductsSkeleton />)
        expect(screen.getByTestId("products-content-skeleton")).toBeInTheDocument()
    })
})
