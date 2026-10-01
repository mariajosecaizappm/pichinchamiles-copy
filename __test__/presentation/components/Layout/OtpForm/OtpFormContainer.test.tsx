import React from "react"
import {render} from "@testing-library/react"
import {describe, it, expect, vi, afterEach, beforeEach} from "vitest"
import OtpFormContainer from "@/presentation/components/Layout/OtpForm/OtpFormContainer"
import { OTP_GENERIC_ERROR_MESSAGE } from "@/presentation/components/Layout/OtpForm/OtpFormConfig"
import { maskedEmail } from "@/presentation/helpers/member"
import {ScreenReaderProvider} from "@/presentation/components/providers/ScreenReaderProvider"
import {ApiError} from "@/domain/entity/Error/models/ApiError"
import {ErrorCode} from "@/domain/entity/Error/structure/error"

const mocks = vi.hoisted(() => {
    const onSubmitOtp = vi.fn()
    const onResendOtp = vi.fn()
    const onBlockUser = vi.fn()
    const onUnblockUser = vi.fn()
    const onContinueBlockUser = vi.fn()
    const info = vi.fn()
    let lastRenderProps: any = null

    return {
        onSubmitOtp,
        onResendOtp,
        onBlockUser,
        onUnblockUser,
        onContinueBlockUser,
        info,
        getLastRenderProps: () => lastRenderProps,
        setLastRenderProps: (p: any) => (lastRenderProps = p),
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
            isPending: false,
        }
    },
}))

vi.mock("@/presentation/helpers/numberToWords", () => ({
    numberToWords: (num: string) => num.split("").join(", "),
}))

vi.mock("@/presentation/components/providers/ScreenReaderProvider", () => ({
    ScreenReaderProvider: ({children}: {children: React.ReactNode}) => children,
    ScreenReaderContext: { current: null },
    useScreenReader: () => ({ info: mocks.info }),
}))

const otp = {
    cellPhone: "1234",
    durationOtpCodeMinutes: 1,
    email: "user@example.com",
    mfaToken: "mfa-token",
}

