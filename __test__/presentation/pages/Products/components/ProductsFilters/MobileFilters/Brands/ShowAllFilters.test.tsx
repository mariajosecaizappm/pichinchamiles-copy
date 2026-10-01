import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@heroui/react", () => ({
    Button: ({
        children,
        onPress,
        endContent,
        className,
    }: {
        children: React.ReactNode
        onPress: () => void
        endContent?: React.ReactNode
        className?: string
    }) => (
        <button data-testid="show-all-button" onClick={onPress} className={className}>
            {endContent}
            {children}
        </button>
    ),
}))

import ShowAllFilters from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Brands/ShowAllFilters"

describe("ShowAllFilters", () => {
    it("should render 'Ver todos' when showAll is false", () => {
        render(<ShowAllFilters showAll={false} setShowAll={vi.fn()} />)

        expect(screen.getByText("Ver todos")).toBeInTheDocument()
    })

    it("should render 'Ver menos' when showAll is true", () => {
        render(<ShowAllFilters showAll={true} setShowAll={vi.fn()} />)

        expect(screen.getByText("Ver menos")).toBeInTheDocument()
    })

    it("should call setShowAll with true when showAll is false and button is clicked", () => {
        const setShowAll = vi.fn()
        render(<ShowAllFilters showAll={false} setShowAll={setShowAll} />)

        fireEvent.click(screen.getByTestId("show-all-button"))

        expect(setShowAll).toHaveBeenCalledWith(true)
    })

    it("should call setShowAll with false when showAll is true and button is clicked", () => {
        const setShowAll = vi.fn()
        render(<ShowAllFilters showAll={true} setShowAll={setShowAll} />)

        fireEvent.click(screen.getByTestId("show-all-button"))

        expect(setShowAll).toHaveBeenCalledWith(false)
    })
})
