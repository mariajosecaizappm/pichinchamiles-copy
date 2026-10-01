import {render} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"

vi.mock("next/image", () => ({
    getImageProps: (options: { src: string; alt?: string; width: number; height: number }) => ({
        props: { src: options.src, srcSet: options.src, alt: options.alt || "", width: String(options.width), height: String(options.height) }
    }),
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    default: (props: Record<string, unknown>) => <img {...props} />,
}))

import AssetImage from "@/presentation/components/AssetImage/AssetImage"

describe("AssetImage", () => {
    const asset = {
        desktopUrl: "https://example.com/desktop.jpg",
        mobileUrl: "https://example.com/mobile.jpg",
    }

    it("should render a picture element with source and img", () => {
        const {container} = render(
            <AssetImage asset={asset} alt="Test image" width={1920} height={600} />,
        )

        expect(container.querySelector("picture")).toBeInTheDocument()
        expect(container.querySelector("source")).toBeInTheDocument()
        expect(container.querySelector("img")).toBeInTheDocument()
    })

    it("should set mobile source with default breakpoint of 768", () => {
        const {container} = render(
            <AssetImage asset={asset} alt="Test image" width={1920} height={600} />,
        )

        const source = container.querySelector("source")
        expect(source).toHaveAttribute("media", "(max-width: 768px)")
        expect(source).toHaveAttribute("srcSet", "https://example.com/mobile.jpg")
    })

    it("should use custom breakpoint when provided", () => {
        const {container} = render(
            <AssetImage asset={asset} alt="Test image" width={1920} height={600} breakpoint={640} />,
        )

        const source = container.querySelector("source")
        expect(source).toHaveAttribute("media", "(max-width: 640px)")
    })

    it("should set desktop image as img src", () => {
        const {container} = render(
            <AssetImage asset={asset} alt="Test image" width={1920} height={600} />,
        )

        const img = container.querySelector("img")
        expect(img).toHaveAttribute("src", "https://example.com/desktop.jpg")
        expect(img).toHaveAttribute("alt", "Test image")
    })

    it("should pass width and height to the img element", () => {
        const {container} = render(
            <AssetImage asset={asset} alt="Test image" width={1920} height={600} />,
        )

        const img = container.querySelector("img")
        expect(img).toHaveAttribute("width", "1920")
        expect(img).toHaveAttribute("height", "600")
    })
})
