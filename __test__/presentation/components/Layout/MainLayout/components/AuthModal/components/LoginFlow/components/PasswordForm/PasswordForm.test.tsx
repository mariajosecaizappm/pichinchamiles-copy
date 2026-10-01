import React from "react"
import {render, screen, fireEvent} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"
import AuthModalContext from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext"
import {
    defaultPasswordFormValues,
    onPasswordFormError,
    PasswordFormSchema,
} from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/LoginFlow/components/PasswordForm/PasswordFormConfig"
import {ErrorCode} from "@/domain/entity/Error/structure/error"
import {AuthFlow} from "@/domain/entity/Auth/auth"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"

const mocks = vi.hoisted(() => {
    const containerGet = vi.fn()
    const getOtp = vi.fn()
    const clearAuth = vi.fn()
    const setAuth = vi.fn()
    const onSubmitPassword = vi.fn()
    const onBlock = vi.fn()
    const onUnblock = vi.fn()
    const onContinueBlock = vi.fn()
    let lastFormProps: any = null
    let lastPasswordInputProps: any = null
    let lastOtpFormBlockedProps: any = null
    return {
        containerGet,
        getOtp,
        clearAuth,
        setAuth,
        onSubmitPassword,
        onBlock,
        onUnblock,
        onContinueBlock,
        getLastFormProps: () => lastFormProps,
        setLastFormProps: (p: any) => (lastFormProps = p),
        getLastPasswordInputProps: () => lastPasswordInputProps,
        setLastPasswordInputProps: (p: any) => (lastPasswordInputProps = p),
        getLastOtpFormBlockedProps: () => lastOtpFormBlockedProps,
        setLastOtpFormBlockedProps: (p: any) => (lastOtpFormBlockedProps = p),
    }
})

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}))

vi.mock("@tanstack/react-query", () => ({
    useMutation: ({mutationFn}: any) => ({
        mutate: mutationFn,
        isPending: false,
    }),
}))

vi.mock("@/presentation/components/Form/context/Form", async () => {
    const React = await import("react")
    return {
        default: (props: any) => {
            mocks.setLastFormProps(props)
            const [errorNode, setErrorNode] = React.useState<any>(null)
            return (
                <div data-testid="mock-form">
                    <button
                        type="button"
                        data-testid="mock-form-submit"
                        onClick={() => props.onSubmit({password: "pass-123"})}
                    >
                        submit
                    </button>
                    <button
                        type="button"
                        data-testid="mock-form-error"
                        onClick={() => {
                            const nextErrorNode = props.onError?.({
                                is: (code: ErrorCode) =>
                                    code === ErrorCode.USER_BLOCKED,
                                metadata: {minutes: 10},
                            })
                            setErrorNode(nextErrorNode ?? null)
                        }}
                    >
                        error
                    </button>
                    <button
                        type="button"
                        data-testid="mock-form-error-invalid-attempt"
                        onClick={() => {
                            const nextErrorNode = props.onError?.({
                                is: (code: ErrorCode) =>
                                    code === ErrorCode.INVALID_ATTEMPT,
                                metadata: null,
                            })
                            setErrorNode(nextErrorNode ?? null)
                        }}
                    >
                        invalid-attempt
                    </button>
                    {errorNode ? (
                        <div data-testid="mock-form-error-content">
                            {errorNode}
                        </div>
                    ) : null}
                    {props.children}
                </div>
            )
        },
    }
})

vi.mock("@/presentation/components/Form/controls/FormPasswordInput", async () => {
    const React = await import("react")
    return {
        FormPasswordInput: (props: any) => {
            mocks.setLastPasswordInputProps(props)
            return (
                <div>
                    <div data-testid="mock-password-input" />
                    {props.helpText}
                </div>
            )
        },
    }
})

vi.mock("@/presentation/components/Form/controls/FormButton", async () => {
    const React = await import("react")
    return {
        default: (props: any) => {
            return <div data-testid="mock-form-button">{props.children}</div>
        },
    }
})

vi.mock("@/presentation/components/Layout/OtpForm/components/OtpFormBlocked", async () => {
    const React = await import("react")
    return {
        default: (props: any) => {
            mocks.setLastOtpFormBlockedProps(props)
            return (
                <div data-testid="mock-otp-form-blocked">
                    <div data-testid="blocked-until">
                        {props.blockedUntil?.toISOString?.() ?? "null"}
                    </div>
                    <button type="button" onClick={() => props.onUnblock()}>
                        unblock
                    </button>
                    <button
                        type="button"
                        onClick={() => props.onContinueBlockUser()}
                    >
                        continue
                    </button>
                </div>
            )
        },
    }
})

