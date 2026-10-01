import { describe, it, expect } from "vitest"
import { parseDate, parseTime } from "@/domain/entity/Travel/models/parseDateTime"

describe("parseDateTime", () => {
    describe("parseDate", () => {
        it("should format a date as YYYY-MM-DD", () => {
            const date = new Date(2024, 5, 15) // June 15, 2024
            expect(parseDate(date)).toBe("2024-06-15")
        })

        it("should zero-pad single-digit months", () => {
            const date = new Date(2024, 0, 20) // January 20, 2024
            expect(parseDate(date)).toBe("2024-01-20")
        })

        it("should zero-pad single-digit days", () => {
            const date = new Date(2024, 11, 5) // December 5, 2024
            expect(parseDate(date)).toBe("2024-12-05")
        })

        it("should handle double-digit months and days without extra padding", () => {
            const date = new Date(2024, 9, 25) // October 25, 2024
            expect(parseDate(date)).toBe("2024-10-25")
        })

        it("should handle last day of year", () => {
            const date = new Date(2024, 11, 31)
            expect(parseDate(date)).toBe("2024-12-31")
        })

        it("should handle first day of year", () => {
            const date = new Date(2024, 0, 1)
            expect(parseDate(date)).toBe("2024-01-01")
        })
    })

    describe("parseTime", () => {
        it("should format time as HHMM", () => {
            const date = new Date(2024, 0, 1, 14, 30)
            expect(parseTime(date)).toBe("1430")
        })

        it("should zero-pad single-digit hours", () => {
            const date = new Date(2024, 0, 1, 8, 45)
            expect(parseTime(date)).toBe("0845")
        })

        it("should zero-pad single-digit minutes", () => {
            const date = new Date(2024, 0, 1, 12, 5)
            expect(parseTime(date)).toBe("1205")
        })

        it("should handle midnight", () => {
            const date = new Date(2024, 0, 1, 0, 0)
            expect(parseTime(date)).toBe("0000")
        })

        it("should handle end of day", () => {
            const date = new Date(2024, 0, 1, 23, 59)
            expect(parseTime(date)).toBe("2359")
        })
    })
})
