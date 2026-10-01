import {describe, it, expect, vi} from "vitest"
import {render, screen} from "@testing-library/react"
import ProductMeta from "@/presentation/pages/Products/ProductDetails/components/ProductMeta"
import {useProductDetailsContext} from "@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext"

vi.mock("@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext")

const mockUseProductDetailsContext = useProductDetailsContext as unknown as ReturnType<typeof vi.fn>

describe("ProductMeta", () => {
    it("should render brand", () => {
        mockUseProductDetailsContext.mockReturnValue({
            isLoading: false,
            variation: {stock: 10},
        })

        render(<ProductMeta brand={{id: "brand-1", name: "Apple"}} />)
        expect(screen.getByText(/Marca:/)).toBeInTheDocument()
        expect(screen.getByText(/Apple/)).toBeInTheDocument()
    })

    it("should render stock when available", () => {
        mockUseProductDetailsContext.mockReturnValue({
            isLoading: false,
            variation: {stock: 25},
        })

        render(<ProductMeta brand={{id: "brand-2", name: "Samsung"}} />)
        expect(screen.getByText(/Stock disponible:/)).toBeInTheDocument()
        expect(screen.getByText(/25 unidades/)).toBeInTheDocument()
    })

    it("should show skeleton when loading", () => {
        mockUseProductDetailsContext.mockReturnValue({
            isLoading: true,
            variation: {stock: 10},
        })

        render(<ProductMeta brand={{id: "brand-1", name: "Apple"}} />)
        // When loading, stock info should not be visible
        expect(screen.queryByText(/Stock disponible:/)).not.toBeInTheDocument()
    })

    it("should handle no stock (shows 0)", () => {
        mockUseProductDetailsContext.mockReturnValue({
            isLoading: false,
            variation: null,
        })

        render(<ProductMeta brand={{id: "brand-3", name: "Nike"}} />)
        // When variation is null, stock defaults to 0
        expect(screen.getByText(/Stock disponible:/)).toBeInTheDocument()
        expect(screen.getByText(/0 unidades/)).toBeInTheDocument()
    })
})
