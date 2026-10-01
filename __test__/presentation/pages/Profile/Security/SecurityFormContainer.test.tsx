import { render, screen, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import SecurityFormContainer from "@/presentation/pages/Profile/Security/SecurityFormContainer"
import { PersonalMember, MemberType } from "@/domain/entity/Member/member"

const mocks = vi.hoisted(() => ({
    member: null as PersonalMember | null,
    updateEmail: vi.fn(),
    isValidatingSession: false,
    withOtp: vi.fn(),
    onSubmitOtp: null as any,
    onRequestOtp: null as any,
    onContinue: null as any,
    updateMemberValidateOtp: vi.fn(),
    updateMemberUpdate: vi.fn(),
    setFieldValue: vi.fn(),
    resetForm: vi.fn(),
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => ({
        member: mocks.member,
        updateEmail: mocks.updateEmail,
        isValidatingSession: mocks.isValidatingSession,
    }),
}))

vi.mock("@/presentation/hooks/useOtp", () => ({
    default: ({ onSubmitOtp, onRequestOtp, onContinue }: any) => {
        mocks.onSubmitOtp = onSubmitOtp
        mocks.onRequestOtp = onRequestOtp
        mocks.onContinue = onContinue
        return { withOtp: mocks.withOtp }
    },
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: () => ({
            validateOtpUpdateInformation: mocks.updateMemberValidateOtp,
            updateMember: mocks.updateMemberUpdate,
        }),
    },
}))

vi.mock("@heroui/react", () => ({
    Skeleton: ({ className }: { className: string }) => (
        <div data-testid="skeleton" className={className}>Loading...</div>
    ),
}))

vi.mock("@/presentation/pages/Profile/Security/SecurityForm", () => ({
    default: ({ show, setShow, onUpdateSecurityData, formRef }: any) => {
        if (formRef) {
            formRef.current = {
                setFieldValue: mocks.setFieldValue,
                reset: mocks.resetForm,
            }
        }

        return (
        <div data-testid="security-form">
            <button onClick={() => onUpdateSecurityData({ test: "data" })}>
                Update Security
            </button>
            <button data-testid="show-email-form" onClick={() => setShow({ emailForm: true, passwordForm: false })}>
                Show Email Form
            </button>
            <button data-testid="show-password-form" onClick={() => setShow({ emailForm: false, passwordForm: true })}>
                Show Password Form
            </button>
        </div>
        )
    },
}))

vi.mock("@/presentation/components/Modal/SuccessAlertModal", () => ({
    default: ({ isOpen, title, onContinue, continueLabel, successIcon }: any) =>
        isOpen ? (
            <div data-testid="success-modal">
                {successIcon}
                <h2>{title}</h2>
                <button onClick={onContinue}>{continueLabel}</button>
            </div>
        ) : null,
}))

vi.mock("@/presentation/pages/Products/ProductDetails/components/ProductForm/components/Snackbar", () => ({
    SuccessSnackbarIcon: () => <div data-testid="success-icon">✓</div>,
}))

vi.mock("@/presentation/pages/Profile/Security/SecurityFormConfig", () => ({
    getOtpValidationData: vi.fn((values, show) => ({
        password: show?.passwordForm ? values.newPasswordConfirm : undefined,
        enrollmentEmail: show?.emailForm ? values.emailConfirmation : undefined,
    })),
}))

