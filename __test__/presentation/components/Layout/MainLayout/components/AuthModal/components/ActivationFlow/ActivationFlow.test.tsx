import React, {useMemo, useState} from "react"
import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"
import ActivationFlow from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ActivationFlow/ActivationFlow"
import AuthModalContext from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext"
import {AuthFlow, Authentication} from "@/domain/entity/Auth/auth"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"
import {MfaRequest} from "@/domain/entity/Otp/otp"

const mocks = vi.hoisted(() => {
    const containerGet = vi.fn()
    const verifyIdentification = vi.fn()
    const verifyOtp = vi.fn()
    let lastOtpFormProps: any = null
    let member: any = null

    return {
        containerGet,
        verifyIdentification,
        verifyOtp,
        getLastOtpFormProps: () => lastOtpFormProps,
        setLastOtpFormProps: (p: any) => (lastOtpFormProps = p),
        setMember: (next: any) => (member = next),
        getMember: () => member,
        reset: () => {
            lastOtpFormProps = null
            member = null
        },
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

vi.mock(
    "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ActivationFlow/components/ActivationForm",
    () => ({
        default: () => <div>activation-form</div>,
    }),
)

vi.mock(
    "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ActivationFlow/components/ActivationSummary",
    () => ({
        default: () => <div>activation-summary</div>,
    }),
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

const otp = {
    cellPhone: "1234",
    durationOtpCodeMinutes: 1,
    email: "user@example.com",
    mfaToken: "mfa-token",
}

type HarnessProps = {
    auth: Authentication | null
    identification: string
}

const Harness = ({auth, identification}: HarnessProps) => {
    const [currentAuth, setCurrentAuth] = useState<Authentication | null>(auth)
    const [currentIdentification, setCurrentIdentification] =
        useState(identification)
    const [blockedUntil, setBlockedUntil] = useState<Date | null>(null)
    const [mfaRequest, setMfaRequest] = useState<MfaRequest | null>(null)

    const value = useMemo(() => {
        return {
            auth: currentAuth,
            identification: currentIdentification,
            blockedUntil,
            mfaRequest,
            otp: null,
            setAuth: (nextAuth: Authentication, nextIdentification?: string) => {
                setCurrentAuth(nextAuth)
                if (nextIdentification) {
                    setCurrentIdentification(nextIdentification)
                }
            },
            setOtp: () => {},
            onBlock: (date: Date) => setBlockedUntil(date),
            onUnblock: () => setBlockedUntil(null),
            onContinueBlock: () => {
                setBlockedUntil(null)
                setCurrentIdentification("")
            },
            clearAuth: () => {
                setCurrentAuth(null)
                setCurrentIdentification("")
            },
            setMfaRequest,
            onLoadAuthMember: async () => {},
            currentStep: 1,
            backStep: vi.fn(),
        }
    }, [currentAuth, currentIdentification, blockedUntil, mfaRequest])

    return (
        <AuthModalContext.Provider value={value}>
            <ActivationFlow />
            <div data-testid="blocked-state">
                {String(Boolean(blockedUntil))}
            </div>
            <div data-testid="identification-state">{currentIdentification}</div>
        </AuthModalContext.Provider>
    )
}

describe("ActivationFlow", () => {
    beforeEach(() => {
        mocks.reset()
        mocks.containerGet.mockReset()
        mocks.verifyIdentification.mockReset()
        mocks.verifyOtp.mockReset()

        mocks.containerGet.mockImplementation((type: any) => {
            if (type === UseCaseTypes.OnboardingUseCase) {
                return {verifyIdentification: mocks.verifyIdentification}
            }
            if (type === UseCaseTypes.ActivationUseCase) {
                return {verifyOtp: mocks.verifyOtp}
            }
            return {}
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when auth flow is not ACTIVATE_ACCOUNT", () => {
        it("should render nothing", () => {
            render(
                <Harness
                    auth={{flow: AuthFlow.LOGIN} as any}
                    identification="1723402878"
                />,
            )

            expect(screen.queryByTestId("mock-otp-form")).not.toBeInTheDocument()
        })
    })

    describe("when auth flow is ACTIVATE_ACCOUNT and otp is pending", () => {
        it("should render OtpForm with the expected callbacks", async () => {
            mocks.verifyIdentification.mockResolvedValue({
                flow: AuthFlow.ACTIVATE_ACCOUNT,
                otp,
            })

            render(
                <Harness
                    auth={{flow: AuthFlow.ACTIVATE_ACCOUNT, otp} as any}
                    identification="1723402878"
                />,
            )

            expect(screen.getByTestId("mock-otp-form")).toBeInTheDocument()

            fireEvent.click(screen.getByTestId("trigger-block"))
            expect(screen.getByTestId("blocked-state")).toHaveTextContent("true")

            fireEvent.click(screen.getByTestId("trigger-unblock"))
            expect(screen.getByTestId("blocked-state")).toHaveTextContent(
                "false",
            )

            fireEvent.click(screen.getByTestId("trigger-resend"))
            await waitFor(() => {
                expect(mocks.verifyIdentification).toHaveBeenCalledWith(
                    "1723402878",
                )
            })

            fireEvent.click(screen.getByTestId("trigger-continue"))
            expect(screen.getByTestId("blocked-state")).toHaveTextContent(
                "false",
            )
            expect(
                screen.getByTestId("identification-state"),
            ).toHaveTextContent("")
        })
    })

    describe("when member exists in session", () => {
        it("should render summary and hide OtpForm", () => {
            mocks.setMember({identificationNumber: "123"})

            render(
                <Harness
                    auth={{flow: AuthFlow.ACTIVATE_ACCOUNT, otp} as any}
                    identification="1723402878"
                />,
            )

            expect(screen.getByText("activation-summary")).toBeInTheDocument()
            expect(screen.queryByTestId("mock-otp-form")).not.toBeInTheDocument()
        })
    })

    describe("when otp is submitted successfully", () => {
        it("should show the password step and hide OtpForm", async () => {
            mocks.verifyOtp.mockResolvedValue("activation-token")

            render(
                <Harness
                    auth={{flow: AuthFlow.ACTIVATE_ACCOUNT, otp} as any}
                    identification="1723402878"
                />,
            )

            fireEvent.click(screen.getByTestId("trigger-submit"))

            await waitFor(() => {
                expect(mocks.verifyOtp).toHaveBeenCalledWith(
                    "1723402878",
                    "mfa-token",
                    "123456",
                )
            })

            expect(screen.getByText("activation-form")).toBeInTheDocument()
            expect(screen.queryByTestId("mock-otp-form")).not.toBeInTheDocument()
        })
    })
})
