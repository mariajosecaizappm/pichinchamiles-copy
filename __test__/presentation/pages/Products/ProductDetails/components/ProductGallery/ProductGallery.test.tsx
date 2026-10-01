import { ProductAsset } from "@/domain/entity/Product/product"
import { Variation } from "@/domain/entity/Product/variation"
import useIsDesktop from "@/presentation/hooks/useIsDesktop"
import ProductGallery from "@/presentation/pages/Products/ProductDetails/components/ProductGallery"
import { useProductDetailsContext } from "@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext"
import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

interface MockDotsProps {
    assets: ProductAsset[]
    selectedImage: number
    setSelectedImage: (idx: number) => void
}

interface MockGalleryModalProps {
    isOpen: boolean
    onClose: () => void
    initialIndex: number
    onImageSelect: (asset: ProductAsset) => void
}

interface MockViewerModalProps {
    isOpen: boolean
    onClose: () => void
    asset: ProductAsset | null
}

interface MockThumbnailsProps {
    assets: ProductAsset[]
    selectedImage: number
    setSelectedImage: (idx: number) => void
}

interface MockMagnifierProps {
    asset: ProductAsset
}

interface MockImageProps {
    src: string
    alt: string
}

// Mock sub-components using absolute alias paths to match source imports
vi.mock("@/presentation/pages/Products/ProductDetails/components/ProductGallery/components/CarouselDots", () => ({
    default: ({ assets, selectedImage, setSelectedImage }: MockDotsProps) => (
        <div data-testid="carousel-dots">
            Dots Count: {assets?.length}
            Selected: {selectedImage}
            <button onClick={() => setSelectedImage(1)}>Select 1</button>
        </div>
    )
}))

vi.mock("@/presentation/pages/Products/ProductDetails/components/ProductGallery/components/ProductGalleryModal", () => ({
    default: ({ isOpen, onClose, initialIndex, onImageSelect }: MockGalleryModalProps) => (
        isOpen ? (
            <div data-testid="gallery-modal">
                Modal Open (initial: {initialIndex})
                <button onClick={onClose}>Close</button>
                <button onClick={() => onImageSelect({ id: "viewer-asset" } as ProductAsset)}>Select Viewer Asset</button>
            </div>
        ) : null
    )
}))

vi.mock("@/presentation/pages/Products/ProductDetails/components/ProductGallery/components/ProductImageViewerModal", () => ({
    default: ({ isOpen, onClose, asset }: MockViewerModalProps) => (
        isOpen ? (
            <div data-testid="viewer-modal">
                Viewer Open (asset: {asset?.id})
                <button onClick={onClose}>Close Viewer</button>
            </div>
        ) : null
    )
}))

vi.mock("@/presentation/pages/Products/ProductDetails/components/ProductGallery/components/ProductThumbnails", () => ({
    default: ({ assets, selectedImage, setSelectedImage }: MockThumbnailsProps) => (
        <div data-testid="thumbnails">
            Thumbnails Count: {assets?.length}
            Selected: {selectedImage}
            <button onClick={() => setSelectedImage(2)}>Select 2</button>
        </div>
    )
}))

vi.mock("@/presentation/pages/Products/ProductDetails/components/ProductGallery/components/SideBySideMagnifier", () => ({
    default: ({ asset }: MockMagnifierProps) => (
        <div data-testid="magnifier">Magnified: {asset?.desktopUrl}</div>
    )
}))

// Mock custom hooks
vi.mock("@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext", () => ({
    useProductDetailsContext: vi.fn()
}))

vi.mock("@/presentation/hooks/useIsDesktop", () => ({
    default: vi.fn()
}))

// Mock next/image
vi.mock("next/image", () => ({
    default: ({ src, alt }: MockImageProps) => <img src={src} alt={alt} data-testid="next-image" />,
    getImageProps: ({ src }: { src: string }) => ({ props: { src, srcSet: undefined } }),
}))

// Mock HeroUI
vi.mock("@heroui/react", () => ({
    Skeleton: ({ className }: { className?: string }) => <div className={className} data-testid="skeleton" />,
    cn: (...args: string[]) => args.filter(Boolean).join(" "),
}))

