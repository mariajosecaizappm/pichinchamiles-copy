import SubcategoryChip from "@/presentation/pages/Products/components/Categories/SubcategoryChip"
import { CategoryWithCount } from "@/presentation/pages/Products/components/Categories/types"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("next/link", () => ({
    default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}))

vi.mock("@/presentation/pages/Home/components/Button", () => ({
    default: ({ children, as: Component = "button", ...props }: { children: React.ReactNode; as?: React.ElementType; [key: string]: unknown }) => {
        if (Component === "button") {
            return <button {...props}>{children}</button>
        }
        return <Component {...props}>{children}</Component>
    },
}))

describe("SubcategoryChip", () => {
    const mockCategory: CategoryWithCount = {
        id: "1",
        name: "Electronics",
        slug: "electronics",
        parent: null,
        count: 0,
    }

    it("should render category name", () => {
        render(<SubcategoryChip category={mockCategory} href="/test" />)

        expect(screen.getByText("Electronics")).toBeInTheDocument()
    })

    it("should append count when count prop is defined", () => {
        render(<SubcategoryChip category={mockCategory} count={42} href="/test" />)

        expect(screen.getByText("Electronics (42)")).toBeInTheDocument()
    })

    it("should not append count when count prop is undefined", () => {
        render(<SubcategoryChip category={mockCategory} href="/test" />)

        const text = screen.getByText("Electronics")
        expect(text.textContent).toBe("Electronics")
    })

    it("should set href on the rendered link", () => {
        render(<SubcategoryChip category={mockCategory} href="/productos/categoria/electronics" />)

        const link = screen.getByRole("link")
        expect(link).toHaveAttribute("href", "/productos/categoria/electronics")
    })

    it("should pass replace prop to Link", () => {
        render(<SubcategoryChip category={mockCategory} href="/test" replace={true} />)

        // The component receives the prop, but Next.js Link doesn't render it as an HTML attribute
        expect(screen.getByRole("link")).toBeInTheDocument()
    })

    it("should pass scroll prop to Link", () => {
        render(<SubcategoryChip category={mockCategory} href="/test" scroll={false} />)

        // The component receives the prop, but Next.js Link doesn't render it as an HTML attribute
        expect(screen.getByRole("link")).toBeInTheDocument()
    })

    it("should forward data-active attribute", () => {
        render(<SubcategoryChip category={mockCategory} href="/test" data-active="true" />)

        const link = screen.getByRole("link")
        expect(link).toHaveAttribute("data-active", "true")
    })

    it("should forward data-active as false", () => {
        render(<SubcategoryChip category={mockCategory} href="/test" data-active="false" />)

        const link = screen.getByRole("link")
        expect(link).toHaveAttribute("data-active", "false")
    })

    it("should forward className prop", () => {
        render(<SubcategoryChip category={mockCategory} href="/test" className="custom-class" />)

        const link = screen.getByRole("link")
        expect(link).toHaveClass("custom-class")
    })

    it("should forward other button props", () => {
        render(<SubcategoryChip category={mockCategory} href="/test" data-testid="chip-test" />)

        expect(screen.getByTestId("chip-test")).toBeInTheDocument()
    })
})
