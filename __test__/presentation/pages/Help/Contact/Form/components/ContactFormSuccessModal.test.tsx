import {render, screen, fireEvent} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import React from "react"
import ContactFormSuccessModal from "@/presentation/pages/Help/Contact/Form/components/ContactFormSuccessModal"

vi.mock("@/presentation/components/Modal", () => ({
    default: ({children, isOpen, classNames}: {children: React.ReactNode; isOpen: boolean; classNames: Record<string, string>}) => {
        if (!isOpen) return null
        return <div data-testid="modal" data-classnames={JSON.stringify(classNames)}>{children}</div>
    },
}))

vi.mock("@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStatusModal/components/StatusIcon/SuccessIcon", () => ({
    default: () => <svg data-testid="success-icon" />,
}))

vi.mock("@/presentation/components/Form/components/Button", () => ({
    Button: ({children, onPress}: {children: React.ReactNode; onPress?: () => void}) => (
        <button data-testid="continue-button" onClick={onPress}>{children}</button>
    ),
}))

vi.mock("@heroui/react", () => ({
    Divider: () => <hr data-testid="divider" />,
}))

describe("ContactFormSuccessModal", () => {
    it("should render nothing when isOpen is false", () => {
        render(<ContactFormSuccessModal isOpen={false} onOpenChange={vi.fn()} />)
        expect(screen.queryByTestId("modal")).not.toBeInTheDocument()
    })

    it("should render success content when open", () => {
        render(<ContactFormSuccessModal isOpen={true} onOpenChange={vi.fn()} />)

        expect(screen.getByTestId("modal")).toBeInTheDocument()
        expect(screen.getByTestId("success-icon")).toBeInTheDocument()
        expect(screen.getByRole("heading", {name: "Envío de requerimiento exitoso"})).toBeInTheDocument()
        expect(screen.getByText(/Uno de nuestros asesores/)).toBeInTheDocument()
        expect(screen.getByTestId("continue-button")).toHaveTextContent("Continuar")
    })

    it("should call onOpenChange(false) when clicking continue", () => {
        const onOpenChange = vi.fn()
        render(<ContactFormSuccessModal isOpen={true} onOpenChange={onOpenChange} />)

        fireEvent.click(screen.getByTestId("continue-button"))
        expect(onOpenChange).toHaveBeenCalledWith(false)
    })
})
