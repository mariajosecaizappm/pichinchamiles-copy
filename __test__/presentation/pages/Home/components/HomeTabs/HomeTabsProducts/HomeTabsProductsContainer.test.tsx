import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"
import type {Category} from "@/domain/entity/Category/structure/category"
import type {UseQueryResult} from "@tanstack/react-query"

vi.mock("@/presentation/hooks/queries/products/useProductCategories", () => ({
    useProductCategories: vi.fn(),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Layout/Tabs/HomeTabsProducts/HomeTabsProducts", () => ({
    default: ({categories}: {categories: Category[]}) => (
        <div data-testid="home-tabs-products">{categories.length} categories</div>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/Categories/ProductCategoriesSkeleton", () => ({
    default: () => <div data-testid="skeleton">Skeleton</div>,
}))


import { useProductCategories } from "@/presentation/hooks/queries/products/useProductCategories"
import HomeTabsProductsContainer from "@/presentation/pages/Home/UseYourMiles/Layout/Tabs/HomeTabsProducts"

const mockUseProductCategories = vi.mocked(useProductCategories)

const mockCategories: Category[] = [
    {
        id: "cat-1",
        name: "Electrónica",
        slug: "electronica",
        description: "Productos electrónicos",
        showName: "Electrónica",
        icon: "icon-electronics",
        parent: null,
        programCategories: [],
    },
    {
        id: "cat-2",
        name: "Hogar",
        slug: "hogar",
        description: "Productos para el hogar",
        showName: "Hogar",
        icon: "icon-home",
        parent: null,
        programCategories: [],
    },
]

describe("HomeTabsProductsContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockUseProductCategories.mockReturnValue({
            data: undefined,
            isLoading: false,
            error: null,
            isError: false,
            isPending: false,
            isSuccess: false,
            refetch: vi.fn(),
        } as unknown as UseQueryResult<Category[], Error>)
    })

    it("should render HomeTabsProducts when data is returned", () => {
        mockUseProductCategories.mockReturnValue({
            data: mockCategories,
            isLoading: false,
            error: null,
            isError: false,
            isPending: false,
            isSuccess: true,
            refetch: vi.fn(),
        } as unknown as UseQueryResult<Category[], Error>)
        
        render(<HomeTabsProductsContainer />)
        
        expect(screen.getByTestId("home-tabs-products")).toBeInTheDocument()
        expect(screen.getByTestId("home-tabs-products")).toHaveTextContent("2 categories")
    })

    it("should render skeleton when no categories are returned", () => {
        mockUseProductCategories.mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
            isError: false,
            isPending: false,
            isSuccess: true,
            refetch: vi.fn(),
        } as unknown as UseQueryResult<Category[], Error>)
        
        render(<HomeTabsProductsContainer />)
        
        expect(screen.getByTestId("skeleton")).toBeInTheDocument()
    })

    it("should render skeleton when there is an error", () => {
        mockUseProductCategories.mockReturnValue({
            data: undefined,
            isLoading: false,
            error: new Error("Network error"),
            isError: true,
            isPending: false,
            isSuccess: false,
            refetch: vi.fn(),
        } as unknown as UseQueryResult<Category[], Error>)
        
        render(<HomeTabsProductsContainer />)
        
        expect(screen.getByTestId("skeleton")).toBeInTheDocument()
    })

    it("should render skeleton when loading", () => {
        mockUseProductCategories.mockReturnValue({
            data: undefined,
            isLoading: true,
            error: null,
            isError: false,
            isPending: true,
            isSuccess: false,
            refetch: vi.fn(),
        } as unknown as UseQueryResult<Category[], Error>)
        
        render(<HomeTabsProductsContainer />)
        
        expect(screen.getByTestId("skeleton")).toBeInTheDocument()
    })
})
