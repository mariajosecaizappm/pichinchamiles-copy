import React from "react"
import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"
import AuthModalContext from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext"
import {AuthFlow} from "@/domain/entity/Auth/auth"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"

const mocks = vi.hoisted(() => {
    const containerGet = vi.fn()
    const getOtp = vi.fn()
    const verifyOtp = vi.fn()
    const setAuth = vi.fn()
    const onBlock = vi.fn()
    const onUnblock = vi.fn()
    const onContinueBlock = vi.fn()
    let member: any = null
    let lastOtpFormProps: any = null
    let lastResetPasswordFormProps: any = null
    return {
        containerGet,
        getOtp,
        verifyOtp,
        setAuth,
        onBlock,
        onUnblock,
        onContinueBlock,
        setMember: (value: any) => (member = value),
        getMember: () => member,
        setLastOtpFormProps: (p: any) => (lastOtpFormProps = p),
        getLastOtpFormProps: () => lastOtpFormProps,
        setLastResetPasswordFormProps: (p: any) => (lastResetPasswordFormProps = p),
        getLastResetPasswordFormProps: () => lastResetPasswordFormProps,
    }
})

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => ({
        member: mocks.getMember(),
    }),
}))

vi.mock("@/presentation/components/Layout/OtpForm", async () => {
    const React = await import("react")
    return {
        default: (props: any) => {
            mocks.setLastOtpFormProps(props)
            return (
                <div data-testid="mock-otp-form">
                    <button
                        type="button"
                        data-testid="mock-submit-otp"
                        onClick={() =>
                            props.onSubmitOtp({
                                mfaToken: "mfa-token",
                                mfaCode: "123456",
                            })
                        }
                    >
                        submit otp
                    </button>
                    <button
                        type="button"
                        data-testid="mock-resend-otp"
                        onClick={() => props.onResendOtp()}
                    >
                        resend otp
                    </button>
                </div>
            )
        },
    }
})

vi.mock(
    "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ResetPasswordFlow/components/ResetPasswordForm",
    async () => {
        const React = await import("react")
        return {
            default: (props: any) => {
                mocks.setLastResetPasswordFormProps(props)
                return (
                    <div data-testid="mock-reset-password-form">
                        {props.resetPasswordToken}
                    </div>
                )
            },
        }
    },
)

vi.mock(
    "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ResetPasswordFlow/components/ResetPasswordAlert",
    async () => {
        const React = await import("react")
        return {
            default: () => <div data-testid="mock-reset-password-alert" />,
        }
    },
)

import ResetPasswordFlow from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ResetPasswordFlow/ResetPasswordFlow"

const otp = {
    mfaToken: "otp-mfa",
    durationOtpCodeMinutes: 10,
    cellPhone: null,
    email: null,
}

const renderWithAuthModalContext = (options?: {
    authFlow?: AuthFlow
    initialMfaRequest?: any
}) => {
    const Wrapper = () => {
        const [mfaRequest, setMfaRequest] = React.useState<any>(
            options?.initialMfaRequest ?? null,
        )

        return (
            <AuthModalContext.Provider
                value={{
                    auth:
                        options?.authFlow === AuthFlow.LOGIN
                            ? ({flow: AuthFlow.LOGIN} as any)
                            : ({flow: AuthFlow.RESET_PASSWORD, otp} as any),
                    identification: "1723402878",
                    setAuth: mocks.setAuth,
                    clearAuth: vi.fn(),
                    mfaRequest,
                    setMfaRequest: (value: any) => {
                        setMfaRequest(value)
                    },
                    onLoadAuthMember: async () => {},
                    otp: null,
                    setOtp: vi.fn(),
                    blockedUntil: null,
                    onBlock: mocks.onBlock,
                    onUnblock: mocks.onUnblock,
                    onContinueBlock: mocks.onContinueBlock,
currentStep: 1,
backStep: vi.fn()
}}
            >
                <ResetPasswordFlow />
            </AuthModalContext.Provider>
        )
    }

    return render(<Wrapper />)
}

