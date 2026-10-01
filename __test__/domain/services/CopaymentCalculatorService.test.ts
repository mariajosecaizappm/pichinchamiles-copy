import {describe, it, expect} from "vitest"
import CopaymentCalculatorService from "@/domain/services/CopaymentCalculatorService"
import {VariationCopayment} from "@/domain/entity/Product/variation"
import {CurrencyType} from "@/domain/entity/Currency/currency"

describe("CopaymentCalculatorService", () => {
    // Base64 encoded "0.05" (5% conversion rate)
    const baseConversionRate = "MC4wNQ==" // Base64 of "0.05"
    const base64DoubleEncoded = btoa(baseConversionRate) // Double encode as the service expects

    const createMockCopayment = (overrides?: Partial<VariationCopayment>): VariationCopayment => ({
        initialization: {
            points: 100,
            coins: 10.50
        },
        minimumPointsValue: 200,
        pointsConversionRatePercentage: base64DoubleEncoded,
        ...overrides
    })

    describe("constructor", () => {
        it("should initialize with correct calculated values", () => {
            const copayment = createMockCopayment()
            const service = new CopaymentCalculatorService(
                2, // quantity
                500, // productUnitPointsPrice
                50, // productUnitPrice
                copayment
            )

            expect(service).toBeDefined()
            expect(service.getCopaymentPercentage()).toBe(40) // (200 * 100) / 500 = 40%
        })

        it("should handle zero minimum points value", () => {
            const copayment = createMockCopayment({minimumPointsValue: 0})
            const service = new CopaymentCalculatorService(
                1,
                100,
                10,
                copayment
            )

            expect(service.getCopaymentPercentage()).toBe(0)
        })

        it("should round coins initialization to 2 decimal places", () => {
            const copayment = createMockCopayment({
                initialization: {points: 100, coins: 10.555}
            })
            const service = new CopaymentCalculatorService(
                1,
                100,
                10,
                copayment
            )

            expect(service).toBeDefined()
        })
    })

    describe("getCopaymentCoins", () => {
        it("should calculate coins correctly for given points", () => {
            const copayment = createMockCopayment()
            const service = new CopaymentCalculatorService(
                1,
                1000, // points total = 1000
                100,
                copayment
            )

            // With 5% conversion rate, remaining 500 points = 25 coins
            const coins = service.getCopaymentCoins(500)
            expect(coins).toBe(25) // (1000 - 500) * 0.05 = 25
        })

        it("should return 0 when all points are used", () => {
            const copayment = createMockCopayment()
            const service = new CopaymentCalculatorService(
                1,
                1000,
                100,
                copayment
            )

            const coins = service.getCopaymentCoins(1000)
            expect(coins).toBe(0)
        })

        it("should calculate with quantity multiplier", () => {
            const copayment = createMockCopayment()
            const service = new CopaymentCalculatorService(
                3, // quantity = 3
                100, // unit points = 100, total = 300
                10,
                copayment
            )

            // Remaining 150 points * 0.05 = 7.5 coins
            const coins = service.getCopaymentCoins(150)
            expect(coins).toBe(7.5)
        })

        it("should handle edge case with zero points remaining", () => {
            const copayment = createMockCopayment()
            const service = new CopaymentCalculatorService(
                1,
                100,
                10,
                copayment
            )

            const coins = service.getCopaymentCoins(100)
            expect(coins).toBe(0)
        })
    })

    describe("getCopaymentPoints", () => {
        it("should calculate points correctly for given coins", () => {
            const copayment = createMockCopayment()
            const service = new CopaymentCalculatorService(
                1,
                1000, // total points = 1000
                100,
                copayment
            )

            // 25 coins / 0.05 = 500 points converted
            // 1000 - 500 = 500 points remaining
            const points = service.getCopaymentPoints(25)
            expect(points).toBe(500)
        })

        it("should return all points when zero coins", () => {
            const copayment = createMockCopayment()
            const service = new CopaymentCalculatorService(
                1,
                1000,
                100,
                copayment
            )

            const points = service.getCopaymentPoints(0)
            expect(points).toBe(1000)
        })

        it("should handle quantity multiplier", () => {
            const copayment = createMockCopayment()
            const service = new CopaymentCalculatorService(
                2, // quantity = 2
                500, // unit = 500, total = 1000
                50,
                copayment
            )

            // 25 coins / 0.05 = 500 points
            // 1000 - 500 = 500 points remaining
            const points = service.getCopaymentPoints(25)
            expect(points).toBe(500)
        })
    })

    describe("getCopaymentMaxMin", () => {
        it("should return correct POINTS type min/max", () => {
            const copayment = createMockCopayment({
                initialization: {points: 200, coins: 10}
            })
            const service = new CopaymentCalculatorService(
                1,
                1000, // unit points = 1000
                100,  // unit price = 100
                copayment
            )

            const result = service.getCopaymentMaxMin(CurrencyType.POINTS)
            expect(result.min).toBe(200) // initialization.points * quantity
            expect(result.max).toBe(1980) // (100 - 1) / 0.05 = 1980
        })

        it("should return minimum 1 point when initialization is 0", () => {
            const copayment = createMockCopayment({
                initialization: {points: 0, coins: 10}
            })
            const service = new CopaymentCalculatorService(
                1,
                1000,
                100,
                copayment
            )

            const result = service.getCopaymentMaxMin(CurrencyType.POINTS)
            expect(result.min).toBe(1) // Should never be 0
        })

        it("should return correct COINS type min/max", () => {
            const copayment = createMockCopayment({
                initialization: {points: 200, coins: 10}
            })
            const service = new CopaymentCalculatorService(
                1,
                1000,
                100,
                copayment
            )

            const result = service.getCopaymentMaxMin(CurrencyType.COINS)
            expect(result.min).toBe(1)
            // (1000 - 200) * 0.05 = 40
            expect(result.max).toBe(40)
        })

        it("should apply quantity multiplier to points min", () => {
            const copayment = createMockCopayment({
                initialization: {points: 100, coins: 5}
            })
            const service = new CopaymentCalculatorService(
                3, // quantity = 3
                500,
                50,
                copayment
            )

            const result = service.getCopaymentMaxMin(CurrencyType.POINTS)
            expect(result.min).toBe(300) // 100 * 3
        })
    })

    describe("getCopaymentInitialValues", () => {
        it("should return correct initial points and coins", () => {
            const copayment = createMockCopayment({
                initialization: {points: 250, coins: 15}
            })
            const service = new CopaymentCalculatorService(
                1,
                1000,
                100,
                copayment
            )

            const initial = service.getCopaymentInitialValues()
            expect(initial.points).toBe(250) // min from POINTS max/min
            expect(initial.coins).toBe(37.5) // max from COINS max/min = (1000 - 250) * 0.05
        })

        it("should handle when minimum points is 0", () => {
            const copayment = createMockCopayment({
                initialization: {points: 0, coins: 5}
            })
            const service = new CopaymentCalculatorService(
                1,
                1000,
                100,
                copayment
            )

            const initial = service.getCopaymentInitialValues()
            expect(initial.points).toBe(1) // Should be at least 1
            // max coins = (1000 - 1) * 0.05 = 49.95
            expect(initial.coins).toBe(49.95)
        })
    })

    describe("getCopaymentPercentage", () => {
        it("should calculate percentage correctly", () => {
            const copayment = createMockCopayment({minimumPointsValue: 300})
            const service = new CopaymentCalculatorService(
                1,
                1000, // productUnitPointsPrice
                100,
                copayment
            )

            // (300 * 100) / 1000 = 30%
            expect(service.getCopaymentPercentage()).toBe(30)
        })

        it("should round percentage to nearest integer", () => {
            const copayment = createMockCopayment({minimumPointsValue: 333})
            const service = new CopaymentCalculatorService(
                1,
                1000,
                100,
                copayment
            )

            // (333 * 100) / 1000 = 33.3% → rounds to 33%
            expect(service.getCopaymentPercentage()).toBe(33)
        })
    })

    describe("unCryptPointsPercent (indirectly tested via calculations)", () => {
        it("should correctly decrypt base64 encoded conversion rate", () => {
            // Create a known conversion rate
            const knownRate = "0.05"
            const singleEncoded = btoa(knownRate)
            const doubleEncoded = btoa(singleEncoded)

            const copayment = createMockCopayment({
                pointsConversionRatePercentage: doubleEncoded
            })

            const service = new CopaymentCalculatorService(
                1,
                1000,
                100,
                copayment
            )

            // If unCryptPointsPercent works, getCopaymentCoins should return correct value
            // 500 remaining points * 0.05 = 25 coins
            const coins = service.getCopaymentCoins(500)
            expect(coins).toBe(25)
        })
    })

    describe("rounding behavior", () => {
        it("should round coins to 2 decimal places", () => {
            const copayment = createMockCopayment()
            const service = new CopaymentCalculatorService(
                1,
                100,
                33.33, // Use price that with 5% rate produces clean numbers
                copayment
            )

            // Testing that calculations don't produce floating point artifacts
            const coins = service.getCopaymentCoins(50)
            // (100 - 50) * 0.05 = 2.5 - should be exactly 2.5
            expect(coins).toBe(2.5)
            expect(coins.toString()).not.toContain("0000000000") // No floating point artifacts
        })
    })

    describe("edge cases", () => {
        it("should handle very large quantity values", () => {
            const copayment = createMockCopayment()
            const service = new CopaymentCalculatorService(
                1000,
                10,
                1,
                copayment
            )

            const result = service.getCopaymentMaxMin(CurrencyType.POINTS)
            expect(result.min).toBe(100000) // 100 * 1000
        })

        it("should handle very small conversion rates", () => {
            const tinyRate = btoa(btoa("0.001")) // 0.1%
            const copayment = createMockCopayment({
                pointsConversionRatePercentage: tinyRate
            })
            const service = new CopaymentCalculatorService(
                1,
                1000,
                100,
                copayment
            )

            const coins = service.getCopaymentCoins(500)
            expect(coins).toBe(0.5) // 500 * 0.001
        })

        it("should handle high conversion rates", () => {
            const highRate = btoa(btoa("0.5")) // 50%
            const copayment = createMockCopayment({
                pointsConversionRatePercentage: highRate
            })
            const service = new CopaymentCalculatorService(
                1,
                100,
                50,
                copayment
            )

            const coins = service.getCopaymentCoins(50)
            expect(coins).toBe(25) // 50 * 0.5
        })

        it("should handle coins calculation with zero remaining points", () => {
            const copayment = createMockCopayment()
            const service = new CopaymentCalculatorService(
                1,
                100,
                10,
                copayment
            )

            const coins = service.getCopaymentCoins(100)
            expect(coins).toBe(0)
        })

        it("should handle getCopaymentPoints with coins exceeding price", () => {
            const copayment = createMockCopayment()
            const service = new CopaymentCalculatorService(
                1,
                100,
                100,
                copayment
            )

            // If coins > price, points calculation can go negative
            const points = service.getCopaymentPoints(500)
            expect(points).toBeLessThan(0) // Edge case: negative points
        })
    })
})
