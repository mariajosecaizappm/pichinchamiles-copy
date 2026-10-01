import {describe, it, expect, vi} from "vitest"
import {render, screen} from "@testing-library/react"
import ProductQuantity from "@/presentation/pages/Products/ProductDetails/components/ProductQuantity/ProductQuantity"
import {useProductDetailsContext} from "@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext"

vi.mock("@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext")

const mockUseProductDetailsContext = useProductDetailsContext as unknown as ReturnType<typeof vi.fn>

describe("ProductQuantity", () => {
    it("should render quantity selector", () => {
        mockUseProductDetailsContext.mockReturnValue({
            quantity: 1,
            setQuantity: vi.fn(),
            isLoading: false,
            variation: {stock: 10},
        })

        render(<ProductQuantity max={10} />)
        expect(screen.getByText(/Cantidad/i)).toBeInTheDocument()
    })

    it("should show loading state", () => {
        mockUseProductDetailsContext.mockReturnValue({
            quantity: 1,
            isLoading: true,
            variation: {stock: 10},
        })

        render(<ProductQuantity max={10} />)
        // When loading, quantity input should not be visible
        expect(screen.queryByDisplayValue("1")).not.toBeInTheDocument()
    })
})
