import React from "react"
import {render, screen, fireEvent} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import type {Product, ProductAsset} from "@/domain/entity/Product/product"
import {ProductType} from "@/domain/entity/Product/product"
import type SearchEngine from "@/domain/entity/SearchEngine/structure/SearchEngine"
import ProductItem from "@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar/components/ProductItem/ProductItem"

vi.mock("@/presentation/helpers/quantities", () => ({
    formatMiles: (value: number) => value.toLocaleString("es-EC"),
}))

vi.mock("@/presentation/components/AssetImage", () => ({
    default: () => <div data-testid="asset-image">Asset</div>,
}))

interface ImageProps {
    src: string
    alt: string
    width: number
    height: number
    className?: string
}

vi.mock("next/image", () => ({
    default: ({src, alt, width, height, className}: ImageProps) => (
        <img src={src} alt={alt} width={width} height={height} className={className} data-testid="product-image" />
    ),
}))

const mockProduct: Product = {
    id: "prod-1",
    name: "Test Product",
    slug: "test-product",
    description: "Test description",
    brand: {id: "brand-1", name: "Test Brand"},
    categories: [],
    minPrice: 100,
    maxPrice: 200,
    minPointsPrice: 1500,
    maxPointsPrice: 2000,
    assets: [
        {
            id: "asset-1",
            type: "image" as const,
            desktopUrl: "https://example.com/image.jpg",
            mobileUrl: "https://example.com/mobile.jpg",
            order: 1,
        } satisfies ProductAsset,
    ],
    features: [],
    mostWanted: true,
    productType: ProductType.PHYSICAL_PRODUCT,
    recommended: true,
    segmentCodes: [],
    store: {id: "store-1", name: "Test Store"},
    supplierId: "sup-1",
    priority: 1,
    searchEngine: {id: "", name: "", structure: {}} as unknown as SearchEngine,
}

describe("ProductItem", () => {
    it("should render product name", () => {
        render(<ProductItem product={mockProduct} onClick={vi.fn()} />)

        expect(screen.getByText("Test Product")).toBeInTheDocument()
    })

    it("should render product image", () => {
        render(<ProductItem product={mockProduct} onClick={vi.fn()} />)

        expect(screen.getByTestId("product-image")).toBeInTheDocument()
        expect(screen.getByTestId("product-image")).toHaveAttribute("alt", "Test Product")
    })

    it("should render formatted price", () => {
        render(<ProductItem product={mockProduct} onClick={vi.fn()} />)

        expect(screen.getByText((content) => content.includes("1.500"))).toBeInTheDocument()
        expect(screen.getByText((content) => content.includes("millas"))).toBeInTheDocument()
    })

    it("should call onClick when clicked", () => {
        const onClick = vi.fn()
        render(<ProductItem product={mockProduct} onClick={onClick} />)

        const button = screen.getByRole("button")
        fireEvent.click(button)

        expect(onClick).toHaveBeenCalledTimes(1)
        expect(onClick).toHaveBeenCalledWith(mockProduct)
    })

    it("should not render image when product has no image assets", () => {
        const productNoImage = {
            ...mockProduct,
            assets: [],
        }

        render(<ProductItem product={productNoImage} onClick={vi.fn()} />)

        expect(screen.queryByTestId("product-image")).not.toBeInTheDocument()
    })

    it("should render only image type assets", () => {
        const productWithVideo = {
            ...mockProduct,
            assets: [
                {
                    id: "asset-video",
                    type: "video" as const,
                    desktopUrl: "https://example.com/video.mp4",
                    mobileUrl: "https://example.com/mobile-video.mp4",
                    order: 1,
                } satisfies ProductAsset,
                {
                    id: "asset-image",
                    type: "image" as const,
                    desktopUrl: "https://example.com/image.jpg",
                    mobileUrl: "https://example.com/mobile.jpg",
                    order: 2,
                } satisfies ProductAsset,
            ],
        }

        render(<ProductItem product={productWithVideo} onClick={vi.fn()} />)

        expect(screen.getByTestId("product-image")).toBeInTheDocument()
        expect(screen.getByTestId("product-image")).toHaveAttribute("src", "https://example.com/image.jpg")
    })

    it("should apply correct styling classes", () => {
        const {container} = render(<ProductItem product={mockProduct} onClick={vi.fn()} />)

        const button = container.querySelector("button")
        expect(button).toHaveClass("rounded-lg")
        expect(button).toHaveClass("cursor-pointer")
    })

    it("should render Desde label with price", () => {
        render(<ProductItem product={mockProduct} onClick={vi.fn()} />)

        expect(screen.getByText("Desde:")).toBeInTheDocument()
    })
})
