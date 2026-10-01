import React from "react"
import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"
import {ApiError} from "@/domain/entity/Error/models/ApiError"
import {ErrorCode} from "@/domain/entity/Error/structure/error"
import {
    defaultOtpFormValues,
    onOtpFormError,
    OTP_GENERIC_ERROR_MESSAGE,
    otpFormSchema,
} from "@/presentation/components/Layout/OtpForm/OtpFormConfig"

describe("OtpFormConfig", () => {
    describe("when defaultOtpFormValues is used", () => {
        it("should have an empty code", () => {
            expect(defaultOtpFormValues).toEqual({code: ""})
        })
    })

    describe("when otpFormSchema validates code", () => {
        it("should reject when code is missing", async () => {
            await expect(otpFormSchema.validate({code: undefined})).rejects.toMatchObject({
                message: "El código es requerido",
            })
        })

        it("should reject when code is shorter than 6 digits", async () => {
            await expect(otpFormSchema.validate({code: "12345"})).rejects.toBeTruthy()
        })

        it("should reject when code is longer than 6 digits", async () => {
            await expect(otpFormSchema.validate({code: "1234567"})).rejects.toBeTruthy()
        })

        it("should accept when code has exactly 6 digits", async () => {
            await expect(otpFormSchema.validate({code: "123456"})).resolves.toEqual({
                code: "123456",
            })
        })
    })

    describe("when OTP_GENERIC_ERROR_MESSAGE is rendered", () => {
        it("should show the generic error text with bold phone number", () => {
            render(<div>{OTP_GENERIC_ERROR_MESSAGE}</div>)

            expect(
                screen.getByText(
                    /Algo salió mal\. Inténtalo de nuevo o espera unos minutos\. Si el error persiste, llámanos al/i,
                ),
            ).toBeInTheDocument()
            expect(screen.getByText("1800-BPMILE (276-453)")).toBeInTheDocument()
            expect(screen.getByText("1800-BPMILE (276-453)").tagName).toBe("STRONG")
        })
    })

    describe("when onOtpFormError receives INVALID_ATTEMPT", () => {
        it("should mark the attempt as invalid and return null", () => {
            const setInvalidAttempt = vi.fn()
            const onBlock = vi.fn()

            const result = onOtpFormError(
                new ApiError(ErrorCode.INVALID_ATTEMPT),
                setInvalidAttempt,
                onBlock,
            )

            expect(setInvalidAttempt).toHaveBeenCalledWith(true)
            expect(onBlock).not.toHaveBeenCalled()
            expect(result).toBeNull()
        })
    })

    describe("when onOtpFormError receives USER_BLOCKED", () => {
        beforeEach(() => {
            vi.useFakeTimers()
            vi.setSystemTime(new Date("2026-08-14T20:00:00.000Z"))
        })

        afterEach(() => {
            vi.useRealTimers()
        })

        it("should return the generic error message when metadata is missing", () => {
            const setInvalidAttempt = vi.fn()
            const onBlock = vi.fn()

            const result = onOtpFormError(
                new ApiError(ErrorCode.USER_BLOCKED),
                setInvalidAttempt,
                onBlock,
            )

            expect(result).toBe(OTP_GENERIC_ERROR_MESSAGE)
            expect(setInvalidAttempt).not.toHaveBeenCalled()
            expect(onBlock).not.toHaveBeenCalled()
        })

        it("should block the user until metadata minutes elapse and return null", () => {
            const setInvalidAttempt = vi.fn()
            const onBlock = vi.fn()

            const result = onOtpFormError(
                new ApiError(ErrorCode.USER_BLOCKED, {minutes: 5}),
                setInvalidAttempt,
                onBlock,
            )

            expect(result).toBeNull()
            expect(setInvalidAttempt).not.toHaveBeenCalled()
            expect(onBlock).toHaveBeenCalledTimes(1)

            const blockedUntil = onBlock.mock.calls[0][0] as Date
            expect(blockedUntil.getTime()).toBe(
                new Date("2026-08-14T20:05:00.000Z").getTime(),
            )
        })
    })

    describe("when onOtpFormError receives an unhandled code", () => {
        it("should return the generic error message", () => {
            const setInvalidAttempt = vi.fn()
            const onBlock = vi.fn()

            const result = onOtpFormError(
                new ApiError(ErrorCode.UNKNOWN),
                setInvalidAttempt,
                onBlock,
            )

            expect(result).toBe(OTP_GENERIC_ERROR_MESSAGE)
            expect(setInvalidAttempt).not.toHaveBeenCalled()
            expect(onBlock).not.toHaveBeenCalled()
        })
    })
})
