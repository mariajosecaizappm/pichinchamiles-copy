import HeaderStickyWrapper from "@/presentation/pages/Home/components/Header/HeaderStickyWrapper"
import { render, screen } from "@testing-library/react"
import { usePathname } from "next/navigation"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("next/navigation", () => ({
    usePathname: vi.fn(),
}))

describe("HeaderStickyWrapper", () => {
    beforeEach(() => {
        vi.mocked(usePathname).mockReturnValue("/")
    })

    it("should render children inside a header", () => {
        render(<HeaderStickyWrapper>Content</HeaderStickyWrapper>)

        expect(screen.getByRole("banner")).toHaveTextContent("Content")
    })

    it("should apply sticky classes for profile and legal paths", () => {
        vi.mocked(usePathname).mockReturnValue("/mi-perfil")

        render(<HeaderStickyWrapper>Profile</HeaderStickyWrapper>)

        const header = screen.getByRole("banner")
        expect(header).toHaveClass("sticky", "top-0", "z-50")
        expect(header).toHaveClass("lg:sticky", "lg:top-0", "lg:z-50")
    })

    it("should apply sticky classes for products paths", () => {
        vi.mocked(usePathname).mockReturnValue("/productos/categoria/electronics")

        render(<HeaderStickyWrapper>Products</HeaderStickyWrapper>)

        const header = screen.getByRole("banner")
        expect(header).toHaveClass("sticky", "top-0", "z-50")
        expect(header).toHaveClass("lg:sticky", "lg:top-0", "lg:z-50")
    })

    it("should keep header static when path has another sticky element", () => {
        vi.mocked(usePathname).mockReturnValue("/utilice-sus-millas/productos")

        render(<HeaderStickyWrapper>Use your miles</HeaderStickyWrapper>)

        const header = screen.getByRole("banner")
        expect(header).toHaveClass("lg:static")
        expect(header).not.toHaveClass("sticky")
    })
})
