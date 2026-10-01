import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock dependencies
vi.mock("@/presentation/components/Form/context/Form", () => ({
    default: ({
        children,
        onSubmit,
        role,
        "aria-label": ariaLabel,
    }: {
        children: React.ReactNode
        onSubmit: (values: unknown) => void
        role?: string
        "aria-label"?: string
    }) => {
        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault()
            onSubmit({ search: "test" })
        }
        return (
            <form onSubmit={handleSubmit} role={role} aria-label={ariaLabel}>
                {children}
            </form>
        )
    },
}))

vi.mock("@/presentation/components/Form/controls/FormInput", () => ({
    default: ({
        name,
        placeholder,
        startContent,
        "aria-label": ariaLabel,
    }: {
        name: string
        placeholder: string
        startContent: React.ReactNode
        "aria-label"?: string
    }) => (
        <div>
            <input name={name} placeholder={placeholder} aria-label={ariaLabel} data-testid="search-input" />
            <div data-testid="start-content">{startContent}</div>
        </div>
    ),
}))

vi.mock("@/presentation/components/icons/IconSearch", () => ({
    default: () => <span data-testid="search-icon" aria-hidden="true">Search Icon</span>,
}))

import ProductSearchBar from "@/presentation/pages/Home/UseYourMiles/Layout/Tabs/HomeTabsProducts/components/ProductSearchBar"

describe("ProductSearchBar", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render the search input", () => {
        render(<ProductSearchBar />)
        expect(screen.getByTestId("search-input")).toBeInTheDocument()
    })

    it("should render with default placeholder", () => {
        render(<ProductSearchBar />)
        expect(screen.getByPlaceholderText("Busca tu producto")).toBeInTheDocument()
    })

    it("should render with a custom placeholder", () => {
        render(<ProductSearchBar placeholder="Custom placeholder" />)
        expect(screen.getByPlaceholderText("Custom placeholder")).toBeInTheDocument()
    })

    it("should render the search icon", () => {
        render(<ProductSearchBar />)
        expect(screen.getByTestId("search-icon")).toBeInTheDocument()
    })

    it("should call onSearch when the form is submitted with a non-empty value", () => {
        const mockOnSearch = vi.fn()
        const { container } = render(<ProductSearchBar onSearch={mockOnSearch} />)
        const form = container.querySelector("form")
        form?.dispatchEvent(new Event("submit", { bubbles: true }))
        expect(mockOnSearch).toHaveBeenCalledWith("test")
    })

    describe("accessibility", () => {
        it("should have role='search' on the form element", () => {
            render(<ProductSearchBar />)
            expect(screen.getByRole("search")).toBeInTheDocument()
        })

        it("should label the form as 'Buscador de productos'", () => {
            render(<ProductSearchBar />)
            expect(screen.getByRole("search", { name: "Buscador de productos" })).toBeInTheDocument()
        })

        it("should have aria-label='Buscar productos' on the input", () => {
            render(<ProductSearchBar />)
            expect(screen.getByTestId("search-input")).toHaveAttribute("aria-label", "Buscar productos")
        })

        it("should have the search icon marked as aria-hidden to avoid noise for screen readers", () => {
            render(<ProductSearchBar />)
            expect(screen.getByTestId("search-icon")).toHaveAttribute("aria-hidden", "true")
        })
    })
})
