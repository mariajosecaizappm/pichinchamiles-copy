import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { PaymentStatus } from "@/domain/entity/Payment/payment"
import ShoppingCartStatusModal from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStatusModal/ShoppingCartStatusModal"
import StatusIcon from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStatusModal/components/StatusIcon/StatusIcon"
import SupportBox from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStatusModal/components/SupportBox/SupportBox"
import useShoppingCartStatusModal from "@/presentation/pages/ShoppingCartDetail/hooks/useShoppingCartStatusModal"

const mocks = vi.hoisted(() => ({
    useModal: vi.fn(),
    modalProps: [] as Array<Record<string, unknown>>,
    buttonClicks: [] as string[],
}))

vi.mock("@/presentation/components/Modal", () => ({
    __esModule: true,
    default: ({
        children,
        isOpen,
        onClose,
    }: {
        children: React.ReactNode
        isOpen: boolean
        onClose?: (isOpen: boolean) => void
    }) => {
        mocks.modalProps.push({ isOpen, onClose })
        return isOpen ? (
            <div data-testid="status-modal-root">
                <button type="button" onClick={() => onClose?.(false)}>
                    modal-close
                </button>
                <button type="button" onClick={() => onClose?.(true)}>
                    modal-ignore-close
                </button>
                {children}
            </div>
        ) : null
    },
    useModal: mocks.useModal,
}))

vi.mock("@/presentation/components/Form/components/Button/Button", () => ({
    __esModule: true,
    default: ({
        children,
        onPress,
        ...props
    }: {
        children: React.ReactNode
        onPress?: () => void
    } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button type="button" onClick={onPress} {...props}>
            {children}
        </button>
    ),
}))

vi.mock("@/presentation/components/Alert", () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="alert">{children}</div>
    ),
}))

describe("Shopping cart status modal pieces", () => {
    beforeEach(() => {
        mocks.useModal.mockReset()
        mocks.modalProps.length = 0
        mocks.buttonClicks.length = 0
    })

    it("renders the proper icon for each payment status", () => {
        const { rerender } = render(<StatusIcon status={PaymentStatus.SUCCESS} />)

        expect(document.querySelector("svg")).toBeInTheDocument()
        expect(document.querySelectorAll("circle")).toHaveLength(1)

        rerender(<StatusIcon status={PaymentStatus.REJECTED} />)
        expect(document.querySelector("svg")).toBeInTheDocument()

        rerender(<StatusIcon status={PaymentStatus.PENDING} />)
        expect(document.querySelector("svg")).toBeInTheDocument()
    })

    it("renders the support message", () => {
        render(<SupportBox />)

        expect(screen.getByTestId("alert")).toBeInTheDocument()
        expect(screen.getByText("¿Necesitas ayuda?")).toBeInTheDocument()
        expect(screen.getByText("Comunícate al 1800 – BPMILE (276453)")).toBeInTheDocument()
    })

    it("renders ShoppingCartStatusModal and triggers the expected actions", () => {
        const onClose = vi.fn()
        const onGoToRedemptions = vi.fn()
        const onBackToHome = vi.fn()
        const onRetry = vi.fn()

        render(
            <ShoppingCartStatusModal
                isOpen
                title="Canje exitoso"
                description="Descripcion"
                secondaryDescription="Texto secundario"
                showSupportBox
                onClose={onClose}
                onGoToRedemptions={onGoToRedemptions}
                onBackToHome={onBackToHome}
                onRetry={onRetry}
                status={PaymentStatus.SUCCESS}
                retry={false}
            />,
        )

        expect(screen.getByText("Canje exitoso")).toBeInTheDocument()
        expect(screen.getByText("Descripcion")).toBeInTheDocument()
        expect(screen.getByText("Texto secundario")).toBeInTheDocument()
        expect(screen.getByText("Ver mis pedidos")).toBeInTheDocument()
        expect(screen.getByText("Volver al home")).toBeInTheDocument()
        expect(screen.getByText("¿Necesitas ayuda?")).toBeInTheDocument()

        fireEvent.click(screen.getByRole("button", { name: "Ver mis pedidos" }))
        fireEvent.click(screen.getByRole("button", { name: "Volver al home" }))
        fireEvent.click(screen.getByRole("button", { name: "modal-ignore-close" }))
        fireEvent.click(screen.getByRole("button", { name: "modal-close" }))

        expect(onGoToRedemptions).toHaveBeenCalledTimes(1)
        expect(onBackToHome).toHaveBeenCalledTimes(1)
        expect(onClose).toHaveBeenCalledTimes(1)

        const { rerender } = render(
            <ShoppingCartStatusModal
                isOpen
                title="Canje rechazado"
                description="Descripcion"
                secondaryDescription="Texto secundario"
                showSupportBox={false}
                onClose={onClose}
                onGoToRedemptions={onGoToRedemptions}
                onBackToHome={onBackToHome}
                onRetry={onRetry}
                status={PaymentStatus.REJECTED}
                retry
            />,
        )

        rerender(
            <ShoppingCartStatusModal
                isOpen
                title="Canje rechazado"
                description="Descripcion"
                secondaryDescription="Texto secundario"
                showSupportBox={false}
                onClose={onClose}
                onGoToRedemptions={onGoToRedemptions}
                onBackToHome={onBackToHome}
                onRetry={onRetry}
                status={PaymentStatus.REJECTED}
                retry
            />,
        )

        fireEvent.click(screen.getByRole("button", { name: "Reiniciar tu compra" }))

        expect(onRetry).toHaveBeenCalledTimes(1)
    })

    it("binds useShoppingCartStatusModal to its fixed modal id", () => {
        const openModal = vi.fn()
        const closeAllModals = vi.fn()
        mocks.useModal.mockReturnValue({
            isOpen: true,
            openModal,
            closeAllModals,
        })

        const { result } = renderHookForHook()

        expect(mocks.useModal).toHaveBeenCalledWith("shoppingCartStatusModal")
        expect(result.current.isShoppingCartStatusModalOpen).toBe(true)

        result.current.openShoppingCartStatusModal({
            title: "Canje exitoso",
            description: "Descripcion",
            secondaryDescription: "Secundario",
            showSupportBox: false,
            onClose: vi.fn(),
            onGoToRedemptions: vi.fn(),
            onBackToHome: vi.fn(),
            onRetry: vi.fn(),
            status: PaymentStatus.SUCCESS,
            retry: false,
            isOpen: true,
        } as any)

        expect(openModal).toHaveBeenCalledWith(
            expect.any(Function),
            expect.objectContaining({
                title: "Canje exitoso",
            }),
            "shoppingCartStatusModal",
        )

        result.current.closeShoppingCartStatusModal()
        expect(closeAllModals).toHaveBeenCalledTimes(1)
    })
})

function renderHookForHook() {
    const value = { current: null as ReturnType<typeof useShoppingCartStatusModal> | null }

    const Consumer = () => {
        value.current = useShoppingCartStatusModal()
        return null
    }

    render(<Consumer />)

    return { result: value as { current: ReturnType<typeof useShoppingCartStatusModal> } }
}
