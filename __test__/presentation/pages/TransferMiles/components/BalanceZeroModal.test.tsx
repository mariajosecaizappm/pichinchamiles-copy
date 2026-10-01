import { fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import BalanceZeroModal from "@/presentation/pages/TransferMiles/components/BalanceZeroModal/BalanceZeroModal"

const mocks = vi.hoisted(() => ({
    lastModalProps: null as Record<string, unknown> | null,
}))

vi.mock("@/presentation/components/icons/ModalInfoIcon", () => ({
    default: ({ className }: { className?: string }) => (
        <span data-testid="balance-zero-icon" className={className} />
    ),
}))

vi.mock("@/presentation/components/Modal", () => ({
    default: (props: {
        isOpen: boolean
        children: React.ReactNode
        footer?: React.ReactNode
        hideCloseButton?: boolean
        isDismissable?: boolean
        isKeyboardDismissDisabled?: boolean
    }) => {
        mocks.lastModalProps = props as unknown as Record<string, unknown>
        if (!props.isOpen) return null
        return (
            <div data-testid="mock-modal">
                {props.children}
                {props.footer}
            </div>
        )
    },
}))

vi.mock("@/presentation/components/Form/components/Button/Button", () => ({
    default: ({
        children,
        onPress,
        testId,
        "aria-label": ariaLabel,
    }: {
        children: React.ReactNode
        onPress?: () => void
        testId?: string
        "aria-label"?: string
    }) => (
        <button type="button" data-testid={testId} aria-label={ariaLabel} onClick={onPress}>
            {children}
        </button>
    ),
}))

const defaultProps = {
    isOpen: true,
    title: "Necesitas más millas para transferir",
    description: "Para realizar una transferencia necesitas tener al menos 10 millas en tu cuenta.",
    continueLabel: "Ir al home",
    onGoHome: vi.fn(),
}

describe("BalanceZeroModal", () => {
    afterEach(() => {
        vi.clearAllMocks()
        mocks.lastModalProps = null
    })

    it("does not render when closed", () => {
        render(<BalanceZeroModal {...defaultProps} isOpen={false} />)

        expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument()
    })

    it("renders blocking modal with props content and go home action", () => {
        const onGoHome = vi.fn()

        render(<BalanceZeroModal {...defaultProps} onGoHome={onGoHome} />)

        expect(mocks.lastModalProps).toMatchObject({
            hideCloseButton: true,
            isDismissable: false,
            isKeyboardDismissDisabled: true,
        })
        expect(screen.getByTestId("balance-zero-icon")).toHaveClass("size-12")
        expect(
            screen.getByRole("heading", { name: defaultProps.title })
        ).toBeInTheDocument()
        expect(screen.getByText(defaultProps.description)).toBeInTheDocument()
        expect(screen.getByRole("button", { name: defaultProps.continueLabel })).toBeInTheDocument()
        expect(mocks.lastModalProps?.footer).toBeTruthy()

        fireEvent.click(screen.getByTestId("balanceZeroGoHome"))

        expect(onGoHome).toHaveBeenCalledTimes(1)
    })
})
