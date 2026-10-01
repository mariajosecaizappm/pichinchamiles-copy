import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"

const mocks = vi.hoisted(() => {
    const executeMock = vi.fn()
    const loadMock = vi.fn(async () => ({execute: executeMock}))
    return {executeMock, loadMock}
})

vi.mock("recaptcha-v3", () => ({
    load: mocks.loadMock,
}))

import RecaptchaService from "@/domain/services/RecaptchaService"

describe("RecaptchaService", () => {
    const originalEnv = process.env

    beforeEach(() => {
        process.env = {...originalEnv}
        process.env.NEXT_PUBLIC_SITE_KEY = "test-site-key"
        mocks.executeMock.mockReset()
        mocks.loadMock.mockClear()
    })

    afterEach(() => {
        process.env = originalEnv
    })

    describe("when getToken is called", () => {
        it("should load recaptcha and execute action", async () => {
            mocks.executeMock.mockResolvedValueOnce("token-123")

            const token = await RecaptchaService.getToken("login")

            expect(mocks.loadMock).toHaveBeenCalledWith("test-site-key", {autoHideBadge: true})
            expect(mocks.executeMock).toHaveBeenCalledWith("login")
            expect(token).toBe("token-123")
        })
    })
})
