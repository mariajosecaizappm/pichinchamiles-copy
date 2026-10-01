import React from "react"
import {render, screen, fireEvent} from "@testing-library/react"
import {afterEach, describe, expect, it, vi} from "vitest"
import OtpInputContainer from "@/presentation/components/Form/components/OtpInput/OtpInputContainer"
import {ScreenReaderProvider} from "@/presentation/components/providers/ScreenReaderProvider"

const mocks = vi.hoisted(() => {
    const receivedProps: any[] = []
    return {receivedProps}
})

vi.mock("@heroui/react", async () => {
    const React = await import("react")
    return {
        InputOtp: (props: any) => {
            mocks.receivedProps.push(props)
            return (
                <input
                    data-testid="mock-input-otp"
                    value={props.value ?? ""}
                    data-type={props.type}
                    disabled={props.disabled}
                    onChange={(e) => props.onValueChange?.(e.target.value)}
                />
            )
        },
    }
})

describe("OtpInputContainer", () => {
    afterEach(() => {
        vi.clearAllMocks()
        mocks.receivedProps.length = 0
    })

    describe("when rendered with no value", () => {
        it("should hide the visibility toggle", () => {
            render(
                <ScreenReaderProvider>
                    <OtpInputContainer testId="otp" length={6} />
                </ScreenReaderProvider>,
            )

            const toggle = screen.getByRole("button", {name: "Ocultar código. Ocultar los dígitos ingresados."})
            expect(toggle).toHaveClass("opacity-0")
            expect(toggle).toHaveClass("invisible")
        })
    })

    describe("when user types a value", () => {
        it("should show the visibility toggle and allow switching between text and password", () => {
            render(
                <ScreenReaderProvider>
                    <OtpInputContainer testId="otp" length={6} />
                </ScreenReaderProvider>,
            )

            fireEvent.change(screen.getByTestId("mock-input-otp"), {
                target: {value: "123"},
            })

            const toggle = screen.getByRole("button", {name: "Ocultar código. Ocultar los dígitos ingresados."})
            expect(toggle).toHaveClass("opacity-100")
            expect(toggle).toHaveClass("visible")

            expect(screen.getByTestId("mock-input-otp")).toHaveAttribute(
                "data-type",
                "text",
            )

            fireEvent.click(toggle)
            expect(
                screen.getByRole("button", {name: "Mostrar código. Mostrar los dígitos ingresados."}),
            ).toBeInTheDocument()
            expect(screen.getByTestId("mock-input-otp")).toHaveAttribute(
                "data-type",
                "password",
            )
        })
    })

    describe("when onValueChange is provided", () => {
        it("should call it with the new value", () => {
            const onValueChange = vi.fn()
            render(
                <ScreenReaderProvider>
                    <OtpInputContainer
                        testId="otp"
                        length={6}
                        onValueChange={onValueChange}
                    />
                </ScreenReaderProvider>,
            )

            fireEvent.change(screen.getByTestId("mock-input-otp"), {
                target: {value: "123"},
            })

            expect(onValueChange).toHaveBeenCalledWith("123")
        })
    })
})

