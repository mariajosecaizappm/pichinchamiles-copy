import React from "react"
import {render, screen, fireEvent} from "@testing-library/react"
import {afterEach, describe, expect, it, vi} from "vitest"
import OtpFormBlocked from "@/presentation/components/Layout/OtpForm/components/OtpFormBlocked/OtpFormBlocked"

vi.mock("@/presentation/components/Layout/OtpForm/components/Countdown", async () => {
    const React = await import("react")
    return {
        default: (props: any) => (
            <button
                type="button"
                data-testid="mock-countdown"
                onClick={() => {
                    props.onTimeUpdate?.(5, 30)
                    props.onComplete?.()
                }}
            >
                00:10
            </button>
        ),
    }
})

vi.mock("@/presentation/components/icons/Icon", async () => {
    const React = await import("react")
    return {default: (props: any) => <div data-testid={`mock-icon-${props.name}`} {...props} />}
})

vi.mock("@/presentation/components/Form/components/Button", async () => {
    const React = await import("react")
    return {
        Button: ({children, onPress, testId}: any) => (
            <button
                type="button"
                data-testid={testId ?? "mock-button"}
                onClick={() => onPress?.()}
            >
                {children}
            </button>
        ),
    }
})

describe("OtpFormBlocked", () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when rendered", () => {
        it("should render the blocked message and continue button", () => {
            render(
                <OtpFormBlocked
                    blockedUntil={new Date("2030-01-01T00:00:00.000Z")}
                    onUnblock={vi.fn()}
                    onContinueBlockUser={vi.fn()}
                />,
            )

            expect(screen.getByTestId("mock-icon-icon-error")).toBeInTheDocument()
            expect(
                screen.getByText("¡Has superado el límite de intentos fallidos!"),
            ).toBeInTheDocument()
            expect(screen.getByTestId("continueOtp")).toHaveTextContent(
                "Entendido",
            )
        })
    })

    describe("when countdown completes", () => {
        it("should call onUnblock", () => {
            const onUnblock = vi.fn()
            render(
                <OtpFormBlocked
                    blockedUntil={new Date("2030-01-01T00:00:00.000Z")}
                    onUnblock={onUnblock}
                />,
            )

            fireEvent.click(screen.getByTestId("mock-countdown"))
            expect(onUnblock).toHaveBeenCalledTimes(1)
        })
    })

    describe("when continue button is pressed", () => {
        it("should call onContinueBlockUser", () => {
            const onContinueBlockUser = vi.fn()
            render(
                <OtpFormBlocked
                    blockedUntil={new Date("2030-01-01T00:00:00.000Z")}
                    onUnblock={vi.fn()}
                    onContinueBlockUser={onContinueBlockUser}
                />,
            )

            fireEvent.click(screen.getByTestId("continueOtp"))
            expect(onContinueBlockUser).toHaveBeenCalledTimes(1)
        })
    })

    describe("when countdown updates time", () => {
        it("should have aria-label on paragraph", () => {
            render(
                <OtpFormBlocked
                    blockedUntil={new Date("2030-01-01T00:00:00.000Z")}
                    onUnblock={vi.fn()}
                    onContinueBlockUser={vi.fn()}
                />,
            )

            const paragraph = screen.getByText(/Por motivos de seguridad/).closest("p") as HTMLElement
            expect(paragraph).toHaveAttribute("aria-label")
        })
    })
})

