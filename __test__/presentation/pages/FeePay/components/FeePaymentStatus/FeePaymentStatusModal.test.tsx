import React from "react"
import {render, screen, fireEvent} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"
import {FeePaymentDetail, PaymentStatus} from "@/domain/entity/Payment/payment"
import FeePaymentStatusModal from "@/presentation/pages/FeePay/components/FeePaymentStatus/FeePaymentStatusModal"

const mocks = vi.hoisted(() => ({
    onClose: vi.fn(),
    onBackToHome: vi.fn(),
    receivedModalProps: [] as any[],
    receivedButtonProps: [] as any[],
}))

vi.mock("@heroui/theme", () => ({
    cn: (...values: any[]) => values.filter(Boolean).join(" "),
}))

vi.mock("@heroui/react", async () => {
    return {
        Button: (props: any) => {
            mocks.receivedButtonProps.push(props)
            return (
                <button
                    data-testid={`heroui-button-${props.color}`}
                    type={props.type}
                    disabled={props.isDisabled}
                    onClick={props.onPress}
                >
                    {props.children}
                </button>
            )
        },
    }
})

vi.mock("@/presentation/components/Modal", () => ({
    default: ({isOpen, onClose, hideCloseButton, isDismissable, children, classNames}: any) => {
        mocks.receivedModalProps.push({isOpen, classNames, hideCloseButton, isDismissable})
        return (
            <div
                data-testid="modal-container"
                data-is-open={String(isOpen)}
                data-hide-close-button={String(hideCloseButton)}
                data-is-dismissable={String(isDismissable)}
            >
                {isOpen && children}
                <button
                    data-testid="modal-close-button"
                    onClick={() => onClose?.(false)}
                >
                    close
                </button>
            </div>
        )
    }
}))

vi.mock("@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStatusModal/components/StatusIcon", () => ({
    default: ({status}: any) => (
        <div data-testid={`status-icon-${status}`}>icon-{status}</div>
    )
}))

vi.mock("@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStatusModal/components/SupportBox", () => ({
    default: () => <div data-testid="support-box">support-box-content</div>
}))

