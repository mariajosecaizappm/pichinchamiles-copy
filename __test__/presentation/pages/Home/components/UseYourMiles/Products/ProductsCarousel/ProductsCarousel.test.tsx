import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("react-horizontal-scrolling-menu", () => ({
    ScrollMenu: ({ children, LeftArrow, RightArrow, wrapperClassName, scrollContainerClassName, itemClassName }: {
        children: React.ReactNode
        LeftArrow?: React.ComponentType
        RightArrow?: React.ComponentType
        wrapperClassName: string
        scrollContainerClassName: string
        itemClassName: string
    }) => (
        <div data-testid="scroll-menu" className={wrapperClassName}>
            <div data-testid="scroll-container" className={scrollContainerClassName}>
                <div data-testid="scroll-items" className={itemClassName}>
                    {children}
                </div>
            </div>
            {LeftArrow && <div data-testid="left-arrow"><LeftArrow /></div>}
            {RightArrow && <div data-testid="right-arrow"><RightArrow /></div>}
        </div>
    ),
    VisibilityContext: {
        currentValue: {
            scrollPrev: vi.fn(),
            scrollNext: vi.fn(),
        }
    }
}))

vi.mock("@/presentation/components/icons/IconCarouselArrowLeft", () => ({
    default: () => <div data-testid="arrow-left-icon">Left Arrow</div>
}))

vi.mock("@/presentation/components/icons/IconCarouselArrowRight", () => ({
    default: () => <div data-testid="arrow-right-icon">Right Arrow</div>
}))

vi.mock("@/presentation/components/AssetImage", () => ({
    default: ({ alt, className }: { asset: unknown; alt: string; className: string }) => (
        <div data-testid="asset-image" className={className} aria-label={alt}>
            Asset Image
        </div>
    ),
}))

vi.mock("@/presentation/config/links", () => ({
    default: {
        products: "products"
    }
}))

vi.mock("next/link", () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}))

import ProductsCarousel from "@/presentation/pages/Home/UseYourMiles/Products/ProductsCarousel/ProductsCarousel"
import { ProductType } from "@/domain/entity/Product/product"
import { AlgoliaSearchEngine, SearchEngineType } from "@/domain/entity/SearchEngine/structure/SearchEngine"

const mockProducts = [
    {
        id: "product-1",
        name: "Product 1",
        slug: "product-1",
        keywords: "",
        seoTitle: "",
        seoKeywords: "",
        seoDescription: "",
        description: "",
        summary: "",
        brand: { id: "brand-1", name: "Brand 1" },
        categories: [],
        minPrice: 0,
        recommended: false,
        segmentCodes: [],
        store: { id: "store-1", name: "Store 1" },
        supplierId: "",
        priority: 1,
        maxPrice: 0,
        minPointsPrice: 15000,
        maxPointsPrice: 20000,
        assets: [{ id: "asset-1", type: "image" as const, order: 1, desktopUrl: "image1.jpg", mobileUrl: "image1-mobile.jpg" }],
        features: [],
        tags: [],
        mostWanted: false,
        productType: ProductType.PHYSICAL_PRODUCT,
        searchEngine: {
            engine: SearchEngineType.ALGOLIA,
            position: 1,
            index: "test-index",
            queryID: "test-query-id",
            objectID: "test-object-id"
        } as AlgoliaSearchEngine
    },
    {
        id: "product-2",
        name: "Product 2",
        slug: "product-2",
        keywords: "",
        seoTitle: "",
        seoKeywords: "",
        seoDescription: "",
        description: "",
        summary: "",
        brand: { id: "brand-2", name: "Brand 2" },
        categories: [],
        minPrice: 0,
        recommended: false,
        segmentCodes: [],
        store: { id: "store-2", name: "Store 2" },
        supplierId: "",
        priority: 2,
        maxPrice: 0,
        minPointsPrice: 25000,
        maxPointsPrice: 30000,
        assets: [{ id: "asset-2", type: "image" as const, order: 1, desktopUrl: "image2.jpg", mobileUrl: "image2-mobile.jpg" }],
        features: [],
        tags: [],
        mostWanted: false,
        productType: ProductType.PHYSICAL_PRODUCT,
        searchEngine: {
            engine: SearchEngineType.ALGOLIA,
            position: 1,
            index: "test-index",
            queryID: "test-query-id",
            objectID: "test-object-id"
        } as AlgoliaSearchEngine
    }
]

