import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import BrandFilter from "@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/Brands/BrandFilter"

const mockOnCheckBrand = vi.fn()
const mockSetShowAllBrands = vi.fn()
const mockOnPressBrand = vi.fn()

const defaultProps = {
    isLoading: false,
    brands: [] as Array<{ id: string; name: string; slug: string }>,
    showAllBrands: false,
    currentBrand: "",
    onCheckBrand: mockOnCheckBrand,
    setShowAllBrands: mockSetShowAllBrands,
    isPending: false,
    onPressBrand: mockOnPressBrand,
}

vi.mock("@/presentation/pages/Products/components/ProductsFilters/FilterAccordion", () => ({
    default: ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div data-testid="accordion" data-title={title}>{children}</div>
    ),
}))

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Brands/ShowAllFilters", () => ({
    default: ({ showAll, setShowAll }: { showAll: boolean; setShowAll: (v: boolean) => void }) => (
        <button data-testid="show-all-brands" onClick={() => setShowAll(!showAll)}>Toggle</button>
    ),
}))

vi.mock("@/presentation/components/Form/components/Radio", () => ({
    Radio: ({ value, children }: { value: string; children: React.ReactNode }) => (
        <label data-testid={`radio-${value}`}>{children}</label>
    ),
}))

vi.mock("@heroui/react", async () => {
    const actual = await vi.importActual<Record<string, unknown>>("@heroui/react")
    return {
        ...actual,
        RadioGroup: ({ value, onValueChange, children }: { value: string | null; onValueChange: (v: string) => void; children: React.ReactNode }) => (
            <div data-testid="radio-group" data-value={String(value)}>
                <button data-testid="change-b1" onClick={() => onValueChange("b1")}>b1</button>
                {children}
            </div>
        ),
    }
})

describe("BrandFilter", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render the accordion with brands when loaded", () => {
        const props = {
            ...defaultProps,
            brands: [
                { id: "b1", name: "Brand 1", slug: "brand-1" },
                { id: "b2", name: "Brand 2", slug: "brand-2" },
            ],
        }
        render(<BrandFilter {...props} />)
        expect(screen.getByTestId("accordion")).toHaveAttribute("data-title", "Marcas")
        expect(screen.getByTestId("radio-b1")).toBeInTheDocument()
        expect(screen.getByTestId("radio-b2")).toBeInTheDocument()
    })

    it("should render skeletons while loading", () => {
        const props = { ...defaultProps, isLoading: true }
        const { container } = render(<BrandFilter {...props} />)
        expect(container.querySelectorAll(".w-full.h-12").length).toBeGreaterThan(0)
    })

    it("should reflect current brand selection in the RadioGroup", () => {
        const props = {
            ...defaultProps,
            brands: [{ id: "b1", name: "Brand 1", slug: "brand-1" }],
            currentBrand: "b1",
        }
        render(<BrandFilter {...props} />)
        expect(screen.getByTestId("radio-group")).toHaveAttribute("data-value", "b1")
    })

    it("should call onCheckBrand when selecting a new brand", () => {
        const props = {
            ...defaultProps,
            brands: [{ id: "b1", name: "Brand 1", slug: "brand-1" }],
        }
        render(<BrandFilter {...props} />)
        fireEvent.click(screen.getByTestId("change-b1"))
        expect(mockOnCheckBrand).toHaveBeenCalledWith("b1")
    })

    it("should show ShowAllBrands when brands exceed DEFAULT_BRANDS_TO_SHOW", () => {
        const brands = []
        for (let i = 1; i <= 12; i++) {
            brands.push({ id: `b${i}`, name: `Brand ${i}`, slug: `brand-${i}` })
        }
        const props = { ...defaultProps, brands }
        render(<BrandFilter {...props} />)
        expect(screen.getByTestId("show-all-brands")).toBeInTheDocument()
    })

    it("should NOT show ShowAllBrands when brands are within limit", () => {
        const props = {
            ...defaultProps,
            brands: [
                { id: "b1", name: "Brand 1", slug: "brand-1" },
                { id: "b2", name: "Brand 2", slug: "brand-2" },
            ],
        }
        render(<BrandFilter {...props} />)
        expect(screen.queryByTestId("show-all-brands")).not.toBeInTheDocument()
    })

    it("should call setShowAllBrands when clicking ShowAllBrands", () => {
        const brands = []
        for (let i = 1; i <= 12; i++) {
            brands.push({ id: `b${i}`, name: `Brand ${i}`, slug: `brand-${i}` })
        }
        const props = { ...defaultProps, brands, showAllBrands: false }
        render(<BrandFilter {...props} />)
        fireEvent.click(screen.getByTestId("show-all-brands"))
        expect(mockSetShowAllBrands).toHaveBeenCalledWith(true)
    })
})