describe("ResetPasswordFlow", () => {
    beforeEach(() => {
        mocks.containerGet.mockReset()
        mocks.getOtp.mockReset()
        mocks.verifyOtp.mockReset()
        mocks.setAuth.mockReset()
        mocks.onBlock.mockReset()
        mocks.onUnblock.mockReset()
        mocks.onContinueBlock.mockReset()
        mocks.setMember(null)
        mocks.setLastOtpFormProps(null)
        mocks.setLastResetPasswordFormProps(null)

        mocks.containerGet.mockImplementation((type: any) => {
            if (type === UseCaseTypes.ResetPasswordUseCase) {
                return {
                    getOtp: mocks.getOtp,
                    verifyOtp: mocks.verifyOtp,
                }
            }
            return {}
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when auth flow is not RESET_PASSWORD", () => {
        it("should render nothing", () => {
            renderWithAuthModalContext({authFlow: AuthFlow.LOGIN})

            expect(
                screen.queryByTestId("mock-reset-password-alert"),
            ).not.toBeInTheDocument()
            expect(
                screen.queryByTestId("mock-reset-password-form"),
            ).not.toBeInTheDocument()
            expect(screen.queryByTestId("mock-otp-form")).not.toBeInTheDocument()
        })
    })

    describe("when member exists", () => {
        it("should render reset password alert", () => {
            mocks.setMember({id: "member-1"})

            renderWithAuthModalContext()

            expect(
                screen.getByTestId("mock-reset-password-alert"),
            ).toBeInTheDocument()
            expect(
                screen.queryByTestId("mock-reset-password-form"),
            ).not.toBeInTheDocument()
            expect(screen.queryByTestId("mock-otp-form")).not.toBeInTheDocument()
        })
    })

    describe("when mfaRequest is not set", () => {
        it("should render otp form with block controls", () => {
            renderWithAuthModalContext()

            expect(screen.getByTestId("mock-otp-form")).toBeInTheDocument()

            const otpFormProps = mocks.getLastOtpFormProps()
            expect(otpFormProps.otp).toBe(otp)
            expect(otpFormProps.onBlockUser).toBe(mocks.onBlock)
            expect(otpFormProps.onUnblockUser).toBe(mocks.onUnblock)
            expect(otpFormProps.onContinueBlockUser).toBe(mocks.onContinueBlock)
        })

        it("should request otp and set auth when resend otp is clicked", async () => {
            const newOtp = {
                mfaToken: "new-mfa",
                durationOtpCodeMinutes: 10,
                cellPhone: null,
                email: null,
            }
            mocks.getOtp.mockResolvedValueOnce(newOtp)

            renderWithAuthModalContext()

            fireEvent.click(screen.getByTestId("mock-resend-otp"))

            await waitFor(() => {
                expect(mocks.getOtp).toHaveBeenCalledWith("1723402878")
            })
            expect(mocks.setAuth).toHaveBeenCalledWith({
                flow: AuthFlow.RESET_PASSWORD,
                otp: newOtp,
            })
        })

        it("should verify otp, set mfaRequest and render reset password form when otp is submitted", async () => {
            mocks.verifyOtp.mockResolvedValueOnce("reset-token-123")

            renderWithAuthModalContext()

            fireEvent.click(screen.getByTestId("mock-submit-otp"))

            await waitFor(() => {
                expect(mocks.verifyOtp).toHaveBeenCalledWith(
                    "1723402878",
                    "123456",
                    "mfa-token",
                )
            })

            expect(
                await screen.findByTestId("mock-reset-password-form"),
            ).toBeInTheDocument()

            const resetPasswordFormProps = mocks.getLastResetPasswordFormProps()
            expect(resetPasswordFormProps).toMatchObject({
                identificationNumber: "1723402878",
                mfaRequest: {mfaToken: "mfa-token", mfaCode: "123456"},
                resetPasswordToken: "reset-token-123",
            })
        })
    })

    describe("when mfaRequest is already set", () => {
        it("should render reset password form", () => {
            renderWithAuthModalContext({
                initialMfaRequest: {mfaToken: "mfa", mfaCode: "123456"},
            })

            expect(
                screen.getByTestId("mock-reset-password-form"),
            ).toBeInTheDocument()

            const resetPasswordFormProps = mocks.getLastResetPasswordFormProps()
            expect(resetPasswordFormProps).toMatchObject({
                identificationNumber: "1723402878",
                mfaRequest: {mfaToken: "mfa", mfaCode: "123456"},
                resetPasswordToken: "",
            })
        })
    })
})

