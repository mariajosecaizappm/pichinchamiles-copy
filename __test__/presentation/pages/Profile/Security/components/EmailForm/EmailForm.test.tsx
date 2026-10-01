import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, afterEach } from "vitest"
import EmailForm from "@/presentation/pages/Profile/Security/components/EmailForm/EmailForm"
import { RefObject } from "react"
import { FormRef } from "@/presentation/components/Form/context/Form"

const mocks = vi.hoisted(() => ({
    isSubmitting: false,
    focusOn: vi.fn(),
}))

vi.mock("@/presentation/components/Form/context/FormContext", () => ({
    default: {
        Consumer: ({ children }: { children: (value: any) => React.ReactNode }) =>
            children({ isSubmitting: mocks.isSubmitting }),
    },
}))

vi.mock("react", async () => {
    const actual = await vi.importActual("react")
    return {
        ...actual,
        useContext: () => ({ isSubmitting: mocks.isSubmitting }),
    }
})

vi.mock("@/presentation/components/Form/controls/FormInput", () => ({
    default: ({ label, name, readOnly, isDisabled, endContent, testId, type }: any) => (
        <div data-testid={`form-input-${testId || name}`}>
            <label>{label}</label>
            <input
                name={name}
                type={type}
                readOnly={readOnly}
                disabled={isDisabled}
                data-testid={`input-${testId || name}`}
            />
            {endContent && <div data-testid={`end-content-${name}`}>{endContent}</div>}
        </div>
    ),
}))

describe("EmailForm", () => {
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
    })

    it("should render email input field with correct props", () => {
        render(<EmailForm {...defaultProps} />)

        expect(screen.getByTestId("form-input-email")).toBeInTheDocument()
        expect(screen.getByText("Correo electrónico")).toBeInTheDocument()
    })

    it("should render email input as readonly", () => {
        render(<EmailForm {...defaultProps} />)

        const input = screen.getByTestId("input-email")
        expect(input).toHaveAttribute("readonly")
    })

    it("should disable email input when passwordForm is shown", () => {
        const props = {
            ...defaultProps,
            show: { emailForm: false, passwordForm: true },
        }

        render(<EmailForm {...props} />)

        const input = screen.getByTestId("input-email")
        expect(input).toBeDisabled()
    })

    it("should disable email input when isSubmitting is true", () => {
        mocks.isSubmitting = true

        render(<EmailForm {...defaultProps} />)

        const input = screen.getByTestId("input-email")
        expect(input).toBeDisabled()
    })

    it("should hide edit button when passwordForm is shown", () => {
        const props = {
            ...defaultProps,
            show: { emailForm: false, passwordForm: true },
        }

        render(<EmailForm {...props} />)

        expect(screen.queryByTestId("end-content-email")).not.toBeInTheDocument()
    })

    it("should show edit button when passwordForm is not shown", () => {
        render(<EmailForm {...defaultProps} />)

        expect(screen.getByTestId("end-content-email")).toBeInTheDocument()
    })

    it("should toggle emailForm state when edit button is clicked", () => {
        const setShow = vi.fn()
        const props = {
            ...defaultProps,
            setShow,
        }

        render(<EmailForm {...props} />)

        const button = screen.getByRole("button")
        fireEvent.click(button)

        expect(setShow).toHaveBeenCalledWith({ emailForm: true, passwordForm: false })
    })

    it("should focus on newEmail field when emailForm is opened", () => {
        vi.useFakeTimers()
        const setShow = vi.fn()
        const props = {
            ...defaultProps,
            setShow,
        }

        render(<EmailForm {...props} />)

        const button = screen.getByRole("button")
        fireEvent.click(button)

        vi.runAllTimers()

        expect(mocks.focusOn).toHaveBeenCalledWith("newEmail")
        vi.useRealTimers()
    })

    it("should not focus when emailForm is closed", () => {
        vi.useFakeTimers()
        const setShow = vi.fn()
        const props = {
            ...defaultProps,
            show: { emailForm: true, passwordForm: false },
            setShow,
        }

        render(<EmailForm {...props} />)

        const button = screen.getAllByRole("button")[0]
        fireEvent.click(button)

        vi.runAllTimers()

        expect(mocks.focusOn).not.toHaveBeenCalled()
        vi.useRealTimers()
    })

    it("should render newEmail and emailConfirmation fields when emailForm is shown", () => {
        const props = {
            ...defaultProps,
            show: { emailForm: true, passwordForm: false },
        }

        render(<EmailForm {...props} />)

        expect(screen.getByTestId("form-input-newEmail")).toBeInTheDocument()
        expect(screen.getByTestId("form-input-emailConfirmation")).toBeInTheDocument()
    })

    it("should not render additional fields when emailForm is hidden", () => {
        render(<EmailForm {...defaultProps} />)

        expect(screen.queryByTestId("form-input-newEmail")).not.toBeInTheDocument()
        expect(screen.queryByTestId("form-input-emailConfirmation")).not.toBeInTheDocument()
    })

    it("should disable newEmail and emailConfirmation when isSubmitting", () => {
        mocks.isSubmitting = true
        const props = {
            ...defaultProps,
            show: { emailForm: true, passwordForm: false },
        }

        render(<EmailForm {...props} />)

        expect(screen.getByTestId("input-newEmail")).toBeDisabled()
        expect(screen.getByTestId("input-emailConfirmation")).toBeDisabled()
    })

    it("should render newEmail field with correct props", () => {
        const props = {
            ...defaultProps,
            show: { emailForm: true, passwordForm: false },
        }

        render(<EmailForm {...props} />)

        expect(screen.getByText("Nuevo correo electrónico")).toBeInTheDocument()
        expect(screen.getByTestId("input-newEmail")).toBeInTheDocument()
    })

    it("should render emailConfirmation field with correct props", () => {
        const props = {
            ...defaultProps,
            show: { emailForm: true, passwordForm: false },
        }

        render(<EmailForm {...props} />)

        expect(screen.getByText("Confirme su correo electrónico")).toBeInTheDocument()
        expect(screen.getByTestId("input-emailConfirmation")).toBeInTheDocument()
    })

    it("should render email inputs with type email for mobile keyboard optimization", () => {
        const props = {
            ...defaultProps,
            show: { emailForm: true, passwordForm: false },
        }

        render(<EmailForm {...props} />)

        expect(screen.getByTestId("input-email")).toHaveAttribute("type", "email")
        expect(screen.getByTestId("input-newEmail")).toHaveAttribute("type", "email")
        expect(screen.getByTestId("input-emailConfirmation")).toHaveAttribute("type", "email")
    })
})
