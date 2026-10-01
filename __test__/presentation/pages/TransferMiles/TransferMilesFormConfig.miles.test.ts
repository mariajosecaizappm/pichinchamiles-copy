import { describe, it, expect } from "vitest"
import {
    createTransferMilesAmountSchema,
    isValidTransferMilesAmount,
    MILES_INSUFFICIENT_ERROR,
    MILES_MAX_ERROR,
    MILES_MIN_ERROR,
} from "@/presentation/pages/TransferMiles/TransferMilesFormConfig"

describe("createTransferMilesAmountSchema", () => {
    const schema = createTransferMilesAmountSchema(250490)

    it("rejects amounts below the minimum", async () => {
        await expect(schema.validate({ miles: "9" })).rejects.toThrow(MILES_MIN_ERROR)
    })

    it("rejects amounts above the maximum", async () => {
        await expect(schema.validate({ miles: "1000001" })).rejects.toThrow(MILES_MAX_ERROR)
    })

    it("accepts the maximum allowed amount", async () => {
        const highBalanceSchema = createTransferMilesAmountSchema(2_000_000)
        await expect(highBalanceSchema.validate({ miles: "1000000" })).resolves.toEqual({
            miles: "1000000",
        })
    })

    it("rejects amounts above available balance", async () => {
        await expect(schema.validate({ miles: "250491" })).rejects.toThrow(MILES_INSUFFICIENT_ERROR)
    })

    it("accepts valid amounts", async () => {
        await expect(schema.validate({ miles: "18000" })).resolves.toEqual({ miles: "18000" })
    })
})

describe("isValidTransferMilesAmount", () => {
    it("returns true only for amounts between 10 and balance and up to 1'000.000", () => {
        expect(isValidTransferMilesAmount("10", 100)).toBe(true)
        expect(isValidTransferMilesAmount("9", 100)).toBe(false)
        expect(isValidTransferMilesAmount("101", 100)).toBe(false)
        expect(isValidTransferMilesAmount("1000000", 2_000_000)).toBe(true)
        expect(isValidTransferMilesAmount("1000001", 2_000_000)).toBe(false)
        expect(isValidTransferMilesAmount("abc", 100)).toBe(false)
    })
})
