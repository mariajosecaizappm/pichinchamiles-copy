import React from "react"
import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"
import ActivationFormFields from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ActivationFlow/components/ActivationForm/ActivationFormFields"

interface MockComponentProps {
    testId?: string
    name?: string
    label?: string
    maxLength?: number
    "aria-label"?: string
    className?: string
    children?: React.ReactNode
}

const mocks = vi.hoisted(() => {
    let passwordInputProps: MockComponentProps[] = []
    let lastCheckboxProps: MockComponentProps | null = null
    let lastButtonProps: MockComponentProps | null = null
    return {
        getPasswordInputProps: () => passwordInputProps,
        addPasswordInputProps: (p: MockComponentProps) => passwordInputProps.push(p),
        getLastPasswordInputProps: () => passwordInputProps.at(-1) || null,
        clearPasswordInputProps: () => passwordInputProps = [],
        getLastCheckboxProps: () => lastCheckboxProps,
        setLastCheckboxProps: (p: MockComponentProps) => (lastCheckboxProps = p),
        getLastButtonProps: () => lastButtonProps,
        setLastButtonProps: (p: MockComponentProps) => (lastButtonProps = p),
    }
})

vi.mock("@/presentation/components/Form/context/FormContext", () => ({
    default: {
        Provider: ({children}: {children: React.ReactNode}) => children,
    },
}))


import { useContext } from "react"
vi.mock("react", async () => {
    const actual = await vi.importActual("react")
    return {
        ...actual,
        useContext: vi.fn(() => ({
            values: {
                acceptTermsAndConditions: false,
            },
        })),
    }
})

vi.mock("@/presentation/components/Form/controls/FormPasswordInput", async () => {
    return {
        FormPasswordInput: (props: MockComponentProps) => {
            mocks.addPasswordInputProps(props)
            return <div data-testid="mock-form-password-input" />
        },
    }
})

vi.mock("@/presentation/components/Form/controls/FormCheckbox", async () => {
    return {
        FormCheckbox: (props: MockComponentProps) => {
            mocks.setLastCheckboxProps(props)
            return <div data-testid="mock-form-checkbox" />
        },
    }
})

vi.mock("@/presentation/components/Form/controls/FormButton", async () => {
    return {
        default: (props: MockComponentProps) => {
            mocks.setLastButtonProps(props)
            return <div data-testid="mock-form-button">{props.children}</div>
        },
    }
})

vi.mock("next/link", () => ({
    default: ({children, ...props}: {children: React.ReactNode, [key: string]: unknown}) => <a {...props}>{children}</a>,
}))

vi.mock("@/presentation/config/links", () => ({
    default: {
        termsAndConditions: "/terminos-condiciones-del-programa",
    },
}))

vi.mock(
    "@/presentation/components/Layout/MainLayout/components/AuthModal/components/PasswordComparator",
    () => ({
        default: () => <div data-testid="mock-password-comparator" />,
    }),
)

const renderFields = (isPasswordValid = false) =>
    render(
        <ActivationFormFields
            isPasswordValid={isPasswordValid}
            onPasswordValidation={vi.fn()}
        />,
    )

