import { describe, it, expect, vi, beforeEach } from "vitest"
import AddProductToCartUseCase from "@/domain/interactors/Products/AddProductToCartUseCase"
import { Basket, BasketProduct } from "@/domain/entity/Basket/structure/basket"
import { PaymentMethod } from "@/domain/entity/Payment/payment"

const mockBasket: Basket = {
    buyerId: "buyer-1",
    items: [],
}

const mockBasketRepository = {
    getBasket: vi.fn(),
    updateBasket: vi.fn(),
}

const makeProduct = (): BasketProduct => ({
    product: {
        id: "prod-1",
        name: "Test Product",
        slug: "test-product",
        description: "desc",
        brand: { name: "Brand" },
        store: { id: "store-1" },
        supplierId: "supplier-1",
        categories: [{ id: "cat-1", name: "Category" }],
        productType: "physical",
        searchEngine: { queryID: "qid-1" },
        assets: [],
        tags: [],
        features: [],
        minPointsPrice: 500,
    } as unknown as BasketProduct["product"],
    variation: {
        id: "var-1",
        pointsPrice: 500,
        price: 100,
        stock: 10,
        taxes: 0,
        copayment: null,
        assets: [],
        features: [],
    } as unknown as BasketProduct["variation"],
    coinsCurrencyId: "coins-ccy",
    pointsCurrencyId: "points-ccy",
    paymentType: PaymentMethod.POINTS,
    points: 500,
    coins: 0,
    quantity: 1,
})

describe("AddProductToCartUseCase", () => {
    let useCase: AddProductToCartUseCase

    beforeEach(() => {
        vi.clearAllMocks()
        useCase = new AddProductToCartUseCase(mockBasketRepository as never)
    })

    it("should call getBasket and updateBasket", async () => {
        mockBasketRepository.getBasket.mockResolvedValue(mockBasket)
        mockBasketRepository.updateBasket.mockResolvedValue(mockBasket)

        await useCase.addProduct(makeProduct())

        expect(mockBasketRepository.getBasket).toHaveBeenCalledOnce()
        expect(mockBasketRepository.updateBasket).toHaveBeenCalledOnce()
    })

    it("should return the updated basket from updateBasket", async () => {
        const updatedBasket: Basket = { buyerId: "buyer-1", items: [{ id: "item-1" }] as unknown as Basket["items"] }
        mockBasketRepository.getBasket.mockResolvedValue(mockBasket)
        mockBasketRepository.updateBasket.mockResolvedValue(updatedBasket)

        const result = await useCase.addProduct(makeProduct())

        expect(result).toBe(updatedBasket)
    })

    it("should pass the new basket (with product added) to updateBasket", async () => {
        mockBasketRepository.getBasket.mockResolvedValue(mockBasket)
        mockBasketRepository.updateBasket.mockResolvedValue(null)

        await useCase.addProduct(makeProduct())

        const passedBasket = mockBasketRepository.updateBasket.mock.calls[0][0] as Basket
        expect(passedBasket.items).toHaveLength(1)
        expect(passedBasket.items[0].variationId).toBe("var-1")
    })

    it("should handle a null current basket from getBasket", async () => {
        mockBasketRepository.getBasket.mockResolvedValue(null)
        mockBasketRepository.updateBasket.mockResolvedValue(null)

        await useCase.addProduct(makeProduct())

        const passedBasket = mockBasketRepository.updateBasket.mock.calls[0][0] as Basket
        expect(passedBasket.items).toHaveLength(1)
    })

    it("should propagate errors from getBasket", async () => {
        mockBasketRepository.getBasket.mockRejectedValue(new Error("Network error"))
        mockBasketRepository.updateBasket.mockResolvedValue(null)

        await expect(useCase.addProduct(makeProduct())).rejects.toThrow("Network error")
        expect(mockBasketRepository.updateBasket).not.toHaveBeenCalled()
    })

    it("should propagate errors from updateBasket", async () => {
        mockBasketRepository.getBasket.mockResolvedValue(mockBasket)
        mockBasketRepository.updateBasket.mockRejectedValue(new Error("Update failed"))

        await expect(useCase.addProduct(makeProduct())).rejects.toThrow("Update failed")
    })

    it("should return null when updateBasket returns null", async () => {
        mockBasketRepository.getBasket.mockResolvedValue(mockBasket)
        mockBasketRepository.updateBasket.mockResolvedValue(null)

        const result = await useCase.addProduct(makeProduct())

        expect(result).toBeNull()
    })
})
