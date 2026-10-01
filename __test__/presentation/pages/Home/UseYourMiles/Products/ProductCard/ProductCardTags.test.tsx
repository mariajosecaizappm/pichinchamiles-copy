import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import ProductCardTags from "@/presentation/pages/Home/UseYourMiles/Products/ProductCard/ProductCardTags"
import type { ProductTag } from "@/domain/entity/Product/product"

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/ProductCard/ProductCardTag", () => ({
    default: ({ tag }: { tag: string }) => (
        <span data-testid="product-card-tag" aria-label={tag}>{tag}</span>
    ),
}))

const makeTags = (overrides: Partial<ProductTag>[] = []): ProductTag[] =>
    overrides.map((o) => ({ tag: "Tag", backgroundColor: "#fff", textColor: "#000", ...o }))

describe("ProductCardTags", () => {
    it("should return null when tags is empty", () => {
        const { container } = render(<ProductCardTags tags={[]} isProductsPage={false} />)
        expect(container.firstChild).toBeNull()
    })

    it("should render a tag for each item in tags", () => {
        const tags = makeTags([{ tag: "Nuevo" }, { tag: "Oferta" }])
        render(<ProductCardTags tags={tags} isProductsPage={false} />)
        expect(screen.getAllByTestId("product-card-tag")).toHaveLength(2)
    })

    it("should render tag labels correctly", () => {
        const tags = makeTags([{ tag: "Nuevo" }])
        render(<ProductCardTags tags={tags} isProductsPage={false} />)
        expect(screen.getByText("Nuevo")).toBeInTheDocument()
    })

    it("should apply default page positioning classes when isProductsPage is false", () => {
        const tags = makeTags([{ tag: "Tag" }])
        const { container } = render(<ProductCardTags tags={tags} isProductsPage={false} />)
        const wrapper = container.firstChild as HTMLElement
        expect(wrapper).toHaveClass("right-4", "top-4")
    })

    it("should apply products-page responsive positioning classes when isProductsPage is true", () => {
        const tags = makeTags([{ tag: "Tag" }])
        const { container } = render(<ProductCardTags tags={tags} isProductsPage={true} />)
        const wrapper = container.firstChild as HTMLElement
        expect(wrapper).toHaveClass("right-2", "top-2", "lg:right-4", "lg:top-4")
    })

    it("should always have absolute positioning and z-index classes", () => {
        const tags = makeTags([{ tag: "Tag" }])
        const { container } = render(<ProductCardTags tags={tags} isProductsPage={false} />)
        const wrapper = container.firstChild as HTMLElement
        expect(wrapper).toHaveClass("absolute", "z-10")
    })

    it("should mark the container as aria-hidden", () => {
        const tags = makeTags([{ tag: "Tag" }])
        const { container } = render(<ProductCardTags tags={tags} isProductsPage={false} />)
        expect(container.firstChild).toHaveAttribute("aria-hidden", "true")
    })
})
