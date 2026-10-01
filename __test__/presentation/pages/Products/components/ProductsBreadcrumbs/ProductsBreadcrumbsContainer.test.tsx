import Categorization from "@/domain/entity/Category/models/Categorization"
import type { Category } from "@/domain/entity/Category/structure/category"
import ProductsBreadcrumbsContainer from "@/presentation/pages/Products/components/ProductsBreadcrumbs/ProductsBreadcrumbsContainer"
import { render, screen } from "@testing-library/react"
import { useParams, usePathname } from "next/navigation"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("next/navigation", () => ({
    usePathname: vi.fn(),
    useParams: vi.fn(),
}))

vi.mock("@/presentation/pages/Products/components/ProductsBreadcrumbs/ProductsBreadcrumbs", () => ({
    default: ({ items }: { items: Array<{ id: string; label: string; href?: string; isCurrent?: boolean }> }) => (
        <div data-testid="products-breadcrumbs-items">{JSON.stringify(items)}</div>
    ),
}))

const categories: Category[] = [
    { id: "1", name: "Electronics", slug: "electronics", parent: null },
    { id: "2", name: "Phones", slug: "phones", parent: { id: "1", slug: "electronics" } },
]

vi.mock("@/presentation/pages/Products/context/useProductsContext", () => ({
    useProductsContext: () => ({
        categorization: new Categorization(categories),
    }),
}))

const getRenderedItems = () => {
    const raw = screen.getByTestId("products-breadcrumbs-items").textContent ?? "[]"
    return JSON.parse(raw) as Array<{ id: string; label: string; href?: string; isCurrent?: boolean }>
}

describe("ProductsBreadcrumbsContainer", () => {
    beforeEach(() => {
        vi.mocked(usePathname).mockReturnValue("/productos")
        vi.mocked(useParams).mockReturnValue({})
    })

    it("should return null outside products paths", () => {
        vi.mocked(usePathname).mockReturnValue("/ofertas")
        const { container } = render(<ProductsBreadcrumbsContainer />)

        expect(container.firstChild).toBeNull()
    })

    it("should return null when pathname is null", () => {
        vi.mocked(usePathname).mockReturnValue(null)
        const { container } = render(<ProductsBreadcrumbsContainer />)

        expect(container.firstChild).toBeNull()
    })

    it("should render root crumbs and mark productos as current", () => {
        render(<ProductsBreadcrumbsContainer />)
        const items = getRenderedItems()

        expect(items).toEqual([
            { id: "home", label: "Home", href: "/utilice-sus-millas/productos", isCurrent: false },
            { id: "productos", label: "Todos los productos", href: "/productos", isCurrent: true },
        ])
    })

    it("should fallback to 'Productos' label when browse title is null", () => {
        vi.mocked(usePathname).mockReturnValue("/productos/ofertas")
        render(<ProductsBreadcrumbsContainer />)
        const items = getRenderedItems()

        expect(items).toEqual([
            { id: "home", label: "Home", href: "/utilice-sus-millas/productos", isCurrent: false },
            { id: "productos", label: "Productos", href: "/productos", isCurrent: false },
        ])
    })

    it("should render category crumb as current when subcategory is missing", () => {
        vi.mocked(usePathname).mockReturnValue("/productos/categoria/electronics")
        vi.mocked(useParams).mockReturnValue({ category: "electronics" })
        render(<ProductsBreadcrumbsContainer />)
        const items = getRenderedItems()

        expect(items).toEqual([
            { id: "home", label: "Home", href: "/utilice-sus-millas/productos", isCurrent: false },
            { id: "productos", label: "Productos", href: "/productos", isCurrent: false },
            {
                id: "category-electronics",
                label: "Electronics",
                href: "/productos/categoria/electronics",
                isCurrent: true,
            },
        ])
    })

    it("should render subcategory crumb as current when both slugs exist", () => {
        vi.mocked(usePathname).mockReturnValue("/productos/categoria/electronics/phones")
        vi.mocked(useParams).mockReturnValue({ category: "electronics", subcategory: "phones" })
        render(<ProductsBreadcrumbsContainer />)
        const items = getRenderedItems()

        expect(items).toEqual([
            { id: "home", label: "Home", href: "/utilice-sus-millas/productos", isCurrent: false },
            { id: "productos", label: "Productos", href: "/productos", isCurrent: false },
            {
                id: "category-electronics",
                label: "Electronics",
                href: "/productos/categoria/electronics",
                isCurrent: false,
            },
            {
                id: "subcategory-phones",
                label: "Phones",
                href: "/productos/categoria/electronics/phones",
                isCurrent: true,
            },
        ])
    })
})
