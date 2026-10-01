import { ProductAsset } from "@/domain/entity/Product/product"
import ProductGalleryMobileSlider from "@/presentation/pages/Products/ProductDetails/components/ProductGallery/components/ProductGalleryMobileSlider"
import { fireEvent, render, screen } from "@testing-library/react"
import { publicApiType } from "react-horizontal-scrolling-menu"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

interface MockImageProps {
    src: string
    alt: string
}

interface MockApi extends Omit<publicApiType, "items" | "scrollContainer" | "menuVisible"> {
    isItemVisible: ReturnType<typeof vi.fn>
    getItemById: ReturnType<typeof vi.fn>
    scrollToItem: ReturnType<typeof vi.fn>
}

const mockState = vi.hoisted(() => ({
    lastApi: null as MockApi | null,
    lastOnUpdate: null as ((api: MockApi) => void) | null,
}))

const triggerScrollToIndex = (index: number) => {
    if (!mockState.lastOnUpdate || !mockState.lastApi) return
    mockState.lastApi.isItemVisible.mockImplementation((id: string) => id === `gallery-slide-${index}`)
    mockState.lastOnUpdate(mockState.lastApi)
}

vi.mock("react-horizontal-scrolling-menu", () => ({
    ScrollMenu: ({ children, onUpdate, apiRef }: { children: React.ReactNode; onUpdate: (api: MockApi) => void; apiRef: { current: MockApi } }) => {
        mockState.lastOnUpdate = onUpdate
        const api: MockApi = {
            scrollToItem: vi.fn((item: { id: string }) => {
                const match = item?.id?.match(/gallery-slide-(\d+)/)
                if (match) {
                    const index = Number(match[1])
                    api.isItemVisible.mockImplementation((id: string) => id === `gallery-slide-${index}`)
                    onUpdate(api)
                }
            }),
            isItemVisible: vi.fn(),
            getItemById: vi.fn((id: string) => ({ id })),
            getItemByIndex: vi.fn(),
            getItemElementById: vi.fn(),
            getItemElementByIndex: vi.fn(),
            getNextElement: vi.fn(),
            getPrevElement: vi.fn(),
            isFirstItemVisible: true,
            isLastItemVisible: false,
            isLastItem: vi.fn(),
            scrollNext: vi.fn(),
            scrollPrev: vi.fn(),
            useIsVisible: vi.fn(),
            useLeftArrowVisible: vi.fn(),
            useRightArrowVisible: vi.fn(),
        }
        mockState.lastApi = api
        apiRef.current = api
        return <div data-testid="scroll-menu">{children}</div>
    },
    publicApiType: vi.fn(),
}))

vi.mock("next/image", () => ({
    // eslint-disable-next-line @next/next/no-img-element
    default: ({ src, alt }: MockImageProps) => <img src={src} alt={alt} data-testid="next-image" />,
    getImageProps: ({ src }: { src: string }) => ({ props: { src, srcSet: undefined } }),
}))

vi.mock("@/presentation/helpers/asset", () => ({
    getPlatformAsset: (asset: ProductAsset) => asset.desktopUrl,
}))

vi.mock("@/presentation/helpers/video", () => ({
    getVideoIframeUrl: (url: string) => url ? `https://www.youtube.com/embed/videoId` : null,
    getVideoThumbnail: vi.fn(),
}))

