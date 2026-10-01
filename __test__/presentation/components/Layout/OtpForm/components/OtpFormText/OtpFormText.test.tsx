import React from "react"
import {render, screen, fireEvent} from "@testing-library/react"
import {afterEach, describe, expect, it, vi} from "vitest"
import OtpFormText from "@/presentation/components/Layout/OtpForm/components/OtpFormText/OtpFormText"

const mocks = vi.hoisted(() => {
    let lastCountdownProps: any = null
    return {
        getCountdownProps: () => lastCountdownProps,
        setCountdownProps: (p: any) => (lastCountdownProps = p),
        reset: () => {
            lastCountdownProps = null
        },
    }
})

vi.mock("@/presentation/components/Layout/OtpForm/components/Countdown", async () => {
    const React = await import("react")

    return {
        default: (props: any) => {
            mocks.setCountdownProps(props)
            return (
                <button
                    type="button"
                    data-testid="mock-countdown"
                    onClick={() => props.onComplete?.()}
                >
                    01:02
                </button>
            )
        },
    }
})

vi.mock("@heroui/spinner", async () => {
    const React = await import("react")
    return {
        Spinner: (props: any) => (
            <div data-testid="mock-spinner">{props.label}</div>
        ),
    }
})

describe("OtpFormText", () => {
    afterEach(() => {
        vi.clearAllMocks()
        mocks.reset()
    })

    describe("when isResendingOtp is true", () => {
        it("should render the spinner label", () => {
            render(
                <OtpFormText
                    isExpired={false}
                    isResendingOtp
                    isInvalidAttempt={false}
                    otpExpiredDate={new Date("2030-01-01T00:00:00.000Z")}
                    onExpireOtp={vi.fn()}
                    onResendOtp={vi.fn()}
                />,
            )

            expect(screen.getByTestId("mock-spinner")).toHaveTextContent(
                "Reenviando código",
            )
        })
    })

    describe("when isExpired is true", () => {
        it("should render resend button and call onResendOtp", () => {
            const onResendOtp = vi.fn()
            render(
                <OtpFormText
                    isExpired
                    isResendingOtp={false}
                    isInvalidAttempt={false}
                    otpExpiredDate={new Date("2030-01-01T00:00:00.000Z")}
                    onExpireOtp={vi.fn()}
                    onResendOtp={onResendOtp}
                />,
            )

            fireEvent.click(screen.getByTestId("resendOtp"))

            expect(onResendOtp).toHaveBeenCalledTimes(1)
        })
    })

    describe("when isInvalidAttempt is true", () => {
        it("should show the error message and hide the countdown section", () => {
            const {container} = render(
                <OtpFormText
                    isExpired={false}
                    isResendingOtp={false}
                    isInvalidAttempt
                    otpExpiredDate={new Date("2030-01-01T00:00:00.000Z")}
                    onExpireOtp={vi.fn()}
                    onResendOtp={vi.fn()}
                />,
            )

            expect(
                screen.getByText("El código ingresado es incorrecto"),
            ).toBeInTheDocument()

            const countdownSpan = container.querySelector("span.hidden")
            expect(countdownSpan).not.toBeNull()
            expect(countdownSpan).toHaveTextContent("El código expira en")
        })
    })

    describe("when countdown completes", () => {
        it("should call onExpireOtp", () => {
            const onExpireOtp = vi.fn()
            const date = new Date("2030-01-01T00:00:00.000Z")
            render(
                <OtpFormText
                    isExpired={false}
                    isResendingOtp={false}
                    isInvalidAttempt={false}
                    otpExpiredDate={date}
                    onExpireOtp={onExpireOtp}
                    onResendOtp={vi.fn()}
                />,
            )

            expect(mocks.getCountdownProps().date).toBe(date)

            fireEvent.click(screen.getByTestId("mock-countdown"))
            expect(onExpireOtp).toHaveBeenCalledTimes(1)
        })
    })
})
