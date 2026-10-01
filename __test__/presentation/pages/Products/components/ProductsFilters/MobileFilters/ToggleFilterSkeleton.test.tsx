import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import ToggleFilterSkeleton from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/ToggleFilterSkeleton"

describe("ToggleFilterSkeleton", () => {
    it("should render a skeleton element", () => {
        const { container } = render(<ToggleFilterSkeleton />)
        expect(container.firstChild).toBeInTheDocument()
    })

    it("should apply the configured skeleton classes", () => {
        const { container } = render(<ToggleFilterSkeleton />)
        const skeleton = container.firstChild as HTMLElement
        expect(skeleton.className).toContain("h-9")
        expect(skeleton.className).toContain("w-20")
        expect(skeleton.className).toContain("rounded-lg")
    })
})
