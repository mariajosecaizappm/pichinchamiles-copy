import { describe, it, expect } from "vitest"
import { parseDisneyParamsToStructure } from "@/domain/entity/Travel/models/parseDisneyParamsToStructure"
import { DisneyParams } from "@/domain/entity/Travel/structure/disney"

describe("parseDisneyParamsToStructure", () => {
    it("should parse DisneyParams to Disney structure correctly", () => {
        const params: DisneyParams = {
            adults: 2,
            childrens: 1,
            date: new Date("2024-06-15"),
        }

        const result = parseDisneyParamsToStructure(params)

        expect(result).toEqual({
            adults: "adults=2",
            children: "children=1",
            date: "date=2024-06-14",
        })
    })

    it("should handle single digit months and days with leading zeros", () => {
        const params: DisneyParams = {
            adults: 1,
            childrens: 0,
            date: new Date("2024-01-05"),
        }

        const result = parseDisneyParamsToStructure(params)

        expect(result.date).toBe("date=2024-01-04")
    })

    it("should handle double digit months and days without leading zeros", () => {
        const params: DisneyParams = {
            adults: 3,
            childrens: 2,
            date: new Date("2024-12-25"),
        }

        const result = parseDisneyParamsToStructure(params)

        expect(result.date).toBe("date=2024-12-24")
    })

    it("should handle zero children", () => {
        const params: DisneyParams = {
            adults: 1,
            childrens: 0,
            date: new Date("2024-06-15"),
        }

        const result = parseDisneyParamsToStructure(params)

        expect(result.children).toBe("children=0")
    })

    it("should handle multiple adults and children", () => {
        const params: DisneyParams = {
            adults: 5,
            childrens: 4,
            date: new Date("2024-07-20"),
        }

        const result = parseDisneyParamsToStructure(params)

        expect(result.adults).toBe("adults=5")
        expect(result.children).toBe("children=4")
    })
})
