import React, {useMemo, useState} from "react"
import {render, screen, fireEvent, waitFor, act} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"
import LoginFlow from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/LoginFlow/LoginFlow"
import AuthModalContext from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext"
import {AuthFlow, Authentication} from "@/domain/entity/Auth/auth"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"
import {MfaRequest, Otp} from "@/domain/entity/Otp/otp"

const mocks = vi.hoisted(() => {
    const containerGet = vi.fn()
    const getOtp = vi.fn()
    const verifyLoginOtp = vi.fn()
    const onCloseAuthModal = vi.fn()
    const onLoadAuthMember = vi.fn()
    const routerPush = vi.fn()
    let lastOtpFormProps: any = null
    let lastPasswordFormProps: any = null

    return {
        containerGet,
        getOtp,
        verifyLoginOtp,
        onCloseAuthModal,
        onLoadAuthMember,
        routerPush,
        getLastOtpFormProps: () => lastOtpFormProps,
        setLastOtpFormProps: (p: any) => (lastOtpFormProps = p),
        getLastPasswordFormProps: () => lastPasswordFormProps,
        setLastPasswordFormProps: (p: any) => (lastPasswordFormProps = p),
        reset: () => {
            lastOtpFormProps = null
            lastPasswordFormProps = null
        },
    }
})

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mocks.routerPush,
    }),
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => ({
        onCloseAuthModal: mocks.onCloseAuthModal,
    }),
}))

vi.mock(
    "@/presentation/components/Layout/MainLayout/components/AuthModal/components/LoginFlow/components/PasswordForm",
    async () => {
        const React = await import("react")

        return {
            default: (props: any) => {
                mocks.setLastPasswordFormProps(props)
                return (
                    <div data-testid="mock-password-form">
                        <button
                            type="button"
                            data-testid="trigger-submit-password"
                            onClick={() =>
                                props.onSubmitPassword?.({
                                    password: "pass-123",
                                })
                            }
                        >
                            submit-password
                        </button>
                        <button
                            type="button"
                            data-testid="trigger-submit-password-2"
                            onClick={() =>
                                props.onSubmitPassword?.({
                                    password: "pass-456",
                                })
                            }
                        >
                            submit-password-2
                        </button>
                    </div>
                )
            },
        }
    },
)

vi.mock("@/presentation/components/Layout/OtpForm", async () => {
    const React = await import("react")

    return {
        default: (props: any) => {
            mocks.setLastOtpFormProps(props)
            return (
                <div data-testid="mock-otp-form">
                    <button
                        type="button"
                        data-testid="trigger-resend"
                        onClick={() => props.onResendOtp?.()}
                    >
                        resend
                    </button>
                    <button
                        type="button"
                        data-testid="trigger-submit"
                        onClick={() =>
                            props.onSubmitOtp?.({
                                mfaToken: props.otp?.mfaToken ?? "mfa",
                                mfaCode: "123456",
                            })
                        }
                    >
                        submit
                    </button>
                    <button
                        type="button"
                        data-testid="trigger-block"
                        onClick={() =>
                            props.onBlockUser?.(new Date("2020-01-01T00:00:00.000Z"))
                        }
                    >
                        block
                    </button>
                    <button
                        type="button"
                        data-testid="trigger-unblock"
                        onClick={() => props.onUnblockUser?.()}
                    >
                        unblock
                    </button>
                    <button
                        type="button"
                        data-testid="trigger-continue"
                        onClick={() => props.onContinueBlockUser?.()}
                    >
                        continue
                    </button>
                </div>
            )
        },
    }
})

const otpMock: Otp = {
    cellPhone: "0999999999",
    durationOtpCodeMinutes: 5,
    email: "user@example.com",
    mfaToken: "mfa-token",
}

type HarnessProps = {
    auth: Authentication | null
    identification: string
    otp?: Otp | null
}

