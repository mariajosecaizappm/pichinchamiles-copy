import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, afterEach } from "vitest"
import PasswordForm from "@/presentation/pages/Profile/Security/components/PasswordForm/PasswordForm"
import { RefObject } from "react"
import { FormRef } from "@/presentation/components/Form/context/Form"

const mocks = vi.hoisted(() => ({
    isSubmitting: false,
    focusOn: vi.fn(),
    validateForm: vi.fn().mockResolvedValue({}),
    values: {
        newPassword: "",
        newPasswordConfirm: "",
    },
}))

vi.mock("@/presentation/components/Form/context/FormContext", () => ({
    default: {
        Consumer: ({ children }: { children: (value: any) => React.ReactNode }) =>
            children({
                isSubmitting: mocks.isSubmitting,
                values: mocks.values,
                validateForm: mocks.validateForm,
            }),
    },
}))

vi.mock("react", async () => {
    const actual = await vi.importActual("react")
    return {
        ...actual,
        useContext: () => ({
            isSubmitting: mocks.isSubmitting,
            values: mocks.values,
            validateForm: mocks.validateForm,
        }),
    }
})

vi.mock("@/presentation/components/Form/controls/FormInput", () => ({
    default: ({ label, name, readOnly, isDisabled, endContent, testId }: any) => (
        <div data-testid={`form-input-${testId || name}`}>
            <label>{label}</label>
            <input
                name={name}
                readOnly={readOnly}
                disabled={isDisabled}
                data-testid={`input-${testId || name}`}
            />
            {endContent && <div data-testid={`end-content-${name}`}>{endContent}</div>}
        </div>
    ),
}))

vi.mock("@/presentation/components/Form/controls/FormPasswordInput", () => ({
    FormPasswordInput: ({ label, name, isDisabled, testId }: any) => (
        <div data-testid={`form-password-input-${testId || name}`}>
            <label>{label}</label>
            <input
                type="password"
                name={name}
                disabled={isDisabled}
                data-testid={`input-${testId || name}`}
            />
        </div>
    ),
}))

vi.mock("@/presentation/components/Layout/MainLayout/components/AuthModal/components/PasswordComparator", () => ({
    default: ({ name }: { name: string }) => (
        <div data-testid={`password-comparator-${name}`}>Password Comparator</div>
    ),
}))

