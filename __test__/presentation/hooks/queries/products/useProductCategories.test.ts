import { renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"
import { useProductCategories } from "@/presentation/hooks/queries/products/useProductCategories"

const mocks = vi.hoisted(() => ({
    useQuery: vi.fn(),
    containerGet: vi.fn(),
    getHomeMenuMainCategories: vi.fn(),
}))

vi.mock("@tanstack/react-query", () => ({
    __esModule: true,
    useQuery: mocks.useQuery,
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    __esModule: true,
    default: {
        get: mocks.containerGet,
    },
}))

describe("useProductCategories", () => {
    beforeEach(() => {
        mocks.useQuery.mockReset()
        mocks.containerGet.mockReset()
        mocks.getHomeMenuMainCategories.mockReset()

        mocks.containerGet.mockReturnValue({
            getHomeMenuMainCategories: mocks.getHomeMenuMainCategories,
        })
        mocks.useQuery.mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
        })
    })

    it("should call useQuery with default options when params are omitted", () => {
        const queryResult = { data: [], isLoading: false, error: null }
        mocks.useQuery.mockReturnValue(queryResult)

        const { result } = renderHook(() => useProductCategories())

        expect(mocks.useQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ["product-categories", undefined],
                staleTime: 600000,
                gcTime: 720000,
                refetchOnMount: true,
                refetchOnWindowFocus: false,
                refetchOnReconnect: true,
                retry: 1,
            }),
        )
        expect(result.current).toBe(queryResult)
    })

    it("should include params in the query key", () => {
        const params = { id: ["cat-1", "cat-2"], page: 1, pageSize: 10 }

        renderHook(() => useProductCategories(params))

        expect(mocks.useQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ["product-categories", params],
            }),
        )
    })

    it("should resolve categories through GetProductCategoriesUseCase", async () => {
        const params = { id: ["cat-home"] }
        const categories = [{ id: "cat-home", name: "Hogar", slug: "hogar", parent: null }]
        mocks.getHomeMenuMainCategories.mockResolvedValue(categories)

        renderHook(() => useProductCategories(params))

        const queryConfig = mocks.useQuery.mock.calls[0][0] as {
            queryFn: () => Promise<unknown>
        }
        const result = await queryConfig.queryFn()

        expect(mocks.containerGet).toHaveBeenCalledWith(UseCaseTypes.GetProductCategoriesUseCase)
        expect(mocks.getHomeMenuMainCategories).toHaveBeenCalledWith(params)
        expect(result).toEqual(categories)
    })

    it("should call getHomeMenuMainCategories without params when none are provided", async () => {
        mocks.getHomeMenuMainCategories.mockResolvedValue([])

        renderHook(() => useProductCategories())

        const queryConfig = mocks.useQuery.mock.calls[0][0] as {
            queryFn: () => Promise<unknown>
        }
        await queryConfig.queryFn()

        expect(mocks.getHomeMenuMainCategories).toHaveBeenCalledWith(undefined)
    })
})
