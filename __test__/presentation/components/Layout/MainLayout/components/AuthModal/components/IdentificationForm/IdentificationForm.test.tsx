import React from "react"
import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"
import AuthModalContext from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext"
import {AuthFlow} from "@/domain/entity/Auth/auth"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"
import {
    defaultIdentificationFormValues,
    identificationFormSchema,
    onIdentificationFormError,
} from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/IdentificationForm/IdentificationFormConfig"
import {textAndNumbers} from "@/presentation/helpers/regexp"

const mocks = vi.hoisted(() => {
    const containerGet = vi.fn()
    const verifyIdentification = vi.fn()
    const setAuth = vi.fn()
    const clearAuth = vi.fn()
    const setMfaRequest = vi.fn()
    const onLoadAuthMember = vi.fn()
    const setOtp = vi.fn()
    const onBlock = vi.fn()
    const onUnblock = vi.fn()
    const onContinueBlock = vi.fn()
    let lastFormProps: any = null
    let lastInputProps: any = null
    let lastButtonProps: any = null
    let isKeyboardOpen = false
    return {
        containerGet,
        verifyIdentification,
        setAuth,
        clearAuth,
        setMfaRequest,
        onLoadAuthMember,
        setOtp,
        onBlock,
        onUnblock,
        onContinueBlock,
        getLastFormProps: () => lastFormProps,
        setLastFormProps: (p: any) => (lastFormProps = p),
        getLastInputProps: () => lastInputProps,
        setLastInputProps: (p: any) => (lastInputProps = p),
        getLastButtonProps: () => lastButtonProps,
        setLastButtonProps: (p: any) => (lastButtonProps = p),
        getIsKeyboardOpen: () => isKeyboardOpen,
        setIsKeyboardOpen: (value: boolean) => (isKeyboardOpen = value),
    }
})

vi.mock("@/presentation/hooks/useDetectKeyboardOpen", () => ({
    default: vi.fn(() => mocks.getIsKeyboardOpen()),
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}))

vi.mock("@/presentation/components/Form/context/Form", async () => {
    const React = await import("react")
    return {
        default: (props: any) => {
            mocks.setLastFormProps(props)
            return (
                <div data-testid="mock-form">
                    <button
                        type="button"
                        data-testid="mock-form-submit"
                        onClick={() =>
                            props.onSubmit({
                                identificationNumber: "1723402878",
                            })
                        }
                    >
                        submit
                    </button>
                    {props.children}
                </div>
            )
        },
    }
})

vi.mock("@/presentation/components/Form/controls/FormInput", async () => {
    const React = await import("react")
    return {
        default: (props: any) => {
            mocks.setLastInputProps(props)
            return <div data-testid="mock-form-input" />
        },
    }
})

vi.mock("@/presentation/components/Form/controls/FormButton", async () => {
    const React = await import("react")
    return {
        default: (props: any) => {
            mocks.setLastButtonProps(props)
            return <div data-testid="mock-form-button">{props.children}</div>
        },
    }
})

import IdentificationForm from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/IdentificationForm/IdentificationForm"

const otpMock = {
    cellPhone: null,
    durationOtpCodeMinutes: 0,
    email: null,
    mfaToken: "mfa",
}

type RenderOptions = {
    auth: any
    blockedUntil?: Date | null
    otp?: any
    identification?: string
}

const renderWithAuthContext = ({
    auth,
    blockedUntil = null,
    otp = null,
    identification = "",
}: RenderOptions) => {
    return render(
        <AuthModalContext.Provider
            value={{
                auth,
                identification,
                setAuth: mocks.setAuth,
                blockedUntil,
                onBlock: mocks.onBlock,
                onUnblock: mocks.onUnblock,
                onContinueBlock: mocks.onContinueBlock,
                clearAuth: mocks.clearAuth,
                mfaRequest: null,
                setMfaRequest: mocks.setMfaRequest,
                onLoadAuthMember: mocks.onLoadAuthMember,
                otp,
                setOtp: mocks.setOtp,
                currentStep: 1,
                backStep: vi.fn(),
            }}
        >
            <IdentificationForm />
        </AuthModalContext.Provider>,
    )
}

