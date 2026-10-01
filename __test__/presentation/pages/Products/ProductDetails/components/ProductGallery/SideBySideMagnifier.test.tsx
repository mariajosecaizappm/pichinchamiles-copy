import { Asset } from "@/domain/entity/Asset/asset"
import SideBySideMagnifier from "@/presentation/pages/Products/ProductDetails/components/ProductGallery/components/SideBySideMagnifier"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

interface NextImageProps {
    src: string
    alt?: string
}

// Mock next/image
vi.mock("next/image", async () => {
    const actual = await vi.importActual<typeof import("next/image")>("next/image")
    return {
        ...actual,
        default: (props: NextImageProps) => <img src={props.src} alt={props.alt || ""} />,
        getImageProps: ({ src, alt }: NextImageProps) => ({
            props: { src, alt, srcSet: `${src} 1x` }
        })
    }
})

// Mock ResizeObserver
const observeMock = vi.fn()
const disconnectMock = vi.fn()
let resizeCallback: (entries: ResizeObserverEntry[]) => void

global.ResizeObserver = class {
    constructor(callback: (entries: ResizeObserverEntry[]) => void) {
        resizeCallback = callback
    }
    observe(el: Element) {
        observeMock(el)
    }
    disconnect() {
        disconnectMock()
    }
    unobserve() {}
} as unknown as typeof ResizeObserver

describe("SideBySideMagnifier", () => {
    const mockAsset: Asset = {
        id: "asset-1",
        desktopUrl: "http://example.com/desktop.jpg",
        mobileUrl: "http://example.com/mobile.jpg",
        type: "image",
        order: 1,
    } as unknown as Asset

    const defaultProps = {
        asset: mockAsset,
        productName: "Test Product",
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render successfully and observe element resize", () => {
        const { container } = render(<SideBySideMagnifier {...defaultProps} />)
        const figure = container.querySelector("figure")
        expect(figure).toBeInTheDocument()
        expect(observeMock).toHaveBeenCalled()
    })

    it("should disconnect ResizeObserver on unmount", () => {
        const { unmount } = render(<SideBySideMagnifier {...defaultProps} />)
        unmount()
        expect(disconnectMock).toHaveBeenCalled()
    })

    it("should display lens and zoom panel when hovered after resizing", () => {
        const { container } = render(<SideBySideMagnifier {...defaultProps} />)
        const figure = container.querySelector("figure")!

        if (resizeCallback) {
            act(() => {
                resizeCallback([
                    {
                        contentRect: { width: 400, height: 300, top: 0, left: 0, right: 400, bottom: 300, x: 0, y: 0, toJSON: () => {} },
                        target: figure,
                    } as unknown as ResizeObserverEntry
                ])
            })
        }

        figure.getBoundingClientRect = () => ({
            width: 400,
            height: 300,
            top: 10,
            left: 10,
            bottom: 310,
            right: 410,
            x: 10,
            y: 10,
            toJSON: () => {}
        })

        expect(container.querySelector(".absolute.pointer-events-none")).not.toBeInTheDocument()

        act(() => {
            fireEvent.mouseEnter(figure)
        })

        act(() => {
            fireEvent.mouseMove(figure, { clientX: 100, clientY: 100 })
        })

        expect(container.querySelector(".absolute.pointer-events-none")).toBeInTheDocument()
        expect(container.querySelectorAll(".absolute.bg-white").length).toBeGreaterThan(0)
    })

    it("should use custom zoomSrc when provided", () => {
        const { container } = render(
            <SideBySideMagnifier
                {...defaultProps}
                zoomSrc="http://example.com/zoom.jpg"
                alt="Product zoom"
                zoom={3}
            />
        )

        const figure = container.querySelector("figure")!
        act(() => {
            resizeCallback([
                {
                    contentRect: { width: 300, height: 200, top: 0, left: 0, right: 300, bottom: 200, x: 0, y: 0, toJSON: () => {} },
                    target: figure,
                } as unknown as ResizeObserverEntry,
            ])
        })

        figure.getBoundingClientRect = () => ({
            width: 300,
            height: 200,
            top: 0,
            left: 0,
            bottom: 200,
            right: 300,
            x: 0,
            y: 0,
            toJSON: () => {},
        })

        act(() => {
            fireEvent.mouseEnter(figure)
            fireEvent.mouseMove(figure, { clientX: 150, clientY: 100 })
        })

        const zoomPanel = container.querySelector(".absolute.bg-white") as HTMLElement
        expect(zoomPanel?.style.backgroundImage).toContain("http://example.com/zoom.jpg")
        expect(screen.getByAltText("Product zoom")).toBeInTheDocument()
    })

    it("should not show zoom panel when size is zero", () => {
        const { container } = render(<SideBySideMagnifier {...defaultProps} />)
        const figure = container.querySelector("figure")!

        act(() => {
            fireEvent.mouseEnter(figure)
        })

        expect(container.querySelector(".absolute.pointer-events-none")).not.toBeInTheDocument()
    })
})
