import {describe, it, expect} from "vitest"
import {CurrencyType} from "@/domain/entity/Currency/currency"

describe("CurrencyType enum", () => {
    it("should have POINTS value", () => {
        expect(CurrencyType.POINTS).toBe("points")
    })

    it("should have COINS value", () => {
        expect(CurrencyType.COINS).toBe("coins")
    })
})
