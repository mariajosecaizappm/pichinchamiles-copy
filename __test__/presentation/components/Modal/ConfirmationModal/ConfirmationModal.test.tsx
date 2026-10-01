import { fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import ConfirmationModal from "@/presentation/components/Modal/ConfirmationModal/ConfirmationModal"

const mocks = vi.hoisted(() => ({
    setLastModalProps: (props: any) => {
        mocks.lastModalProps = props
    },
    lastModalProps: null as any,
}))

vi.mock("@/presentation/components/Modal", () => ({
    default: (props: any) => {
        mocks.setLastModalProps(props)
        if (!props.isOpen) return null
        return (
            <div data-testid="mock-modal">
                <button
                    type="button"
                    data-testid="mock-modal-close"
                    onClick={() => props.onClose?.(false)}
                >
                    close
                </button>
                {props.children}
                {props.footer}
            </div>
        )
    },
}))

vi.mock("@/presentation/components/Form/components/Button/Button", () => ({
    default: ({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) => (
        <button type="button" onClick={onPress}>
            {children}
        </button>
    ),
}))

describe("ConfirmationModal", () => {
    afterEach(() => {
        vi.clearAllMocks()
        mocks.lastModalProps = null
    })

    it("should not render when isOpen is false", () => {
        render(
            <ConfirmationModal
                isOpen={false}
                message="¿Desea salir?"
                onConfirm={vi.fn()}
                onCancel={vi.fn()}
            />,
        )

        expect(screen.queryByText("¿Desea salir?")).toBeNull()
    })

    it("should render message and default action labels", () => {
        render(
            <ConfirmationModal
                isOpen
                message="¿Desea salir?"
                onConfirm={vi.fn()}
                onCancel={vi.fn()}
            />,
        )

        expect(screen.getByText("¿Desea salir?")).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Salir" })).toBeInTheDocument()
    })

    it("should render custom action labels", () => {
        render(
            <ConfirmationModal
                isOpen
                message="¿Desea continuar?"
                confirmLabel="Sí, continuar"
                cancelLabel="No, volver"
                onConfirm={vi.fn()}
                onCancel={vi.fn()}
            />,
        )

        expect(screen.getByRole("button", { name: "No, volver" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Sí, continuar" })).toBeInTheDocument()
    })

    it("should render title and message when title is provided", () => {
        render(
            <ConfirmationModal
                isOpen
                title="Eliminar dirección"
                message="¿Quieres eliminar esta dirección registrada?"
                confirmLabel="Eliminar dirección"
                onConfirm={vi.fn()}
                onCancel={vi.fn()}
            />,
        )

        expect(screen.getByRole("heading", { name: "Eliminar dirección" })).toBeInTheDocument()
        expect(screen.getByText("¿Quieres eliminar esta dirección registrada?")).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Eliminar dirección" })).toBeInTheDocument()
    })

    it("should call onConfirm when confirm button is clicked", () => {
        const onConfirm = vi.fn()

        render(
            <ConfirmationModal
                isOpen
                message="¿Desea salir?"
                onConfirm={onConfirm}
                onCancel={vi.fn()}
            />,
        )

        fireEvent.click(screen.getByRole("button", { name: "Salir" }))
        expect(onConfirm).toHaveBeenCalledTimes(1)
    })

    it("should call onCancel when cancel button is clicked", () => {
        const onCancel = vi.fn()

        render(
            <ConfirmationModal
                isOpen
                message="¿Desea salir?"
                onConfirm={vi.fn()}
                onCancel={onCancel}
            />,
        )

        fireEvent.click(screen.getByRole("button", { name: "Cancelar" }))
        expect(onCancel).toHaveBeenCalledTimes(1)
    })

    it("should call onCancel when modal is closed", () => {
        const onCancel = vi.fn()

        render(
            <ConfirmationModal
                isOpen
                message="¿Desea salir?"
                onConfirm={vi.fn()}
                onCancel={onCancel}
            />,
        )

        fireEvent.click(screen.getByTestId("mock-modal-close"))
        expect(onCancel).toHaveBeenCalledTimes(1)
    })

    it("should pass placement and classNames to Modal", () => {
        render(
            <ConfirmationModal
                isOpen
                message="¿Desea salir?"
                onConfirm={vi.fn()}
                onCancel={vi.fn()}
            />,
        )

        expect(mocks.lastModalProps.placement).toBe("center")
        expect(mocks.lastModalProps.classNames.base).toContain("max-w-[563px]")
        expect(mocks.lastModalProps.classNames.header).toContain("hidden")
        expect(mocks.lastModalProps.classNames.closeButton).toContain("!z-50")
    })
})
