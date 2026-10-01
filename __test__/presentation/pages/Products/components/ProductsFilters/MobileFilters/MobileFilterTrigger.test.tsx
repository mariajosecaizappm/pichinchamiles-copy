import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import MobileFilterTrigger from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/MobileFilterTrigger"

describe("MobileFilterTrigger", () => {
    it("should render children label", () => {
        render(<MobileFilterTrigger>Filtros</MobileFilterTrigger>)
        expect(screen.getByText("Filtros")).toBeInTheDocument()
    })

    it("should not render count chip when count is 0", () => {
        render(<MobileFilterTrigger count={0}>Filtros</MobileFilterTrigger>)
        expect(screen.queryByText("0")).not.toBeInTheDocument()
    })

    it("should render count chip when count > 0", () => {
        render(<MobileFilterTrigger count={3}>Filtros</MobileFilterTrigger>)
        expect(screen.getByText("3")).toBeInTheDocument()
    })

    it("should call onClick handler when pressed", () => {
        const onClick = vi.fn()
        render(<MobileFilterTrigger onClick={onClick}>Filtros</MobileFilterTrigger>)
        fireEvent.click(screen.getByRole("button"))
        expect(onClick).toHaveBeenCalled()
    })

    it("should apply active background class when count > 0", () => {
        render(<MobileFilterTrigger count={2}>Filtros</MobileFilterTrigger>)
        expect(screen.getByRole("button").className).toContain("bg-darkGrayishBlue-100")
    })
})