import PasswordForm from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/LoginFlow/components/PasswordForm/PasswordForm"

const renderWithAuthModalContext = () => {
    const Wrapper = () => {
        const [blockedUntil, setBlockedUntil] = React.useState<Date | null>(null)
        const handleBlock = (date: Date) => {
            mocks.onBlock(date)
            setBlockedUntil(date)
        }
        const handleUnblock = () => {
            mocks.onUnblock()
            setBlockedUntil(null)
        }
        const handleContinueBlock = () => {
            mocks.onContinueBlock()
            setBlockedUntil(null)
            mocks.clearAuth()
        }
        return (
            <AuthModalContext.Provider
                value={{
                    auth: null,
                    identification: "",
                    setAuth: () => {},
                    blockedUntil,
                    onBlock: handleBlock,
                    onUnblock: handleUnblock,
                    onContinueBlock: handleContinueBlock,
                    clearAuth: mocks.clearAuth,
                    mfaRequest: null,
                    setMfaRequest: () => {},
                    onLoadAuthMember: async () => {},
                    otp: null,
                    setOtp: () => {},
currentStep: 1,
backStep: vi.fn()
}}
            >
                <PasswordForm onSubmitPassword={mocks.onSubmitPassword} />
            </AuthModalContext.Provider>
        )
    }
    return render(<Wrapper />)
}

