import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import { getMinDate } from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/helpers/dates"

describe("getMinDate", () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("should return today's date when daysAhead is 0", () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        vi.setSystemTime(today)
        
        const result = getMinDate(0)
        
        expect(result.getHours()).toBe(0)
        expect(result.getMinutes()).toBe(0)
        expect(result.getSeconds()).toBe(0)
        expect(result.getMilliseconds()).toBe(0)
    })

    it("should return date 3 days ahead when daysAhead is 3", () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        vi.setSystemTime(today)
        
        const result = getMinDate(3)
        
        const expected = new Date(today)
        expected.setDate(expected.getDate() + 3)
        expected.setHours(0, 0, 0, 0)
        
        expect(result.toISOString()).toBe(expected.toISOString())
    })

    it("should return date 7 days ahead when daysAhead is 7", () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        vi.setSystemTime(today)
        
        const result = getMinDate(7)
        
        const expected = new Date(today)
        expected.setDate(expected.getDate() + 7)
        expected.setHours(0, 0, 0, 0)
        
        expect(result.toISOString()).toBe(expected.toISOString())
    })

    it("should handle month boundaries correctly", () => {
        const today = new Date("2024-01-30T12:00:00")
        vi.setSystemTime(today)
        
        const result = getMinDate(5)
        
        const expected = new Date("2024-02-04T00:00:00")
        
        expect(result.toISOString()).toBe(expected.toISOString())
    })

    it("should handle year boundaries correctly", () => {
        const today = new Date("2024-12-30T12:00:00")
        vi.setSystemTime(today)
        
        const result = getMinDate(5)
        
        const expected = new Date("2025-01-04T00:00:00")
        
        expect(result.toISOString()).toBe(expected.toISOString())
    })
})
