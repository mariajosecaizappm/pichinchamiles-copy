import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import ProductsContentSkeleton from "@/presentation/pages/Products/components/skeletons/ProductsContentSkeleton"

describe("ProductsContentSkeleton", () => {
    it("should render without crashing", () => {
        const { container } = render(<ProductsContentSkeleton />)
        expect(container.firstChild).not.toBeNull()
    })

    it("should render the mobile filter skeletons (3 placeholders)", () => {
        const { container } = render(<ProductsContentSkeleton />)
        const mobileBlock = container.querySelector(".block.lg\\:hidden")
        expect(mobileBlock).not.toBeNull()
        // 3 mobile skeletons + 5 desktop skeletons (1 title + 4 items)
        expect(container.querySelectorAll(".lg\\:hidden .rounded-lg").length).toBe(3)
    })

    it("should render the desktop sidebar skeletons", () => {
        const { container } = render(<ProductsContentSkeleton />)
        expect(container.querySelector("aside")).not.toBeNull()
    })
})
