import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import useProductsOfferContext from "@/presentation/pages/Offers/Products/Offer/context/useProductsOfferContext"
import ProductsOfferProvider from "@/presentation/pages/Offers/Products/Offer/context/ProductsOfferProvider"

describe("useProductsOfferContext", () => {
    it("throws when used outside a ProductsOfferProvider", () => {
        expect(() => renderHook(() => useProductsOfferContext())).toThrow(
            "useProductsOfferContext must be used within a ProductsOfferProvider",
        )
    })

    it("returns brandIds and setBrandIds inside a ProductsOfferProvider", () => {
        const { result } = renderHook(() => useProductsOfferContext(), {
            wrapper: ProductsOfferProvider,
        })

        expect(result.current.brandIds).toEqual([])
        expect(typeof result.current.setBrandIds).toBe("function")
    })
})
