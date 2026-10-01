import { fireEvent, render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import ProductCategories from "@/presentation/pages/Home/UseYourMiles/Products/Categories/ProductCategories"
import type { Category } from "@/domain/entity/Category/structure/category"
import { useSearchParams, usePathname, useParams } from "next/navigation"
import { EventName } from "@/presentation/analytics/types"
import { mockTrack } from "../../../../../../../utils/analytics"

// Mock dependencies
vi.mock("@/presentation/pages/Home/UseYourMiles/Layout/Tabs/components/CarouselCategories", () => ({
    default: ({ items, itemClassName }: { items: React.ReactNode[]; itemClassName: string }) => (
        <div data-testid="carousel-categories" data-item-class={itemClassName}>
            {items.map((item, index) => (
                <div key={index} data-testid={`carousel-item-${index}`}>
                    {item}
                </div>
            ))}
        </div>
    ),
}))


vi.mock("next/navigation", () => ({
    useSearchParams: vi.fn(),
    usePathname: vi.fn(),
    useParams: vi.fn(),
}))


vi.mock("@/presentation/pages/Home/UseYourMiles/Layout/components/CategoryPill", () => ({
    default: ({ label, href, icon, onClick }: { label: string; href: string; icon: React.ReactNode; onClick?: () => void }) => (
        <a data-testid="category-pill" href={href} onClick={onClick}>
            <span>{label}</span>
            <span data-testid="category-icon-wrapper">{icon}</span>
        </a>
    ),
}))

vi.mock("@/presentation/components/icons/Icon", () => ({
    Icon: ({ name, size }: { name: string; size: number }) => (
        <div data-testid="icon" data-name={name} data-size={size}>
            Icon: {name} ({size})
        </div>
    ),
}))

vi.mock("@/presentation/config/links", () => ({
    default: {
        shoppingProducts: "/shopping/products",
        productsList: "/shopping/products",
    },
}))

vi.mock("@/presentation/hooks/useIsDesktop", () => ({
    default: () => ({ isDesktop: false }),
}))

const mockCategories: Category[] = [
    {
        id: "1",
        name: "Electronics",
        slug: "electronics",
        parent: null,
        icon: "electronics",
    },
    {
        id: "2",
        name: "Home",
        slug: "home",
        parent: null,
        icon: "home",
    },
]

describe("ProductCategories", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockTrack.mockReset()
        vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams() as unknown as ReturnType<typeof useSearchParams>)
        vi.mocked(usePathname).mockReturnValue("/")
        vi.mocked(useParams).mockReturnValue({})
    })

    it("should render carousel with categories", () => {
        render(<ProductCategories categories={mockCategories} />)
        
        expect(screen.getByTestId("carousel-categories")).toBeInTheDocument()
        expect(screen.getByTestId("carousel-item-0")).toBeInTheDocument()
        expect(screen.getByTestId("carousel-item-1")).toBeInTheDocument()
    })

    it("should render category pills with correct content", () => {
        render(<ProductCategories categories={mockCategories} />)
        
        expect(screen.getByText("Electronics")).toBeInTheDocument()
        expect(screen.getByText("Home")).toBeInTheDocument()
        expect(screen.getAllByTestId("icon")).toHaveLength(2)
    })

    it("should render icon with correct props", () => {
        render(<ProductCategories categories={mockCategories} />)
        
        const icons = screen.getAllByTestId("icon")
        expect(icons[0]).toHaveAttribute("data-name", "icon-electronics")
        expect(icons[0]).toHaveAttribute("data-size", "24")
    })

    it("should render category pills with correct href", () => {
        render(<ProductCategories categories={mockCategories} />)
        
        const pills = screen.getAllByTestId("category-pill")
        expect(pills).toHaveLength(3)
        expect(pills[0]).toHaveAttribute("href", "/shopping/products")
        expect(pills[1]).toHaveAttribute("href", "/shopping/products/categoria/electronics")
        expect(pills[2]).toHaveAttribute("href", "/shopping/products/categoria/home")
    })

    it("should still render categories even when icon prop is missing", () => {
        const categoriesWithoutIcon: Category[] = [
            {
                id: "1",
                name: "No Icon",
                slug: "no-icon",
                parent: null,
            },
        ]

        render(<ProductCategories categories={categoriesWithoutIcon} />)
        
        expect(screen.getByText("No Icon")).toBeInTheDocument()
        // Icon is always rendered, falls back to "icon-undefined" when no icon is provided
        const icon = screen.getByTestId("icon")
        expect(icon).toHaveAttribute("data-name", "icon-undefined")
    })

    it("should pass correct itemClassName to carousel", () => {
        vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams() as unknown as ReturnType<typeof useSearchParams>)
        render(<ProductCategories categories={mockCategories} />)
        
        const carousel = screen.getByTestId("carousel-categories")
        expect(carousel).toHaveAttribute("data-item-class", "grid place-items-center")
    })

    it("should track analytics when a category is clicked", () => {
        render(<ProductCategories categories={mockCategories} />)

        fireEvent.click(screen.getAllByTestId("category-pill")[1])

        expect(mockTrack).toHaveBeenCalledWith(EventName.CLICKED_FILTERS, {
            type: "category",
            filter: mockCategories[0],
        })
    })
})
