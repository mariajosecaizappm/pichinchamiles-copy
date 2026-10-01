import MobileStickyProductSearchBar from "@/presentation/pages/Products/components/MobileStickyProductSearchBar/MobileStickyProductSearchBar"
import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mockUseSession = vi.hoisted(() => vi.fn())

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar", () => ({
    default: () => <div data-testid="product-search-bar">Search</div>,
}))

describe("MobileStickyProductSearchBar", () => {
    beforeEach(() => {
        mockUseSession.mockReturnValue({ isLogged: false })
    })

    it("should use the anonymous header offset when user is not logged in", () => {
        const { container } = render(<MobileStickyProductSearchBar />)

        expect(screen.getByTestId("product-search-bar")).toBeInTheDocument()
        expect(container.firstChild).toHaveClass("sticky", "top-[61px]", "lg:hidden")
    })

    it("should use the logged header offset when user is logged in", () => {
        mockUseSession.mockReturnValue({ isLogged: true })

        const { container } = render(<MobileStickyProductSearchBar />)

        expect(container.firstChild).toHaveClass("top-[97px]")
    })
})
