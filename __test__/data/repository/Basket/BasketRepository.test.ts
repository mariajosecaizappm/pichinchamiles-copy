import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"
import {server} from "../../../../__mocks__/server"
import {http, HttpResponse} from "msw"

const mocks = vi.hoisted(() => {
    const addBasketItemAdapter = vi.fn()
    const getBasketAdapter = vi.fn()
    const updateBasketAdapter = vi.fn()

    return {addBasketItemAdapter, getBasketAdapter, updateBasketAdapter}
})

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: vi.fn(),
        bind: vi.fn().mockReturnThis(),
        to: vi.fn(),
    },
}))

vi.mock("@/data/adapters/Basket/basketAdapter", () => ({
    addBasketItemAdapter: mocks.addBasketItemAdapter,
    getBasketAdapter: mocks.getBasketAdapter,
    updateBasketAdapter: mocks.updateBasketAdapter,
}))

describe("BasketRepository", () => {
    beforeEach(() => {
        mocks.addBasketItemAdapter.mockReset()
        mocks.getBasketAdapter.mockReset()
        mocks.updateBasketAdapter.mockReset()
        process.env.NEXT_PUBLIC_PROGRAM_ID = "test-program-id"
        server.listen()
    })

    afterEach(() => {
        vi.clearAllMocks()
        server.close()
    })

    describe("when getBasket is called", () => {
        it("should return null when response data is empty", async () => {
            vi.resetModules()
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
            const programId = process.env.NEXT_PUBLIC_PROGRAM_ID || "test-program-id"
            const url = `${baseUrl}/baskets-api/${programId}/baskets`

            server.use(http.get(url, () => HttpResponse.json(null)))

            const {default: BasketRepository} = await import(
                "@/data/repository/Basket/BasketRepository"
            )
            const repository = new BasketRepository()

            const result = await repository.getBasket()

            expect(mocks.getBasketAdapter).not.toHaveBeenCalled()
            expect(result).toBeNull()
        })

        it("should adapt and return basket when response data exists", async () => {
            vi.resetModules()
            const apiBasket = {buyerId: "default-buyer-id", items: []}
            const adaptedBasket = {buyerId: "buyer", items: []} as any
            mocks.getBasketAdapter.mockReturnValueOnce(adaptedBasket)

            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
            const programId = process.env.NEXT_PUBLIC_PROGRAM_ID || "test-program-id"
            const url = `${baseUrl}/baskets-api/${programId}/baskets`

            server.use(http.get(url, () => HttpResponse.json(apiBasket)))

            const {default: BasketRepository} = await import(
                "@/data/repository/Basket/BasketRepository"
            )
            const repository = new BasketRepository()

            const result = await repository.getBasket()

            expect(mocks.getBasketAdapter).toHaveBeenCalledWith(apiBasket)
            expect(result).toBe(adaptedBasket)
        })
    })

    describe("when updateBasket is called", () => {
        it("should post adapted payload and return null when response data is empty", async () => {
            vi.resetModules()
            const basket = {buyerId: "buyer", items: []} as any
            const payload = {items: []}

            mocks.updateBasketAdapter.mockReturnValueOnce(payload)

            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
            const programId = process.env.NEXT_PUBLIC_PROGRAM_ID || "test-program-id"
            const url = `${baseUrl}/baskets-api/${programId}/baskets`

            server.use(
                http.post(url, async ({request}) => {
                    const body = (await request.json()) as unknown
                    expect(body).toEqual(payload)
                    return HttpResponse.json(null)
                }),
            )

            const {default: BasketRepository} = await import(
                "@/data/repository/Basket/BasketRepository"
            )
            const repository = new BasketRepository()

            const result = await repository.updateBasket(basket)

            expect(mocks.updateBasketAdapter).toHaveBeenCalledWith(basket)
            expect(mocks.getBasketAdapter).not.toHaveBeenCalled()
            expect(result).toBeNull()
        })

        it("should post adapted payload and adapt response basket", async () => {
            vi.resetModules()
            const basket = {buyerId: "buyer", items: []} as any
            const payload = {items: []}
            const apiBasket = {buyerId: "default-buyer-id", items: []}
            const adaptedBasket = {buyerId: "buyer", items: []} as any

            mocks.updateBasketAdapter.mockReturnValueOnce(payload)
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
            const programId = process.env.NEXT_PUBLIC_PROGRAM_ID || "test-program-id"
            const url = `${baseUrl}/baskets-api/${programId}/baskets`

            server.use(
                http.post(url, async ({request}) => {
                    const body = (await request.json()) as unknown
                    expect(body).toEqual(payload)
                    return HttpResponse.json(apiBasket)
                }),
            )
            mocks.getBasketAdapter.mockReturnValueOnce(adaptedBasket)

            const {default: BasketRepository} = await import(
                "@/data/repository/Basket/BasketRepository"
            )
            const repository = new BasketRepository()

            const result = await repository.updateBasket(basket)

            expect(mocks.updateBasketAdapter).toHaveBeenCalledWith(basket)
            expect(mocks.getBasketAdapter).toHaveBeenCalledWith(apiBasket)
            expect(result).toBe(adaptedBasket)
        })
    })

    describe("when addBasketItem is called", () => {
        it("should post adapted payload and adapt response", async () => {
            vi.resetModules()
            const newItem = { variation: { id: "v1" } } as any
            const basket = { buyerId: "b", items: [] } as any
            const payload = { items: [{ variationId: "v1" }] }
            const apiBasket = { buyerId: "api", items: [] }
            const adaptedBasket = { buyerId: "adapted", items: [] } as any
            mocks.addBasketItemAdapter.mockReturnValueOnce(payload)
            mocks.getBasketAdapter.mockReturnValueOnce(adaptedBasket)

            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
            const programId = process.env.NEXT_PUBLIC_PROGRAM_ID || "test-program-id"
            const url = `${baseUrl}/baskets-api/${programId}/v2/baskets`
            server.use(http.post(url, async ({ request }) => {
                expect(await request.json()).toEqual(payload)
                return HttpResponse.json(apiBasket)
            }))

            const { default: BasketRepository } = await import("@/data/repository/Basket/BasketRepository")
            const repository = new BasketRepository()
            const result = await repository.addBasketItem(newItem, basket)

            expect(mocks.addBasketItemAdapter).toHaveBeenCalledWith(newItem, basket)
            expect(mocks.getBasketAdapter).toHaveBeenCalledWith(apiBasket)
            expect(result).toBe(adaptedBasket)
        })
    })

    describe("when removeBasketItem is called", () => {
        it("should remove item and call updateBasket", async () => {
            vi.resetModules()
            const basket = {
                buyerId: "b",
                items: [{ id: "keep" }, { id: "delete" }],
            } as any

            const { default: BasketRepository } = await import("@/data/repository/Basket/BasketRepository")
            const repository = new BasketRepository()
            const updateSpy = vi.spyOn(repository, "updateBasket").mockResolvedValue({ buyerId: "b", items: [{ id: "keep" }] } as any)
            const result = await repository.removeBasketItem("delete", basket)

            expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({ items: [{ id: "keep" }] }))
            expect(result).toEqual({ buyerId: "b", items: [{ id: "keep" }] })
        })
    })

})
