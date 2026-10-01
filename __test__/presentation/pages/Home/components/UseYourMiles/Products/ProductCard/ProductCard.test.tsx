import { fireEvent, render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { Product, ProductType } from "@/domain/entity/Product/product"
import { SearchEngineType } from "@/domain/entity/SearchEngine/structure/SearchEngine"
import { mockTrack } from "../../../../../../../utils/analytics"
import { EventName } from "@/presentation/analytics/types"

vi.mock("@/presentation/components/AssetImage", () => ({
    default: ({ asset, alt, className }: { asset: unknown; alt: string; className: string }) => (
        <div data-testid="asset-image" className={className} aria-label={alt}>
            {JSON.stringify(asset)}
        </div>
    ),
}))

vi.mock("@/presentation/config/links", () => ({
    default: {
        productsList: "products"
    }
}))

vi.mock("next/link", () => ({
    default: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
        <a href={href} {...rest}>{children}</a>
    ),
}))

import ProductCard from "@/presentation/pages/Home/UseYourMiles/Products/ProductCard/ProductCard"

const baseProduct = {
    id: "product-1",
    name: "Test Product",
    slug: "test-product",
    keywords: "",
    seoTitle: "",
    seoKeywords: "",
    seoDescription: "",
    description: "",
    summary: "",
    brand: {
        id: "brand-1",
        name: "Test Brand"
    },
    categories: [],
    minPrice: 0,
    recommended: false,
    segmentCodes: [],
    store: {
        id: "store-1",
        name: "Test Store"
    },
    supplierId: "",
    priority: 1,
    maxPrice: 0,
    minPointsPrice: 15000,
    maxPointsPrice: 20000,
    unitPointsPriceWithoutDiscount: 20000,
    assets: [
        {
            id: "asset-1",
            type: "image" as const,
            desktopUrl: "product-desktop.jpg",
            mobileUrl: "product-mobile.jpg",
            order: 1
        }
    ],
    features: [],
    tags: [
        {
            tag: "Nuevo",
            backgroundColor: "",
            textColor: ""
        }
    ],
    mostWanted: false,
    productType: ProductType.PHYSICAL_PRODUCT,
    searchEngine: {
        engine: SearchEngineType.ALGOLIA,
        position: 1,
        index: "test-index",
        queryID: "test-query-id",
        objectID: "test-object-id"
    }
} satisfies Product

const renderSubject = (overrides?: Partial<Product>) =>
    render(<ProductCard product={{ ...baseProduct, ...overrides }} />)

const getRenderedAsset = () => {
    const assetImage = screen.getByTestId("asset-image")

    return JSON.parse(assetImage.textContent ?? "{}") as Product["assets"][number]
}

