import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, afterEach } from "vitest"
import { Otp } from "@/domain/entity/Otp/otp"
import AddressOtpModal from "@/presentation/pages/ShoppingCartDetail/components/AddressOtpModal/AddressOtpModal"

const mocks = vi.hoisted(() => ({
    lastOtpFormProps: null as Record<string, unknown> | null,
    lastModalProps: null as Record<string, unknown> | null,
}))

vi.mock("@/presentation/components/Modal", () => ({
    default: ({
        children,
        onClose,
        headerButton,
        classNames,
    }: {
        children: React.ReactNode
        onClose?: (isOpen: boolean) => void
        headerButton?: React.ReactNode
        classNames?: Record<string, string>
    }) => {
        mocks.lastModalProps = { onClose, headerButton, classNames }
        return (
            <div data-testid="mock-modal" data-classnames={JSON.stringify(classNames ?? {})}>
                <div data-testid="modal-header">{headerButton}</div>
                <button
                    type="button"
                    data-testid="trigger-modal-close"
                    onClick={() => onClose?.(false)}
                >
                    close
                </button>
                <button
                    type="button"
                    data-testid="trigger-modal-stay-open"
                    onClick={() => onClose?.(true)}
                >
                    stay open
                </button>
                {children}
            </div>
        )
    },
}))

vi.mock("@/presentation/components/Layout/OtpForm", () => ({
    default: (props: Record<string, unknown>) => {
        mocks.lastOtpFormProps = props
        return (
            <div data-testid="mock-otp-form">
                <button
                    type="button"
                    data-testid="trigger-submit-otp"
                    onClick={() =>
                        (props.onSubmitOtp as (request: { mfaCode: string }) => Promise<void>)?.({
                            mfaCode: "654321",
                        })
                    }
                >
                    submit otp
                </button>
                <button
                    type="button"
                    data-testid="trigger-resend-otp"
                    onClick={() => (props.onResendOtp as () => Promise<void>)?.()}
                >
                    resend otp
                </button>
            </div>
        )
    },
}))

const otp: Otp = {
    cellPhone: "0999999999",
    durationOtpCodeMinutes: 5,
    email: "user@test.com",
    mfaToken: "token-123",
}

describe("AddressOtpModal", () => {
    afterEach(() => {
        vi.clearAllMocks()
        mocks.lastOtpFormProps = null
        mocks.lastModalProps = null
    })

    it("should render nothing when otp is null", () => {
        const { container } = render(
            <AddressOtpModal
                otp={null}
                onClose={vi.fn()}
                onValidateOtp={vi.fn()}
                onResendOtp={vi.fn()}
            />
        )

        expect(container).toBeEmptyDOMElement()
    })

    it("should render modal with security header and otp form", () => {
        render(
            <AddressOtpModal
                otp={otp}
                onClose={vi.fn()}
                onValidateOtp={vi.fn()}
                onResendOtp={vi.fn()}
            />
        )

        expect(screen.getByTestId("mock-modal")).toBeInTheDocument()
        expect(screen.getByText("Código de seguridad")).toBeInTheDocument()
        expect(screen.getByTestId("mock-otp-form")).toBeInTheDocument()
        expect(mocks.lastModalProps?.classNames).toEqual({ base: "md:max-w-[456px]" })
        expect(mocks.lastOtpFormProps?.otp).toEqual(otp)
    })

    it("should call onClose when modal closes", () => {
        const onClose = vi.fn()

        render(
            <AddressOtpModal
                otp={otp}
                onClose={onClose}
                onValidateOtp={vi.fn()}
                onResendOtp={vi.fn()}
            />
        )

        fireEvent.click(screen.getByTestId("trigger-modal-close"))

        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it("should not call onClose when modal stays open", () => {
        const onClose = vi.fn()

        render(
            <AddressOtpModal
                otp={otp}
                onClose={onClose}
                onValidateOtp={vi.fn()}
                onResendOtp={vi.fn()}
            />
        )

        fireEvent.click(screen.getByTestId("trigger-modal-stay-open"))

        expect(onClose).not.toHaveBeenCalled()
    })

    it("should call onValidateOtp with otp code on submit", async () => {
        const onValidateOtp = vi.fn().mockResolvedValue(undefined)

        render(
            <AddressOtpModal
                otp={otp}
                onClose={vi.fn()}
                onValidateOtp={onValidateOtp}
                onResendOtp={vi.fn()}
            />
        )

        fireEvent.click(screen.getByTestId("trigger-submit-otp"))

        await waitFor(() => {
            expect(onValidateOtp).toHaveBeenCalledWith({ code: "654321" })
        })
    })

    it("should call onResendOtp when resend is triggered", async () => {
        const onResendOtp = vi.fn().mockResolvedValue(undefined)

        render(
            <AddressOtpModal
                otp={otp}
                onClose={vi.fn()}
                onValidateOtp={vi.fn()}
                onResendOtp={onResendOtp}
            />
        )

        fireEvent.click(screen.getByTestId("trigger-resend-otp"))

        await waitFor(() => {
            expect(onResendOtp).toHaveBeenCalledTimes(1)
        })
    })
})
