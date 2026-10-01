import { ProductAsset } from "@/domain/entity/Product/product"
import ProductThumbnails from "@/presentation/pages/Products/ProductDetails/components/ProductGallery/components/ProductThumbnails"
import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

interface MockImageProps {
    src: string
    alt: string
    className?: string
}

// Mock next/image
vi.mock("next/image", () => ({
    default: ({ src, alt, className }: MockImageProps) => <img src={src} alt={alt} className={className} data-testid="thumbnail-image" />,
}))

// Mock HeroUI
vi.mock("@heroui/react", () => ({
    cn: (...args: string[]) => args.filter(Boolean).join(" "),
    Skeleton: ({ className }: { className?: string }) => <div className={className} data-testid="skeleton" />,
}))

// Mock ArrowIcon
vi.mock("@/presentation/pages/Home/components/Header/components/Menu/components/Icons/ArrowIcon", () => ({
    default: () => <span data-testid="arrow-icon">^</span>,
}))

describe("ProductThumbnails", () => {
    const mockAssets: ProductAsset[] = [
        { id: "a1", desktopUrl: "http://example.com/1.jpg" },
        { id: "a2", desktopUrl: "http://example.com/2.jpg" },
        { id: "a3", desktopUrl: "http://example.com/3.jpg" },
        { id: "a4", desktopUrl: "http://example.com/4.jpg" },
        { id: "a5", desktopUrl: "http://example.com/5.jpg" },
    ] as unknown as ProductAsset[]

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render successfully showing first 4 assets", () => {
        render(
            <ProductThumbnails
                assets={mockAssets}
                selectedImage={0}
                setSelectedImage={vi.fn()}
            />
        )

        const listItems = screen.getAllByRole("listitem")
        expect(listItems.length).toBe(4) // VISIBLE_COUNT is 4

        const firstImage = screen.getAllByTestId("thumbnail-image")[0]
        expect(firstImage).toHaveAttribute("src", "http://example.com/1.jpg")
    })

    it("should trigger setSelectedImage when thumbnail is clicked", () => {
        const setSelectedImage = vi.fn()
        render(
            <ProductThumbnails
                assets={mockAssets}
                selectedImage={0}
                setSelectedImage={setSelectedImage}
            />
        )

        const buttons = screen.getAllByRole("tab")
        fireEvent.click(buttons[2]) // select 3rd item (index 2)

        expect(setSelectedImage).toHaveBeenCalledWith(2)
    })

    it("should handle scrolling down and up", () => {
        render(
            <ProductThumbnails
                assets={mockAssets}
                selectedImage={0}
                setSelectedImage={vi.fn()}
            />
        )

        const upButton = screen.getByRole("button", { name: "Ver imágenes anteriores" })
        const downButton = screen.getByRole("button", { name: "Ver imágenes siguientes" })

        // At startIndex = 0, up is disabled, down is enabled
        expect(upButton).toBeDisabled()
        expect(downButton).not.toBeDisabled()

        // Scroll down
        fireEvent.click(downButton)

        // At startIndex = 1, up is enabled
        expect(upButton).not.toBeDisabled()

        // Images shown should be index 1 to 4 (a2, a3, a4, a5)
        const images = screen.getAllByTestId("thumbnail-image")
        expect(images[0]).toHaveAttribute("src", "http://example.com/2.jpg")
        expect(images[3]).toHaveAttribute("src", "http://example.com/5.jpg")

        // Scroll up
        fireEvent.click(upButton)
        expect(upButton).toBeDisabled()
    })
})
