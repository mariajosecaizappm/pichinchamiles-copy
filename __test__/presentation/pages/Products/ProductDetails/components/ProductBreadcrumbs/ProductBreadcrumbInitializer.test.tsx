import { render } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ProductBreadcrumbInitializer from "@/presentation/pages/Products/ProductDetails/components/ProductBreadcrumbs/ProductBreadcrumbInitializer"

const mocks = vi.hoisted(() => ({
    setRootCategory: vi.fn(),
}))

vi.mock("@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext", () => ({
    useProductDetailsContext: () => ({
        setRootCategory: mocks.setRootCategory,
    }),
}))

describe("ProductBreadcrumbInitializer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("sets the first category as the root category", () => {
        render(
            <ProductBreadcrumbInitializer
                categories={[
                    { id: "1", name: "Tecnologia", slug: "tecnologia" },
                    { id: "2", name: "Celulares", slug: "celulares" },
                ]}
            />,
        )

        expect(mocks.setRootCategory).toHaveBeenCalledWith("Tecnologia")
    })

    it("does not update the root category when there are no categories", () => {
        const { container } = render(<ProductBreadcrumbInitializer categories={[]} />)

        expect(container.firstChild).toBeNull()
        expect(mocks.setRootCategory).not.toHaveBeenCalled()
    })
})