describe("PasswordForm", () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date("2020-01-01T00:00:00.000Z"))

        mocks.containerGet.mockReset()
        mocks.getOtp.mockReset()
        mocks.clearAuth.mockReset()
        mocks.setAuth.mockReset()
        mocks.onSubmitPassword.mockReset()
        mocks.onBlock.mockReset()
        mocks.onUnblock.mockReset()
        mocks.onContinueBlock.mockReset()
        mocks.setLastFormProps(null)
        mocks.setLastPasswordInputProps(null)
        mocks.setLastOtpFormBlockedProps(null)

        mocks.containerGet.mockImplementation((type: any) => {
            if (type === UseCaseTypes.ResetPasswordUseCase) {
                return {
                    getOtp: mocks.getOtp,
                }
            }
            return {}
        })
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.clearAllMocks()
    })

    describe("when rendered", () => {
        it("should render form with password input and submit button", () => {
            renderWithAuthModalContext()

            expect(screen.getByTestId("mock-form")).toBeInTheDocument()
            expect(screen.getByTestId("mock-password-input")).toBeInTheDocument()
            expect(screen.getByTestId("mock-form-button")).toHaveTextContent(
                "Continuar",
            )

            const formProps = mocks.getLastFormProps()
            expect(formProps.initialValues).toBe(defaultPasswordFormValues)
            expect(formProps.schema).toBe(PasswordFormSchema)
            expect(formProps.formErrorId).toBe("formsAlert")
            expect(formProps.className).toBe("h-full flex flex-col")
            expect(formProps.onSubmit).toBe(mocks.onSubmitPassword)
            expect(formProps.onError).not.toBe(onPasswordFormError)

            const passwordInputProps = mocks.getLastPasswordInputProps()
            expect(passwordInputProps).toMatchObject({
                label: "Contraseña",
                placeholder: "Ingresa tu contraseña",
                name: "password",
                testId: "password",
            })

            expect(
                screen.getByRole("button", {name: "¿Olvidaste tu contraseña? Recuperar contraseña."}),
            ).toBeInTheDocument()

            expect(mocks.containerGet).toHaveBeenCalledWith(
                UseCaseTypes.ResetPasswordUseCase,
            )
        })
    })

    describe("when form is submitted", () => {
        it("should call onSubmitPassword", () => {
            renderWithAuthModalContext()

            fireEvent.click(screen.getByTestId("mock-form-submit"))

            expect(mocks.onSubmitPassword).toHaveBeenCalledWith({
                password: "pass-123",
            })
        })
    })

    describe("when form error is USER_BLOCKED", () => {
        it("should show blocked component and set blocked state in context", () => {
            renderWithAuthModalContext()

            fireEvent.click(screen.getByTestId("mock-form-error"))

            expect(mocks.onBlock).toHaveBeenCalledTimes(1)
            expect(
                screen.getByTestId("mock-otp-form-blocked"),
            ).toBeInTheDocument()

            const blockedUntil = new Date("2020-01-01T00:10:00.000Z")
            expect(screen.getByTestId("blocked-until")).toHaveTextContent(
                blockedUntil.toISOString(),
            )

            const otpFormBlockedProps = mocks.getLastOtpFormBlockedProps()
            expect(otpFormBlockedProps.blockedUntil).toBeInstanceOf(Date)
        })

        it("should unblock when unblock is clicked", () => {
            renderWithAuthModalContext()
            fireEvent.click(screen.getByTestId("mock-form-error"))

            fireEvent.click(screen.getByRole("button", {name: "unblock"}))

            expect(mocks.onUnblock).toHaveBeenCalledTimes(1)
            expect(
                screen.queryByTestId("mock-otp-form-blocked"),
            ).not.toBeInTheDocument()
            expect(screen.getByTestId("mock-form")).toBeInTheDocument()
        })

        it("should clear auth and return to form when continue is clicked", () => {
            renderWithAuthModalContext()
            fireEvent.click(screen.getByTestId("mock-form-error"))

            fireEvent.click(screen.getByRole("button", {name: "continue"}))

            expect(mocks.onContinueBlock).toHaveBeenCalledTimes(1)
            expect(mocks.clearAuth).toHaveBeenCalledTimes(1)
            expect(
                screen.queryByTestId("mock-otp-form-blocked"),
            ).not.toBeInTheDocument()
            expect(screen.getByTestId("mock-form")).toBeInTheDocument()
        })
    })

    describe("when reset password button is clicked", () => {
        it("should request otp and set auth flow to RESET_PASSWORD", async () => {
            const otp = {
                mfaToken: "mfa",
                durationOtpCodeMinutes: 10,
                cellPhone: null,
                email: null,
            }
            mocks.getOtp.mockResolvedValueOnce(otp)

            render(
                <AuthModalContext.Provider
                    value={{
                        auth: null,
                        identification: "1723402878",
                        setAuth: mocks.setAuth,
                        blockedUntil: null,
                        onBlock: vi.fn(),
                        onUnblock: vi.fn(),
                        onContinueBlock: vi.fn(),
                        clearAuth: vi.fn(),
                        mfaRequest: null,
                        setMfaRequest: vi.fn(),
                        onLoadAuthMember: async () => {},
                        otp: null,
                        setOtp: vi.fn(),
                        currentStep: 1,
                        backStep: vi.fn()
                }}
                >
                    <PasswordForm onSubmitPassword={mocks.onSubmitPassword} />
                </AuthModalContext.Provider>,
            )

            fireEvent.click(
                screen.getByRole("button", {name: "¿Olvidaste tu contraseña? Recuperar contraseña."}),
            )

            await Promise.resolve()
            await Promise.resolve()

            expect(mocks.getOtp).toHaveBeenCalledWith("1723402878")
            expect(mocks.setAuth).toHaveBeenCalledWith({
                flow: AuthFlow.RESET_PASSWORD,
                otp,
            })
        })
    })

    describe("when form error is INVALID_ATTEMPT", () => {
        it("should show invalid password content with reset action", async () => {
            const otp = {
                mfaToken: "mfa",
                durationOtpCodeMinutes: 10,
                cellPhone: null,
                email: null,
            }
            mocks.getOtp.mockResolvedValueOnce(otp)

            render(
                <AuthModalContext.Provider
                    value={{
                        auth: null,
                        identification: "1723402878",
                        setAuth: mocks.setAuth,
                        blockedUntil: null,
                        onBlock: vi.fn(),
                        onUnblock: vi.fn(),
                        onContinueBlock: vi.fn(),
                        clearAuth: vi.fn(),
                        mfaRequest: null,
                        setMfaRequest: vi.fn(),
                        onLoadAuthMember: async () => {},
                        otp: null,
                        setOtp: vi.fn(),
currentStep: 1,
backStep: vi.fn()
}}
                >
                    <PasswordForm onSubmitPassword={mocks.onSubmitPassword} />
                </AuthModalContext.Provider>,
            )

            fireEvent.click(
                screen.getByTestId("mock-form-error-invalid-attempt"),
            )

            expect(screen.getByTestId("mock-form-error-content")).toHaveTextContent(
                "La contraseña que ingresaste es incorrecta.",
            )

            fireEvent.click(
                screen.getByRole("button", {
                    name: "¿Olvidaste tu usuario y contraseña? Recuperar credenciales.",
                }),
            )

            await Promise.resolve()
            await Promise.resolve()

            expect(mocks.getOtp).toHaveBeenCalledWith("1723402878")
            expect(mocks.setAuth).toHaveBeenCalledWith({
                flow: AuthFlow.RESET_PASSWORD,
                otp,
            })
        })
    })
})