describe("ProductGallery", () => {
    const mockAssets: ProductAsset[] = [
        { id: "a1", desktopUrl: "http://example.com/1.jpg", type: "image" as const, order: 1, mobileUrl: "http://example.com/1-m.jpg" },
        { id: "a2", desktopUrl: "http://example.com/2.jpg", type: "image" as const, order: 2, mobileUrl: "http://example.com/2-m.jpg" },
        { id: "a3", desktopUrl: "http://example.com/3.jpg", type: "image" as const, order: 3, mobileUrl: "http://example.com/3-m.jpg" },
    ]

    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useProductDetailsContext).mockReturnValue({
            assets: mockAssets,
            variation: { id: "var-1" } as unknown as Variation,
            isLoading: false,
            tags: [],
            setVariation: vi.fn(),
            selectedFeatures: [],
            setSelectedFeatures: vi.fn(),
            pointsPrice: 500,
            minCopaymentPoints: 0,
            copaymentPercentage: 0,
            addProductToCart: vi.fn(),
        })
        vi.mocked(useIsDesktop).mockReturnValue({ isDesktop: true })
    })

    it("should render successfully in desktop view", () => {
        render(<ProductGallery productName="Test Product" />)
        expect(screen.getByTestId("magnifier")).toBeInTheDocument()
        expect(screen.getByTestId("thumbnails")).toBeInTheDocument()
        expect(screen.getByTestId("carousel-dots")).toBeInTheDocument()
        expect(screen.getByText("Pasa el cursor para ampliar la imagen")).toBeInTheDocument()
    })

    it("should render loading skeleton when isLoading is true", () => {
        vi.mocked(useProductDetailsContext).mockReturnValue({
            assets: mockAssets,
            variation: { id: "var-1" } as unknown as Variation,
            isLoading: true,
            tags: [],
            setVariation: vi.fn(),
            selectedFeatures: [],
            setSelectedFeatures: vi.fn(),
            pointsPrice: 500,
            minCopaymentPoints: 0,
            copaymentPercentage: 0,
            addProductToCart: vi.fn(),
        })

        const { container } = render(<ProductGallery productName="Test Product" />)
        // Check for loading skeleton - ProductGallerySkeleton wrapper has class space-y-4
        expect(container.querySelector(".space-y-4")).toBeInTheDocument()
    })

    it("should handle image selection in thumbnails", () => {
        render(<ProductGallery productName="Test Product" />)
        const thumbnailSelectBtn = screen.getByText("Select 2")
        fireEvent.click(thumbnailSelectBtn)

        // Selected image state is 2, so magnifier should show 3rd asset URL
        expect(screen.getByTestId("magnifier")).toHaveTextContent("http://example.com/3.jpg")
    })

    it("should handle mobile view rendering and opening modal", () => {
        vi.mocked(useIsDesktop).mockReturnValue({ isDesktop: false })
        render(<ProductGallery productName="Test Product" />)

        // No magnifier on mobile
        expect(screen.queryByTestId("magnifier")).not.toBeInTheDocument()

        // Shows next/image (mobile slider renders multiple images)
        const mainImage = screen.getAllByTestId("next-image")[0]
        expect(mainImage).toBeInTheDocument()

        // Clicking the main image button opens ProductGalleryModal
        const imageButton = screen.getAllByRole("button", { name: "Ver galería de imágenes" })[0]
        fireEvent.click(imageButton)

        expect(screen.getByTestId("gallery-modal")).toBeInTheDocument()

        // We can close the gallery modal
        fireEvent.click(screen.getByText("Close"))
        expect(screen.queryByTestId("gallery-modal")).not.toBeInTheDocument()
    })

    it("should open viewer modal from gallery modal in mobile view", () => {
        vi.mocked(useIsDesktop).mockReturnValue({ isDesktop: false })
        render(<ProductGallery productName="Test Product" />)

        const imageButton = screen.getAllByRole("button", { name: "Ver galería de imágenes" })[0]
        fireEvent.click(imageButton)

        // Click select viewer asset in modal
        fireEvent.click(screen.getByText("Select Viewer Asset"))

        expect(screen.getByTestId("viewer-modal")).toBeInTheDocument()
        expect(screen.getByTestId("viewer-modal")).toHaveTextContent("Viewer Open (asset: viewer-asset)")

        // Close viewer modal
        fireEvent.click(screen.getByText("Close Viewer"))
        expect(screen.queryByTestId("viewer-modal")).not.toBeInTheDocument()
    })
})
