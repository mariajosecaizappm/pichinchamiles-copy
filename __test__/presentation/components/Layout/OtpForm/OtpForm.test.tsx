import React from "react"
import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import {afterEach, describe, expect, it, vi, beforeEach} from "vitest"
import OtpForm from "@/presentation/components/Layout/OtpForm/OtpForm"
import { OTP_GENERIC_ERROR_MESSAGE } from "@/presentation/components/Layout/OtpForm/OtpFormConfig"
import { maskedEmail } from "@/presentation/helpers/member"
import {ScreenReaderProvider} from "@/presentation/components/providers/ScreenReaderProvider"

const mocks = vi.hoisted(() => {
    const addAlert = vi.fn()
    const clearAlert = vi.fn()
    const submitForm = vi.fn()
    const reset = vi.fn()
    const onResendOtp = vi.fn()
    const onSubmitOtp = vi.fn()
    const onContinueBlockUser = vi.fn()
    const onBlockUser = vi.fn()
    const onUnblockUser = vi.fn()
    const onOtpFormError = vi.fn()
    let isMutationPending = false
    let lastFormProps: any = null
    let lastOtpInputProps: any = null
    let lastOtpFormTextProps: any = null
    let lastBlockedProps: any = null

    return {
        addAlert,
        clearAlert,
        submitForm,
        reset,
        onResendOtp,
        onSubmitOtp,
        onContinueBlockUser,
        onBlockUser,
        onUnblockUser,
        onOtpFormError,
        setIsMutationPending: (value: boolean) => (isMutationPending = value),
        getIsMutationPending: () => isMutationPending,
        getLastFormProps: () => lastFormProps,
        setLastFormProps: (p: any) => (lastFormProps = p),
        getLastOtpInputProps: () => lastOtpInputProps,
        setLastOtpInputProps: (p: any) => (lastOtpInputProps = p),
        getLastOtpFormTextProps: () => lastOtpFormTextProps,
        setLastOtpFormTextProps: (p: any) => (lastOtpFormTextProps = p),
        getLastBlockedProps: () => lastBlockedProps,
        setLastBlockedProps: (p: any) => (lastBlockedProps = p),
        resetAll: () => {
            lastFormProps = null
            lastOtpInputProps = null
            lastOtpFormTextProps = null
            lastBlockedProps = null
        },
    }
})

vi.mock("@tanstack/react-query", () => ({
    useMutation: ({mutationFn, onError}: any) => {
        const mutateAsync = async (...args: any[]) => {
            return await mutationFn(...args)
        }
        const mutate = async (...args: any[]) => {
            try {
                await mutateAsync(...args)
            } catch (e) {
                onError?.(e)
            }
        }
        return {
            mutate,
            mutateAsync,
            isPending: mocks.getIsMutationPending(),
        }
    },
}))

vi.mock("@heroui/divider", async () => {
    const React = await import("react")
    return {Divider: (props: any) => <hr data-testid="mock-divider" {...props} />}
})

vi.mock("@/presentation/components/Layout/OtpForm/OtpFormConfig", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/presentation/components/Layout/OtpForm/OtpFormConfig")>()
    return {
        ...actual,
        onOtpFormError: (...args: any[]) => mocks.onOtpFormError(...args),
    }
})

vi.mock("@/presentation/components/Form/context/Form", async () => {
    const React = await import("react")
    return {
        default: React.forwardRef((props: any, ref: any) => {
            mocks.setLastFormProps(props)
            React.useImperativeHandle(ref, () => ({
                addAlert: mocks.addAlert,
                clearAlert: mocks.clearAlert,
                submitForm: mocks.submitForm,
                reset: mocks.reset,
            }))
            return (
                <div data-testid="mock-form">
                    <button
                        type="button"
                        data-testid="trigger-submit"
                        onClick={() => props.onSubmit?.({code: "654321"})}
                    >
                        submit
                    </button>
                    <button
                        type="button"
                        data-testid="trigger-error"
                        onClick={() => props.onError?.({} as any)}
                    >
                        error
                    </button>
                    {props.children}
                </div>
            )
        }),
    }
})