describe("ProductGalleryMobileSlider", () => {
    const mockAssets: ProductAsset[] = [
        { id: "a1", desktopUrl: "http://example.com/1.jpg", type: "image" as const, order: 1, mobileUrl: "http://example.com/1-m.jpg" },
        { id: "a2", desktopUrl: "http://example.com/2.jpg", type: "image" as const, order: 2, mobileUrl: "http://example.com/2-m.jpg" },
        { id: "a3", desktopUrl: "http://example.com/3.jpg", type: "image" as const, order: 3, mobileUrl: "http://example.com/3-m.jpg" },
    ]

    const mockSetSelectedImage = vi.fn()
    const mockSetModalOpen = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    const renderSlider = (selectedImage: number, assets: ProductAsset[] = mockAssets) =>
        render(
            <ProductGalleryMobileSlider
                productName="Test Product"
                assets={assets}
                selectedImage={selectedImage}
                setSelectedImage={mockSetSelectedImage}
                setModalOpen={mockSetModalOpen}
            />
        )

    it("renders all image slides", () => {
        renderSlider(0)

        const images = screen.getAllByTestId("next-image")
        expect(images).toHaveLength(3)
        expect(images[0]).toHaveAttribute("alt", "Imagen de Test Product 1")
        expect(images[1]).toHaveAttribute("alt", "Imagen de Test Product 2")
        expect(images[2]).toHaveAttribute("alt", "Imagen de Test Product 3")
    })

    it("renders a video slide as iframe", () => {
        const videoAssets: ProductAsset[] = [
            { id: "v1", desktopUrl: "https://youtube.com/watch?v=abc123", type: "video" as const, order: 1, mobileUrl: "https://youtube.com/watch?v=abc123" },
        ]
        renderSlider(0, videoAssets)

        expect(screen.getByTitle("Test Product video")).toBeInTheDocument()
        expect(screen.queryByTestId("next-image")).not.toBeInTheDocument()
    })

    it("opens modal when clicking an image slide", () => {
        renderSlider(0)

        const imageButton = screen.getAllByRole("button", { name: "Ver galería de imágenes" })[0]
        fireEvent.click(imageButton)

        expect(mockSetModalOpen).toHaveBeenCalledWith(true)
    })

    it("renders carousel dots with correct selected state", () => {
        renderSlider(1)

        const dots = screen.getAllByRole("tab")
        expect(dots).toHaveLength(3)
        expect(dots[0]).toHaveAttribute("aria-selected", "false")
        expect(dots[1]).toHaveAttribute("aria-selected", "true")
        expect(dots[2]).toHaveAttribute("aria-selected", "false")
    })

    it("updates selected image and scrolls when a dot is clicked", () => {
        renderSlider(0)

        const dots = screen.getAllByRole("tab")
        fireEvent.click(dots[2])

        expect(mockSetSelectedImage).toHaveBeenCalledWith(2)
        expect(mockState.lastApi?.scrollToItem).toHaveBeenCalledWith(
            { id: "gallery-slide-2" },
            "smooth",
            "start"
        )
    })

    it("scrolls to selected image when selectedImage changes externally", () => {
        const { rerender } = renderSlider(0)

        rerender(
            <ProductGalleryMobileSlider
                productName="Test Product"
                assets={mockAssets}
                selectedImage={2}
                setSelectedImage={mockSetSelectedImage}
                setModalOpen={mockSetModalOpen}
            />
        )

        expect(mockState.lastApi?.scrollToItem).toHaveBeenCalledWith(
            { id: "gallery-slide-2" },
            "smooth",
            "start"
        )
    })

    it("does not scroll when selectedImage is already visible", () => {
        renderSlider(0)
        mockState.lastApi?.isItemVisible.mockImplementation((id: string) => id === "gallery-slide-0")

        const { rerender } = renderSlider(0)
        rerender(
            <ProductGalleryMobileSlider
                productName="Test Product"
                assets={mockAssets}
                selectedImage={0}
                setSelectedImage={mockSetSelectedImage}
                setModalOpen={mockSetModalOpen}
            />
        )

        expect(mockState.lastApi?.scrollToItem).not.toHaveBeenCalled()
    })

    it("updates selected image after scroll settles", () => {
        renderSlider(0)

        triggerScrollToIndex(2)
        expect(mockSetSelectedImage).not.toHaveBeenCalled()

        vi.advanceTimersByTime(120)
        expect(mockSetSelectedImage).toHaveBeenCalledWith(2)
    })

    it("cancels pending update when another scroll event occurs", () => {
        renderSlider(0)

        triggerScrollToIndex(1)
        triggerScrollToIndex(2)

        vi.advanceTimersByTime(120)
        expect(mockSetSelectedImage).toHaveBeenCalledTimes(1)
        expect(mockSetSelectedImage).toHaveBeenCalledWith(2)
    })
})
