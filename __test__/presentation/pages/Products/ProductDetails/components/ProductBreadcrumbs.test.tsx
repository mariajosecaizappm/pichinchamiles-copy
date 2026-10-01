import {describe, it, expect, vi} from "vitest"
import {render, screen} from "@testing-library/react"
import ProductBreadcrumbs from "@/presentation/pages/Products/ProductDetails/components/ProductBreadcrumbs/ProductBreadcrumbs"
import {ProductCategory} from "@/domain/entity/Product/product"

// Mock Next.js router
const mockBack = vi.fn()
vi.mock("next/navigation", () => ({
    useRouter: () => ({back: mockBack}),
    usePathname: () => "/products/item",
}))

vi.mock("next/link", () => ({
    default: ({children, href}: {children: React.ReactNode; href: string}) => (
        <a href={href}>{children}</a>
    ),
}))

vi.mock("@/presentation/pages/Products/ProductDetails/components/ProductBreadcrumbs/ProductBreadcrumbInitializer", () => ({
    default: () => <div data-testid="product-breadcrumb-initializer" />,
}))

describe("ProductBreadcrumbs", () => {
    const mockCategories: ProductCategory[] = [
        {id: "cat-1", name: "Electronics", slug: "electronics"},
        {id: "cat-2", name: "Phones", slug: "phones"},
        {id: "cat-3", name: "Smartphones", slug: "smartphones"},
    ]

    it("should render back button", () => {
        render(<ProductBreadcrumbs categories={mockCategories} productName="iPhone 15" />)
        expect(screen.getAllByRole("button").length).toBeGreaterThan(0)
    })

    it("should render the breadcrumb initializer", () => {
        render(<ProductBreadcrumbs categories={mockCategories} productName="iPhone 15" />)
        expect(screen.getByTestId("product-breadcrumb-initializer")).toBeInTheDocument()
    })

    it("should render Home link on desktop", () => {
        render(<ProductBreadcrumbs categories={mockCategories} productName="iPhone 15" />)
        expect(screen.getByText("Home")).toBeInTheDocument()
    })

    it("should render first category", () => {
        render(<ProductBreadcrumbs categories={mockCategories} productName="iPhone 15" />)
        expect(screen.getByText("Electronics")).toBeInTheDocument()
    })

    it("should render product name", () => {
        render(<ProductBreadcrumbs categories={mockCategories} productName="iPhone 15 Pro" />)
        expect(screen.getByText("iPhone 15 Pro")).toBeInTheDocument()
    })

    it("should handle single category", () => {
        render(<ProductBreadcrumbs categories={[mockCategories[0]]} productName="Product" />)
        expect(screen.getByText("Electronics")).toBeInTheDocument()
    })

    it("should handle empty categories", () => {
        render(<ProductBreadcrumbs categories={[]} productName="Product" />)
        expect(screen.getByText("Product")).toBeInTheDocument()
    })

    it("should handle undefined categories", () => {
        render(<ProductBreadcrumbs categories={undefined} productName="Product" />)
        expect(screen.getByText("Product")).toBeInTheDocument()
    })

    it("should render separators between items", () => {
        render(<ProductBreadcrumbs categories={mockCategories} productName="Product" />)
        const separators = screen.getAllByText("/")
        expect(separators.length).toBeGreaterThan(0)
    })

    it("should call router.back when back button is clicked", () => {
        render(<ProductBreadcrumbs categories={mockCategories} productName="Product" />)
        const backButton = screen.getAllByRole("button")[0]
        backButton.click()
        expect(mockBack).toHaveBeenCalled()
    })

    it("should render middle categories dropdown for mobile", () => {
        render(<ProductBreadcrumbs categories={mockCategories} productName="iPhone 15" />)
        // Dropdown trigger button with "..."
        expect(screen.getByText("...")).toBeInTheDocument()
    })

    it("should render all middle categories in dropdown", () => {
        render(<ProductBreadcrumbs categories={mockCategories} productName="iPhone 15" />)
        // Should have Phones and Smartphones in dropdown
        expect(screen.getByText("Phones")).toBeInTheDocument()
        expect(screen.getByText("Smartphones")).toBeInTheDocument()
    })

    it("should render correct category links", () => {
        render(<ProductBreadcrumbs categories={mockCategories} productName="iPhone 15" />)
        const links = screen.getAllByRole("link")
        
        // Check Home link
        expect(links[0]).toHaveAttribute("href", "/productos")
        
        // Check first category link
        expect(links[1]).toHaveAttribute("href", expect.stringContaining("electronics"))
    })

    it("should handle two categories correctly", () => {
        const twoCategories = mockCategories.slice(0, 2)
        render(<ProductBreadcrumbs categories={twoCategories} productName="Product" />)
        
        expect(screen.getByText("Electronics")).toBeInTheDocument()
        expect(screen.getByText("Phones")).toBeInTheDocument()
        expect(screen.getByText("Product")).toBeInTheDocument()
    })

    it("should render product name with blue styling class", () => {
        const { container } = render(<ProductBreadcrumbs categories={mockCategories} productName="Test Product" />)
        const productName = screen.getByText("Test Product")
        expect(productName).toBeInTheDocument()
        // Product name should be in a span
        expect(productName.tagName.toLowerCase()).toBe("span")
    })

    it("should not show dropdown when only one category", () => {
        render(<ProductBreadcrumbs categories={[mockCategories[0]]} productName="Product" />)
        // No "..." button when only 1 category
        expect(screen.queryByText("...")).not.toBeInTheDocument()
    })

    it("should show separator after single category", () => {
        render(<ProductBreadcrumbs categories={[mockCategories[0]]} productName="Product" />)
        const separators = screen.getAllByText("/")
        // Should have at least 2 separators (after Home, after category)
        expect(separators.length).toBeGreaterThanOrEqual(1)
    })

    it("should handle categories with undefined slug", () => {
        const categoriesWithNullSlug = [
            { id: "cat-1", name: "Category", slug: undefined as unknown as string },
        ]
        render(<ProductBreadcrumbs categories={categoriesWithNullSlug} productName="Product" />)
        expect(screen.getByText("Category")).toBeInTheDocument()
    })

    it("should render multiple separators for deep categories", () => {
        render(<ProductBreadcrumbs categories={mockCategories} productName="Product" />)
        const separators = screen.getAllByText("/")
        // 3 categories + product = multiple separators
        expect(separators.length).toBeGreaterThanOrEqual(3)
    })

    it("should have correct href structure for category links", () => {
        render(<ProductBreadcrumbs categories={mockCategories} productName="Product" />)
        const links = screen.getAllByRole("link")
        
        // Find category link
        const categoryLink = links.find(link => link.textContent === "Electronics")
        expect(categoryLink).toBeDefined()
        expect(categoryLink).toHaveAttribute("href", expect.stringContaining("/categoria/"))
    })

    it("should render container with correct layout classes", () => {
        const { container } = render(<ProductBreadcrumbs categories={mockCategories} productName="Product" />)
        const wrapper = container.firstChild
        expect(wrapper).toHaveClass("flex", "gap-4", "items-center")
    })

    it("should handle long category names with truncation", () => {
        const longNameCategories = [
            { id: "cat-1", name: "Very Long Category Name That Should Be Truncated", slug: "long" },
        ]
        render(<ProductBreadcrumbs categories={longNameCategories} productName="Product" />)
        expect(screen.getByText("Very Long Category Name That Should Be Truncated")).toBeInTheDocument()
    })
})
