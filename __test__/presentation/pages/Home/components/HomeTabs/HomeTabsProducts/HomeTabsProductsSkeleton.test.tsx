import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import React from "react"
import ProductCategoriesSkeleton from "@/presentation/pages/Home/UseYourMiles/Products/Categories/ProductCategoriesSkeleton"

// Mock Skeleton component
vi.mock("@heroui/react", () => ({
    Skeleton: ({ className, children }: { className?: string; children?: React.ReactNode }) => (
        <div data-testid="skeleton" className={className}>
            {children}
        </div>
    ),
}))

describe("ProductCategoriesSkeleton", () => {
    it("should render skeleton elements", () => {
        render(<ProductCategoriesSkeleton />)
        const skeletons = screen.getAllByTestId("skeleton")
        expect(skeletons.length).toBeGreaterThan(0)
    })

    it("should render 2 arrow skeletons with rounded-md class", () => {
        render(<ProductCategoriesSkeleton />)
        const skeletons = screen.getAllByTestId("skeleton")
        const arrowSkeletons = skeletons.filter(el =>
            el.classList.contains("w-10") &&
            el.classList.contains("h-10") &&
            el.classList.contains("rounded-md")
        )
        expect(arrowSkeletons.length).toBe(2)
    })

    it("should render 12 category icon skeletons (rounded-full)", () => {
        render(<ProductCategoriesSkeleton />)
        const skeletons = screen.getAllByTestId("skeleton")
        const iconSkeletons = skeletons.filter(el =>
            el.classList.contains("w-10") &&
            el.classList.contains("h-10") &&
            el.classList.contains("rounded-full")
        )
        expect(iconSkeletons.length).toBe(12)
    })

    it("should render 12 category label skeletons", () => {
        render(<ProductCategoriesSkeleton />)
        const skeletons = screen.getAllByTestId("skeleton")
        const labelSkeletons = skeletons.filter(el =>
            el.classList.contains("w-14") &&
            el.classList.contains("h-3") &&
            el.classList.contains("rounded")
        )
        expect(labelSkeletons.length).toBe(12)
    })

    it("should render the correct total number of skeletons (2 arrows + 12 icons + 12 labels)", () => {
        render(<ProductCategoriesSkeleton />)
        const skeletons = screen.getAllByTestId("skeleton")
        expect(skeletons.length).toBe(26)
    })

    it("should render the root container with expected layout classes", () => {
        const { container } = render(<ProductCategoriesSkeleton />)
        const root = container.firstChild as HTMLElement
        expect(root).toBeInTheDocument()
        expect(root).toHaveClass("flex")
        expect(root).toHaveClass("self-stretch")
        expect(root).toHaveClass("items-center")
        expect(root).toHaveClass("justify-between")
        expect(root).toHaveClass("w-full")
    })
})