const Harness = ({auth, identification, otp = null}: HarnessProps) => {
    const [currentAuth, setCurrentAuth] = useState<Authentication | null>(auth)
    const [currentIdentification, setCurrentIdentification] =
        useState(identification)
    const [currentOtp, setCurrentOtp] = useState<Otp | null>(otp)
    const [blockedUntil, setBlockedUntil] = useState<Date | null>(null)
    const [mfaRequest, setMfaRequest] = useState<MfaRequest | null>(null)

    const value = useMemo(() => {
        return {
            auth: currentAuth,
            identification: currentIdentification,
            otp: currentOtp,
            blockedUntil,
            mfaRequest,
            setAuth: (nextAuth: Authentication, nextIdentification?: string) => {
                setCurrentAuth(nextAuth)
                if (nextIdentification) {
                    setCurrentIdentification(nextIdentification)
                }
            },
            setOtp: setCurrentOtp,
            onBlock: (date: Date) => setBlockedUntil(date),
            onUnblock: () => setBlockedUntil(null),
            onContinueBlock: () => {
                setBlockedUntil(null)
                setCurrentAuth(null)
                setCurrentIdentification("")
                setCurrentOtp(null)
            },
            clearAuth: () => {
                setCurrentAuth(null)
                setCurrentIdentification("")
                setCurrentOtp(null)
            },
            setMfaRequest,
            onLoadAuthMember: mocks.onLoadAuthMember,
            currentStep: 1,
            backStep: vi.fn(),
        }
    }, [
        currentAuth,
        currentIdentification,
        currentOtp,
        blockedUntil,
        mfaRequest,
    ])

    return (
        <AuthModalContext.Provider value={value}>
            <LoginFlow />
            <div data-testid="blocked-state">
                {String(Boolean(blockedUntil))}
            </div>
            <div data-testid="auth-flow-state">
                {currentAuth?.flow ?? "null"}
            </div>
            <div data-testid="identification-state">{currentIdentification}</div>
        </AuthModalContext.Provider>
    )
}

