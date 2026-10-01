import {render, screen, fireEvent, within} from "@testing-library/react"
import {describe, it, expect, vi, afterEach} from "vitest"
import Modal from "@/presentation/components/Modal"

vi.mock("@heroui/react", () => {
    const Modal = ({
        isOpen,
        onOpenChange,
        closeButton,
        classNames,
        children,
    }: any) => {
        if (!isOpen) return null

        return (
            <div
                data-testid="heroui-modal"
                data-classnames={JSON.stringify(classNames ?? {})}
            >
                <div data-testid="close-button-slot">{closeButton}</div>
                <button
                    type="button"
                    data-testid="trigger-open-change"
                    onClick={() => onOpenChange?.(false)}
                />
                {children}
            </div>
        )
    }

    const ModalContent = ({children}: any) => (
        <div data-testid="heroui-modal-content">
            {typeof children === "function" ? children() : children}
        </div>
    )

    const ModalHeader = ({children, ...rest}: any) => (
        <div data-testid="heroui-modal-header" {...rest}>
            {children}
        </div>
    )

    const ModalBody = ({children, ...rest}: any) => (
        <div data-testid="heroui-modal-body" {...rest}>
            {children}
        </div>
    )

    const ModalFooter = ({children, ...rest}: any) => (
        <div data-testid="heroui-modal-footer" {...rest}>
            {children}
        </div>
    )

    return {
        Modal,
        ModalContent,
        ModalHeader,
        ModalBody,
        ModalFooter,
    }
})

describe("Modal", () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when isOpen is true", () => {
        it("should render children and close icon", () => {
            render(
                <Modal isOpen onClose={vi.fn()}>
                    <p>Contenido del modal</p>
                </Modal>,
            )

            expect(screen.getByText("Contenido del modal")).toBeInTheDocument()

            const closeSlot = screen.getByTestId("close-button-slot")
            expect(within(closeSlot).getByRole("button")).toHaveAttribute(
                "type",
                "button",
            )
            expect(closeSlot.querySelector("svg")).not.toBeNull()
        })
    })

    describe("when isOpen is false", () => {
        it("should not render children", () => {
            render(
                <Modal isOpen={false} onClose={vi.fn()}>
                    <p>Contenido del modal</p>
                </Modal>,
            )

            expect(screen.queryByText("Contenido del modal")).toBeNull()
        })
    })

    describe("when onOpenChange is triggered", () => {
        it("should call onClose", () => {
            const onClose = vi.fn()

            render(
                <Modal isOpen onClose={onClose}>
                    <p>Contenido del modal</p>
                </Modal>,
            )

            fireEvent.click(screen.getByTestId("trigger-open-change"))
            expect(onClose).toHaveBeenCalledTimes(1)
        })
    })

    describe("when headerButton is provided", () => {
        it("should render the header button inside ModalHeader", () => {
            render(
                <Modal isOpen onClose={vi.fn()} headerButton={<button data-testid="custom-header-btn">Back</button>}>
                    <p>Contenido del modal</p>
                </Modal>,
            )

            const headerBtn = screen.getByTestId("custom-header-btn")
            expect(headerBtn).toBeInTheDocument()
            expect(headerBtn.textContent).toBe("Back")
        })
    })

    describe("when footer is provided", () => {
        it("should render footer inside ModalFooter", () => {
            render(
                <Modal
                    isOpen
                    onClose={vi.fn()}
                    footer={<button type="button">Confirmar</button>}
                >
                    <p>Contenido del modal</p>
                </Modal>,
            )

            expect(screen.getByTestId("heroui-modal-footer")).toBeInTheDocument()
            expect(screen.getByRole("button", { name: "Confirmar" })).toBeInTheDocument()
        })
    })

    describe("when hideHeader is true", () => {
        it("should not render ModalHeader", () => {
            render(
                <Modal isOpen onClose={vi.fn()} hideHeader>
                    <p>Contenido del modal</p>
                </Modal>,
            )

            expect(screen.queryByTestId("heroui-modal-header")).not.toBeInTheDocument()
            expect(screen.getByText("Contenido del modal")).toBeInTheDocument()
        })
    })

    describe("when hideCloseButton is true", () => {
        it("should not render close button", () => {
            render(
                <Modal isOpen onClose={vi.fn()} hideCloseButton>
                    <p>Contenido del modal</p>
                </Modal>,
            )

            const closeSlot = screen.getByTestId("close-button-slot")
            expect(within(closeSlot).queryByRole("button")).toBeNull()
        })
    })

    describe("when classNames are provided", () => {
        it("should merge default classNames with custom values", () => {
            render(
                <Modal
                    isOpen
                    onClose={vi.fn()}
                    classNames={{
                        base: "custom-base",
                        header: "custom-header",
                        closeButton: "custom-close",
                        body: "custom-body",
                    }}
                >
                    <p>Contenido del modal</p>
                </Modal>,
            )

            const modal = screen.getByTestId("heroui-modal")
            const classNames = JSON.parse(
                modal.getAttribute("data-classnames") ?? "{}",
            ) as Record<string, string>

            expect(classNames.base).toContain("rounded-xl")
            expect(classNames.base).toContain("custom-base")

            expect(classNames.header).toContain("p-[20px]")
            expect(classNames.header).toContain("custom-header")

            expect(classNames.closeButton).toContain("top-[20px]")
            expect(classNames.closeButton).toContain("custom-close")

            expect(classNames.body).toContain("p-6")
            expect(classNames.body).toContain("custom-body")

            expect(classNames.footer).toContain("border-t")
        })
    })
})

