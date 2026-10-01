import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, afterEach } from "vitest"
import SecurityForm from "@/presentation/pages/Profile/Security/SecurityForm"
import { PersonalMember, MemberType } from "@/domain/entity/Member/member"

const mocks = vi.hoisted(() => ({
    formOnSubmit: null as any,
    formInitialValues: null as any,
    formSchema: null as any,
}))

vi.mock("@/presentation/components/Form/context/Form", () => ({
    default: ({ initialValues, onSubmit, schema, children, className }: any) => {
        mocks.formInitialValues = initialValues
        mocks.formOnSubmit = onSubmit
        mocks.formSchema = schema
        return <form className={className} data-testid="mock-form">{children}</form>
    },
}))

vi.mock("@/presentation/components/Form/controls/FormButton", () => ({
    default: ({ children, alwaysEnabled }: { children: React.ReactNode, alwaysEnabled?: boolean }) => (
        <button type="submit" data-testid="form-button" data-always-enabled={String(!!alwaysEnabled)}>{children}</button>
    ),
}))

vi.mock("@/presentation/pages/Profile/Security/components/EmailForm/EmailForm", () => ({
    default: ({ show, setShow, formRef }: any) => (
        <div data-testid="email-form" data-show={JSON.stringify(show)}>
            Email Form
        </div>
    ),
}))

vi.mock("@/presentation/pages/Profile/Security/components/PasswordForm", () => ({
    default: ({ show, setShow, formRef }: any) => (
        <div data-testid="password-form" data-show={JSON.stringify(show)}>
            Password Form
        </div>
    ),
}))

vi.mock("@/presentation/pages/Profile/Security/SecurityFormConfig", () => ({
    getInitialFormValues: vi.fn((member) => ({
        email: member.enrollmentEmail || "",
        newEmail: undefined,
        emailConfirmation: undefined,
        password: "********",
        newPassword: "",
        newPasswordConfirm: "",
    })),
    getSecurityFormValidationSchema: vi.fn((type) => ({
        validate: vi.fn(),
        _type: type,
    })),
    SecurityFormSchemaType: {
        EMAIL: "email",
        PASSWORD: "password",
    },
}))

describe("SecurityForm", () => {
    const mockMember: PersonalMember = {
        acceptLopd: false,
        acceptedTermsAndCondition: false,
        cellPhone: "0999999999",
        enrollmentEmail: "user@test.com",
        firstName: "Juan",
        secondName: "",
        firstLastName: "Pérez",
        secondLastName: "",
        gender: "M",
        birthDay: "1990-01-01",
        state: "Pichincha",
        city: "Quito",
        address: "Av. 1",
        identificationNumber: "123",
        identificationType: "CI",
        memberType: MemberType.PERSONAL,
        phone: "000",
        country: "EC",
        registrationDate: "2026-01-01",
        segment: "SEG",
    }

    const mockFormRef = {
        current: {
            submitForm: vi.fn(),
            reset: vi.fn(),
            disableForm: vi.fn(),
            focusOn: vi.fn(),
            addAlert: vi.fn(),
            clearAlert: vi.fn(),
        },
    }

    const defaultProps = {
        member: mockMember,
        show: { emailForm: false, passwordForm: false },
        setShow: vi.fn(),
        onUpdateSecurityData: vi.fn(),
        formRef: mockFormRef,
    }

    afterEach(() => {
        vi.clearAllMocks()
    })

    it("should render Form component with correct props", () => {
        render(<SecurityForm {...defaultProps} />)

        expect(screen.getByTestId("mock-form")).toBeInTheDocument()
    })

    it("should pass correct initialValues from getInitialFormValues", () => {
        render(<SecurityForm {...defaultProps} />)

        expect(mocks.formInitialValues).toEqual({
            email: "user@test.com",
            newEmail: undefined,
            emailConfirmation: undefined,
            password: "********",
            newPassword: "",
            newPasswordConfirm: "",
        })
    })

    it("should pass EMAIL validation schema when emailForm is shown", () => {
        const props = {
            ...defaultProps,
            show: { emailForm: true, passwordForm: false },
        }

        render(<SecurityForm {...props} />)

        expect(mocks.formSchema._type).toBe("email")
    })

    it("should pass PASSWORD validation schema when passwordForm is shown", () => {
        const props = {
            ...defaultProps,
            show: { emailForm: false, passwordForm: true },
        }

        render(<SecurityForm {...props} />)

        expect(mocks.formSchema._type).toBe("password")
    })

    it("should pass PASSWORD validation schema when both forms are hidden", () => {
        render(<SecurityForm {...defaultProps} />)

        expect(mocks.formSchema._type).toBe("password")
    })

    it("should render EmailForm with correct props", () => {
        render(<SecurityForm {...defaultProps} />)

        const emailForm = screen.getByTestId("email-form")
        expect(emailForm).toBeInTheDocument()
        expect(emailForm.getAttribute("data-show")).toBe(
            JSON.stringify({ emailForm: false, passwordForm: false })
        )
    })

    it("should render PasswordForm with correct props", () => {
        render(<SecurityForm {...defaultProps} />)

        const passwordForm = screen.getByTestId("password-form")
        expect(passwordForm).toBeInTheDocument()
        expect(passwordForm.getAttribute("data-show")).toBe(
            JSON.stringify({ emailForm: false, passwordForm: false })
        )
    })

    it("should render FormButton with Guardar cambios label", () => {
        render(<SecurityForm {...defaultProps} />)

        const button = screen.getByTestId("form-button")
        expect(button).toBeInTheDocument()
        expect(button).toHaveAttribute("data-always-enabled", "false")
        expect(screen.getByText("Guardar cambios")).toBeInTheDocument()
    })

    it("should call onUpdateSecurityData when form is submitted", () => {
        const onUpdateSecurityData = vi.fn()
        const props = {
            ...defaultProps,
            onUpdateSecurityData,
        }

        render(<SecurityForm {...props} />)

        expect(mocks.formOnSubmit).toBe(onUpdateSecurityData)
    })

    it("should render with correct container classes", () => {
        const { container } = render(<SecurityForm {...defaultProps} />)

        const wrapper = container.querySelector(".body-container")
        expect(wrapper).toBeInTheDocument()
        expect(wrapper).toHaveClass("pt-3", "pb-6", "md:max-w-[676px]")
    })

    it("should render form with correct classes", () => {
        render(<SecurityForm {...defaultProps} />)

        const form = screen.getByTestId("mock-form")
        expect(form).toHaveClass("flex", "flex-col", "gap-4")
    })
})
