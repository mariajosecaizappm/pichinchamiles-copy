import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import links from "@/presentation/config/links"
import useProductSearch from "@/presentation/hooks/useProductSearch"

const mockPush = vi.hoisted(() => vi.fn())
const mockReplace = vi.hoisted(() => vi.fn())
const mockSearchParams = vi.hoisted(() => new URLSearchParams())
const mockPathname = vi.hoisted(() => vi.fn(() => "/productos"))
const mockParams = vi.hoisted(() => vi.fn())

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
        replace: mockReplace,
    }),
    usePathname: () => mockPathname(),
    useSearchParams: () => mockSearchParams,
    useParams: () => mockParams,
}))

describe("useProductSearch", () => {
    beforeEach(() => {
        mockPush.mockClear()
        mockReplace.mockClear()
        mockPathname.mockReturnValue("/productos")
        Array.from(mockSearchParams.keys()).forEach((key) => {
            mockSearchParams.delete(key)
        })
    })

    it("should redirect filter changes to productos path", () => {
        const { result } = renderHook(() => useProductSearch())

        act(() => {
            result.current.onChangeFilter("search", "maleta")
        })

        expect(mockPush).toHaveBeenCalledWith("/productos?search=maleta")
    })

    it("should preserve existing filters when changing a filter", () => {
        mockSearchParams.set("category", "travel")
        const { result } = renderHook(() => useProductSearch())

        act(() => {
            result.current.onChangeFilter("search", "maleta")
        })

        expect(mockPush).toHaveBeenCalledWith("/productos?category=travel&search=maleta")
    })

    it("should redirect to productos without query string when filters are cleared", () => {
        mockSearchParams.set("search", "maleta")
        const { result } = renderHook(() => useProductSearch())

        act(() => {
            result.current.clearSearch()
        })

        expect(mockPush).toHaveBeenCalledWith("/productos")
    })

    it("should replace URL with updated page param", () => {
        mockSearchParams.set("search", "phone")
        mockSearchParams.set("page", "2")
        const { result } = renderHook(() => useProductSearch())

        act(() => {
            result.current.onChangePage(3)
        })

        expect(mockReplace).toHaveBeenCalledWith("/productos?search=phone&page=3", { scroll: false })
    })

    it("should remove page param when navigating to first page", () => {
        mockSearchParams.set("search", "phone")
        mockSearchParams.set("page", "2")
        const { result } = renderHook(() => useProductSearch())

        act(() => {
            result.current.onChangePage(1)
        })

        expect(mockReplace).toHaveBeenCalledWith("/productos?search=phone", { scroll: false })
    })

    it("should replace pathname without query when no params remain on first page", () => {
        mockSearchParams.set("page", "2")
        const { result } = renderHook(() => useProductSearch())

        act(() => {
            result.current.onChangePage(1)
        })

        expect(mockReplace).toHaveBeenCalledWith("/productos", { scroll: false })
    })

    it("should use current pathname for pagination", () => {
        mockPathname.mockReturnValue("/productos/categoria/electronics")
        mockSearchParams.set("page", "1")
        const { result } = renderHook(() => useProductSearch())

        act(() => {
            result.current.onChangePage(2)
        })

        expect(mockReplace).toHaveBeenCalledWith("/productos/categoria/electronics?page=2", {
            scroll: false,
        })
    })

    it("should redirect to catalog when submitting search outside products page", () => {
        mockPathname.mockReturnValue("/utilice-sus-millas/productos")
        const { result } = renderHook(() => useProductSearch())

        act(() => {
            result.current.submitSearch("satten")
        })

        expect(mockPush).toHaveBeenCalledWith(`${links.productsList}?search=satten`)
    })

    it("should update search params when submitting search on products page", () => {
        mockPathname.mockReturnValue("/productos")
        const { result } = renderHook(() => useProductSearch())

        act(() => {
            result.current.submitSearch("satten")
        })

        expect(mockPush).toHaveBeenCalledWith("/productos?search=satten")
    })

    it("should ignore empty search submissions", () => {
        mockPathname.mockReturnValue("/utilice-sus-millas/productos")
        const { result } = renderHook(() => useProductSearch())

        act(() => {
            result.current.submitSearch("   ")
        })

        expect(mockPush).not.toHaveBeenCalled()
    })
})
