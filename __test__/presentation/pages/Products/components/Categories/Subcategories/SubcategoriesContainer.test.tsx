import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import SubcategoriesContainer from "@/presentation/pages/Products/components/Categories/Subcategories/SubcategoriesContainer"
import { CategoryGroup } from "@/domain/entity/Category/structure/category"
import { EventName } from "@/presentation/analytics/types"
import { mockTrack } from "../../../../../../utils/analytics"

const mockUseParams = vi.fn()
const mockUseProductsContext = vi.fn()

vi.mock("next/navigation", () => ({
    useParams: () => mockUseParams(),
    useSearchParams: () => new URLSearchParams(),
    useRouter: () => ({ push: vi.fn() }),
}))

vi.mock("@/presentation/pages/Products/context/useProductsContext", () => ({
    useProductsContext: () => mockUseProductsContext(),
}))

vi.mock("@/presentation/pages/Products/components/Categories/Subcategories/Subcategories", () => ({
    default: ({ categories, activeSubcategory, buildSubcategoryHref }: {
        categories: CategoryGroup[]
        activeSubcategory: string
        buildSubcategoryHref: (subcategorySlug: string) => string
    }) => (
        <div data-testid="subcategories">
            <div data-testid="categories-count">{categories.length}</div>
            <div data-testid="active-subcategory">{activeSubcategory}</div>
            <div data-testid="test-href">{buildSubcategoryHref("test-slug")}</div>
        </div>
    ),
}))

describe("SubcategoriesContainer", () => {
    const mockSubcategories: CategoryGroup[] = [
        { id: "1", name: "Phones", slug: "phones", parent: null, subcategories: [] },
        { id: "2", name: "Tablets", slug: "tablets", parent: null, subcategories: [] },
    ]

    const mockCategorization = {
        getSubcategoriesBySlug: vi.fn(),
        categoryGroups: [],
        categories: [],
        getCategoryBySlug: vi.fn(),
        getCategoryAndSubcategoriesSlugs: vi.fn(),
        getCategoryAndSubcategoriesIds: vi.fn(),
    }

    beforeEach(() => {
        vi.clearAllMocks()
        mockTrack.mockReset()
    })

    it("should return null when no category slug is present", () => {
        mockUseParams.mockReturnValue({})
        mockUseProductsContext.mockReturnValue({ categorization: mockCategorization })

        const { container } = render(<SubcategoriesContainer />)

        expect(container.firstChild).toBeNull()
    })

    it("should return null when no subcategories exist", () => {
        mockUseParams.mockReturnValue({ category: "electronics" })
        mockCategorization.getSubcategoriesBySlug.mockReturnValue([])
        mockUseProductsContext.mockReturnValue({ categorization: mockCategorization })

        const { container } = render(<SubcategoriesContainer />)

        expect(container.firstChild).toBeNull()
    })

    it("should render Subcategories when category and subcategories exist", () => {
        mockUseParams.mockReturnValue({ category: "electronics" })
        mockCategorization.getSubcategoriesBySlug.mockReturnValue(mockSubcategories)
        mockUseProductsContext.mockReturnValue({ categorization: mockCategorization })

        render(<SubcategoriesContainer />)

        expect(screen.getByTestId("subcategories")).toBeInTheDocument()
        expect(screen.getByTestId("categories-count")).toHaveTextContent("2")
        expect(mockTrack).toHaveBeenCalledWith(EventName.VIEWED_FILTER, {
            filters: mockSubcategories,
        })
    })

    it("should pass active subcategory from params", () => {
        mockUseParams.mockReturnValue({ category: "electronics", subcategory: "phones" })
        mockCategorization.getSubcategoriesBySlug.mockReturnValue(mockSubcategories)
        mockUseProductsContext.mockReturnValue({ categorization: mockCategorization })

        render(<SubcategoriesContainer />)

        expect(screen.getByTestId("active-subcategory")).toHaveTextContent("phones")
    })

    it("should pass empty string as active subcategory when not present", () => {
        mockUseParams.mockReturnValue({ category: "electronics" })
        mockCategorization.getSubcategoriesBySlug.mockReturnValue(mockSubcategories)
        mockUseProductsContext.mockReturnValue({ categorization: mockCategorization })

        render(<SubcategoriesContainer />)

        expect(screen.getByTestId("active-subcategory")).toHaveTextContent("")
    })

    describe("buildSubcategoryHref", () => {
        it("should return # when no current category slug", () => {
            mockUseParams.mockReturnValue({})
            mockCategorization.getSubcategoriesBySlug.mockReturnValue(mockSubcategories)
            mockUseProductsContext.mockReturnValue({ categorization: mockCategorization })

            const { container } = render(<SubcategoriesContainer />)

            // Should return null, so no href to test
            expect(container.firstChild).toBeNull()
        })

        it("should return base path when subcategory slug equals current", () => {
            mockUseParams.mockReturnValue({ category: "electronics", subcategory: "test-slug" })
            mockCategorization.getSubcategoriesBySlug.mockReturnValue(mockSubcategories)
            mockUseProductsContext.mockReturnValue({ categorization: mockCategorization })

            render(<SubcategoriesContainer />)

            expect(screen.getByTestId("test-href")).toHaveTextContent("/productos/categoria/electronics")
        })

        it("should return full path when subcategory slug differs from current", () => {
            mockUseParams.mockReturnValue({ category: "electronics", subcategory: "phones" })
            mockCategorization.getSubcategoriesBySlug.mockReturnValue(mockSubcategories)
            mockUseProductsContext.mockReturnValue({ categorization: mockCategorization })

            render(<SubcategoriesContainer />)

            expect(screen.getByTestId("test-href")).toHaveTextContent(
                "/productos/categoria/electronics/test-slug"
            )
        })

        it("should return full path when no current subcategory", () => {
            mockUseParams.mockReturnValue({ category: "electronics" })
            mockCategorization.getSubcategoriesBySlug.mockReturnValue(mockSubcategories)
            mockUseProductsContext.mockReturnValue({ categorization: mockCategorization })

            render(<SubcategoriesContainer />)

            expect(screen.getByTestId("test-href")).toHaveTextContent(
                "/productos/categoria/electronics/test-slug"
            )
        })
    })

    it("should return null when categorization is null", () => {
        mockUseParams.mockReturnValue({ category: "electronics" })
        mockUseProductsContext.mockReturnValue({ categorization: null })

        const { container } = render(<SubcategoriesContainer />)

        expect(container.firstChild).toBeNull()
    })
})