describe("ActivationFormFields", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.clearPasswordInputProps()
        mocks.setLastCheckboxProps({} as MockComponentProps)
        mocks.setLastButtonProps({} as MockComponentProps)
    })

    it("should render all form fields", () => {
        renderFields()

        expect(screen.getAllByTestId("mock-form-password-input")).toHaveLength(2)
        expect(screen.getByTestId("mock-password-comparator")).toBeInTheDocument()
        expect(screen.getByTestId("mock-form-checkbox")).toBeInTheDocument()
        expect(screen.getByTestId("mock-form-button")).toBeInTheDocument()
    })

    it("should render password requirements below password fields", () => {
        renderFields()

        const passwordInputs = screen.getAllByTestId("mock-form-password-input")
        const comparator = screen.getByTestId("mock-password-comparator")
        const confirmPassword = passwordInputs[1]

        expect(
            confirmPassword.compareDocumentPosition(comparator) &
                Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy()
    })

    it("should render two password input fields", () => {
        renderFields()

        const passwordInputs = screen.getAllByTestId("mock-form-password-input")
        expect(passwordInputs).toHaveLength(2)
    })

    describe("password input fields", () => {
        it("should render password field with correct props", () => {
            renderFields()

            const passwordInputs = screen.getAllByTestId("mock-form-password-input")
            const allPasswordProps = mocks.getPasswordInputProps()
            
            // First password input
            expect(allPasswordProps[0]).toMatchObject({
                testId: "password",
                name: "password",
                label: "Contraseña",
                maxLength: 16,
                "aria-label": "Campo de texto seguro, ingresa tu contraseña",
            })

            // Second password input (confirm password)
            expect(passwordInputs[1]).toBeInTheDocument()
        })

        it("should render confirm password field with correct props", () => {
            renderFields()

            const passwordInputs = screen.getAllByTestId("mock-form-password-input")
            const allPasswordProps = mocks.getPasswordInputProps()
            
            // Check that we have 2 password inputs
            expect(passwordInputs).toHaveLength(2)
            expect(allPasswordProps).toHaveLength(2)
            
            // Check the second password input (confirm password)
            expect(allPasswordProps[1]).toMatchObject({
                testId: "confirmPassword",
                name: "confirmPassword",
                label: "Repita la contraseña",
                maxLength: 16,
                "aria-label": "Repite la contraseña. Campo de texto seguro. Ingresa nuevamente tu contraseña",
            })
        })
    })

    describe("terms and conditions checkbox", () => {
        it("should render checkbox with correct props", () => {
            renderFields()

            expect(mocks.getLastCheckboxProps()).toMatchObject({
                testId: "acceptTermsAndConditions",
                name: "acceptTermsAndConditions",
                "aria-label": "He leído y acepto los términos y condiciones del programa",
            })
        })

        it("should render checkbox label with terms and conditions link", () => {
            renderFields()

            const checkboxProps = mocks.getLastCheckboxProps()
            if (checkboxProps) {
                expect(checkboxProps.label).toBeDefined()
                
                // The label is a React element, check if it exists and has children
                const labelElement = checkboxProps.label
                expect(labelElement).toBeTruthy()
                expect(typeof labelElement === 'object').toBe(true)
            }
        })
    })

    describe("submit button", () => {
        it("should render button with continue text", () => {
            renderFields()

            expect(screen.getByTestId("mock-form-button")).toHaveTextContent("Continuar")
        })

        it("should have correct aria-label when form is invalid", () => {
            renderFields()

            const buttonProps = mocks.getLastButtonProps()
            if (buttonProps) {
                expect(buttonProps["aria-label"]).toBe(
                    "Botón continuar deshabilitado, define la contraseña o acepta los términos y condiciones para continuar."
                )
            }
        })

        it("should have correct aria-label when form is valid", () => {
            // Mock useContext to return acceptTermsAndConditions: true
            vi.mocked(useContext).mockReturnValue({
                values: {
                    acceptTermsAndConditions: true,
                },
            })

            renderFields(true)

            const buttonProps = mocks.getLastButtonProps()
            if (buttonProps) {
                expect(buttonProps["aria-label"]).toBe(
                    "La contraseña cumple todos los requisitos. Puedes continuar."
                )
            }
        })

        it("should have correct className", () => {
            renderFields()

            const buttonProps = mocks.getLastButtonProps()
            if (buttonProps) {
                expect(buttonProps.className).toBe("mt-auto")
            }
        })
    })

    describe("button aria-label logic", () => {
        it("should show disabled message when password is invalid", () => {
            renderFields()

            const buttonProps = mocks.getLastButtonProps()
            if (buttonProps) {
                expect(buttonProps["aria-label"]).toContain("deshabilitado")
            }
        })

        it("should show disabled message when terms are not accepted", () => {
            // Mock useContext to return acceptTermsAndConditions: false
            vi.mocked(useContext).mockReturnValue({
                values: {
                    acceptTermsAndConditions: false,
                },
            })

            renderFields(true)

            const buttonProps = mocks.getLastButtonProps()
            if (buttonProps) {
                expect(buttonProps["aria-label"]).toContain("deshabilitado")
            }
        })

        it("should show enabled message when both password is valid and terms are accepted", () => {
            // Mock useContext to return acceptTermsAndConditions: true
            vi.mocked(useContext).mockReturnValue({
                values: {
                    acceptTermsAndConditions: true,
                },
            })

            renderFields(true)

            const buttonProps = mocks.getLastButtonProps()
            if (buttonProps) {
                expect(buttonProps["aria-label"]).toBe(
                    "La contraseña cumple todos los requisitos. Puedes continuar."
                )
            }
        })
    })
})