describe("ProductCard", () => {
    beforeEach(() => {
        mockTrack.mockReset()
    })

    describe("when rendered", () => {
        it("should render the card as a link to the product detail page", () => {
            renderSubject()

            const link = screen.getByRole("link")
            expect(link).toHaveAttribute("href", "products/test-product")
            expect(link).toHaveClass("block", "h-full", "w-full")
        })

        it("should render the product name", () => {
            renderSubject()

            expect(screen.getByText("Test Product")).toBeInTheDocument()
        })

        it("should render the asset image", () => {
            renderSubject()

            const assetImage = screen.getByTestId("asset-image")
            expect(assetImage).toBeInTheDocument()
            expect(assetImage).toHaveClass("object-contain", "shrink-0", "h-[155px]", "w-full")
            expect(assetImage).toHaveAttribute("aria-label", "Test Product")
        })

        it("should use the asset with order 1 when it is available", () => {
            renderSubject({
                assets: [
                    {
                        id: "asset-0",
                        type: "image",
                        desktopUrl: "fallback-desktop.jpg",
                        mobileUrl: "fallback-mobile.jpg",
                        order: 2,
                    },
                    {
                        id: "asset-1",
                        type: "image",
                        desktopUrl: "primary-desktop.jpg",
                        mobileUrl: "primary-mobile.jpg",
                        order: 1,
                    },
                ],
            })

            expect(getRenderedAsset()).toMatchObject({
                id: "asset-1",
                desktopUrl: "primary-desktop.jpg",
                order: 1,
            })
        })

        it("should fall back to the first asset when none has order 1", () => {
            renderSubject({
                assets: [
                    {
                        id: "asset-0",
                        type: "image",
                        desktopUrl: "first-desktop.jpg",
                        mobileUrl: "first-mobile.jpg",
                        order: 2,
                    },
                    {
                        id: "asset-1",
                        type: "image",
                        desktopUrl: "second-desktop.jpg",
                        mobileUrl: "second-mobile.jpg",
                        order: 3,
                    },
                ],
            })

            expect(getRenderedAsset()).toMatchObject({
                id: "asset-0",
                desktopUrl: "first-desktop.jpg",
                order: 2,
            })
        })

        it("should render the payment method message", () => {
            renderSubject()

            expect(screen.getByText("También puedes pagar millas + tarjeta")).toBeInTheDocument()
        })

        it("should apply the expected container classes", () => {
            const { container } = renderSubject()

            const cardDiv = container.querySelector("a > div")
            expect(cardDiv).toHaveClass(
                "flex",
                "flex-col",
                "justify-between",
                "rounded-lg",
                "border",
                "border-darkGrayishBlue-500",
                "overflow-hidden",
                "text-left",
                "max-w-62.5",
                "bg-white",
                "lg:w-62.5",
                "lg:h-[337px]",
                "h-full",
            )
        })

        it("should wrap the image and tags in a relative container", () => {
            const { container } = renderSubject()

            const imageColumn = container.querySelector("a > div > div.relative")
            expect(imageColumn).toBeInTheDocument()
            expect(imageColumn?.querySelector('[data-testid="asset-image"]')).toBeInTheDocument()
            expect(imageColumn?.querySelector(".absolute.right-4")).toBeInTheDocument()
        })

        it("should expose a descriptive aria-label on the link", () => {
            renderSubject()

            expect(screen.getByRole("link")).toHaveAttribute(
                "aria-label",
                expect.stringContaining("Test Product"),
            )
        })

        it("should track the clicked product when the card link is pressed", () => {
            renderSubject()

            fireEvent.click(screen.getByRole("link"))

            expect(mockTrack).toHaveBeenCalledWith(EventName.CLICKED_PRODUCT, { product: baseProduct })
        })

        it("should mark the content area as aria-hidden for assistive tech", () => {
            const { container } = renderSubject()

            const contentDiv = container.querySelector(".py-4.px-5")
            expect(contentDiv).toBeInTheDocument()
            expect(contentDiv).toHaveAttribute("aria-hidden", "true")
        })
    })

    describe("when rendered in default variant", () => {
        it("should apply mb-4 to the product name when there is no previous price", () => {
            renderSubject({ unitPointsPriceWithoutDiscount: 0 })

            expect(screen.getByText("Test Product")).toHaveClass("mb-4")
            expect(screen.getByText("Test Product")).not.toHaveClass("mb-2")
        })

        it("should apply mb-2 to the product name when there is a previous price", () => {
            renderSubject({ unitPointsPriceWithoutDiscount: 20000 })

            expect(screen.getByText("Test Product")).toHaveClass("mb-2")
            expect(screen.getByText("Test Product")).not.toHaveClass("mb-4")
        })
    })

    describe("when product has tags", () => {
        it("should render them", () => {
            renderSubject()

            const badge = screen.getByLabelText("Nuevo")
            expect(badge).toBeInTheDocument()
            expect(badge).toHaveClass(
                "uppercase",
                "py-1",
                "px-1.5",
                "rounded-lg",
                "text-xs",
                "font-sans",
                "font-bold",
                "leading-2.75"
            )
        })

        it("should mark the tags container as aria-hidden", () => {
            const { container } = renderSubject()

            const tagsWrapper = container.querySelector(".absolute.right-4")
            expect(tagsWrapper).toBeInTheDocument()
            expect(tagsWrapper).toHaveAttribute("aria-hidden", "true")
        })
    })

    describe("when product has no tags", () => {
        it("should not render the tags container", () => {
            renderSubject({ tags: [] })

            expect(screen.queryByLabelText("Nuevo")).not.toBeInTheDocument()
        })
    })

    describe("when minPointsPrice is valid", () => {
        it("should render the formatted min points price", () => {
            renderSubject()

            const priceElement = screen.getByText("Desde").parentElement
            expect(priceElement).toHaveTextContent("Desde 15.000 millas")
        })

        it("should format large numbers correctly", () => {
            renderSubject({ minPointsPrice: 1500000 })

            const priceElement = screen.getByText("Desde").parentElement
            expect(priceElement).toHaveTextContent("Desde 1'500.000 millas")
        })

        it("should render Desde label without grayscale text class", () => {
            renderSubject()

            const desdeLabel = screen.getByText("Desde")
            expect(desdeLabel).toHaveClass("font-medium", "text-xs")
            expect(desdeLabel).not.toHaveClass("text-grayscale-500")
        })
    })

    describe("when minPointsPrice is not valid", () => {
        it("should not render the min points price", () => {
            renderSubject({ minPointsPrice: 0 })

            expect(screen.queryByText(/Desde/)).not.toBeInTheDocument()
        })
    })

    describe("when unitPointsPriceWithoutDiscount is present and different from minPointsPrice", () => {
        it("should render the previous price with line-through", () => {
            renderSubject({ unitPointsPriceWithoutDiscount: 20000 })

            expect(screen.getByText("Antes:")).toBeInTheDocument()
            expect(screen.getByText("20.000 millas")).toBeInTheDocument()

            const lineThrough = screen.getByText("20.000 millas").closest("span")
            expect(lineThrough).toHaveClass("line-through")
        })
    })

    describe("when unitPointsPriceWithoutDiscount is not present", () => {
        it("should not render the previous price", () => {
            renderSubject({ unitPointsPriceWithoutDiscount: 0 })

            expect(screen.queryByText(/Antes:/)).not.toBeInTheDocument()
        })
    })

    describe("when unitPointsPriceWithoutDiscount equals minPointsPrice", () => {
        it("should not render the previous price", () => {
            renderSubject({ unitPointsPriceWithoutDiscount: 15000 })

            expect(screen.queryByText(/Antes:/)).not.toBeInTheDocument()
        })
    })

    describe("when variant is products-page", () => {
        it("should render the brand name", () => {
            render(<ProductCard product={baseProduct} variant="products-page" />)

            expect(screen.getByText("Test Brand")).toBeInTheDocument()
        })

        it("should not apply default variant name margin classes", () => {
            render(<ProductCard product={baseProduct} variant="products-page" />)

            const productName = screen.getByText("Test Product")
            expect(productName).not.toHaveClass("mb-4")
            expect(productName).not.toHaveClass("mb-2")
        })

        it("should use horizontal layout classes on the card until large breakpoint", () => {
            const { container } = render(<ProductCard product={baseProduct} variant="products-page" />)

            const cardDiv = container.querySelector("a > div")
            expect(cardDiv).toHaveClass("flex-row", "lg:flex-col", "lg:min-h-[311px]")
        })

        it("should constrain image width on small screens", () => {
            render(<ProductCard product={baseProduct} variant="products-page" />)

            const assetImage = screen.getByTestId("asset-image")
            expect(assetImage).toHaveClass("w-[140px]", "lg:w-full")
        })

        it("should wrap image and tags in relative column on products-page", () => {
            const { container } = render(<ProductCard product={baseProduct} variant="products-page" />)

            const imageColumn = container.querySelector("a > div > div.relative")
            expect(imageColumn).toHaveClass("w-[140px]", "lg:w-full", "shrink-0")
            expect(imageColumn?.querySelector(".absolute.z-10")).toBeInTheDocument()
        })

        it("should render previous price with the same text size as Antes label", () => {
            render(<ProductCard product={baseProduct} variant="products-page" />)

            const antesLabel = screen.getByText("Antes:")
            const previousPrice = screen.getByText("20.000 millas")

            expect(antesLabel).toHaveClass("text-xs")
            expect(previousPrice.closest("span")).toHaveClass("line-through", "text-xs")
        })

        it("should render Desde label without grayscale text class on products-page", () => {
            render(<ProductCard product={baseProduct} variant="products-page" />)

            const desdeLabel = screen.getByText("Desde")
            expect(desdeLabel).toHaveClass("font-medium", "text-xs", "lg:text-xs")
            expect(desdeLabel).not.toHaveClass("text-grayscale-500")
        })

        it("should keep 22px price size on large screens even without previous price", () => {
            render(
                <ProductCard
                    product={{ ...baseProduct, unitPointsPriceWithoutDiscount: 0 }}
                    variant="products-page"
                />,
            )

            expect(screen.getByText("15.000 millas")).toHaveClass("lg:text-[22px]")
            expect(screen.getByText("15.000 millas")).not.toHaveClass("lg:text-[28px]")
        })
    })

    describe("when enlargePriceWithoutPrevious is enabled", () => {
        it("should use 28px price size and 14px Desde when there is no previous price", () => {
            render(
                <ProductCard
                    product={{ ...baseProduct, unitPointsPriceWithoutDiscount: 0 }}
                    enlargePriceWithoutPrevious
                />,
            )

            expect(screen.getByText("15.000 millas")).toHaveClass("text-[28px]")
            expect(screen.getByText("Desde")).toHaveClass("text-[14px]")
        })

        it("should keep 22px price size when previous price is shown", () => {
            render(<ProductCard product={baseProduct} enlargePriceWithoutPrevious />)

            expect(screen.getByText("15.000 millas")).toHaveClass("text-[22px]")
            expect(screen.getByText("15.000 millas")).not.toHaveClass("text-[28px]")
            expect(screen.getByText("Desde")).toHaveClass("text-xs")
        })
    })
})
