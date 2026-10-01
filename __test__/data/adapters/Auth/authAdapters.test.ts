import {describe, it, expect, vi, afterEach} from "vitest"
import {AuthFlow} from "@/domain/entity/Auth/auth"
import {
    convertFailedOtpDetails,
    getOtp,
    getTokenAdapter,
    otpAdapter,
    validateIdentificationAdapter,
} from "@/data/adapters/Auth/authAdapters"

describe("authAdapters", () => {
    afterEach(() => {
        vi.useRealTimers()
    })

    describe("when convertFailedOtpDetails receives valid JSON", () => {
        it("should convert attempts and minutes", () => {
            const details = JSON.stringify({
                Minutes: "01:02:50",
                ValidAttempts: 2,
            })

            const result = convertFailedOtpDetails(details)

            expect(result).toEqual({attempts: 2, minutes: 62})
        })
    })

    describe("when convertFailedOtpDetails receives invalid JSON", () => {
        it("should return zeros", () => {
            const result = convertFailedOtpDetails("not-json")

            expect(result).toEqual({attempts: 0, minutes: 0})
        })
    })

    describe("when convertFailedOtpDetails receives JSON without minutes", () => {
        it("should default to zero minutes", () => {
            const details = JSON.stringify({
                ValidAttempts: "3",
            })

            const result = convertFailedOtpDetails(details)

            expect(result).toEqual({attempts: 3, minutes: 0})
        })
    })

    describe("when otpAdapter receives otp fields", () => {
        it("should map values and calculate expiration date", () => {
            vi.useFakeTimers()
            vi.setSystemTime(new Date("2020-01-01T00:00:00.000Z"))
            
            const result = otpAdapter({
                cellPhone: "123***7890",
                durationOtpCodeMinutes: 5,
                email: "test@example.com",
                mfaToken: "mfa-token",
            })

            expect(result).toEqual({
                cellPhone: "123***7890",
                durationOtpCodeMinutes: 5,
                email: "test@example.com",
                mfaToken: "mfa-token",
                expirationDate: new Date("2020-01-01T00:05:00.000Z"),
            })
        })
    })

    describe("when otpAdapter receives missing fields", () => {
        it("should apply defaults and current time for expiration", () => {
            vi.useFakeTimers()
            vi.setSystemTime(new Date("2020-01-01T00:00:00.000Z"))
            
            const result = otpAdapter({})

            expect(result).toEqual({
                cellPhone: null,
                durationOtpCodeMinutes: 0,
                email: null,
                mfaToken: "",
                expirationDate: new Date("2020-01-01T00:00:00.000Z"),
            })
        })
    })

    describe("when getOtp receives complete otp data", () => {
        it("should return the adapted otp", () => {
            vi.useFakeTimers()
            vi.setSystemTime(new Date("2020-01-01T00:00:00.000Z"))

            const result = getOtp({
                cellPhone: "123***7890",
                durationOtpCodeMinutes: 5,
                email: "test@example.com",
                mfaToken: "mfa-token",
            })

            expect(result).toEqual({
                cellPhone: "123***7890",
                durationOtpCodeMinutes: 5,
                email: "test@example.com",
                mfaToken: "mfa-token",
                expirationDate: new Date("2020-01-01T00:05:00.000Z"),
            })
        })
    })

    describe("when getOtp receives incomplete otp data", () => {
        it("should return null", () => {
            const result = getOtp({
                durationOtpCodeMinutes: 5,
                mfaToken: "mfa-token",
            })

            expect(result).toBeNull()
        })
    })

    describe("when validateIdentificationAdapter receives ACTIVATE_ACCOUNT", () => {
        it("should return flow with otp", () => {
            vi.useFakeTimers()
            vi.setSystemTime(new Date("2020-01-01T00:00:00.000Z"))
            const result = validateIdentificationAdapter({
                nextStep: AuthFlow.ACTIVATE_ACCOUNT,
                cellPhone: "123***7890",
                durationOtpCodeMinutes: 5,
                email: "test@example.com",
                mfaToken: "mfa-token",
            })

            expect(result).toEqual({
                flow: AuthFlow.ACTIVATE_ACCOUNT,
                otp: {
                    cellPhone: "123***7890",
                    durationOtpCodeMinutes: 5,
                    email: "test@example.com",
                    mfaToken: "mfa-token",
                    expirationDate: new Date("2020-01-01T00:05:00.000Z"),
                },
            })
        })
    })

    describe("when validateIdentificationAdapter receives RESET_PASSWORD", () => {
        it("should return flow with otp", () => {
            vi.useFakeTimers()
            vi.setSystemTime(new Date("2020-01-01T00:00:00.000Z"))
            const result = validateIdentificationAdapter({
                nextStep: AuthFlow.RESET_PASSWORD,
                cellPhone: "123***7890",
                durationOtpCodeMinutes: 5,
                email: "test@example.com",
                mfaToken: "mfa-token",
            })

            expect(result).toEqual({
                flow: AuthFlow.RESET_PASSWORD,
                otp: {
                    cellPhone: "123***7890",
                    durationOtpCodeMinutes: 5,
                    email: "test@example.com",
                    mfaToken: "mfa-token",
                    expirationDate: new Date("2020-01-01T00:05:00.000Z"),
                },
            })
        })
    })

    describe("when validateIdentificationAdapter receives UPDATE_PERSONAL_INFORMATION", () => {
        it("should return update flow", () => {
            const result = validateIdentificationAdapter({
                nextStep: AuthFlow.UPDATE_PERSONAL_INFORMATION,
            })

            expect(result).toEqual({flow: AuthFlow.UPDATE_PERSONAL_INFORMATION})
        })
    })

    describe("when validateIdentificationAdapter receives unknown nextStep", () => {
        it("should fallback to LOGIN flow", () => {
            const result = validateIdentificationAdapter({
                nextStep: "UNKNOWN",
            })

            expect(result).toEqual({flow: AuthFlow.LOGIN})
        })
    })

    describe("when getTokenAdapter receives valid token payload", () => {
        it("should return token with expiration date", () => {
            vi.useFakeTimers()
            vi.setSystemTime(new Date("2020-01-01T00:00:00.000Z"))

            const result = getTokenAdapter({
                access_token: "access",
                refresh_token: "refresh",
                refresh_token_expires_in: 3600,
            })

            expect(result.accessToken).toBe("access")
            expect(result.refreshToken).toBe("refresh")
            expect(result.refreshTokenExpireDate).toEqual(new Date("2020-01-01T01:00:00.000Z"))
        })
    })

    describe("when getTokenAdapter receives invalid token payload", () => {
        it("should return empty strings and current time expiration", () => {
            vi.useFakeTimers()
            vi.setSystemTime(new Date("2020-01-01T00:00:00.000Z"))

            const result = getTokenAdapter(null)

            expect(result.accessToken).toBe("")
            expect(result.refreshToken).toBe("")
            expect(result.refreshTokenExpireDate).toEqual(new Date("2020-01-01T00:00:00.000Z"))
        })
    })
})
