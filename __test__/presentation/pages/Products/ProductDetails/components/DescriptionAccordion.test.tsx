import {describe, it, expect, vi, beforeEach} from "vitest"
import {render, screen} from "@testing-library/react"

vi.mock("@/presentation/pages/Products/ProductDetails/components/DescriptionAccordion/styles.css", () => ({
    __esModule: true,
    default: {},
}))

import DescriptionAccordion from "@/presentation/pages/Products/ProductDetails/components/DescriptionAccordion/DescriptionAccordion"

const mocks = vi.hoisted(() => ({
    accordion: vi.fn(),
}))

vi.mock("@/presentation/components/Accordion", () => ({
    default: (props: {
        items: Array<{ id: string; title: string; content: string; hasHtml?: boolean }>
        defaultExpandedKeys?: string[]
        itemClassName?: string
    }) => {
        mocks.accordion(props)
        return (
            <div data-testid="accordion-mock">
                {props.items.map((item) => (
                    <div key={item.id}>
                        <span>{item.title}</span>
                        <div dangerouslySetInnerHTML={{ __html: item.content }} />
                    </div>
                ))}
            </div>
        )
    },
}))

describe("DescriptionAccordion", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render description title", () => {
        render(<DescriptionAccordion description="Test description" />)
        expect(screen.getByText(/Descripción del producto/i)).toBeInTheDocument()
    })

    it("should render description content", () => {
        render(<DescriptionAccordion description="This is the product description" />)
        expect(screen.getByText(/This is the product description/i)).toBeInTheDocument()
    })

    it("should handle HTML in description", () => {
        render(<DescriptionAccordion description="<p>HTML content</p>" />)
        expect(screen.getByText(/HTML content/i)).toBeInTheDocument()
    })

    it("should configure accordion with the default expanded item", () => {
        render(<DescriptionAccordion description="Test description" />)

        expect(mocks.accordion).toHaveBeenCalledWith(
            expect.objectContaining({
                defaultExpandedKeys: ["product-description"],
                items: [
                    expect.objectContaining({
                        id: "product-description",
                        title: "Descripción del producto",
                        content: "Test description",
                        hasHtml: true,
                    }),
                ],
            }),
        )
    })

    it("should pass contentClassName to accordion itemClassName", () => {
        render(<DescriptionAccordion description="Test description" contentClassName="custom-class" />)

        expect(mocks.accordion).toHaveBeenCalledWith(
            expect.objectContaining({
                itemClassName: expect.stringContaining("custom-class"),
            }),
        )
    })
})