describe("PasswordForm", () => {
    const mockFormRef: RefObject<FormRef> = {
        current: {
            submitForm: vi.fn(),
            reset: vi.fn(),
            disableForm: vi.fn(),
            focusOn: mocks.focusOn,
            addAlert: vi.fn(),
            clearAlert: vi.fn(),
        },
    }

    const defaultProps = {
        show: { emailForm: false, passwordForm: false },
        setShow: vi.fn(),
        formRef: mockFormRef,
    }

    afterEach(() => {
        vi.clearAllMocks()
        mocks.isSubmitting = false
        mocks.values.newPassword = ""
        mocks.values.newPasswordConfirm = ""
    })

    it("should render password input field with correct props", () => {
        render(<PasswordForm {...defaultProps} />)

        expect(screen.getByTestId("form-input-password")).toBeInTheDocument()
        expect(screen.getByText("Contraseña")).toBeInTheDocument()
    })

    it("should render password input as readonly", () => {
        render(<PasswordForm {...defaultProps} />)

        const input = screen.getByTestId("input-password")
        expect(input).toHaveAttribute("readonly")
    })

    it("should disable password input when emailForm is shown", () => {
        const props = {
            ...defaultProps,
            show: { emailForm: true, passwordForm: false },
        }

        render(<PasswordForm {...props} />)

        const input = screen.getByTestId("input-password")
        expect(input).toBeDisabled()
    })

    it("should disable password input when isSubmitting is true", () => {
        mocks.isSubmitting = true

        render(<PasswordForm {...defaultProps} />)

        const input = screen.getByTestId("input-password")
        expect(input).toBeDisabled()
    })

    it("should hide edit button when emailForm is shown", () => {
        const props = {
            ...defaultProps,
            show: { emailForm: true, passwordForm: false },
        }

        render(<PasswordForm {...props} />)

        expect(screen.queryByTestId("end-content-password")).not.toBeInTheDocument()
    })

    it("should show edit button when emailForm is not shown", () => {
        render(<PasswordForm {...defaultProps} />)

        expect(screen.getByTestId("end-content-password")).toBeInTheDocument()
    })

    it("should toggle passwordForm state when edit button is clicked", () => {
        const setShow = vi.fn()
        const props = {
            ...defaultProps,
            setShow,
        }

        render(<PasswordForm {...props} />)

        const button = screen.getByRole("button")
        fireEvent.click(button)

        expect(setShow).toHaveBeenCalledWith({ emailForm: false, passwordForm: true })
    })

    it("should focus on newPassword field when passwordForm is opened", () => {
        vi.useFakeTimers()
        const setShow = vi.fn()
        const props = {
            ...defaultProps,
            setShow,
        }

        render(<PasswordForm {...props} />)

        const button = screen.getByRole("button")
        fireEvent.click(button)

        vi.runAllTimers()

        expect(mocks.focusOn).toHaveBeenCalledWith("newPassword")
        vi.useRealTimers()
    })

    it("should not focus when passwordForm is closed", () => {
        vi.useFakeTimers()
        const setShow = vi.fn()
        const props = {
            ...defaultProps,
            show: { emailForm: false, passwordForm: true },
            setShow,
        }

        render(<PasswordForm {...props} />)

        const button = screen.getAllByRole("button")[0]
        fireEvent.click(button)

        vi.runAllTimers()

        expect(mocks.focusOn).not.toHaveBeenCalled()
        vi.useRealTimers()
    })

    it("should render newPassword, newPasswordConfirm and PasswordComparator when passwordForm is shown", () => {
        const props = {
            ...defaultProps,
            show: { emailForm: false, passwordForm: true },
        }

        render(<PasswordForm {...props} />)

        expect(screen.getByTestId("form-password-input-newPassword")).toBeInTheDocument()
        expect(screen.getByTestId("form-password-input-newPasswordConfirm")).toBeInTheDocument()
        expect(screen.getByTestId("password-comparator-newPassword")).toBeInTheDocument()
    })

    it("should not render additional fields when passwordForm is hidden", () => {
        render(<PasswordForm {...defaultProps} />)

        expect(screen.queryByTestId("form-password-input-newPassword")).not.toBeInTheDocument()
        expect(screen.queryByTestId("form-password-input-newPasswordConfirm")).not.toBeInTheDocument()
        expect(screen.queryByTestId("password-comparator-newPassword")).not.toBeInTheDocument()
        expect(mocks.validateForm).not.toHaveBeenCalled()
    })

    it("should revalidate password fields when passwordForm is shown", () => {
        const props = {
            ...defaultProps,
            show: { emailForm: false, passwordForm: true },
        }

        render(<PasswordForm {...props} />)

        expect(mocks.validateForm).toHaveBeenCalled()
    })

    it("should disable newPassword and newPasswordConfirm when isSubmitting", () => {
        mocks.isSubmitting = true
        const props = {
            ...defaultProps,
            show: { emailForm: false, passwordForm: true },
        }

        render(<PasswordForm {...props} />)

        expect(screen.getByTestId("input-newPassword")).toBeDisabled()
        expect(screen.getByTestId("input-newPasswordConfirm")).toBeDisabled()
    })

    it("should render newPassword field with correct props", () => {
        const props = {
            ...defaultProps,
            show: { emailForm: false, passwordForm: true },
        }

        render(<PasswordForm {...props} />)

        expect(screen.getByText("Nueva contraseña")).toBeInTheDocument()
        expect(screen.getByTestId("input-newPassword")).toBeInTheDocument()
    })

    it("should render newPasswordConfirm field with correct props", () => {
        const props = {
            ...defaultProps,
            show: { emailForm: false, passwordForm: true },
        }

        render(<PasswordForm {...props} />)

        expect(screen.getByText("Repita la contraseña")).toBeInTheDocument()
        expect(screen.getByTestId("input-newPasswordConfirm")).toBeInTheDocument()
    })

    it("should render PasswordComparator with correct name prop", () => {
        const props = {
            ...defaultProps,
            show: { emailForm: false, passwordForm: true },
        }

        render(<PasswordForm {...props} />)

        expect(screen.getByTestId("password-comparator-newPassword")).toBeInTheDocument()
        expect(screen.getByText("Password Comparator")).toBeInTheDocument()
    })
})