vi.mock("@/presentation/components/Form/controls/FormOtpInput", async () => {
    const React = await import("react")
    return {
        default: (props: any) => {
            mocks.setLastOtpInputProps(props)
            return (
                <div
                    data-testid="mock-form-otp-input"
                    data-disabled={String(!!props.disabled)}
                    data-invalid={String(!!props.isInvalid)}
                >
                    <button
                        type="button"
                        data-testid="trigger-input"
                        onClick={() => props.onInput?.()}
                    >
                        input
                    </button>
                    <button
                        type="button"
                        data-testid="trigger-complete"
                        onClick={() => props.onComplete?.()}
                    >
                        complete
                    </button>
                    {props.leftHelperText}
                </div>
            )
        },
    }
})

vi.mock(
    "@/presentation/components/Layout/OtpForm/components/OtpFormText",
    async () => {
        const React = await import("react")
        return {
            default: (props: any) => {
                mocks.setLastOtpFormTextProps(props)
                return (
                    <div data-testid="mock-otp-form-text">
                        <div data-testid="expired-flag">
                            {String(!!props.isExpired)}
                        </div>
                        <button
                            type="button"
                            data-testid="expire"
                            onClick={() => props.onExpireOtp?.()}
                        >
                            expire
                        </button>
                        <button
                            type="button"
                            data-testid="resend"
                            onClick={() => props.onResendOtp?.()}
                        >
                            resend
                        </button>
                    </div>
                )
            },
        }
    },
)

vi.mock(
    "@/presentation/components/Layout/OtpForm/components/OtpFormAccordion",
    async () => {
        const React = await import("react")
        return {default: () => <div data-testid="mock-accordion" />}
    },
)

vi.mock(
    "@/presentation/components/Layout/OtpForm/components/OtpFormBlocked",
    async () => {
        const React = await import("react")
        return {
            default: (props: any) => {
                mocks.setLastBlockedProps(props)
                return (
                    <div data-testid="mock-otp-form-blocked">
                        <button
                            type="button"
                            data-testid="unblock"
                            onClick={() => props.onUnblock?.()}
                        >
                            unblock
                        </button>
                    </div>
                )
            },
        }
    },
)

const otp = {
    cellPhone: "1234",
    durationOtpCodeMinutes: 1,
    email: "user@example.com",
    mfaToken: "mfa-token",
}

