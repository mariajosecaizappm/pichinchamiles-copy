import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/presentation/pages/Products/ProductDetails", () => ({
    default: ({ slug }: { slug: string }) => (
        <div data-testid="product-details" data-slug={slug} />
    ),
}))

import ProductPage from "@/app/productos/[slug]/page"

describe("Product page", () => {
    it("should render ProductDetails with the resolved slug", async () => {
        const element = await ProductPage({
            params: Promise.resolve({ slug: "smartphone-x" }),
        })

        render(element)

        expect(screen.getByTestId("product-details")).toHaveAttribute("data-slug", "smartphone-x")
    })
})
