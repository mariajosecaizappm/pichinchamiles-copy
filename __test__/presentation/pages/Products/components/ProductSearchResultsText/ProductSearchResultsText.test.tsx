import type { Category } from "@/domain/entity/Category/structure/category"
import ProductSearchResultsText from "@/presentation/pages/Products/components/ProductSearchResultsText"
import ProductsProvider from "@/presentation/pages/Products/context/ProductsProvider"
import { render, screen } from "@testing-library/react"
import type { ReactElement } from "react"
import { useParams, usePathname } from "next/navigation"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("next/navigation", () => ({
    usePathname: vi.fn(),
    useParams: vi.fn(),
}))

const categoriesFixture: Category[] = [
    { id: "1", name: "Electronics", slug: "electronics", parent: null },
    { id: "2", name: "Phones", slug: "phones", parent: { id: "1", slug: "electronics" } },
    { id: "3", name: "Smartphones", slug: "smartphones", parent: { id: "2", slug: "phones" } },
]

const renderWithProvider = (
    ui: ReactElement,
    categories: Category[] = categoriesFixture,
) => render(<ProductsProvider categories={categories}>{ui}</ProductsProvider>)

describe("ProductSearchResultsText", () => {
    beforeEach(() => {
        vi.mocked(usePathname).mockReturnValue("/productos")
        vi.mocked(useParams).mockReturnValue({})
    })

    it("should render the search query while loading", () => {
        renderWithProvider(<ProductSearchResultsText searchQuery="maleta" total={9} isLoading />)

        expect(screen.getByText("Resultado de \u201cmaleta\u201d")).toBeInTheDocument()
    })

    it("should render the search query and total when loading finishes", () => {
        renderWithProvider(<ProductSearchResultsText searchQuery="maleta" total={9} />)

        expect(screen.getByText("Resultado de \u201cmaleta\u201d (9)")).toBeInTheDocument()
    })

    it("should render empty results text when total is zero", () => {
        renderWithProvider(<ProductSearchResultsText searchQuery="maleta" total={0} />)

        expect(screen.getByText("No se encontraron resultados")).toBeInTheDocument()
    })

    it("should render todos label when search query is empty on products root", () => {
        renderWithProvider(<ProductSearchResultsText searchQuery="" total={9} />)

        expect(screen.getByText("Todos los productos (9)")).toBeInTheDocument()
    })

    it("should render category name when search query is empty on category route", () => {
        vi.mocked(usePathname).mockReturnValue("/productos/categoria/electronics")
        vi.mocked(useParams).mockReturnValue({ category: "electronics" })

        renderWithProvider(<ProductSearchResultsText searchQuery="" total={4} />)

        expect(screen.getByText("Electronics (4)")).toBeInTheDocument()
    })

    it("should render subcategory name when search query is empty on subcategory route", () => {
        vi.mocked(usePathname).mockReturnValue("/productos/categoria/phones/smartphones")
        vi.mocked(useParams).mockReturnValue({
            category: "phones",
            subcategory: "smartphones",
        })

        renderWithProvider(<ProductSearchResultsText searchQuery="" total={2} />)

        expect(screen.getByText("Smartphones (2)")).toBeInTheDocument()
    })

    it("should render nothing when search query is empty and path is not productos", () => {
        vi.mocked(usePathname).mockReturnValue("/otra-ruta")

        const { container } = renderWithProvider(<ProductSearchResultsText searchQuery="" total={9} />)

        expect(container.firstChild).toBeNull()
    })
})
