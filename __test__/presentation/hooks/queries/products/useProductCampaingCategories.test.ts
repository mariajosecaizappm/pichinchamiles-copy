import { renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"
import { useProductCampaingCategories } from "@/presentation/hooks/queries/products/useProductCampaingCategories"

const mocks = vi.hoisted(() => ({
    useQuery: vi.fn(),
    containerGet: vi.fn(),
    getCategories: vi.fn(),
}))

vi.mock("@tanstack/react-query", () => ({
    __esModule: true,
    useQuery: mocks.useQuery,
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    __esModule: true,
    default: { get: mocks.containerGet },
}))

describe("useProductCampaingCategories", () => {
    beforeEach(() => {
        mocks.useQuery.mockReset()
        mocks.containerGet.mockReset()
        mocks.getCategories.mockReset()

        mocks.containerGet.mockReturnValue({
            getCategories: mocks.getCategories,
        })
        mocks.useQuery.mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
        })
    })

    it("should call useQuery with the campaign-categories key and default options", () => {
        const queryResult = { data: [], isLoading: false, error: null }
        mocks.useQuery.mockReturnValue(queryResult)

        const { result } = renderHook(() => useProductCampaingCategories())

        expect(mocks.useQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ["campaign-categories", { isMainCategory: true }],
                staleTime: 600000,
                gcTime: 720000,
                refetchOnMount: true,
                refetchOnWindowFocus: false,
                refetchOnReconnect: true,
                retry: 1,
                enabled: true,
            }),
        )
        expect(result.current).toBe(queryResult)
    })

    it("should include params in the query key", () => {
        const params = { id: ["cat-1", "cat-2"] }

        renderHook(() => useProductCampaingCategories(params))

        expect(mocks.useQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ["campaign-categories", { ...params, isMainCategory: true }],
            }),
        )
    })

    it("should resolve categories through GetProductCategoriesUseCase", async () => {
        const params = { id: ["cat-1"] }
        const categories = [{ id: "cat-1", name: "Category 1", slug: "cat-1", parent: null }]
        mocks.getCategories.mockResolvedValue(categories)

        renderHook(() => useProductCampaingCategories(params))

        const queryConfig = mocks.useQuery.mock.calls[0][0] as {
            queryFn: () => Promise<unknown>
        }
        const result = await queryConfig.queryFn()

        expect(mocks.containerGet).toHaveBeenCalledWith(UseCaseTypes.GetProductCategoriesUseCase)
        expect(mocks.getCategories).toHaveBeenCalledWith({ ...params, isMainCategory: true })
        expect(result).toEqual(categories)
    })

    it("should call getCategories with an empty object when params are omitted", async () => {
        mocks.getCategories.mockResolvedValue([])

        renderHook(() => useProductCampaingCategories())

        const queryConfig = mocks.useQuery.mock.calls[0][0] as {
            queryFn: () => Promise<unknown>
        }
        await queryConfig.queryFn()

        expect(mocks.getCategories).toHaveBeenCalledWith({ isMainCategory: true })
    })

    it("keeps offer categories restricted to parents even when passed false", async () => {
        const params = { id: ["parent", "child"], isMainCategory: false }
        mocks.getCategories.mockResolvedValue({ data: [] })

        renderHook(() => useProductCampaingCategories(params))

        const queryConfig = mocks.useQuery.mock.calls[0][0] as {
            queryFn: () => Promise<unknown>
        }
        await queryConfig.queryFn()

        expect(mocks.getCategories).toHaveBeenCalledWith({ id: params.id, isMainCategory: true })
    })

    it("should pass the enabled flag to useQuery", () => {
        const params = { id: ["cat-1"] }

        renderHook(() => useProductCampaingCategories(params, false))

        expect(mocks.useQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                enabled: false,
            }),
        )
    })
})
