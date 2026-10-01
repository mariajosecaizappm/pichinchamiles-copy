import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import useFilterNavigation from "@/presentation/pages/Products/hooks/useFilterNavigation"

const {
    mockReplace,
    mockPush,
    mockBuildProductsHref,
    CLEAR_ALL_FILTERS_PARAMS,
} = vi.hoisted(() => ({
    mockReplace: vi.fn(),
    mockPush: vi.fn(),
    mockBuildProductsHref: vi.fn(),
    CLEAR_ALL_FILTERS_PARAMS: {
        brand: null,
        category: null,
        sort: null,
    },
}))

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        replace: mockReplace,
        push: mockPush,
    }),
    usePathname: () => "/products",
    useSearchParams: () => new URLSearchParams("brand=old&page=2"),
}))

vi.mock(
    "@/presentation/pages/Products/components/ProductsFilters/ProductsFiltersConfig",
    () => ({
        buildProductsHref: (
            pathname: string,
            searchParams: URLSearchParams,
            patch: Record<string, string | null>
        ) => mockBuildProductsHref(pathname, searchParams, patch),
        CLEAR_ALL_FILTERS_PARAMS,
    })
)

describe("useFilterNavigation", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockBuildProductsHref.mockReturnValue("/products?brand=new")
    })

    it("applyMany uses router.replace by default", () => {
        const { result } = renderHook(() => useFilterNavigation())

        act(() => {
            result.current.applyMany({ brand: "new" })
        })

        expect(mockBuildProductsHref).toHaveBeenCalledWith(
            "/products",
            expect.any(URLSearchParams),
            { brand: "new" }
        )
        expect(mockReplace).toHaveBeenCalledWith("/products?brand=new")
        expect(mockPush).not.toHaveBeenCalled()
    })

    it("applyMany uses router.push when method is push", () => {
        const { result } = renderHook(() =>
            useFilterNavigation({ method: "push" })
        )

        act(() => {
            result.current.applyMany({ category: "cat-1" })
        })

        expect(mockPush).toHaveBeenCalledWith("/products?brand=new")
        expect(mockReplace).not.toHaveBeenCalled()
    })

    it("applyMany uses router.replace when method is replace", () => {
        const { result } = renderHook(() =>
            useFilterNavigation({ method: "replace" })
        )

        act(() => {
            result.current.applyMany({ sort: "price_asc" })
        })

        expect(mockReplace).toHaveBeenCalledWith("/products?brand=new")
        expect(mockPush).not.toHaveBeenCalled()
    })

    it("handleClearFilters applies CLEAR_ALL_FILTERS_PARAMS", () => {
        const { result } = renderHook(() => useFilterNavigation())

        act(() => {
            result.current.handleClearFilters()
        })

        expect(mockBuildProductsHref).toHaveBeenCalledWith(
            "/products",
            expect.any(URLSearchParams),
            CLEAR_ALL_FILTERS_PARAMS
        )
        expect(mockReplace).toHaveBeenCalledWith("/products?brand=new")
    })

    it("navigates immediately when wrapTransition is false", () => {
        const { result } = renderHook(() =>
            useFilterNavigation({ wrapTransition: false })
        )

        act(() => {
            result.current.applyMany({ brand: "x" })
        })

        expect(mockReplace).toHaveBeenCalledTimes(1)
    })

    it("navigates when wrapTransition is true", () => {
        const { result } = renderHook(() =>
            useFilterNavigation({ wrapTransition: true })
        )

        act(() => {
            result.current.applyMany({ brand: "x" })
        })

        expect(mockReplace).toHaveBeenCalledWith("/products?brand=new")
    })

    it("exposes isPending as boolean", () => {
        const { result } = renderHook(() => useFilterNavigation())
        expect(typeof result.current.isPending).toBe("boolean")
    })

    it("uses default options when none are provided", () => {
        const { result } = renderHook(() => useFilterNavigation())

        act(() => {
            result.current.applyMany({ brand: "a" })
        })

        expect(mockReplace).toHaveBeenCalled()
        expect(mockPush).not.toHaveBeenCalled()
    })

    it("handleClearFilters respects method push", () => {
        const { result } = renderHook(() =>
            useFilterNavigation({ method: "push" })
        )

        act(() => {
            result.current.handleClearFilters()
        })

        expect(mockPush).toHaveBeenCalledWith("/products?brand=new")
        expect(mockReplace).not.toHaveBeenCalled()
    })

    it("handleClearFilters with wrapTransition true still navigates", () => {
        const { result } = renderHook(() =>
            useFilterNavigation({ wrapTransition: true, method: "replace" })
        )

        act(() => {
            result.current.handleClearFilters()
        })

        expect(mockReplace).toHaveBeenCalledWith("/products?brand=new")
    })

    it("passes patch through to buildProductsHref", () => {
        const { result } = renderHook(() => useFilterNavigation())
        const patch = { brand: "b1", category: null, sort: "points-asc" }

        act(() => {
            result.current.applyMany(patch)
        })

        expect(mockBuildProductsHref).toHaveBeenCalledWith(
            "/products",
            expect.any(URLSearchParams),
            patch
        )
    })
})