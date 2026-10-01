import {describe, it, expect, vi} from "vitest"
import {render, screen} from "@testing-library/react"
import RelatedProducts from "@/presentation/pages/Products/ProductDetails/components/RelatedProducts/RelatedProducts"
import {Product} from "@/domain/entity/Product/product"

vi.mock("@/presentation/hooks/useIsDesktop", () => ({
    default: () => ({isDesktop: true}),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/CardsSliderWrapper/CardsSliderWrapper", () => ({
    default: ({items, renderItem}: {items: Product[]; renderItem: (p: Product) => React.ReactNode}) => (
        <div data-testid="slider">{items.map(renderItem)}</div>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/ProductCard/ProductCard", () => ({
    default: ({product}: {product: Product}) => <div data-testid="product-card">{product.name}</div>,
}))

describe("RelatedProducts", () => {
    const mockProducts: Product[] = [
        {id: "p1", name: "Product 1", slug: "product-1"} as Product,
        {id: "p2", name: "Product 2", slug: "product-2"} as Product,
    ]

    it("should render section title", () => {
        render(<RelatedProducts products={mockProducts} />)
        expect(screen.getByText(/Productos relacionados/i)).toBeInTheDocument()
    })

    it("should render no products when empty", () => {
        const {container} = render(<RelatedProducts products={[]} />)
        expect(container.firstChild).toBeNull()
    })

    it("should render product cards", () => {
        render(<RelatedProducts products={mockProducts} />)
        expect(screen.getByText("Product 1")).toBeInTheDocument()
        expect(screen.getByText("Product 2")).toBeInTheDocument()
    })
})
