import { fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import SuccessAlertModal from "@/presentation/components/Modal/SuccessAlertModal/SuccessAlertModal"

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

describe("SuccessAlertModal", () => {
    afterEach(() => {
        vi.clearAllMocks()
        mocks.lastModalProps = null
    })

    it("should not render when isOpen is false", () => {
        render(
            <SuccessAlertModal
                isOpen={false}
                title="Dirección guardada"
                description="Tu dirección fue registrada correctamente."
                onContinue={vi.fn()}
            />,
        )

        expect(screen.queryByText("Dirección guardada")).toBeNull()
    })

    it("should render title, description and default continue label", () => {
        render(
            <SuccessAlertModal
                isOpen
                title="Dirección guardada"
                description="Tu dirección fue registrada correctamente."
                onContinue={vi.fn()}
            />,
        )

        expect(screen.getByRole("heading", { name: "Dirección guardada" })).toBeInTheDocument()
        expect(screen.getByText("Tu dirección fue registrada correctamente.")).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Continuar" })).toBeInTheDocument()
    })

    it("should render custom continue label", () => {
        render(
            <SuccessAlertModal
                isOpen
                title="Dirección guardada"
                description="Tu dirección fue registrada correctamente."
                continueLabel="Entendido"
                onContinue={vi.fn()}
            />,
        )

        expect(screen.getByRole("button", { name: "Entendido" })).toBeInTheDocument()
    })

    it("should call onContinue when continue button is clicked", () => {
        const onContinue = vi.fn()

        render(
            <SuccessAlertModal
                isOpen
                title="Dirección guardada"
                description="Tu dirección fue registrada correctamente."
                onContinue={onContinue}
            />,
        )

        fireEvent.click(screen.getByRole("button", { name: "Continuar" }))
        expect(onContinue).toHaveBeenCalledTimes(1)
    })

    it("should call onContinue when modal is closed", () => {
        const onContinue = vi.fn()

        render(
            <SuccessAlertModal
                isOpen
                title="Dirección guardada"
                description="Tu dirección fue registrada correctamente."
                onContinue={onContinue}
            />,
        )

        fireEvent.click(screen.getByTestId("mock-modal-close"))
        expect(onContinue).toHaveBeenCalledTimes(1)
    })

    it("should pass placement and classNames to Modal", () => {
        render(
            <SuccessAlertModal
                isOpen
                title="Dirección guardada"
                description="Tu dirección fue registrada correctamente."
                onContinue={vi.fn()}
            />,
        )

        expect(mocks.lastModalProps.placement).toBe("center")
        expect(mocks.lastModalProps.classNames.base).toContain("max-w-[563px]")
        expect(mocks.lastModalProps.classNames.body).toContain("flex flex-col")
    })

    it("should render successIcon when provided", () => {
        const SuccessIcon = () => <div data-testid="success-icon">✓</div>

        render(
            <SuccessAlertModal
                isOpen
                title="Operación exitosa"
                onContinue={vi.fn()}
                successIcon={<SuccessIcon />}
            />,
        )

        expect(screen.getByTestId("success-icon")).toBeInTheDocument()
        expect(screen.getByText("✓")).toBeInTheDocument()
    })

    it("should not render icon container when successIcon is not provided", () => {
        const { container } = render(
            <SuccessAlertModal
                isOpen
                title="Operación exitosa"
                onContinue={vi.fn()}
            />,
        )

        expect(container.querySelector(".mb-4")).not.toBeInTheDocument()
    })
})
