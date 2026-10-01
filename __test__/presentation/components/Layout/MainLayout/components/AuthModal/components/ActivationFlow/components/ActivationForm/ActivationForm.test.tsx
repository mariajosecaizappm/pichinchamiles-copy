import React from "react"
import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"
import ActivationForm from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ActivationFlow/components/ActivationForm/ActivationForm"
import AuthModalContext, {
    AuthModalContextValues,
} from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"

const mocks = vi.hoisted(() => {
    const containerGet = vi.fn()
    const activateAccount = vi.fn()
    const disableForm = vi.fn()
    return {containerGet, activateAccount, disableForm}
})


vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}))

vi.mock("next/link", () => ({
    default: ({children, href, ...rest}: any) => (
        <a href={href} {...rest}>
            {children}
        </a>
    ),
}))

vi.mock("@/presentation/components/Form/context/Form", async () => {
    const React = await import("react")

    return {
        default: React.forwardRef((props: any, ref: any) => {
            React.useImperativeHandle(ref, () => ({
                disableForm: mocks.disableForm,
            }))

            return (
                <div data-testid="mock-form">
                    {props.children}
                    <button
                        type="button"
                        onClick={() =>
                            props.onSubmit?.({
                                password: "Abcdef1!",
                                confirmPassword: "Abcdef1!",
                                acceptTermsAndConditions: true,
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
    FormPasswordInput: () => <div />,
}))

vi.mock("@/presentation/components/Form/controls/FormCheckbox", () => ({
    FormCheckbox: (props: any) => <div>{props.label}</div>,
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
            <ActivationForm
                mfaRequest={{mfaToken: "mfa", mfaCode: "123456"} as any}
                activationToken="activation-token"
            />
        </AuthModalContext.Provider>,
    )
}

describe("ActivationForm", () => {
    beforeEach(() => {
        mocks.containerGet.mockReset()
        mocks.activateAccount.mockReset()
        mocks.disableForm.mockReset()

        mocks.containerGet.mockImplementation((type: any) => {
            if (type === UseCaseTypes.ActivationUseCase) {
                return {activateAccount: mocks.activateAccount}
            }
            return {}
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when password comparator reports invalid", () => {
        it("should disable the form", async () => {
            renderWithContext({
                identification: "1723402878",
                onLoadAuthMember: vi.fn(),
            })

            fireEvent.click(screen.getByRole("button", {name: "invalid"}))

            await waitFor(() => {
                expect(mocks.disableForm).toHaveBeenCalledWith(true)
            })
        })
    })

    describe("when rendering the terms and conditions link", () => {
        it("should open terms and conditions in a new tab", () => {
            renderWithContext({
                identification: "1723402878",
                onLoadAuthMember: vi.fn(),
            })

            const termsLink = screen.getByText("Términos y condiciones")
            expect(termsLink).toHaveAttribute("href", "/terminos-condiciones-del-programa")
            expect(termsLink).toHaveAttribute("target", "_blank")
        })
    })

    describe("when form is submitted", () => {
        it("should activate account and load auth member", async () => {
            const onLoadAuthMember = vi.fn().mockResolvedValue(undefined)
            mocks.activateAccount.mockResolvedValue(undefined)

            renderWithContext({
                identification: "1723402878",
                onLoadAuthMember,
            })

            fireEvent.click(screen.getByRole("button", {name: "submit"}))

            await waitFor(() => {
                expect(mocks.activateAccount).toHaveBeenCalledWith({
                    password: "Abcdef1!",
                    mfaCode: "123456",
                    mfaToken: "mfa",
                    acceptedTermsAndCondition: true,
                    acceptedLopd: false,
                    activeAccountToken: "activation-token",
                    identificationNumber: "1723402878",
                })
            })

            expect(onLoadAuthMember).toHaveBeenCalledTimes(1)
        })
    })
})
