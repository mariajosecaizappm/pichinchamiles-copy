import type { Product } from "@/domain/entity/Product/product"
import ProductsListGrid from "@/presentation/pages/Products/components/ProductsList/ProductsListGrid"
import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { mockTrack } from "../../../../../utils/analytics"
import { EventName } from "@/presentation/analytics/types"

const mockRemember = vi.hoisted(() => vi.fn())
const mockTake = vi.hoisted(() => vi.fn())

vi.mock("@/presentation/pages/Products/components/ProductsList/productsListSessionScroll", () => ({
    rememberProductsListLastProduct: (productId: string) => mockRemember(productId),
    takeProductsListLastProductId: () => mockTake(),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/ProductCard/ProductCard", () => ({
    default: ({ product, variant }: { product: Product; variant?: string }) => (
        <div data-testid="product-card" data-product-id={product.id} data-variant={variant}>
            {product.name}
        </div>
    ),
}))

const products = [
    { id: "1", name: "Product 1" },
    { id: "2", name: "Product 2" },
] as Product[]

describe("ProductsListGrid", () => {
    beforeEach(() => {
        mockRemember.mockClear()
        mockTake.mockReset()
        mockTrack.mockReset()
    })

    it("should render product cards using products-page variant", () => {
        render(<ProductsListGrid products={products} />)

        expect(screen.getAllByTestId("product-card")).toHaveLength(2)
        expect(screen.getAllByTestId("product-card")[0]).toHaveAttribute("data-variant", "products-page")
    })

    it("should remember product id on item click capture", () => {
        render(<ProductsListGrid products={products} />)

        fireEvent.click(screen.getByText("Product 1"))

        expect(mockRemember).toHaveBeenCalledWith("1")
    })

    it("should scroll remembered product into view when it exists in the list", () => {
        mockTake.mockReturnValue("2")
        const scrollIntoView = vi.fn()
        vi.spyOn(document, "getElementById").mockReturnValue({ scrollIntoView } as unknown as HTMLElement)

        render(<ProductsListGrid products={products} />)

        expect(document.getElementById).toHaveBeenCalledWith("product-list-item-2")
        expect(scrollIntoView).toHaveBeenCalledWith({ block: "nearest", behavior: "auto" })
    })

    it("should track viewed products when the grid receives products", () => {
        render(<ProductsListGrid products={products} />)

        expect(mockTrack).toHaveBeenCalledWith(EventName.VIEWED_PRODUCTS, { products })
    })
})
