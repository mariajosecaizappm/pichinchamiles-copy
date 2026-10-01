import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"
import LopdPreferencesService from "@/domain/services/LopdPreferencesService"

describe("LopdPreferencesService", () => {
    beforeEach(() => {
        sessionStorage.clear()
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.clearAllMocks()
        vi.unstubAllGlobals()
    })

    describe("when skipLopd is called", () => {
        it("should persist the expiration timestamp in sessionStorage with a stable key", async () => {
            vi.useFakeTimers()
            vi.setSystemTime(new Date("2020-01-01T00:00:00.000Z"))

            const now = Date.now()
            await LopdPreferencesService.skipLopd("123", 60)

            expect(sessionStorage.getItem("lopdReminder-123")).toBe(String(now + 60_000))
        })
    })

    describe("when skipLopd is called on the server", () => {
        it("should not persist anything", async () => {
            vi.stubGlobal("window", undefined as unknown as Window)

            await LopdPreferencesService.skipLopd("123", 60)

            expect(sessionStorage.length).toBe(0)
        })
    })

    describe("when isSkippedLopd is called and no value exists for that identification", () => {
        it("should return false", async () => {
            const result = await LopdPreferencesService.isSkippedLopd("123")

            expect(result).toBe(false)
        })
    })

    describe("when skipLopd is followed by isSkippedLopd for the same identification", () => {
        it("should return true while the reminder is still valid", async () => {
            vi.useFakeTimers()
            vi.setSystemTime(1_000)

            await LopdPreferencesService.skipLopd("123", 60)
            const result = await LopdPreferencesService.isSkippedLopd("123")

            expect(result).toBe(true)
        })
    })

    describe("when isSkippedLopd is called and stored value is a future expiration", () => {
        it("should return true", async () => {
            vi.useFakeTimers()
            vi.setSystemTime(1_000)
            sessionStorage.setItem("lopdReminder-123", "2000")

            const result = await LopdPreferencesService.isSkippedLopd("123")

            expect(result).toBe(true)
        })
    })

    describe("when isSkippedLopd is called and stored value is an expired expiration", () => {
        it("should return false", async () => {
            vi.useFakeTimers()
            vi.setSystemTime(1_000)
            sessionStorage.setItem("lopdReminder-123", "999")

            const result = await LopdPreferencesService.isSkippedLopd("123")

            expect(result).toBe(false)
        })
    })

    describe("when isSkippedLopd is called and stored value is a non-numeric expiration", () => {
        it("should return false", async () => {
            sessionStorage.setItem("lopdReminder-123", "true")

            const result = await LopdPreferencesService.isSkippedLopd("123")

            expect(result).toBe(false)
        })
    })

    describe("when isSkippedLopd is called on the server", () => {
        it("should return false", async () => {
            vi.stubGlobal("window", undefined as unknown as Window)

            const result = await LopdPreferencesService.isSkippedLopd("123")

            expect(result).toBe(false)
        })
    })

    describe("when clearPreferences is called", () => {
        it("should clear sessionStorage", () => {
            const spy = vi.spyOn(Storage.prototype, 'clear')
            LopdPreferencesService.clearPreferences()
            expect(spy).toHaveBeenCalledTimes(1)
            spy.mockRestore()
        })
    })
})
