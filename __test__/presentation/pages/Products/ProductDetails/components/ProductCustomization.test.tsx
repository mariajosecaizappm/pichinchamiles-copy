import {describe, it, expect, vi, beforeEach} from "vitest"
import {render, screen} from "@testing-library/react"
import ProductCustomization from "@/presentation/pages/Products/ProductDetails/components/ProductForm/components/ProductCustomization/ProductCustomization"
import {ProductFeature} from "@/domain/entity/Product/product"
import {useProductDetailsContext} from "@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext"

vi.mock("@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext")

const mockUseProductDetailsContext = useProductDetailsContext as unknown as ReturnType<typeof vi.fn>

describe("ProductCustomization", () => {
    const mockFeatures: ProductFeature[] = [
        {id: "feat-1", name: "Color", options: ["Red", "Blue", "Green"], optionsOrdered: [{id: "opt-1", name: "Red"}, {id: "opt-2", name: "Blue"}, {id: "opt-3", name: "Green"}]},
        {id: "feat-2", name: "Size", options: ["S", "M", "L"], optionsOrdered: [{id: "opt-4", name: "S"}, {id: "opt-5", name: "M"}, {id: "opt-6", name: "L"}]},
    ]

    beforeEach(() => {
        mockUseProductDetailsContext.mockReturnValue({
            variation: {id: "var-1"},
            isLoading: false,
            selectedFeatures: [],
        })
    })

    it("should render without errors", () => {
        const {container} = render(<ProductCustomization features={mockFeatures} />)
        expect(container.firstChild).toBeInTheDocument()
    })

    it("should handle empty features", () => {
        const {container} = render(<ProductCustomization features={[]} />)
        // Component renders an empty container when features is empty
        expect(container.firstChild).toBeInTheDocument()
    })
})
