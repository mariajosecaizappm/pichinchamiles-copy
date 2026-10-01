import { describe, it, expect } from "vitest"
import { formatMiles, formatCopaymentAmount, formatPriceQuantities, groupDigits } from "@/presentation/helpers/quantities"

describe("quantities helper", () => {
    describe("groupDigits", () => {
        it("groups digits with the given separator", () => {
            expect(groupDigits("18000", ".")).toBe("18.000")
            expect(groupDigits("1", "'")).toBe("1")
            expect(groupDigits("1000", "'")).toBe("1'000")
        })

        it("returns 0 for empty input", () => {
            expect(groupDigits("", ".")).toBe("0")
        })
    })

    describe("formatMiles", () => {
        it("formats thousands with dots", () => {
            expect(formatMiles(1000)).toBe("1.000")
            expect(formatMiles(18000)).toBe("18.000")
        })

        it("formats millions with apostrophe", () => {
            expect(formatMiles(1000000)).toBe("1'000.000")
            expect(formatMiles(1234567)).toBe("1'234.567")
            expect(formatMiles(1200000)).toBe("1'200.000")
        })

        it("formats string number correctly", () => {
            expect(formatMiles("1000")).toBe("1.000")
            expect(formatMiles("1234567")).toBe("1'234.567")
        })

        it("handles zero", () => {
            expect(formatMiles(0)).toBe("0")
            expect(formatMiles("0")).toBe("0")
        })

        it("handles decimals by stripping the decimal separator", () => {
            expect(formatMiles(1234.56)).toBe("123.456")
            expect(formatMiles("1234.56")).toBe("123.456")
        })

        it("handles negative numbers", () => {
            expect(formatMiles(-1234)).toBe("-1.234")
            expect(formatMiles("-1234")).toBe("-1.234")
            expect(formatMiles(-1234567)).toBe("-1'234.567")
        })

        it("handles large numbers", () => {
            expect(formatMiles(1000000000)).toBe("1'000'000.000")
        })

        it("returns 0 when invalid string", () => {
            expect(formatMiles("abc")).toBe("0")
        })
    })

    describe("formatPriceQuantities", () => {
        it("always shows two decimals including trailing zero", () => {
            expect(formatPriceQuantities(128.1)).toBe("128,10")
            expect(formatPriceQuantities(128.10)).toBe("128,10")
            expect(formatPriceQuantities(18.3)).toBe("18,30")
            expect(formatPriceQuantities(25.5)).toBe("25,50")
        })

        it("shows two decimals for integers", () => {
            expect(formatPriceQuantities(30)).toBe("30,00")
            expect(formatPriceQuantities(1000)).toBe("1.000,00")
        })

        it("rounds to two decimals when more are provided", () => {
            expect(formatPriceQuantities(18.351)).toBe("18,35")
            expect(formatPriceQuantities(18.355)).toBe("18,36")
        })

        it("groups thousands with dots while keeping two decimals", () => {
            expect(formatPriceQuantities(1234.5)).toBe("1.234,50")
            expect(formatPriceQuantities(1234567.89)).toBe("1.234.567,89")
        })

        it("handles zero", () => {
            expect(formatPriceQuantities(0)).toBe("0,00")
        })

        it("handles negative numbers", () => {
            expect(formatPriceQuantities(-18.5)).toBe("-18,50")
            expect(formatPriceQuantities(-1234.5)).toBe("-1.234,50")
        })

        it("falls back to 0,00 for non-finite values", () => {
            expect(formatPriceQuantities(NaN)).toBe("0,00")
            expect(formatPriceQuantities(Infinity)).toBe("0,00")
            expect(formatPriceQuantities(-Infinity)).toBe("0,00")
        })
    })

    describe("formatCopaymentAmount", () => {
        it("always shows two decimals", () => {
            expect(formatCopaymentAmount(18.3)).toBe("18,30")
            expect(formatCopaymentAmount(18.30)).toBe("18,30")
            expect(formatCopaymentAmount(25.5)).toBe("25,50")
            expect(formatCopaymentAmount(30)).toBe("30,00")
            expect(formatCopaymentAmount(18.35)).toBe("18,35")
        })

        it("groups thousands with dots while keeping two decimals", () => {
            expect(formatCopaymentAmount(1234567.89)).toBe("1.234.567,89")
        })

        it("handles negative numbers and non-finite values", () => {
            expect(formatCopaymentAmount(-18.5)).toBe("-18,50")
            expect(formatCopaymentAmount(NaN)).toBe("0,00")
            expect(formatCopaymentAmount(Infinity)).toBe("0,00")
        })
    })
})
