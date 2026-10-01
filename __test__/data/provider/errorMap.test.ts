import {describe, it, expect} from "vitest"
import type {AxiosError} from "axios"
import {ApiError} from "@/domain/entity/Error/models/ApiError"
import {ErrorCode} from "@/domain/entity/Error/structure/error"
import {getError} from "@/data/provider/errorMap"

type ErrorResponseData = {
    httpCode: number
    message: string
    code: string
    details?: unknown
}

function createAxiosError(args: {
    url?: string
    baseURL?: string
    status?: number
    data?: ErrorResponseData
}): AxiosError<ErrorResponseData> {
    const error = {
        name: "AxiosError",
        message: "request failed",
        config: {
            url: args.url,
            baseURL: args.baseURL,
        },
        response:
            args.status !== undefined || args.data !== undefined
                ? {
                    status: args.status,
                    data: args.data,
                }
                : undefined,
        isAxiosError: true,
        toJSON: () => ({}),
    } as unknown as AxiosError<ErrorResponseData>

    return error
}

const uuid = "123e4567-e89b-12d3-a456-426614174000"

describe("getError", () => {
    describe("when error has no url", () => {
        it("should return original error", () => {
            const error = createAxiosError({})
            expect(getError(error)).toBe(error)
        })
    })

    describe("when request matches identifications onboarding and status is 400", () => {
        it("should map to INVALID_USER", () => {
            const error = createAxiosError({
                url: `/identity-api/${uuid}/users/members/onboardings/identifications`,
                status: 400,
                data: {httpCode: 400, message: "bad request", code: "400"},
            })

            const mapped = getError(error)
            expect(mapped).toBeInstanceOf(ApiError)
            expect((mapped as ApiError).code).toBe(ErrorCode.INVALID_USER)
        })
    })

    describe("when request matches OTP validation and code is 101", () => {
        it("should map to INVALID_ATTEMPT with remaining attempts", () => {
            const error = createAxiosError({
                url: `/identity-api/oauth/token`,
                status: 400,
                data: {
                    httpCode: 400,
                    message: "invalid attempt",
                    code: "101",
                    details: JSON.stringify({Minutes: "00:00:00", ValidAttempts: 2}),
                },
            })

            const mapped = getError(error) as ApiError
            expect(mapped).toBeInstanceOf(ApiError)
            expect(mapped.code).toBe(ErrorCode.INVALID_ATTEMPT)
            expect(mapped.metadata).toEqual({remainingAttempts: 2})
        })
    })

    describe("when request matches OTP validation and attempts are zero", () => {
        it("should map to USER_BLOCKED with minutes", () => {
            const error = createAxiosError({
                url: `/identity-api/${uuid}/users/members/auth/login/v2/validate-otp`,
                status: 400,
                data: {
                    httpCode: 400,
                    message: "blocked",
                    code: "999",
                    details: {Minutes: "00:10:00", ValidAttempts: 0},
                },
            })

            const mapped = getError(error) as ApiError
            expect(mapped).toBeInstanceOf(ApiError)
            expect(mapped.code).toBe(ErrorCode.USER_BLOCKED)
            expect(mapped.metadata).toEqual({minutes: 10})
        })
    })

    describe("when request matches activate accounts and status is 400", () => {
        it("should map to UNKNOWN", () => {
            const error = createAxiosError({
                url: `/identity-api/${uuid}/users/members/v2/activate-accounts`,
                status: 400,
                data: {httpCode: 400, message: "bad request", code: "400"},
            })

            const mapped = getError(error) as ApiError
            expect(mapped).toBeInstanceOf(ApiError)
            expect(mapped.code).toBe(ErrorCode.UNKNOWN)
        })
    })

    describe("when request matches transfer beneficiary lookup", () => {
        it("should map 400 to BENEFICIARY_NOT_FOUND", () => {
            const error = createAxiosError({
                url: `/points-transactions-api/${uuid}/users/members/1723456789`,
                status: 400,
                data: {httpCode: 400, message: "not found", code: "400"},
            })

            const mapped = getError(error) as ApiError
            expect(mapped).toBeInstanceOf(ApiError)
            expect(mapped.code).toBe(ErrorCode.BENEFICIARY_NOT_FOUND)
        })

        it("should map 404 to BENEFICIARY_NOT_FOUND", () => {
            const error = createAxiosError({
                url: `/points-transactions-api/${uuid}/users/members/1723456789`,
                status: 404,
                data: {httpCode: 404, message: "not found", code: "404"},
            })

            const mapped = getError(error) as ApiError
            expect(mapped).toBeInstanceOf(ApiError)
            expect(mapped.code).toBe(ErrorCode.BENEFICIARY_NOT_FOUND)
        })
    })

    describe("when url is absolute and baseURL is provided", () => {
        it("should still match and map correctly", () => {
            const error = createAxiosError({
                url: "https://api.example.com/identity-api/oauth/token",
                baseURL: "https://api.example.com",
                status: 400,
                data: {
                    httpCode: 400,
                    message: "invalid attempt",
                    code: "101",
                    details: JSON.stringify({Minutes: "00:00:00", ValidAttempts: 1}),
                },
            })

            const mapped = getError(error) as ApiError
            expect(mapped).toBeInstanceOf(ApiError)
            expect(mapped.code).toBe(ErrorCode.INVALID_ATTEMPT)
            expect(mapped.metadata).toEqual({remainingAttempts: 1})
        })
    })

    describe("when request does not match any route handler", () => {
        it("should return original error", () => {
            const error = createAxiosError({
                url: `/unmatched/${uuid}`,
                status: 400,
                data: {httpCode: 400, message: "bad request", code: "400"},
            })

            expect(getError(error)).toBe(error)
        })
    })
})

