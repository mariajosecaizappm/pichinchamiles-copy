import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import ProductDetails from "@/presentation/pages/Products/ProductDetails/ProductDetails"
import { ProductVariation, Product } from "@/domain/entity/Product/product"

// Mock context provider (wraps children, no real logic needed)
vi.mock("@/presentation/pages/Products/ProductDetails/context/ProductDetailsProvider", () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="provider">{children}</div>
}))

// Mock context hook used by child components (ProductMeta, ProductForm, etc.)
vi.mock("@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext", () => ({
    useProductDetailsContext: () => ({
        variation: null,
        isLoading: false,
        addProductToCart: vi.fn(),
        quantity: 1,
        setQuantity: vi.fn(),
        paymentMethod: null,
        setPaymentMethod: vi.fn(),
        points: 0,
        setPoints: vi.fn(),
        coins: null,
        setCoins: vi.fn(),
        pointsPrice: 0,
        minCopaymentPoints: 0,
        copaymentPercentage: 0,
        selectedFeatures: [],
        setSelectedFeatures: vi.fn(),
        paymentOptionsVariation: null,
        tags: [],
        assets: [],
        setVariation: vi.fn(),
        updatedBasket: null,
        checkBasketUpdates: vi.fn(),
    })
}))

// Correct path: component lives at ProductSearchToolbar/ProductSearchToolbar
vi.mock("@/presentation/pages/Products/ProductDetails/components/ProductSearchToolbar/ProductSearchToolbar", () => ({
    default: () => <div data-testid="search-toolbar">Search Toolbar</div>
}))

vi.mock("@/presentation/pages/Products/ProductDetails/components/ProductBreadcrumbs/ProductBreadcrumbsSkeleton", () => ({
    default: () => <div data-testid="breadcrumbs-skeleton">Skeleton</div>
}))

vi.mock("@/presentation/pages/Products/ProductDetails/components/ProductBreadcrumbs", () => ({
    default: ({ categories, productName }: { categories: unknown[]; productName: string }) => (
        <div data-testid="breadcrumbs" data-categories={categories?.length} data-name={productName}>Breadcrumbs</div>
    )
}))

vi.mock("@/presentation/pages/Products/ProductDetails/components/ProductGallery", () => ({
    default: () => <div data-testid="gallery">Gallery</div>
}))

vi.mock("@/presentation/pages/Products/ProductDetails/components/DescriptionAccordion", () => ({
    default: ({ description }: { description: string }) => (
        <div data-testid="description" data-description={description}>Description</div>
    )
}))

// ProductMeta receives brand as { id, name } object — extract name for data attribute
vi.mock("@/presentation/pages/Products/ProductDetails/components/ProductMeta", () => ({
    default: ({ brand }: { brand: { id: string; name: string } }) => (
        <div data-testid="meta" data-brand={brand?.name}>Meta</div>
    )
}))

vi.mock("@/presentation/pages/Products/ProductDetails/components/ProductPrice/ProductPrice", () => ({
    default: ({ basePrice, previousPrice }: { basePrice: number; previousPrice?: number }) => (
        <div data-testid="price" data-base={basePrice} data-previous={previousPrice}>Price</div>
    )
}))

vi.mock("@/presentation/pages/Products/ProductDetails/components/ProductForm", () => ({
    default: ({ className }: { className?: string }) => (
        <div data-testid="product-form" data-classname={className}>ProductForm</div>
    )
}))

vi.mock("@/presentation/pages/Products/ProductDetails/components/OrderNotice", () => ({
    default: () => <div data-testid="order-notice">Order Notice</div>
}))

vi.mock("@/presentation/pages/Products/ProductDetails/components/RelatedProducts", () => ({
    default: ({ products }: { products: Product[] }) => (
        <div data-testid="related" data-count={products?.length}>Related Products</div>
    )
}))

vi.mock("@heroui/react", () => ({
    Divider: ({ className }: { className?: string }) => <hr data-testid="divider" className={className} />,
    Skeleton: () => <div data-testid="skeleton" />,
}))

vi.mock("next/link", () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => ({
        isLogged: true,
        basket: { items: [] },
        programCurrency: { coinsCurrencyId: "coins", pointsCurrencyId: "points" },
        updateBasket: vi.fn(),
    })
}))

const mockProductVariation: ProductVariation = {
    product: {
        id: "prod-1",
        name: "Test Product",
        description: "Test description",
        brand: { id: "brand-1", name: "Test Brand" },
        categories: [
            { id: "cat-1", name: "Category 1", slug: "category-1" },
            { id: "cat-2", name: "Category 2", slug: "category-2" }
        ],
        minPointsPrice: 500,
        unitPointsPriceWithoutDiscount: 600,
        features: [
            { id: "f1", name: "Color", options: ["Red"] },
            { id: "f2", name: "Size", options: ["Large"] }
        ]
    },
    variations: []
} as unknown as ProductVariation

const mockRelatedProducts: Product[] = [
    { id: "rel-1", name: "Related 1" },
    { id: "rel-2", name: "Related 2" }
] as unknown as Product[]