describe("ProductsCarousel", () => {
    it("should render scroll menu with products", () => {
        render(<ProductsCarousel items={mockProducts} />)
        
        expect(screen.getByTestId("scroll-menu")).toBeInTheDocument()
        expect(screen.getByText("Product 1")).toBeInTheDocument()
        expect(screen.getByText("Product 2")).toBeInTheDocument()
    })

    it("should render arrows when showArrows is true", () => {
        render(<ProductsCarousel items={mockProducts} showArrows={true} />)
        
        expect(screen.getByTestId("left-arrow")).toBeInTheDocument()
        expect(screen.getByTestId("right-arrow")).toBeInTheDocument()
        expect(screen.getByTestId("arrow-left-icon")).toBeInTheDocument()
        expect(screen.getByTestId("arrow-right-icon")).toBeInTheDocument()
    })

    it("should not render arrows when showArrows is false", () => {
        render(<ProductsCarousel items={mockProducts} showArrows={false} />)
        
        expect(screen.queryByTestId("left-arrow")).not.toBeInTheDocument()
        expect(screen.queryByTestId("right-arrow")).not.toBeInTheDocument()
    })

    it("should apply default wrapper classes", () => {
        render(<ProductsCarousel items={mockProducts} />)
        
        const scrollMenu = screen.getByTestId("scroll-menu")
        expect(scrollMenu).toHaveClass("relative", "overflow-hidden")
    })

    it("should apply custom wrapper className", () => {
        render(<ProductsCarousel items={mockProducts} wrapperClassName="custom-wrapper" />)
        
        const scrollMenu = screen.getByTestId("scroll-menu")
        expect(scrollMenu).toHaveClass("relative", "overflow-hidden", "custom-wrapper")
    })

    it("should apply default scroll container classes", () => {
        render(<ProductsCarousel items={mockProducts} />)
        
        const scrollContainer = screen.getByTestId("scroll-container")
        expect(scrollContainer).toHaveClass("flex", "gap-4", "items-stretch", "overflow-x-auto", "lg:overflow-hidden", "[&::-webkit-scrollbar]:hidden")
    })

    it("should apply custom scroll container className", () => {
        render(<ProductsCarousel items={mockProducts} scrollContainerClassName="custom-scroll" />)
        
        const scrollContainer = screen.getByTestId("scroll-container")
        expect(scrollContainer).toHaveClass("flex", "gap-4", "items-stretch", "overflow-x-auto", "lg:overflow-hidden", "[&::-webkit-scrollbar]:hidden", "custom-scroll")
    })

    it("should apply default item classes", () => {
        render(<ProductsCarousel items={mockProducts} />)
        
        const scrollItems = screen.getByTestId("scroll-items")
        expect(scrollItems).toHaveClass("shrink-0")
    })

    it("should apply custom item className", () => {
        render(<ProductsCarousel items={mockProducts} itemClassName="custom-item" />)
        
        const scrollItems = screen.getByTestId("scroll-items")
        expect(scrollItems).toHaveClass("shrink-0", "custom-item")
    })

    it("should render correct number of products", () => {
        render(<ProductsCarousel items={mockProducts} />)
        
        expect(screen.getAllByText("Desde")).toHaveLength(2)
    })

    it("should enlarge price to 28px when product has no previous price", () => {
        render(<ProductsCarousel items={mockProducts} />)

        expect(screen.getByText("15.000 millas")).toHaveClass("text-[28px]")
        expect(screen.getByText("25.000 millas")).toHaveClass("text-[28px]")
    })

    it("should render empty state when no products", () => {
        render(<ProductsCarousel items={[]} />)
        
        expect(screen.getByTestId("scroll-menu")).toBeInTheDocument()
        expect(screen.queryByText("Desde")).not.toBeInTheDocument()
    })

    it("should assign unique item IDs", () => {
        render(<ProductsCarousel items={mockProducts} />)

        const productCards = screen.getAllByRole("link")
        expect(productCards).toHaveLength(2)
    })

    describe("accessibility (ARIA)", () => {
        it("should wrap the scroll menu in a region landmark", () => {
            render(<ProductsCarousel items={mockProducts} />)
            expect(screen.getByRole("region")).toBeInTheDocument()
        })

        it("should use the default aria-label 'Carrusel de productos'", () => {
            render(<ProductsCarousel items={mockProducts} />)
            expect(screen.getByRole("region", { name: "Carrusel de productos" })).toBeInTheDocument()
        })

        it("should use a custom aria-label when provided", () => {
            render(<ProductsCarousel items={mockProducts} label="Carrusel de ofertas" />)
            expect(screen.getByRole("region", { name: "Carrusel de ofertas" })).toBeInTheDocument()
        })

        it("should have aria-roledescription='carrusel' on the wrapper", () => {
            const { container } = render(<ProductsCarousel items={mockProducts} />)
            const wrapper = container.querySelector("[aria-roledescription='carrusel']")
            expect(wrapper).toBeInTheDocument()
        })

        it("should wrap each product in a slide group", () => {
            render(<ProductsCarousel items={mockProducts} />)
            const groups = screen.getAllByRole("article")
            expect(groups).toHaveLength(mockProducts.length)
        })

        it("should label each slide group with product position", () => {
            render(<ProductsCarousel items={mockProducts} />)
            const groups = screen.getAllByRole("article")
            expect(groups[0]).toHaveAttribute("aria-label", "Producto 1 de 2")
            expect(groups[1]).toHaveAttribute("aria-label", "Producto 2 de 2")
        })

        it("should have aria-roledescription='diapositiva' on each slide group", () => {
            const { container } = render(<ProductsCarousel items={mockProducts} />)
            const slides = container.querySelectorAll("[aria-roledescription='diapositiva']")
            expect(slides).toHaveLength(mockProducts.length)
        })

        it("should render a single slide when items has one element", () => {
            render(<ProductsCarousel items={[mockProducts[0]]} />)
            const groups = screen.getAllByRole("article")
            expect(groups).toHaveLength(1)
            expect(groups[0]).toHaveAttribute("aria-label", "Producto 1 de 1")
        })
    })
})
