import React from "react"
import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"
import AuthModalContext, {
    AuthModalContextValues,
} from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext"
import {
    defaultResetPasswordFormValues,
    resetPasswordFormSchema,
} from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ResetPasswordFlow/components/ResetPasswordForm/ResetPasswordFormConfig"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"

const mocks = vi.hoisted(() => {
    const containerGet = vi.fn()
    const resetPassword = vi.fn()
    const disableForm = vi.fn()
    return {containerGet, resetPassword, disableForm}
})


vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}))

vi.mock("@/presentation/components/Form/context/Form", async () => {
    const React = await import("react")
    return {
        default: React.forwardRef((props: any, ref: any) => {
            ;(mocks as any).lastFormProps = props
            React.useImperativeHandle(ref, () => ({
                disableForm: mocks.disableForm,
            }))

            return (
                <div data-testid="mock-form">
                    {props.children}
                    <button
                        type="button"
                        data-testid="submit"
                        onClick={() =>
                            props.onSubmit?.({
                                password: "Abcdef1!",
                                confirmPassword: "Abcdef1!",
                            })
                        }
                    >
                        submit
                    </button>
                </div>
            )
        }),
    }
})

vi.mock("@/presentation/components/Form/controls/FormPasswordInput", () => ({
    FormPasswordInput: () => <div data-testid="mock-password-input" />,
}))

vi.mock("@/presentation/components/Form/controls/FormButton", () => ({
    default: (props: any) => <button type="button">{props.children}</button>,
}))

vi.mock(
    "@/presentation/components/Layout/MainLayout/components/AuthModal/components/PasswordComparator",
    () => ({
        default: (props: any) => (
            <div>
                <button type="button" onClick={() => props.onChange?.(true)}>
                    invalid
                </button>
                <button type="button" onClick={() => props.onChange?.(false)}>
                    valid
                </button>
            </div>
        ),
    }),
)

import ResetPasswordForm from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ResetPasswordFlow/components/ResetPasswordForm/ResetPasswordForm"

const renderWithContext = (ctx: Partial<AuthModalContextValues>) => {
    const baseValue: AuthModalContextValues = {
        auth: null,
        identification: "",
        setAuth: () => {},
        clearAuth: () => {},
        mfaRequest: null,
        setMfaRequest: () => {},
        onLoadAuthMember: async () => {},
        otp: null,
        setOtp: () => {},
        blockedUntil: null,
        onBlock: () => {},
        onUnblock: () => {},
        onContinueBlock: () => {},
    currentStep: 1,
    backStep: () => {},
    }

    const value = {...baseValue, ...ctx} as AuthModalContextValues

    return render(
        <AuthModalContext.Provider value={value}>
            <ResetPasswordForm
                identificationNumber="1723402878"
                mfaRequest={{mfaToken: "mfa", mfaCode: "123456"} as any}
                resetPasswordToken="reset-token"
            />
        </AuthModalContext.Provider>,
    )
}

describe("ResetPasswordForm", () => {
    beforeEach(() => {
        mocks.containerGet.mockReset()
        mocks.resetPassword.mockReset()
        mocks.disableForm.mockReset()
        ;(mocks as any).lastFormProps = null

        mocks.containerGet.mockImplementation((type: any) => {
            if (type === UseCaseTypes.ResetPasswordUseCase) {
                return {resetPassword: mocks.resetPassword}
            }
            return {}
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when rendered", () => {
        it("should render the reset password message and form", () => {
            renderWithContext({onLoadAuthMember: vi.fn()})

            expect(
                screen.getByText("Define una nueva contraseña para tu cuenta:"),
            ).toBeInTheDocument()
            expect(screen.getByTestId("mock-form")).toBeInTheDocument()
            expect(screen.getAllByTestId("mock-password-input")).toHaveLength(2)

            expect(mocks.containerGet).toHaveBeenCalledWith(
                UseCaseTypes.ResetPasswordUseCase,
            )

            const formProps = (mocks as any).lastFormProps
            expect(formProps).toMatchObject({
                initialValues: defaultResetPasswordFormValues,
                schema: resetPasswordFormSchema,
                className: "flex-1 flex flex-col gap-4 mt-4",
                formErrorId: "formsAlert",
            })
        })
    })

    describe("when password comparator reports invalid", () => {
        it("should disable the form", async () => {
            renderWithContext({onLoadAuthMember: vi.fn()})

            fireEvent.click(screen.getByRole("button", {name: "invalid"}))

            await waitFor(() => {
                expect(mocks.disableForm).toHaveBeenCalledWith(true)
            })
        })
    })

    describe("when password comparator reports valid", () => {
        it("should enable the form", async () => {
            renderWithContext({onLoadAuthMember: vi.fn()})

            fireEvent.click(screen.getByRole("button", {name: "valid"}))

            await waitFor(() => {
                expect(mocks.disableForm).toHaveBeenCalledWith(false)
            })
        })
    })

    describe("when form is submitted", () => {
        it("should reset password and load auth member", async () => {
            const onLoadAuthMember = vi.fn().mockResolvedValue(undefined)
            mocks.resetPassword.mockResolvedValue(undefined)

            renderWithContext({onLoadAuthMember})

            fireEvent.click(screen.getByTestId("submit"))

            await waitFor(() => {
                expect(mocks.resetPassword).toHaveBeenCalledWith(
                    "1723402878",
                    {mfaToken: "mfa", mfaCode: "123456"},
                    "reset-token",
                    "Abcdef1!",
                )
            })

            expect(onLoadAuthMember).toHaveBeenCalledTimes(1)
        })
    })
})