describe("ProductDetails", () => {
    it("should render without errors", () => {
        render(<ProductDetails productVariation={mockProductVariation} />)
        expect(screen.getByTestId("provider")).toBeInTheDocument()
    })

    it("should render product name", () => {
        render(<ProductDetails productVariation={mockProductVariation} />)
        expect(screen.getByText("Test Product")).toBeInTheDocument()
        expect(document.title).toBe("Test Product | Pichincha Miles")
    })

    it("should render search toolbar", () => {
        render(<ProductDetails productVariation={mockProductVariation} />)
        expect(screen.getByTestId("search-toolbar")).toBeInTheDocument()
    })

    it("should render breadcrumbs with correct props", () => {
        render(<ProductDetails productVariation={mockProductVariation} />)
        const breadcrumbs = screen.getByTestId("breadcrumbs")
        expect(breadcrumbs).toBeInTheDocument()
        expect(breadcrumbs).toHaveAttribute("data-categories", "2")
        expect(breadcrumbs).toHaveAttribute("data-name", "Test Product")
    })

    it("should render product gallery", () => {
        render(<ProductDetails productVariation={mockProductVariation} />)
        expect(screen.getByTestId("gallery")).toBeInTheDocument()
    })

    it("should render product meta with brand", () => {
        render(<ProductDetails productVariation={mockProductVariation} />)
        const meta = screen.getByTestId("meta")
        expect(meta).toBeInTheDocument()
        expect(meta).toHaveAttribute("data-brand", "Test Brand")
    })

    it("should render product price with correct prices", () => {
        render(<ProductDetails productVariation={mockProductVariation} />)
        const price = screen.getByTestId("price")
        expect(price).toBeInTheDocument()
        expect(price).toHaveAttribute("data-base", "500")
        expect(price).toHaveAttribute("data-previous", "600")
    })

    it("should render ProductForm with correct props", () => {
        render(<ProductDetails productVariation={mockProductVariation} />)
        const productForm = screen.getByTestId("product-form")
        expect(productForm).toBeInTheDocument()
        expect(productForm).toHaveAttribute("data-classname", "pt-2")
    })

    it("should render order notice", () => {
        render(<ProductDetails productVariation={mockProductVariation} />)
        expect(screen.getByTestId("order-notice")).toBeInTheDocument()
    })

    it("should render description accordion", () => {
        render(<ProductDetails productVariation={mockProductVariation} />)
        const description = screen.getAllByTestId("description")[0]
        expect(description).toBeInTheDocument()
        expect(description).toHaveAttribute("data-description", "Test description")
    })

    it("should render divider on mobile", () => {
        render(<ProductDetails productVariation={mockProductVariation} />)
        expect(screen.getByTestId("divider")).toBeInTheDocument()
    })

    it("should render related products when provided", () => {
        render(
            <ProductDetails
                productVariation={mockProductVariation}
                relatedProducts={mockRelatedProducts}
            />
        )
        const related = screen.getByTestId("related")
        expect(related).toBeInTheDocument()
        expect(related).toHaveAttribute("data-count", "2")
    })

    it("should handle empty related products", () => {
        render(<ProductDetails productVariation={mockProductVariation} relatedProducts={[]} />)
        const related = screen.getByTestId("related")
        expect(related).toHaveAttribute("data-count", "0")
    })

    it("should handle product without previous price", () => {
        const productWithoutDiscount = {
            ...mockProductVariation,
            product: {
                ...mockProductVariation.product,
                unitPointsPriceWithoutDiscount: undefined
            }
        } as unknown as ProductVariation

        render(<ProductDetails productVariation={productWithoutDiscount} />)
        const price = screen.getByTestId("price")
        expect(price).toHaveAttribute("data-base", "500")
    })

    it("should handle product without brand", () => {
        const productWithoutBrand = {
            ...mockProductVariation,
            product: {
                ...mockProductVariation.product,
                brand: undefined
            }
        } as unknown as ProductVariation

        render(<ProductDetails productVariation={productWithoutBrand} />)
        expect(screen.getByTestId("meta")).toBeInTheDocument()
    })

    it("should handle product without description", () => {
        const productWithoutDescription = {
            ...mockProductVariation,
            product: {
                ...mockProductVariation.product,
                description: undefined
            }
        } as unknown as ProductVariation

        render(<ProductDetails productVariation={productWithoutDescription} />)
        expect(screen.getAllByTestId("description")[0]).toBeInTheDocument()
    })

    it("should have correct layout structure", () => {
        const { container } = render(<ProductDetails productVariation={mockProductVariation} />)
        expect(container.querySelector(".py-3")).toBeInTheDocument()
        expect(container.querySelector(".body-container")).toBeInTheDocument()
        expect(container.querySelector(".flex-col")).toBeInTheDocument()
    })

    it("should render with desktop layout classes", () => {
        const { container } = render(<ProductDetails productVariation={mockProductVariation} />)
        expect(container.querySelector(".lg\\:flex-row")).toBeInTheDocument()
        expect(container.querySelector(".lg\\:w-1\\/2")).toBeInTheDocument()
    })

    it("should render mobile-specific elements", () => {
        const { container } = render(<ProductDetails productVariation={mockProductVariation} />)
        const mobileElements = container.querySelectorAll(".lg\\:hidden")
        expect(mobileElements.length).toBeGreaterThanOrEqual(1)
    })

    it("should render desktop-only elements", () => {
        const { container } = render(<ProductDetails productVariation={mockProductVariation} />)
        const desktopElements = container.querySelectorAll(".hidden.lg\\:block")
        expect(desktopElements.length).toBeGreaterThanOrEqual(1)
    })

    it("should render with correct heading level", () => {
        render(<ProductDetails productVariation={mockProductVariation} />)
        const heading = screen.getByRole("heading", { level: 1 })
        expect(heading).toHaveTextContent("Test Product")
    })
})
