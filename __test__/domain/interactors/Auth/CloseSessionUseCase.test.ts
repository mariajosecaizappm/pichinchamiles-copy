import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"

const mocks = vi.hoisted(() => {
    const getToken = vi.fn()
    const clearToken = vi.fn()
    const closeSessionUv = vi.fn()
    const generateSessionId = vi.fn()
    const setSessionCookieInBrowser = vi.fn()
    return {getToken, clearToken, closeSessionUv, generateSessionId, setSessionCookieInBrowser}
})

vi.mock("@/domain/services/TokenService", () => ({
    default: {
        getToken: mocks.getToken,
        clearToken: mocks.clearToken,
    },
}))

vi.mock("@/domain/services/AuthServiceUV", () => ({
    default: {
        CloseSession: mocks.closeSessionUv,
    },
}))

vi.mock("@/domain/entity/Session/sessionCookie", () => ({
    generateSessionId: mocks.generateSessionId,
    setSessionCookieInBrowser: mocks.setSessionCookieInBrowser,
}))

import CloseSessionUseCase from "@/domain/interactors/Auth/CloseSessionUseCase"

describe("CloseSessionUseCase", () => {
    beforeEach(() => {
        mocks.getToken.mockReset()
        mocks.clearToken.mockReset()
        mocks.closeSessionUv.mockReset()
        mocks.generateSessionId.mockReset()
        mocks.setSessionCookieInBrowser.mockReset()
        mocks.generateSessionId.mockReturnValue("fresh-session-uuid-123")
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when closeSession is called and token exists", () => {
        it("should revoke token, close UV session, clear token storage and reset session cookie", async () => {
            const token = {
                accessToken: "access",
                refreshToken: "refresh",
                refreshTokenExpireDate: new Date("2030-01-01T00:00:00.000Z"),
            }
            mocks.getToken.mockResolvedValueOnce(token)
            mocks.clearToken.mockResolvedValueOnce(undefined)

            const authRepository = {
                revokeToken: vi.fn().mockResolvedValue(undefined),
            }
            const useCase = new CloseSessionUseCase(authRepository as any)

            await useCase.closeSession()

            expect(authRepository.revokeToken).toHaveBeenCalledWith(token)
            expect(mocks.closeSessionUv).toHaveBeenCalledTimes(1)
            expect(mocks.clearToken).toHaveBeenCalledTimes(1)
            expect(mocks.generateSessionId).toHaveBeenCalledTimes(1)
            expect(mocks.setSessionCookieInBrowser).toHaveBeenCalledWith("fresh-session-uuid-123")
        })
    })

    describe("when closeSession is called and token is missing", () => {
        it("should close UV session, clear token storage and reset session cookie without revoking", async () => {
            mocks.getToken.mockResolvedValueOnce(null)
            mocks.clearToken.mockResolvedValueOnce(undefined)

            const authRepository = {
                revokeToken: vi.fn(),
            }
            const useCase = new CloseSessionUseCase(authRepository as any)

            await useCase.closeSession()

            expect(authRepository.revokeToken).not.toHaveBeenCalled()
            expect(mocks.closeSessionUv).toHaveBeenCalledTimes(1)
            expect(mocks.clearToken).toHaveBeenCalledTimes(1)
            expect(mocks.generateSessionId).toHaveBeenCalledTimes(1)
            expect(mocks.setSessionCookieInBrowser).toHaveBeenCalledWith("fresh-session-uuid-123")
        })
    })

    describe("AuthServiceUv.CloseSession call order", () => {
        it("should call AuthServiceUv.CloseSession after revoking token and before clearing token and setting cookie", async () => {
            const token = {
                accessToken: "access",
                refreshToken: "refresh",
                refreshTokenExpireDate: new Date("2030-01-01T00:00:00.000Z"),
            }
            mocks.getToken.mockResolvedValueOnce(token)

            const authRepository = {
                revokeToken: vi.fn().mockResolvedValue(undefined),
            }
            const useCase = new CloseSessionUseCase(authRepository as any)

            await useCase.closeSession()

            const revokeOrder = authRepository.revokeToken.mock.invocationCallOrder[0]
            const closeUvOrder = mocks.closeSessionUv.mock.invocationCallOrder[0]
            const clearOrder = mocks.clearToken.mock.invocationCallOrder[0]
            const setCookieOrder = mocks.setSessionCookieInBrowser.mock.invocationCallOrder[0]

            expect(revokeOrder).toBeLessThan(closeUvOrder)
            expect(closeUvOrder).toBeLessThan(clearOrder)
            expect(clearOrder).toBeLessThan(setCookieOrder)
        })

        it("should always call AuthServiceUv.CloseSession even when token does not exist", async () => {
            mocks.getToken.mockResolvedValueOnce(null)

            const authRepository = {
                revokeToken: vi.fn(),
            }
            const useCase = new CloseSessionUseCase(authRepository as any)

            await useCase.closeSession()

            expect(mocks.closeSessionUv).toHaveBeenCalledWith()
            expect(mocks.closeSessionUv).toHaveBeenCalledTimes(1)
            expect(mocks.setSessionCookieInBrowser).toHaveBeenCalledWith("fresh-session-uuid-123")
        })
    })
})