describe("OtpForm", () => {
    beforeEach(() => {
        mocks.resetAll()
        mocks.addAlert.mockReset()
        mocks.clearAlert.mockReset()
        mocks.submitForm.mockReset()
        mocks.reset.mockReset()
        mocks.onResendOtp.mockReset()
        mocks.onSubmitOtp.mockReset()
        mocks.onContinueBlockUser.mockReset()
        mocks.onBlockUser.mockReset()
        mocks.onUnblockUser.mockReset()
        mocks.onOtpFormError.mockReset()
        mocks.setIsMutationPending(false)

        mocks.onSubmitOtp.mockResolvedValue(undefined)
        mocks.onResendOtp.mockResolvedValue(undefined)
        mocks.onOtpFormError.mockImplementation(
            (_error: any, _setInvalidAttempt: any, handleBlock: any) => {
                handleBlock(new Date("2030-01-01T00:00:00.000Z"))
            },
        )
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when rendered", () => {
        it("should show masked email and phone", () => {
            render(
                <ScreenReaderProvider>
                    <OtpForm
                        otp={otp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                    />
                </ScreenReaderProvider>,
            )

            expect(
                screen.getByText((text) => text.includes(maskedEmail("user@example.com"))),
            ).toBeInTheDocument()
            expect(
                screen.getByText((text) => text.includes("[*******1234]")),
            ).toBeInTheDocument()
        })

        it("should pass the expected props to Form", () => {
            render(
                <ScreenReaderProvider>
                    <OtpForm
                        otp={otp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                    />
                </ScreenReaderProvider>,
            )

            const props = mocks.getLastFormProps()
            expect(props.className).toBe("w-full flex-1")
            expect(props.formErrorId).toBe("formsAlert")
        })

        it("should configure the otp input and helper text props", () => {
            render(
                <ScreenReaderProvider>
                    <OtpForm
                        otp={otp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                    />
                </ScreenReaderProvider>,
            )

            const otpInputProps = mocks.getLastOtpInputProps()
            expect(otpInputProps.name).toBe("code")
            expect(otpInputProps.testId).toBe("inputOtp")
            expect(otpInputProps.length).toBe(6)
            expect(otpInputProps.className).toBe("max-w-102 mx-auto w-full")
            expect(otpInputProps.classNames).toEqual({
                segmentWrapper: "justify-between w-full gap-2",
                segment: "flex-1 !w-auto h-[48px]",
            })

            const otpFormTextProps = mocks.getLastOtpFormTextProps()
            expect(otpFormTextProps.errorId).toBe("code-error")
        })

        it("should mask email when it has no domain separator", () => {
            render(
                <ScreenReaderProvider>
                    <OtpForm
                        otp={{...otp, email: "abcdef"} as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                    />
                </ScreenReaderProvider>,
            )

            expect(
                screen.getByText((text) => text.includes(maskedEmail("abcdef"))),
            ).toBeInTheDocument()
        })

        it("should show empty contact placeholders when email and phone are missing", () => {
            render(
                <ScreenReaderProvider>
                    <OtpForm
                        otp={{...otp, email: null, cellPhone: null} as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                    />
                </ScreenReaderProvider>,
            )

            expect(
                screen.getByText((text) => text.includes("celular []")),
            ).toBeInTheDocument()
        })
    })

    describe("when otp expires", () => {
        it("should add a non-dismissible alert and disable the input", async () => {
            render(
                <ScreenReaderProvider>
                    <OtpForm
                        otp={otp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                    />
                </ScreenReaderProvider>,
            )

            expect(screen.getByTestId("expired-flag")).toHaveTextContent("false")
            expect(screen.getByTestId("mock-form-otp-input")).toHaveAttribute(
                "data-disabled",
                "false",
            )

            fireEvent.click(screen.getByTestId("expire"))

            await waitFor(() => {
                expect(mocks.addAlert).toHaveBeenCalledTimes(1)
            })

            expect(mocks.addAlert).toHaveBeenCalledWith({
                content:
                    "El tiempo de duración del código ha expirado. Reenvía el código e intenta nuevamente.",
                dismiss: false,
            })

            expect(screen.getByTestId("expired-flag")).toHaveTextContent("true")
            expect(screen.getByTestId("mock-form-otp-input")).toHaveAttribute(
                "data-disabled",
                "true",
            )
        })
    })

    describe("when otp input completes", () => {
        it("should submit the form", () => {
            render(
                <ScreenReaderProvider>
                    <OtpForm
                        otp={otp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                    />
                </ScreenReaderProvider>,
            )

            fireEvent.click(screen.getByTestId("trigger-complete"))

            expect(mocks.submitForm).toHaveBeenCalledTimes(1)
        })
    })

    describe("when form submits", () => {
        it("should map values to mfaRequest and call onSubmitOtp", async () => {
            render(
                <ScreenReaderProvider>
                    <OtpForm
                        otp={otp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                    />
                </ScreenReaderProvider>,
            )

            fireEvent.click(screen.getByTestId("trigger-submit"))

            await waitFor(() => {
                expect(mocks.onSubmitOtp).toHaveBeenCalledWith({
                    mfaToken: "mfa-token",
                    mfaCode: "654321",
                })
            })
        })
    })

    describe("when resend otp is triggered", () => {
        it("should clear alerts, reset form and call onResendOtp", async () => {
            render(
                <ScreenReaderProvider>
                    <OtpForm
                        otp={otp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                    />
                </ScreenReaderProvider>,
            )

            fireEvent.click(screen.getByTestId("resend"))

            await waitFor(() => {
                expect(mocks.onResendOtp).toHaveBeenCalledTimes(1)
            })
            expect(mocks.clearAlert).toHaveBeenCalledTimes(1)
            expect(mocks.reset).toHaveBeenCalledTimes(1)
        })

        it("should show an alert when resend otp fails", async () => {
            mocks.onResendOtp.mockRejectedValueOnce(new Error("network"))

            render(
                <ScreenReaderProvider>
                    <OtpForm
                        otp={otp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                    />
                </ScreenReaderProvider>,
            )

            fireEvent.click(screen.getByTestId("resend"))

            await waitFor(() => {
                expect(mocks.addAlert).toHaveBeenCalledWith(OTP_GENERIC_ERROR_MESSAGE)
            })
        })

        it("should pass pending state to the helper text", () => {
            mocks.setIsMutationPending(true)

            render(
                <ScreenReaderProvider>
                    <OtpForm
                        otp={otp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                    />
                </ScreenReaderProvider>,
            )

            const otpFormTextProps = mocks.getLastOtpFormTextProps()
            expect(otpFormTextProps.isResendingOtp).toBe(true)
        })
    })

    describe("when onOtpFormError marks the attempt as invalid", () => {
        it("should set invalid flag and clear it on input", async () => {
            mocks.onOtpFormError.mockImplementationOnce(
                (_error: any, setInvalidAttempt: any) => {
                    setInvalidAttempt(true)
                },
            )

            render(
                <ScreenReaderProvider>
                    <OtpForm
                        otp={otp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                    />
                </ScreenReaderProvider>,
            )

            fireEvent.click(screen.getByTestId("trigger-error"))

            await waitFor(() => {
                expect(screen.getByTestId("mock-form-otp-input")).toHaveAttribute(
                    "data-invalid",
                    "true",
                )
            })

            fireEvent.click(screen.getByTestId("trigger-input"))

            expect(screen.getByTestId("mock-form-otp-input")).toHaveAttribute(
                "data-invalid",
                "false",
            )
        })
    })

    describe("when onOtpFormError blocks the user", () => {
        it("should render OtpFormBlocked", async () => {
            render(
                <ScreenReaderProvider>
                    <OtpForm
                        otp={otp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                        onContinueBlockUser={mocks.onContinueBlockUser}
                        onBlockUser={mocks.onBlockUser}
                        onUnblockUser={mocks.onUnblockUser}
                    />
                </ScreenReaderProvider>,
            )

            fireEvent.click(screen.getByTestId("trigger-error"))

            await waitFor(() => {
                expect(
                    screen.getByTestId("mock-otp-form-blocked"),
                ).toBeInTheDocument()
            })

            const blockedProps = mocks.getLastBlockedProps()
            expect(blockedProps.blockedUntil).toEqual(
                new Date("2030-01-01T00:00:00.000Z"),
            )
            expect(blockedProps.onContinueBlockUser).toBe(mocks.onContinueBlockUser)
            expect(mocks.onBlockUser).toHaveBeenCalledWith(
                new Date("2030-01-01T00:00:00.000Z"),
            )
        })

        it("should call onUnblockUser when unblocked", async () => {
            render(
                <ScreenReaderProvider>
                    <OtpForm
                        otp={otp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                        onUnblockUser={mocks.onUnblockUser}
                    />
                </ScreenReaderProvider>,
            )

            fireEvent.click(screen.getByTestId("trigger-error"))

            await waitFor(() => {
                expect(
                    screen.getByTestId("mock-otp-form-blocked"),
                ).toBeInTheDocument()
            })

            fireEvent.click(screen.getByTestId("unblock"))

            expect(mocks.onUnblockUser).toHaveBeenCalledTimes(1)
            expect(screen.getByTestId("mock-form")).toBeInTheDocument()
        })
    })
})
