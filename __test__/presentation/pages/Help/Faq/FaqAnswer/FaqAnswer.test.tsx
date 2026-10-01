import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import FaqAnswer from "@/presentation/pages/Help/Faq/FaqAnswer/FaqAnswer"

describe("FaqAnswer – XSS sanitization", () => {
    it("should strip script tags from the HTML content", () => {
        const { container } = render(
            <FaqAnswer html='<p>Safe content</p><script>alert("XSS")</script>' />,
        )
        expect(container.querySelector("script")).toBeNull()
        expect(container.querySelector("p")?.textContent).toBe("Safe content")
    })

    it("should strip inline event handlers from elements", () => {
        const { container } = render(
            <FaqAnswer html='<img src="x" onerror="alert(1)">' />,
        )
        const img = container.querySelector("img")
        expect(img?.hasAttribute("onerror")).toBe(false)
    })

    it("should strip javascript: href links", () => {
        const { container } = render(
            <FaqAnswer html='<a href="javascript:alert(1)">Click</a>' />,
        )
        const anchor = container.querySelector("a")
        const href = anchor?.getAttribute("href") ?? ""
        expect(href).not.toContain("javascript:")
    })

    it("should preserve safe HTML elements and attributes", () => {
        const { container } = render(
            <FaqAnswer html='<p class="safe"><strong>Bold</strong> text</p>' />,
        )
        expect(container.querySelector("p")).not.toBeNull()
        expect(container.querySelector("strong")?.textContent).toBe("Bold")
    })
})

describe("FaqAnswer", () => {
    it("should render the provided HTML content", () => {
        const { container } = render(<FaqAnswer html="<p>Hello world</p>" />)
        expect(container.querySelector("p")?.textContent).toBe("Hello world")
    })

    it("should apply the wrap-break-word base class", () => {
        const { container } = render(<FaqAnswer html="<p>Content</p>" />)
        expect(container.firstElementChild?.className).toContain("wrap-break-word")
    })

    it("should apply an additional className when provided", () => {
        const { container } = render(<FaqAnswer html="<p>Content</p>" className="custom-class" />)
        expect(container.firstElementChild?.className).toContain("wrap-break-word")
        expect(container.firstElementChild?.className).toContain("custom-class")
    })

    it("should not add className beyond the base when no className prop is passed", () => {
        const { container } = render(<FaqAnswer html="<p>Content</p>" />)
        expect(container.firstElementChild?.className.trim()).toBe("wrap-break-word")
    })

    it("should add target=_blank and rel=noopener noreferrer to external http links", () => {
        const { container } = render(
            <FaqAnswer html='<a href="https://external.com">External</a>' />,
        )
        const anchor = container.querySelector("a")
        expect(anchor?.getAttribute("target")).toBe("_blank")
        expect(anchor?.getAttribute("rel")).toBe("noopener noreferrer")
    })

    it("should not modify relative (internal) links", () => {
        const { container } = render(
            <FaqAnswer html='<a href="/terminos">Términos</a>' />,
        )
        const anchor = container.querySelector("a")
        expect(anchor?.hasAttribute("target")).toBe(false)
        expect(anchor?.hasAttribute("rel")).toBe(false)
    })

    it("should strip incoming target attributes and apply the correct target for external links", () => {
        const { container } = render(
            <FaqAnswer html='<a href="https://external.com" target="_self">Self</a>' />,
        )
        const anchor = container.querySelector("a")
        expect(anchor?.getAttribute("target")).toBe("_blank")
        expect(anchor?.getAttribute("rel")).toBe("noopener noreferrer")
    })

    it("should skip links with an empty href", () => {
        const { container } = render(
            <FaqAnswer html='<a href="">Empty href</a>' />,
        )
        const anchor = container.querySelector("a")
        expect(anchor?.hasAttribute("target")).toBe(false)
    })

    it("should skip links without an href attribute", () => {
        const { container } = render(
            <FaqAnswer html="<a>No href</a>" />,
        )
        const anchor = container.querySelector("a")
        expect(anchor?.hasAttribute("target")).toBe(false)
    })

    it("should treat malformed http URLs as external links", () => {
        const { container } = render(
            <FaqAnswer html='<a href="http://[invalid-url">Bad URL</a>' />,
        )
        const anchor = container.querySelector("a")
        expect(anchor?.getAttribute("target")).toBe("_blank")
        expect(anchor?.getAttribute("rel")).toBe("noopener noreferrer")
    })

    it("should not modify non-http links such as mailto", () => {
        const { container } = render(
            <FaqAnswer html='<a href="mailto:test@example.com">Email</a>' />,
        )
        const anchor = container.querySelector("a")
        expect(anchor?.hasAttribute("target")).toBe(false)
    })

    it("should process multiple anchors independently", () => {
        const { container } = render(
            <FaqAnswer html='<a href="/internal">Internal</a><a href="https://external.com">External</a>' />,
        )
        const anchors = container.querySelectorAll("a")
        expect(anchors[0].hasAttribute("target")).toBe(false)
        expect(anchors[1].getAttribute("target")).toBe("_blank")
        expect(anchors[1].getAttribute("rel")).toBe("noopener noreferrer")
    })
})
