import Categorization from "@/domain/entity/Category/models/Categorization"
import type { Category } from "@/domain/entity/Category/structure/category"
import ProductsBreadcrumbs from "@/presentation/pages/Products/components/ProductsBreadcrumbs"
import { render, screen } from "@testing-library/react"
import { useParams, usePathname } from "next/navigation"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("next/navigation", () => ({
    usePathname: vi.fn(),
    useParams: vi.fn(),
}))

vi.mock("@/presentation/components/Breadcrumb/Breadcrumb", () => ({
    default: ({
        items,
        currentItemClassName,
    }: {
        items: Array<{ id: string; label: string; href?: string; isCurrent?: boolean }>
        currentItemClassName?: string
    }) => (
        <nav data-testid="breadcrumb" data-current-item-class={currentItemClassName}>
            {items.map((item) => (
                <span key={item.id} data-current={item.isCurrent ? "true" : "false"}>
                    {item.label}
                </span>
            ))}
        </nav>
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

describe("ProductsBreadcrumbs", () => {
    beforeEach(() => {
        vi.mocked(usePathname).mockReturnValue("/productos")
        vi.mocked(useParams).mockReturnValue({})
    })

    it("should render root products breadcrumbs", () => {
        render(<ProductsBreadcrumbs />)

        expect(screen.getByTestId("breadcrumb")).toBeInTheDocument()
        expect(screen.getByTestId("breadcrumb")).toHaveAttribute(
            "data-current-item-class",
            "[&>span]:text-blue-500 [&>span]:font-semibold",
        )
        expect(screen.getByText("Home")).toBeInTheDocument()
        expect(screen.getByText("Todos los productos")).toHaveAttribute("data-current", "true")
    })

    it("should render category breadcrumb", () => {
        vi.mocked(usePathname).mockReturnValue("/productos/categoria/electronics")
        vi.mocked(useParams).mockReturnValue({ category: "electronics" })

        render(<ProductsBreadcrumbs />)

        expect(screen.getByText("Electronics")).toHaveAttribute("data-current", "true")
        expect(screen.getByText("Productos")).toHaveAttribute("data-current", "false")
    })

    it("should render subcategory breadcrumb", () => {
        vi.mocked(usePathname).mockReturnValue("/productos/categoria/electronics/phones")
        vi.mocked(useParams).mockReturnValue({ category: "electronics", subcategory: "phones" })

        render(<ProductsBreadcrumbs />)

        expect(screen.getByText("Electronics")).toHaveAttribute("data-current", "false")
        expect(screen.getByText("Phones")).toHaveAttribute("data-current", "true")
    })

    it("should render nothing outside products paths", () => {
        vi.mocked(usePathname).mockReturnValue("/ofertas")

        const { container } = render(<ProductsBreadcrumbs />)

        expect(container.firstChild).toBeNull()
    })
})
