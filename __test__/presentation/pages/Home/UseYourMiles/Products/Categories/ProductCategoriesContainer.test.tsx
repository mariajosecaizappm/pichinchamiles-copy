import ProductCategoriesContainer from "@/presentation/pages/Home/UseYourMiles/Products/Categories/ProductCategoriesContainer"
import { Category } from "@/domain/entity/Category/structure/category"
import Categorization from "@/domain/entity/Category/models/Categorization"
import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mockGetCategorization = vi.fn()

vi.mock("@/presentation/pages/Products/lib/getCategorization", () => ({
    default: () => mockGetCategorization(),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/Categories/ProductCategories", () => ({
    default: ({ categories, className, wrapperClassName }: { categories: Category[], className?: string, wrapperClassName?: string }) => (
        <div
            data-testid="product-categories"
            data-categories={JSON.stringify(categories)}
            data-classname={className}
            data-wrapper={wrapperClassName}
        >
            Product Categories
        </div>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/Categories/ProductCategoriesSkeleton", () => ({
    default: () => <div data-testid="product-categories-skeleton">Loading Categories...</div>,
}))

describe("ProductCategoriesContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should call getCategorization", async () => {
        const mockCategories: Category[] = [
            { id: "1", name: "Electronics", slug: "electronics", parent: null },
        ]
        mockGetCategorization.mockResolvedValue(new Categorization(mockCategories))

        await ProductCategoriesContainer({})

        expect(mockGetCategorization).toHaveBeenCalled()
    })

    it("should render ProductCategories with category groups on success", async () => {
        const mockCategories: Category[] = [
            { id: "1", name: "Electronics", slug: "electronics", parent: null },
            { id: "2", name: "Home", slug: "home", parent: null },
        ]
        const mockCategorization = new Categorization(mockCategories)
        mockGetCategorization.mockResolvedValue(mockCategorization)

        const result = await ProductCategoriesContainer({})
        render(result)

        expect(screen.getByTestId("product-categories")).toBeInTheDocument()

        const categoriesElement = screen.getByTestId("product-categories")
        const categoriesData = JSON.parse(categoriesElement.getAttribute("data-categories") || "[]")

        expect(categoriesData).toEqual(mockCategorization.categoryGroups)
    })

    it("should forward className prop to ProductCategories", async () => {
        const mockCategories: Category[] = [
            { id: "1", name: "Electronics", slug: "electronics", parent: null },
        ]
        mockGetCategorization.mockResolvedValue(new Categorization(mockCategories))

        const result = await ProductCategoriesContainer({ className: "custom-class" })
        render(result)

        const categoriesElement = screen.getByTestId("product-categories")
        expect(categoriesElement).toHaveAttribute("data-classname", "custom-class")
    })

    it("should forward wrapperClassName prop to ProductCategories", async () => {
        const mockCategories: Category[] = [
            { id: "1", name: "Electronics", slug: "electronics", parent: null },
        ]
        mockGetCategorization.mockResolvedValue(new Categorization(mockCategories))

        const result = await ProductCategoriesContainer({ wrapperClassName: "wrapper-class" })
        render(result)

        const categoriesElement = screen.getByTestId("product-categories")
        expect(categoriesElement).toHaveAttribute("data-wrapper", "wrapper-class")
    })

    it("should forward both className and wrapperClassName props", async () => {
        const mockCategories: Category[] = [
            { id: "1", name: "Electronics", slug: "electronics", parent: null },
        ]
        mockGetCategorization.mockResolvedValue(new Categorization(mockCategories))

        const result = await ProductCategoriesContainer({
            className: "custom-class",
            wrapperClassName: "wrapper-class",
        })
        render(result)

        const categoriesElement = screen.getByTestId("product-categories")
        expect(categoriesElement).toHaveAttribute("data-classname", "custom-class")
        expect(categoriesElement).toHaveAttribute("data-wrapper", "wrapper-class")
    })

    it("should render ProductCategoriesSkeleton on error", async () => {
        mockGetCategorization.mockRejectedValue(new Error("Failed to fetch categories"))

        const result = await ProductCategoriesContainer({})
        render(result)

        expect(screen.getByTestId("product-categories-skeleton")).toBeInTheDocument()
        expect(screen.queryByTestId("product-categories")).not.toBeInTheDocument()
    })

    it("should handle empty categories array", async () => {
        mockGetCategorization.mockResolvedValue(new Categorization([]))

        const result = await ProductCategoriesContainer({})
        render(result)

        expect(screen.getByTestId("product-categories")).toBeInTheDocument()

        const categoriesElement = screen.getByTestId("product-categories")
        const categoriesData = JSON.parse(categoriesElement.getAttribute("data-categories") || "[]")

        expect(categoriesData).toEqual([])
    })
})