describe("FeePaymentStatusModal", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.onClose.mockReset()
        mocks.onBackToHome.mockReset()
        mocks.receivedModalProps.length = 0
        mocks.receivedButtonProps.length = 0
    })

    const basePaymentDetail: FeePaymentDetail = {
        reference: "FEE123",
        status: PaymentStatus.SUCCESS,
        totalAmount: 25.5,
    }

    const renderModal = (detail: Partial<FeePaymentDetail> = {}, isOpen = true) => {
        return render(
            <FeePaymentStatusModal
                isOpen={isOpen}
                paymentDetail={{...basePaymentDetail, ...detail} as FeePaymentDetail}
                onClose={mocks.onClose}
                onBackToHome={mocks.onBackToHome}
            />
        )
    }

    describe("SUCCESS status", () => {
        it("shows success title", () => {
            renderModal({status: PaymentStatus.SUCCESS})

            expect(screen.getByText("Pago aprobado")).toBeInTheDocument()
        })

        it("shows description with reference and formatted amount", () => {
            renderModal({status: PaymentStatus.SUCCESS, reference: "FEE-SUCCESS-001", totalAmount: 15.5})

            expect(screen.getByText(/Tu pago con referencia/)).toBeInTheDocument()
            expect(screen.getByText(/No. FEE-SUCCESS-001/)).toBeInTheDocument()
            expect(screen.getByText(/\$ 15,50 dólares/)).toBeInTheDocument()
            expect(screen.getByText(/fue realizado exitosamente/)).toBeInTheDocument()
        })

        it("shows secondary description: email copy sent", () => {
            renderModal({status: PaymentStatus.SUCCESS})

            expect(screen.getByText(/Una copia de esta transacción fue enviada a tu correo electrónico/)).toBeInTheDocument()
        })

        it("shows success status icon", () => {
            renderModal({status: PaymentStatus.SUCCESS})

            expect(screen.getByTestId("status-icon-APPROVED")).toBeInTheDocument()
        })

        it("does NOT show support box", () => {
            renderModal({status: PaymentStatus.SUCCESS})

            expect(screen.queryByTestId("support-box")).not.toBeInTheDocument()
        })
    })

    describe("PENDING status", () => {
        it("shows pending title", () => {
            renderModal({status: PaymentStatus.PENDING})

            expect(screen.getByText("Pago pendiente")).toBeInTheDocument()
        })

        it("shows description with reference and formatted amount", () => {
            renderModal({status: PaymentStatus.PENDING, reference: "FEE-PEND-002", totalAmount: 10})

            expect(screen.getByText(/Tu pago con referencia/)).toBeInTheDocument()
            expect(screen.getByText(/No. FEE-PEND-002/)).toBeInTheDocument()
            expect(screen.getByText(/\$ 10,00 dólares/)).toBeInTheDocument()
            expect(screen.getByText(/se encuentra pendiente/)).toBeInTheDocument()
        })

        it("shows secondary description: transaction details by email", () => {
            renderModal({status: PaymentStatus.PENDING})

            expect(screen.getByText(/Recibirás los detalles de la transacción a tu correo electrónico/)).toBeInTheDocument()
        })

        it("shows pending status icon", () => {
            renderModal({status: PaymentStatus.PENDING})

            expect(screen.getByTestId("status-icon-PENDING")).toBeInTheDocument()
        })

        it("shows support box", () => {
            renderModal({status: PaymentStatus.PENDING})

            expect(screen.getByTestId("support-box")).toBeInTheDocument()
        })
    })

    describe("REJECTED status", () => {
        it("shows rejected title", () => {
            renderModal({status: PaymentStatus.REJECTED})

            expect(screen.getByText("Pago rechazado")).toBeInTheDocument()
        })

        it("shows description with reference and formatted amount", () => {
            renderModal({status: PaymentStatus.REJECTED, reference: "FEE-REJ-003", totalAmount: 5.75})

            expect(screen.getByText(/Lo sentimos, tu pago con referencia/)).toBeInTheDocument()
            expect(screen.getByText(/No. FEE-REJ-003/)).toBeInTheDocument()
            expect(screen.getByText(/\$ 5,75 dólares/)).toBeInTheDocument()
            expect(screen.getByText(/fue rechazado/)).toBeInTheDocument()
        })

        it("shows secondary description: try later or contact us", () => {
            renderModal({status: PaymentStatus.REJECTED})

            expect(screen.getByText(/Por favor, intenta realizarlo más tarde o ponte en contacto con nosotros/)).toBeInTheDocument()
        })

        it("shows rejected status icon", () => {
            renderModal({status: PaymentStatus.REJECTED})

            expect(screen.getByTestId("status-icon-REJECTED")).toBeInTheDocument()
        })

        it("shows support box", () => {
            renderModal({status: PaymentStatus.REJECTED})

            expect(screen.getByTestId("support-box")).toBeInTheDocument()
        })
    })

    describe("null status defaults to REJECTED content", () => {
        it("shows rejected title and fallback content when status is null", () => {
            renderModal({status: null as any, reference: "FEE-NULL-004", totalAmount: 20})

            expect(screen.getByText("Pago rechazado")).toBeInTheDocument()
            expect(screen.getByText(/Lo sentimos, tu pago con referencia/)).toBeInTheDocument()
            expect(screen.getByText(/No. FEE-NULL-004/)).toBeInTheDocument()
            expect(screen.getByTestId("status-icon-REJECTED")).toBeInTheDocument()
            expect(screen.getByTestId("support-box")).toBeInTheDocument()
        })
    })

    describe("actions", () => {
        it("does NOT render 'Ver mis canjes' button", () => {
            renderModal({status: PaymentStatus.SUCCESS})

            expect(screen.queryByText("Ver mis canjes")).not.toBeInTheDocument()
        })

        it("renders only one 'Volver al home' button with primary color", () => {
            renderModal({status: PaymentStatus.SUCCESS})

            const buttons = screen.getAllByText("Volver al home")
            expect(buttons).toHaveLength(1)

            expect(screen.getByTestId("heroui-button-primary")).toBeInTheDocument()
        })

        it("calls onBackToHome when 'Volver al home' button is clicked", () => {
            renderModal({status: PaymentStatus.SUCCESS})

            fireEvent.click(screen.getByText("Volver al home"))

            expect(mocks.onBackToHome).toHaveBeenCalledTimes(1)
        })

        it("calls onClose when modal close is triggered", () => {
            renderModal({status: PaymentStatus.SUCCESS})

            fireEvent.click(screen.getByTestId("modal-close-button"))

            expect(mocks.onClose).toHaveBeenCalledTimes(1)
        })

        it("does not call onClose when modal opens (only when explicitly closed)", () => {
            renderModal({status: PaymentStatus.SUCCESS})

            expect(mocks.onClose).not.toHaveBeenCalled()
        })
    })

    describe("modal configuration", () => {
        it("passes hideCloseButton=true to Modal", () => {
            renderModal({status: PaymentStatus.SUCCESS})

            const lastModalProps = mocks.receivedModalProps[mocks.receivedModalProps.length - 1]
            expect(lastModalProps.hideCloseButton).toBe(true)
        })

        it("passes isDismissable=false to Modal so it can only be closed via button", () => {
            renderModal({status: PaymentStatus.SUCCESS})

            const lastModalProps = mocks.receivedModalProps[mocks.receivedModalProps.length - 1]
            expect(lastModalProps.isDismissable).toBe(false)

            const modalContainer = screen.getByTestId("modal-container")
            expect(modalContainer.getAttribute("data-is-dismissable")).toBe("false")
            expect(modalContainer.getAttribute("data-hide-close-button")).toBe("true")
        })
    })

    describe("isOpen prop", () => {
        it("does not render children when isOpen is false", () => {
            renderModal({status: PaymentStatus.SUCCESS}, false)

            expect(screen.queryByText("Pago aprobado")).not.toBeInTheDocument()
        })

        it("passes isOpen correctly to Modal component", () => {
            renderModal({status: PaymentStatus.SUCCESS}, false)

            const modal = screen.getByTestId("modal-container")
            expect(modal.getAttribute("data-is-open")).toBe("false")
        })
    })
})