describe("OtpFormContainer", () => {
    beforeEach(() => {
        mocks.onSubmitOtp.mockReset()
        mocks.onResendOtp.mockReset()
        mocks.onBlockUser.mockReset()
        mocks.onUnblockUser.mockReset()
        mocks.onContinueBlockUser.mockReset()
        mocks.info.mockReset()
        mocks.setLastRenderProps(null)

        mocks.onSubmitOtp.mockResolvedValue(undefined)
        mocks.onResendOtp.mockResolvedValue(undefined)
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when rendered", () => {
        it("should pass correct props to children function", () => {
            const TestComponent = () => (
                <ScreenReaderProvider>
                    <OtpFormContainer
                        otp={otp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                        onBlockUser={mocks.onBlockUser}
                        onUnblockUser={mocks.onUnblockUser}
                        onContinueBlockUser={mocks.onContinueBlockUser}
                    >
                        {(props) => {
                            mocks.setLastRenderProps(props)
                            return <div data-testid="test-component">Test</div>
                        }}
                    </OtpFormContainer>
                </ScreenReaderProvider>
            )

            render(<TestComponent />)

            const props = mocks.getLastRenderProps()
            expect(props).toBeDefined()
            expect(props.handleSubmit).toBeDefined()
            expect(props.resendOtp).toBeDefined()
            expect(props.isResendingOtp).toBe(false)
            expect(props.isExpired).toBe(false)
            expect(props.blockedUntil).toBe(null)
            expect(props.invalidAttempt).toBe(false)
            expect(props.phone).toBe("*******1234")
            expect(props.email).toBe(maskedEmail("user@example.com"))
            expect(props.emailDomain).toBe("example.com")
            expect(props.phoneDigits).toBe("1234")
            expect(props.phoneDigitsWords).toBe("1, 2, 3, 4")
        })

        it("should mask email when it has no domain separator", () => {
            const TestComponent = () => (
                <ScreenReaderProvider>
                    <OtpFormContainer
                        otp={{...otp, email: "abcdef"} as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                    >
                        {(props) => {
                            mocks.setLastRenderProps(props)
                            return <div data-testid="test-component">Test</div>
                        }}
                    </OtpFormContainer>
                </ScreenReaderProvider>
            )

            render(<TestComponent />)

            const props = mocks.getLastRenderProps()
            expect(props.email).toBe(maskedEmail("abcdef"))
            expect(props.emailDomain).toBe("")
        })

        it("should show empty contact placeholders when email and phone are missing", () => {
            const TestComponent = () => (
                <ScreenReaderProvider>
                    <OtpFormContainer
                        otp={{...otp, email: null, cellPhone: null} as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                    >
                        {(props) => {
                            mocks.setLastRenderProps(props)
                            return <div data-testid="test-component">Test</div>
                        }}
                    </OtpFormContainer>
                </ScreenReaderProvider>
            )

            render(<TestComponent />)

            const props = mocks.getLastRenderProps()
            expect(props.phone).toBe("")
            expect(props.email).toBe("")
        })

        it("should announce email domain to screen reader", () => {
            const TestComponent = () => (
                <ScreenReaderProvider>
                    <OtpFormContainer
                        otp={otp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                    >
                        {(props) => <div data-testid="test-component">Test</div>}
                    </OtpFormContainer>
                </ScreenReaderProvider>
            )

            render(<TestComponent />)

            expect(mocks.info).toHaveBeenCalledWith("Dominio del correo electrónico: example.com")
        })

        it("should announce phone digits to screen reader", () => {
            const TestComponent = () => (
                <ScreenReaderProvider>
                    <OtpFormContainer
                        otp={otp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                    >
                        {(props) => <div data-testid="test-component">Test</div>}
                    </OtpFormContainer>
                </ScreenReaderProvider>
            )

            render(<TestComponent />)

            expect(mocks.info).toHaveBeenCalledWith("Celular terminado en 1, 2, 3, 4")
        })
    })

    describe("when otp expires", () => {
        it("should set isExpired to true when otpExpiredDate is in the past", () => {
            const expiredOtp = {
                ...otp,
                expirationDate: new Date(Date.now() - 1000) // 1 second ago
            }

            const TestComponent = () => (
                <ScreenReaderProvider>
                    <OtpFormContainer
                        otp={expiredOtp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                    >
                        {(props) => {
                            mocks.setLastRenderProps(props)
                            return <div data-testid="test-component">Test</div>
                        }}
                    </OtpFormContainer>
                </ScreenReaderProvider>
            )

            render(<TestComponent />)

            const props = mocks.getLastRenderProps()
            expect(props.isExpired).toBe(true)
        })
    })

    describe("when handleSubmit is called", () => {
        it("should call onSubmitOtp with correct mfaRequest", async () => {
            const TestComponent = () => (
                <ScreenReaderProvider>
                    <OtpFormContainer
                        otp={otp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                    >
                        {(props) => {
                            mocks.setLastRenderProps(props)
                            return <div data-testid="test-component">Test</div>
                        }}
                    </OtpFormContainer>
                </ScreenReaderProvider>
            )

            render(<TestComponent />)

            const props = mocks.getLastRenderProps()
            await props.handleSubmit({code: "654321"})

            expect(mocks.onSubmitOtp).toHaveBeenCalledWith({
                mfaToken: "mfa-token",
                mfaCode: "654321",
            })
        })

        it("should convert an unknown submission error to ApiError.UNKNOWN", async () => {
            mocks.onSubmitOtp.mockRejectedValueOnce(new Error("network error"))

            render(
                <ScreenReaderProvider>
                    <OtpFormContainer
                        otp={otp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                    >
                        {(props) => {
                            mocks.setLastRenderProps(props)
                            return <div>Test</div>
                        }}
                    </OtpFormContainer>
                </ScreenReaderProvider>,
            )

            await expect(
                mocks.getLastRenderProps().handleSubmit({code: "654321"}),
            ).rejects.toMatchObject({
                code: ErrorCode.UNKNOWN,
            })
        })

        it("should preserve mapped ApiError instances", async () => {
            const apiError = new ApiError(ErrorCode.INVALID_ATTEMPT)
            mocks.onSubmitOtp.mockRejectedValueOnce(apiError)

            render(
                <ScreenReaderProvider>
                    <OtpFormContainer
                        otp={otp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                    >
                        {(props) => {
                            mocks.setLastRenderProps(props)
                            return <div>Test</div>
                        }}
                    </OtpFormContainer>
                </ScreenReaderProvider>,
            )

            await expect(
                mocks.getLastRenderProps().handleSubmit({code: "654321"}),
            ).rejects.toBe(apiError)
        })
    })

    describe("when resendOtp is called", () => {
        it("should call onResendOtp and reset expired state", async () => {
            const TestComponent = () => (
                <ScreenReaderProvider>
                    <OtpFormContainer
                        otp={otp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                    >
                        {(props) => {
                            mocks.setLastRenderProps(props)
                            return <div data-testid="test-component">Test</div>
                        }}
                    </OtpFormContainer>
                </ScreenReaderProvider>
            )

            const { rerender } = render(<TestComponent />)

            let props = mocks.getLastRenderProps()
            // First set as expired
            props.handleExpireOtp()
            
            // Rerender to get updated props
            rerender(<TestComponent />)
            props = mocks.getLastRenderProps()
            expect(props.isExpired).toBe(true)

            // Then resend
            await props.resendOtp()
            
            // Rerender again to get updated props
            rerender(<TestComponent />)
            props = mocks.getLastRenderProps()
            expect(mocks.onResendOtp).toHaveBeenCalledTimes(1)
            expect(props.isExpired).toBe(false)
        })

        it("should handle resend otp error", async () => {
            mocks.onResendOtp.mockRejectedValueOnce(new Error("network"))
            
            const TestComponent = () => (
                <ScreenReaderProvider>
                    <OtpFormContainer
                        otp={otp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                    >
                        {(props) => {
                            mocks.setLastRenderProps(props)
                            return <div data-testid="test-component">Test</div>
                        }}
                    </OtpFormContainer>
                </ScreenReaderProvider>
            )

            render(<TestComponent />)

            const props = mocks.getLastRenderProps()
            
            // Mock formRef.current?.addAlert
            const addAlertMock = vi.fn()
            props.formRef.current = { addAlert: addAlertMock } as any

            await props.resendOtp()

            expect(addAlertMock).toHaveBeenCalledWith(OTP_GENERIC_ERROR_MESSAGE)
        })
    })

    describe("when handleBlock is called", () => {
        it("should set blockedUntil and call onBlockUser", () => {
            const TestComponent = () => (
                <ScreenReaderProvider>
                    <OtpFormContainer
                        otp={otp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                        onBlockUser={mocks.onBlockUser}
                    >
                        {(props) => {
                            mocks.setLastRenderProps(props)
                            return <div data-testid="test-component">Test</div>
                        }}
                    </OtpFormContainer>
                </ScreenReaderProvider>
            )

            const { rerender } = render(<TestComponent />)

            let props = mocks.getLastRenderProps()
            const blockedUntil = new Date("2030-01-01T00:00:00.000Z")
            
            props.handleBlock(blockedUntil)
            
            // Rerender to get updated props
            rerender(<TestComponent />)
            props = mocks.getLastRenderProps()
            expect(props.blockedUntil).toBe(blockedUntil)
            expect(mocks.onBlockUser).toHaveBeenCalledWith(blockedUntil)
        })
    })

    describe("when handleUnblock is called", () => {
        it("should clear blockedUntil and call onUnblockUser", () => {
            const TestComponent = () => (
                <ScreenReaderProvider>
                    <OtpFormContainer
                        otp={otp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                        onUnblockUser={mocks.onUnblockUser}
                    >
                        {(props) => {
                            mocks.setLastRenderProps(props)
                            return <div data-testid="test-component">Test</div>
                        }}
                    </OtpFormContainer>
                </ScreenReaderProvider>
            )

            const { rerender } = render(<TestComponent />)

            let props = mocks.getLastRenderProps()
            const blockedUntil = new Date("2030-01-01T00:00:00.000Z")
            
            // First block
            props.handleBlock(blockedUntil)
            
            // Rerender to get updated props
            rerender(<TestComponent />)
            props = mocks.getLastRenderProps()
            expect(props.blockedUntil).toBe(blockedUntil)

            // Then unblock
            props.handleUnblock()
            
            // Rerender again to get updated props
            rerender(<TestComponent />)
            props = mocks.getLastRenderProps()
            expect(props.blockedUntil).toBe(null)
            expect(mocks.onUnblockUser).toHaveBeenCalledTimes(1)
        })
    })

    describe("when setInvalidAttempt is called", () => {
        it("should update invalidAttempt state", () => {
            const TestComponent = () => (
                <ScreenReaderProvider>
                    <OtpFormContainer
                        otp={otp as any}
                        onSubmitOtp={mocks.onSubmitOtp}
                        onResendOtp={mocks.onResendOtp}
                    >
                        {(props) => {
                            mocks.setLastRenderProps(props)
                            return <div data-testid="test-component">Test</div>
                        }}
                    </OtpFormContainer>
                </ScreenReaderProvider>
            )

            const { rerender } = render(<TestComponent />)

            let props = mocks.getLastRenderProps()
            expect(props.invalidAttempt).toBe(false)

            props.setInvalidAttempt(true)
            
            // Rerender to get updated props
            rerender(<TestComponent />)
            props = mocks.getLastRenderProps()
            expect(props.invalidAttempt).toBe(true)

            props.setInvalidAttempt(false)
            
            // Rerender again to get updated props
            rerender(<TestComponent />)
            props = mocks.getLastRenderProps()
            expect(props.invalidAttempt).toBe(false)
        })
    })
})