describe("IdentificationForm", () => {
    beforeEach(() => {
        mocks.containerGet.mockReset()
        mocks.verifyIdentification.mockReset()
        mocks.setAuth.mockReset()
        mocks.clearAuth.mockReset()
        mocks.setMfaRequest.mockReset()
        mocks.onLoadAuthMember.mockReset()
        mocks.setOtp.mockReset()
        mocks.onBlock.mockReset()
        mocks.onUnblock.mockReset()
        mocks.onContinueBlock.mockReset()
        mocks.setLastFormProps(null)
        mocks.setLastInputProps(null)
        mocks.setLastButtonProps(null)
        mocks.setIsKeyboardOpen(false)

        mocks.containerGet.mockReturnValue({
            verifyIdentification: mocks.verifyIdentification,
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when auth flow is ACTIVATE_ACCOUNT", () => {
        it("should render nothing", () => {
            renderWithAuthContext({auth: {flow: AuthFlow.ACTIVATE_ACCOUNT}})

            expect(screen.queryByTestId("mock-form")).not.toBeInTheDocument()
            expect(
                screen.queryByText(
                    "Ingresa tu documento de identificación para continuar:",
                ),
            ).not.toBeInTheDocument()
        })
    })

    describe("when blockedUntil exists", () => {
        it("should render nothing", () => {
            renderWithAuthContext({
                auth: null,
                blockedUntil: new Date("2020-01-01T00:00:00.000Z"),
            })

            expect(screen.queryByTestId("mock-form")).not.toBeInTheDocument()
            expect(
                screen.queryByText(
                    "Ingresa tu documento de identificación para continuar:",
                ),
            ).not.toBeInTheDocument()
        })
    })

    describe("when otp exists", () => {
        it("should render nothing", () => {
            renderWithAuthContext({auth: null, otp: otpMock})

            expect(screen.queryByTestId("mock-form")).not.toBeInTheDocument()
            expect(
                screen.queryByText(
                    "Ingresa tu documento de identificación para continuar:",
                ),
            ).not.toBeInTheDocument()
        })
    })

    describe("when auth is null", () => {
        it("should render the identification message and validate button", () => {
            renderWithAuthContext({auth: null})

            expect(
                screen.getByText(
                    "Ingresa tu documento de identificación para continuar:",
                ),
            ).toBeInTheDocument()
            expect(screen.getByTestId("mock-form-input")).toBeInTheDocument()
            expect(screen.getByTestId("mock-form-button")).toHaveTextContent(
                "Validar",
            )

            const formProps = mocks.getLastFormProps()
            expect(formProps.initialValues).toEqual(defaultIdentificationFormValues)
            expect(formProps.schema).toBe(identificationFormSchema)
            expect(formProps.onError).toBe(onIdentificationFormError)
            expect(formProps.formErrorId).toBe("formsAlert")
            expect(formProps.className).toBe("flex flex-col h-full")
            expect(formProps.autoFocusOn).toBe("identificationNumber")

            const inputProps = mocks.getLastInputProps()
            expect(inputProps).toMatchObject({
                label: "Documento de identificación",
                name: "identificationNumber",
                testId: "identificationNumber",
                maxLength: 16,
                placeholder: "Ej. 1723402878",
                disabled: false,
                "aria-label": "Campo de texto. Ingresa tu número de identificación",
            })
            expect(inputProps.regExp).toBe(textAndNumbers)

            const buttonProps = mocks.getLastButtonProps()
            expect(buttonProps).toMatchObject({
                className: "mt-auto md:mt-10",
                testId: "validateIdentification",
                "aria-label": "Validar documento de identificación",
            })

            expect(mocks.containerGet).toHaveBeenCalledWith(
                UseCaseTypes.OnboardingUseCase,
            )
        })
    })

    describe("when auth flow is LOGIN", () => {
        it("should render the password message and hide validate button", () => {
            renderWithAuthContext({auth: {flow: AuthFlow.LOGIN}})

            expect(
                screen.getByText("Ingresa tu contraseña para continuar:"),
            ).toBeInTheDocument()
            expect(screen.getByTestId("mock-form-input")).toBeInTheDocument()
            expect(
                screen.queryByTestId("mock-form-button"),
            ).not.toBeInTheDocument()

            const inputProps = mocks.getLastInputProps()
            expect(inputProps.disabled).toBe(true)
            expect(inputProps["aria-label"]).toBe("Documento de identificación")

            const formProps = mocks.getLastFormProps()
            expect(formProps.className).toBe("flex flex-col h-fit")
        })
    })

    describe("when auth flow is RESET_PASSWORD", () => {
        it("should render nothing", () => {
            renderWithAuthContext({
                auth: {flow: AuthFlow.RESET_PASSWORD},
            })

            expect(screen.queryByTestId("mock-form")).not.toBeInTheDocument()
            expect(
                screen.queryByText(
                    "Ingresa tu documento de identificación para continuar:",
                ),
            ).not.toBeInTheDocument()
        })
    })

    describe("when auth flow is UPDATE_PERSONAL_INFORMATION", () => {
        it("should render the identification message and show validate button", () => {
            renderWithAuthContext({
                auth: {flow: AuthFlow.UPDATE_PERSONAL_INFORMATION},
            })

            expect(
                screen.getByText(
                    "Ingresa tu documento de identificación para continuar:",
                ),
            ).toBeInTheDocument()
            expect(screen.getByTestId("mock-form-input")).toBeInTheDocument()
            expect(screen.getByTestId("mock-form-button")).toHaveTextContent(
                "Validar",
            )

            const inputProps = mocks.getLastInputProps()
            expect(inputProps.disabled).toBe(false)
        })
    })

    describe("when keyboard is open", () => {
        it("should hide the validate button", () => {
            mocks.setIsKeyboardOpen(true)

            renderWithAuthContext({auth: null})

            expect(screen.getByTestId("mock-form-input")).toBeInTheDocument()
            expect(screen.queryByTestId("mock-form-button")).not.toBeInTheDocument()
        })
    })

    describe("when identification is provided in context", () => {
        it("should use the stored identification as initial value", () => {
            renderWithAuthContext({
                auth: null,
                identification: "1712345678",
            })

            const formProps = mocks.getLastFormProps()
            expect(formProps.initialValues).toEqual({
                ...defaultIdentificationFormValues,
                identificationNumber: "1712345678",
            })
        })
    })

    describe("when submit is triggered", () => {
        it("should verify identification and call setAuth with identification number", async () => {
            const authResult = {flow: AuthFlow.LOGIN}
            mocks.verifyIdentification.mockResolvedValueOnce(authResult)

            renderWithAuthContext({auth: null})

            fireEvent.click(screen.getByTestId("mock-form-submit"))

            await waitFor(() => {
                expect(mocks.verifyIdentification).toHaveBeenCalledWith(
                    "1723402878",
                )
            })
            expect(mocks.setAuth).toHaveBeenCalledWith(authResult, "1723402878")
        })
    })
})
