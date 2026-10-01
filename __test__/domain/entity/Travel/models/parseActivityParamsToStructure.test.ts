import { describe, it, expect } from "vitest"
import { parseActivityParamsToStructure } from "@/domain/entity/Travel/models/parseActivityParamsToStructure"
import { ActivityParams } from "@/domain/entity/Travel/structure/activity"

describe("parseActivityParamsToStructure", () => {
    it("should parse ActivityParams to Activity structure correctly", () => {
        const params: ActivityParams = {
            destination: "NYC",
            endDate: new Date("2024-06-15"),
            age: 25,
        }

        const result = parseActivityParamsToStructure(params)

        expect(result).toEqual({
            destination: "NYC",
            startDate: "2024-06-14",
            endDate: "2024-06-14",
            passengers: "passengers-25",
            promoCode: "0",
        })
    })

    it("should handle single digit months and days with leading zeros", () => {
        const params: ActivityParams = {
            destination: "LAX",
            endDate: new Date("2024-01-05"),
            age: 30,
        }

        const result = parseActivityParamsToStructure(params)

        expect(result.startDate).toBe("2024-01-04")
        expect(result.endDate).toBe("2024-01-04")
    })

    it("should handle double digit months and days without leading zeros", () => {
        const params: ActivityParams = {
            destination: "MIA",
            endDate: new Date("2024-12-25"),
            age: 18,
        }

        const result = parseActivityParamsToStructure(params)

        expect(result.startDate).toBe("2024-12-24")
        expect(result.endDate).toBe("2024-12-24")
    })

    it("should handle minimum age (18)", () => {
        const params: ActivityParams = {
            destination: "CHI",
            endDate: new Date("2024-07-20"),
            age: 18,
        }

        const result = parseActivityParamsToStructure(params)

        expect(result.passengers).toBe("passengers-18")
    })

    it("should handle older passengers", () => {
        const params: ActivityParams = {
            destination: "BOS",
            endDate: new Date("2024-08-10"),
            age: 65,
        }

        const result = parseActivityParamsToStructure(params)

        expect(result.passengers).toBe("passengers-65")
    })

    it("should handle leap year dates", () => {
        const params: ActivityParams = {
            destination: "SEA",
            endDate: new Date("2024-02-29"),
            age: 22,
        }

        const result = parseActivityParamsToStructure(params)

        expect(result.startDate).toBe("2024-02-28")
        expect(result.endDate).toBe("2024-02-28")
    })

    it("should handle empty destination", () => {
        const params: ActivityParams = {
            destination: "",
            endDate: new Date("2024-09-15"),
            age: 28,
        }

        const result = parseActivityParamsToStructure(params)

        expect(result.destination).toBe("")
        expect(result.startDate).toBe("2024-09-14")
        expect(result.endDate).toBe("2024-09-14")
    })

    it("should always set promoCode to '0'", () => {
        const params: ActivityParams = {
            destination: "DEN",
            endDate: new Date("2024-11-30"),
            age: 35,
        }

        const result = parseActivityParamsToStructure(params)

        expect(result.promoCode).toBe("0")
    })

    it("should handle different years", () => {
        const params: ActivityParams = {
            destination: "ATL",
            endDate: new Date("2025-03-15"),
            age: 40,
        }

        const result = parseActivityParamsToStructure(params)

        expect(result.startDate).toBe("2025-03-14")
        expect(result.endDate).toBe("2025-03-14")
    })

    it("should handle edge case age values", () => {
        const testCases = [
            { age: 18, expected: "passengers-18" },
            { age: 99, expected: "passengers-99" },
            { age: 50, expected: "passengers-50" },
        ]

        testCases.forEach(({ age, expected }) => {
            const params: ActivityParams = {
                destination: "DFW",
                endDate: new Date("2024-06-15"),
                age,
            }

            const result = parseActivityParamsToStructure(params)
            expect(result.passengers).toBe(expected)
        })
    })

    it("should handle various destination codes", () => {
        const destinations = ["NYC", "LAX", "CHI", "MIA", "SEA", "BOS", "DEN", "ATL", "DFW", "SFO"]

        destinations.forEach((destination) => {
            const params: ActivityParams = {
                destination,
                endDate: new Date("2024-06-15"),
                age: 25,
            }

            const result = parseActivityParamsToStructure(params)
            expect(result.destination).toBe(destination)
        })
    })
})
