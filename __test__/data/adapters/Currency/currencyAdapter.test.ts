import {describe, it, expect} from "vitest"
import {programCurrencyAdapter} from "@/data/adapters/Currency/currencyAdapter"

describe("currencyAdapter", () => {
    describe("when programCurrencyAdapter is called with both points and coin", () => {
        it("should return ids for points and coins with priority 1", () => {
            const data = {
                entities: [
                    {type: "points", priority: 1, currencyId: "PTS"},
                    {type: "coin", priority: 1, currencyId: "USD"},
                ],
            }
            const result = programCurrencyAdapter(data as any)
            expect(result).toEqual({
                pointsCurrencyId: "PTS",
                coinsCurrencyId: "USD",
            })
        })
    })

    describe("when configuration is incomplete", () => {
        it("should throw when points is missing", () => {
            const data = {
                entities: [{type: "coin", priority: 1, currencyId: "USD"}],
            }
            expect(() => programCurrencyAdapter(data as any)).toThrow(
                "currency not configured",
            )
        })

        it("should throw when coin is missing", () => {
            const data = {
                entities: [{type: "points", priority: 1, currencyId: "PTS"}],
            }
            expect(() => programCurrencyAdapter(data as any)).toThrow(
                "currency not configured",
            )
        })

        it("should throw when priorities do not match 1", () => {
            const data = {
                entities: [
                    {type: "points", priority: 2, currencyId: "PTS"},
                    {type: "coin", priority: 2, currencyId: "USD"},
                ],
            }
            expect(() => programCurrencyAdapter(data as any)).toThrow(
                "currency not configured",
            )
        })
    })
})

