import { describe, it, expect } from "vitest"
import { Disney, DisneyParams } from "@/domain/entity/Travel/structure/disney"

describe("Disney types", () => {
    describe("Disney", () => {
        it("should accept valid Disney structure", () => {
            const disney: Disney = {
                adults: "adults=2",
                children: "children=1",
                date: "date=2024-06-15",
            }

            expect(disney.adults).toBe("adults=2")
            expect(disney.children).toBe("children=1")
            expect(disney.date).toBe("date=2024-06-15")
        })

        it("should accept Disney with zero children", () => {
            const disney: Disney = {
                adults: "adults=1",
                children: "children=0",
                date: "date=2024-06-15",
            }

            expect(disney.children).toBe("children=0")
        })
    })

    describe("DisneyParams", () => {
        it("should accept valid DisneyParams structure", () => {
            const params: DisneyParams = {
                adults: 2,
                childrens: 1,
                date: new Date("2024-06-15"),
            }

            expect(params.adults).toBe(2)
            expect(params.childrens).toBe(1)
            expect(params.date).toEqual(new Date("2024-06-15"))
        })

        it("should accept DisneyParams with zero children", () => {
            const params: DisneyParams = {
                adults: 1,
                childrens: 0,
                date: new Date("2024-06-15"),
            }

            expect(params.childrens).toBe(0)
        })

        it("should accept DisneyParams with multiple passengers", () => {
            const params: DisneyParams = {
                adults: 5,
                childrens: 3,
                date: new Date("2024-12-25"),
            }

            expect(params.adults).toBe(5)
            expect(params.childrens).toBe(3)
        })
    })
})