describe("LoginFlow", () => {
    beforeEach(() => {
        mocks.reset()
        mocks.containerGet.mockReset()
        mocks.getOtp.mockReset()
        mocks.verifyLoginOtp.mockReset()
        mocks.onCloseAuthModal.mockReset()
        mocks.onLoadAuthMember.mockReset()
        mocks.routerPush.mockReset()

        mocks.containerGet.mockImplementation((type: any) => {
            if (type === UseCaseTypes.LoginUseCase) {
                return {
                    getOtp: mocks.getOtp,
                    verifyLoginOtp: mocks.verifyLoginOtp,
                }
            }
            return {}
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when auth flow is not LOGIN", () => {
        it("should render nothing", () => {
            render(
                <Harness
                    auth={{flow: AuthFlow.ACTIVATE_ACCOUNT} as any}
                    identification="1723402878"
                />,
            )

            expect(
                screen.queryByTestId("mock-password-form"),
            ).not.toBeInTheDocument()
            expect(screen.queryByTestId("mock-otp-form")).not.toBeInTheDocument()
        })
    })

    describe("when auth flow is LOGIN and otp is null", () => {
        it("should request otp when password is submitted", async () => {
            mocks.getOtp.mockResolvedValueOnce(otpMock)

            render(<Harness auth={{flow: AuthFlow.LOGIN} as any} identification="1723402878" />)

            expect(screen.getByTestId("mock-password-form")).toBeInTheDocument()
            fireEvent.click(screen.getByTestId("trigger-submit-password"))

            await waitFor(() => {
                expect(mocks.getOtp).toHaveBeenCalledWith("1723402878", "pass-123")
            })

            await waitFor(() => {
                expect(screen.getByTestId("mock-otp-form")).toBeInTheDocument()
            })
        })

        it("should reuse the last submitted password when resend is triggered", async () => {
            mocks.getOtp.mockResolvedValue(otpMock)

            render(<Harness auth={{flow: AuthFlow.LOGIN} as any} identification="1723402878" />)

            fireEvent.click(screen.getByTestId("trigger-submit-password"))

            await waitFor(() => {
                expect(screen.getByTestId("mock-otp-form")).toBeInTheDocument()
            })

            fireEvent.click(screen.getByTestId("trigger-resend"))

            await waitFor(() => {
                expect(mocks.getOtp).toHaveBeenCalledTimes(2)
                expect(mocks.getOtp).toHaveBeenNthCalledWith(
                    1,
                    "1723402878",
                    "pass-123",
                )
                expect(mocks.getOtp).toHaveBeenNthCalledWith(
                    2,
                    "1723402878",
                    "pass-123",
                )
            })
        })

        it("should update the stored password when a new password is submitted", async () => {
            mocks.getOtp.mockResolvedValue(otpMock)

            render(<Harness auth={{flow: AuthFlow.LOGIN} as any} identification="1723402878" />)

            fireEvent.click(screen.getByTestId("trigger-submit-password"))

            await waitFor(() => {
                expect(screen.getByTestId("mock-otp-form")).toBeInTheDocument()
            })

            const otpProps = mocks.getLastOtpFormProps()
            await act(async () => {
                await otpProps.onResendOtp?.("pass-456")
            })

            await waitFor(() => {
                expect(mocks.getOtp).toHaveBeenCalledTimes(2)
                expect(mocks.getOtp).toHaveBeenNthCalledWith(
                    2,
                    "1723402878",
                    "pass-456",
                )
            })

            fireEvent.click(screen.getByTestId("trigger-resend"))

            await waitFor(() => {
                expect(mocks.getOtp).toHaveBeenCalledTimes(3)
                expect(mocks.getOtp).toHaveBeenNthCalledWith(
                    3,
                    "1723402878",
                    "pass-456",
                )
            })
        })
    })

    describe("when otp is present", () => {
        it("should verify login, load auth member, redirect and close modal when otp is submitted", async () => {
            mocks.verifyLoginOtp.mockResolvedValueOnce(undefined)
            mocks.onLoadAuthMember.mockResolvedValueOnce(undefined)

            render(
                <Harness
                    auth={{flow: AuthFlow.LOGIN} as any}
                    identification="1723402878"
                    otp={otpMock}
                />,
            )

            fireEvent.click(screen.getByTestId("trigger-submit"))

            await waitFor(() => {
                expect(mocks.verifyLoginOtp).toHaveBeenCalledWith(
                    "1723402878",
                    "123456",
                    "mfa-token",
                )
                expect(mocks.onLoadAuthMember).toHaveBeenCalledTimes(1)
                expect(mocks.onCloseAuthModal).toHaveBeenCalledTimes(1)
            })
        })

        it("should close modal when loading auth member fails", async () => {
            mocks.verifyLoginOtp.mockResolvedValueOnce(undefined)
            mocks.onLoadAuthMember.mockRejectedValueOnce(new Error("fail"))

            render(
                <Harness
                    auth={{flow: AuthFlow.LOGIN} as any}
                    identification="1723402878"
                    otp={otpMock}
                />,
            )

            fireEvent.click(screen.getByTestId("trigger-submit"))

            await waitFor(() => {
                expect(mocks.onLoadAuthMember).toHaveBeenCalledTimes(1)
                expect(mocks.onCloseAuthModal).toHaveBeenCalledTimes(1)
            })
        })

        it("should update blocked state when block and unblock is triggered", async () => {
            render(
                <Harness
                    auth={{flow: AuthFlow.LOGIN} as any}
                    identification="1723402878"
                    otp={otpMock}
                />,
            )

            fireEvent.click(screen.getByTestId("trigger-block"))
            expect(screen.getByTestId("blocked-state")).toHaveTextContent("true")

            fireEvent.click(screen.getByTestId("trigger-unblock"))
            expect(screen.getByTestId("blocked-state")).toHaveTextContent(
                "false",
            )
        })

        it("should clear auth and reset blocked state when continue is triggered", async () => {
            render(
                <Harness
                    auth={{flow: AuthFlow.LOGIN} as any}
                    identification="1723402878"
                    otp={otpMock}
                />,
            )

            fireEvent.click(screen.getByTestId("trigger-block"))
            expect(screen.getByTestId("blocked-state")).toHaveTextContent("true")

            fireEvent.click(screen.getByTestId("trigger-continue"))
            expect(screen.getByTestId("blocked-state")).toHaveTextContent("false")
            expect(screen.getByTestId("auth-flow-state")).toHaveTextContent(
                "null",
            )
            expect(screen.getByTestId("identification-state")).toHaveTextContent(
                "",
            )
        })
    })
})
