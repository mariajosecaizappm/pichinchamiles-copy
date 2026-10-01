import { describe, it, expect, vi } from "vitest";
import links from "@/presentation/config/links";
import { render, screen } from "@testing-library/react";
import EmptyShoppingCart from "@/presentation/pages/ShoppingCartDetail/components/EmptyShoppingCart";

vi.mock("next/link", () => ({
    default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
        <a href={href} className={className}>{children}</a>
    ),
}))

vi.mock("@/presentation/components/Form/components/Button/Button", () => ({
    default: ({ children, color, className }: { children: React.ReactNode; color?: string; className?: string }) => (
        <button data-color={color} className={className}>{children}</button>
    ),
}))

vi.mock("@/presentation/components/icons/IconEmptyCart", () => ({
    default: ({ className }: { className?: string }) => (
        <svg data-testid="icon-empty-cart" className={className} />
    ),
}))

vi.mock("@/presentation/pages/ShoppingCartDetail/components/ShoppingCartRecommendedProducts", () => ({
    default: () => <div data-testid="recommended-products" />,
}))

describe("EmptyShoppingCart", () => {
    it("should render the empty cart icon", () => {
        render(<EmptyShoppingCart />)
        expect(screen.getByTestId("icon-empty-cart")).toBeInTheDocument()
    })

    it("should display 'Carrito vacío' heading", () => {
        render(<EmptyShoppingCart />)
        expect(screen.getByRole("heading", { name: "Carrito vacío" })).toBeInTheDocument()
    })

    it("should display the descriptive message", () => {
        render(<EmptyShoppingCart />)
        expect(screen.getByText(/Aún no tienes productos/i)).toBeInTheDocument()
    })

    it("should render the link to product catalog", () => {
        render(<EmptyShoppingCart />)
        const link = screen.getByRole("link")
        expect(link).toHaveAttribute("href", links.productsList)
    })

    it("should render 'Ir al catálogo de productos' button inside the link", () => {
        render(<EmptyShoppingCart />)
        expect(screen.getByRole("button", { name: "Ir al catálogo de productos" })).toBeInTheDocument()
    })

    it("should render the ShoppingCartRecommendedProducts component", () => {
        render(<EmptyShoppingCart />)
        expect(screen.getByTestId("recommended-products")).toBeInTheDocument()
    })

    it("should render the section with border styling", () => {
        const { container } = render(<EmptyShoppingCart />)
        const section = container.querySelector("section")
        expect(section).toBeInTheDocument()
        expect(section?.className).toContain("border")
    })

    it("should pass dimension className to the icon", () => {
        const { container } = render(<EmptyShoppingCart />)
        const iconWrapper = container.querySelector(".h-\\[47px\\]")
        expect(iconWrapper).toBeInTheDocument()
    })
})
