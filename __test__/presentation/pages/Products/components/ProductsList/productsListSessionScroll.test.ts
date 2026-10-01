import {
    rememberProductsListLastProduct,
    takeProductsListLastProductId,
} from "@/presentation/pages/Products/components/ProductsList/productsListSessionScroll"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

describe("productsListSessionScroll", () => {
    beforeEach(() => {
        sessionStorage.clear()
        window.history.pushState({}, "", "/productos?search=phone")
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it("should remember and consume the last product id for current URL", () => {
        rememberProductsListLastProduct("product-1")

        expect(takeProductsListLastProductId()).toBe("product-1")
        expect(takeProductsListLastProductId()).toBeNull()
    })

    it("should scope the remembered product by pathname and search", () => {
        rememberProductsListLastProduct("product-1")
        window.history.pushState({}, "", "/productos?page=2")

        expect(takeProductsListLastProductId()).toBeNull()
    })

    it("should not throw when sessionStorage setItem throws", () => {
        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
            throw new Error("storage unavailable")
        })

        expect(() => rememberProductsListLastProduct("product-1")).not.toThrow()
    })

    it("should return null when sessionStorage getItem throws", () => {
        vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
            throw new Error("storage unavailable")
        })

        expect(takeProductsListLastProductId()).toBeNull()
    })
})