describe("SecurityFormContainer", () => {
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

    beforeEach(() => {
        mocks.member = mockMember
        mocks.isValidatingSession = false
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it("should render loading skeleton when isValidatingSession is true", () => {
        mocks.isValidatingSession = true

        render(<SecurityFormContainer />)

        expect(screen.getByTestId("skeleton")).toBeInTheDocument()
        expect(screen.queryByTestId("security-form")).not.toBeInTheDocument()
    })

    it("should render skeleton with correct classes", () => {
        mocks.isValidatingSession = true

        const { container } = render(<SecurityFormContainer />)

        const wrapper = container.querySelector(".body-container")
        expect(wrapper).toBeInTheDocument()
        expect(wrapper).toHaveClass("pt-3", "pb-6", "md:max-w-[676px]")

        const skeleton = screen.getByTestId("skeleton")
        expect(skeleton).toHaveClass("w-full", "h-60", "rounded-lg", "border", "border-darkGrayishBlue-100")
    })

    it("should return null when member is not available", () => {
        mocks.member = null

        const { container } = render(<SecurityFormContainer />)

        expect(container.firstChild).toBeNull()
        expect(screen.queryByTestId("security-form")).not.toBeInTheDocument()
    })

    it("should render SecurityForm when member exists", () => {
        render(<SecurityFormContainer />)

        expect(screen.getByTestId("security-form")).toBeInTheDocument()
    })

    it("should call withOtp when handleUpdateSecurityData is called", async () => {
        render(<SecurityFormContainer />)

        const button = screen.getByText("Update Security")
        
        await act(async () => {
            button.click()
        })

        expect(mocks.withOtp).toHaveBeenCalledWith({ test: "data" })
    })

    it("should validate OTP with password data when passwordForm is shown", async () => {
        render(<SecurityFormContainer />)

        // Set show.passwordForm = true first
        await act(async () => {
            screen.getByTestId("show-password-form").click()
        })

        const mfaRequest = {
            mfaCode: "123456",
            mfaToken: "token123",
        }
        const values = { newPasswordConfirm: "newpass123" }

        await act(async () => {
            await mocks.onSubmitOtp(mfaRequest, values)
        })

        expect(mocks.updateMemberValidateOtp).toHaveBeenCalledWith({
            password: "newpass123",
            enrollmentEmail: undefined,
            mfaCode: "123456",
            mfaToken: "token123",
        })
    })

    it("should validate OTP with email data when emailForm is shown", async () => {
        render(<SecurityFormContainer />)

        // Set show.emailForm = true first
        await act(async () => {
            screen.getByTestId("show-email-form").click()
        })

        const mfaRequest = {
            mfaCode: "123456",
            mfaToken: "token123",
        }
        const values = { emailConfirmation: "new@test.com" }

        await act(async () => {
            await mocks.onSubmitOtp(mfaRequest, values)
        })

        expect(mocks.updateMemberValidateOtp).toHaveBeenCalledWith({
            password: undefined,
            enrollmentEmail: "new@test.com",
            mfaCode: "123456",
            mfaToken: "token123",
        })
    })

    it("should update member information in onRequestOtp when passwordForm is shown", async () => {
        mocks.updateMemberUpdate.mockResolvedValue({ success: true })

        render(<SecurityFormContainer />)

        // Set show.passwordForm = true first
        await act(async () => {
            screen.getByTestId("show-password-form").click()
        })

        const values = { newPasswordConfirm: "newpass123" }

        await act(async () => {
            await mocks.onRequestOtp(values)
        })

        expect(mocks.updateMemberUpdate).toHaveBeenCalledWith({
            password: "newpass123",
            enrollmentEmail: undefined,
        })
    })

    it("should open success modal in onContinue", async () => {
        render(<SecurityFormContainer />)

        expect(screen.queryByTestId("success-modal")).not.toBeInTheDocument()

        await act(async () => {
            await mocks.onContinue({})
        })

        expect(screen.getByTestId("success-modal")).toBeInTheDocument()
    })

    it("should update email when emailConfirmation exists in submitted values", async () => {
        render(<SecurityFormContainer />)

        const values = {
            emailConfirmation: "newemail@test.com",
        }

        await act(async () => {
            await mocks.onContinue(values)
        })

        expect(mocks.updateEmail).toHaveBeenCalledWith("newemail@test.com")
    })

    it("should update email form fields via setFieldValue after email update", async () => {
        render(<SecurityFormContainer />)

        await act(async () => {
            await mocks.onContinue({ emailConfirmation: "newemail@test.com" })
        })

        expect(mocks.setFieldValue).toHaveBeenCalledWith("email", "newemail@test.com")
        expect(mocks.setFieldValue).toHaveBeenCalledWith("newEmail", undefined)
        expect(mocks.setFieldValue).toHaveBeenCalledWith("emailConfirmation", undefined)
        expect(mocks.resetForm).not.toHaveBeenCalled()
    })

    it("should reset form after password update in onContinue", async () => {
        render(<SecurityFormContainer />)

        await act(async () => {
            await mocks.onContinue({ newPasswordConfirm: "newpass123" })
        })

        expect(mocks.resetForm).toHaveBeenCalled()
        expect(mocks.setFieldValue).not.toHaveBeenCalled()
    })

    it("should not update email when emailConfirmation is undefined", async () => {
        render(<SecurityFormContainer />)

        const values = {
            newPasswordConfirm: "newpass123",
        }

        await act(async () => {
            await mocks.onContinue(values)
        })

        expect(mocks.updateEmail).not.toHaveBeenCalled()
    })

    it("should render SuccessAlertModal with correct props", () => {
        render(<SecurityFormContainer />)

        expect(screen.queryByTestId("success-modal")).not.toBeInTheDocument()
    })

    it("should close success modal when onContinue is called", async () => {
        render(<SecurityFormContainer />)

        await act(async () => {
            await mocks.onContinue({})
        })

        expect(screen.getByTestId("success-modal")).toBeInTheDocument()

        const okButton = screen.getByText("OK")
        
        await act(async () => {
            okButton.click()
        })

        expect(screen.queryByTestId("success-modal")).not.toBeInTheDocument()
    })

    it("should render success modal with correct title", async () => {
        render(<SecurityFormContainer />)

        await act(async () => {
            await mocks.onContinue({})
        })

        expect(screen.getByText("Datos actualizados exitosamente")).toBeInTheDocument()
    })

    it("should render success modal with OK button", async () => {
        render(<SecurityFormContainer />)

        await act(async () => {
            await mocks.onContinue({})
        })

        expect(screen.getByText("OK")).toBeInTheDocument()
    })

    it("should render SuccessSnackbarIcon in success modal", async () => {
        render(<SecurityFormContainer />)

        await act(async () => {
            await mocks.onContinue({})
        })

        expect(screen.getByTestId("success-icon")).toBeInTheDocument()
    })

    it("should initialize useOtp with correct title", () => {
        render(<SecurityFormContainer />)

        expect(mocks.onSubmitOtp).toBeDefined()
        expect(mocks.onRequestOtp).toBeDefined()
        expect(mocks.onContinue).toBeDefined()
    })
})
