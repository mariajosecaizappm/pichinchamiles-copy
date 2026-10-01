import {describe, it, expect} from "vitest"
import {numberToWords} from "@/presentation/helpers/numberToWords"

describe("numberToWords", () => {
    describe("when input is empty", () => {
        it("should return empty string", () => {
            expect(numberToWords("")).toBe("")
        })
    })

    describe("when input has digits", () => {
        it("should convert each digit to Spanish word separated by commas", () => {
            expect(numberToWords("123")).toBe("uno, dos, tres")
            expect(numberToWords("0")).toBe("cero")
            expect(numberToWords("9")).toBe("nueve")
            expect(numberToWords("17234")).toBe("uno, siete, dos, tres, cuatro")
        })
    })

    describe("when input has special characters", () => {
        it("should return the character as-is if not in digitWords", () => {
            expect(numberToWords("1a2")).toBe("uno, a, dos")
        })
    })
})
