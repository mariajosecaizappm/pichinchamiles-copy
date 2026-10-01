import { describe, it, expect, vi, beforeEach } from "vitest"

const mocks = vi.hoisted(() => {
    const isCookiePresent = vi.fn()
    return { isCookiePresent }
})

vi.mock("@/domain/services/AuthServiceUV", () => ({
    default: {
        isCookiePresent: mocks.isCookiePresent,
    },
}))

import VerifyUvSessionUseCase from "@/domain/interactors/Home/UseYourMiles/Travels/VerifyUvSessionUseCase"

describe("VerifyUvSessionUseCase", () => {
    beforeEach(() => {
        mocks.isCookiePresent.mockReset()
    })

    describe("when isValidUvSession is called", () => {
        it("should return true when AuthServiceUv.isCookiePresent returns true", () => {
            mocks.isCookiePresent.mockReturnValueOnce(true)

            const useCase = new VerifyUvSessionUseCase()
            const result = useCase.isValidUvSession()

            expect(mocks.isCookiePresent).toHaveBeenCalledTimes(1)
            expect(result).toBe(true)
        })

        it("should return false when AuthServiceUv.isCookiePresent returns false", () => {
            mocks.isCookiePresent.mockReturnValueOnce(false)

            const useCase = new VerifyUvSessionUseCase()
            const result = useCase.isValidUvSession()

            expect(mocks.isCookiePresent).toHaveBeenCalledTimes(1)
            expect(result).toBe(false)
        })

        it("should delegate to AuthServiceUv.isCookiePresent", () => {
            mocks.isCookiePresent.mockReturnValueOnce(true)

            const useCase = new VerifyUvSessionUseCase()
            useCase.isValidUvSession()

            expect(mocks.isCookiePresent).toHaveBeenCalledWith()
        })
    })
})
