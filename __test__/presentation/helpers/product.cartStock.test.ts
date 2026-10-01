import { describe, expect, it } from "vitest"
import { Basket } from "@/domain/entity/Basket/structure/basket"
import {
    getCartQuantityForVariation,
    isMaxStockAlreadyInCart,
} from "@/presentation/helpers/product"

describe("product cart stock helpers", () => {
    const basket = {
        buyerId: "buyer-1",
        items: [
            { variationId: "var-1", quantity: 1 },
            { variationId: "var-1", quantity: 1 },
            { variationId: "var-2", quantity: 3 },
        ],
    } as Basket

    describe("getCartQuantityForVariation", () => {
        it("returns 0 when basket or variation is missing", () => {
            expect(getCartQuantityForVariation(null, "var-1")).toBe(0)
            expect(getCartQuantityForVariation(basket, undefined)).toBe(0)
        })

        it("sums quantities for the same variation", () => {
            expect(getCartQuantityForVariation(basket, "var-1")).toBe(2)
            expect(getCartQuantityForVariation(basket, "var-2")).toBe(3)
            expect(getCartQuantityForVariation(basket, "var-3")).toBe(0)
        })
    })

    describe("isMaxStockAlreadyInCart", () => {
        it("returns false when variation is missing or cart has room", () => {
            expect(isMaxStockAlreadyInCart(basket, null)).toBe(false)
            expect(isMaxStockAlreadyInCart(basket, { id: "var-1", stock: 5 })).toBe(false)
            expect(isMaxStockAlreadyInCart(null, { id: "var-1", stock: 1 })).toBe(false)
        })

        it("returns true when cart quantity reaches stock", () => {
            expect(isMaxStockAlreadyInCart(basket, { id: "var-1", stock: 2 })).toBe(true)
            expect(isMaxStockAlreadyInCart(basket, { id: "var-1", stock: 1 })).toBe(true)
        })
    })
})
