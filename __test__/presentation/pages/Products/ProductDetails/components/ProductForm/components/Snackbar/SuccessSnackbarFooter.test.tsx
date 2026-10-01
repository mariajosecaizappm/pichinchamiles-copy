import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import SuccessSnackbarFooter from "@/presentation/pages/Products/ProductDetails/components/ProductForm/components/Snackbar/SuccessSnackbarFooter"

vi.mock("@/presentation/components/Form/components/Button", () => ({
    Button: ({
        children,
        onPress,
        ...props
    }: {
        children: React.ReactNode
        onPress?: () => void
    } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button onClick={onPress} {...props}>
            {children}
        </button>
    ),
}))

describe("SuccessSnackbarFooter", () => {
    it("calls close and onGoToCart when Ver carrito is pressed", () => {
        const close = vi.fn()
        const onGoToCart = vi.fn()

        render(<SuccessSnackbarFooter close={close} onGoToCart={onGoToCart} />)

        fireEvent.click(screen.getByText("Ver carrito"))

        expect(close).toHaveBeenCalledTimes(1)
        expect(onGoToCart).toHaveBeenCalledTimes(1)
    })

    it("calls close when Seguir comprando is pressed", () => {
        const close = vi.fn()
        const onGoToCart = vi.fn()

        render(<SuccessSnackbarFooter close={close} onGoToCart={onGoToCart} />)

        fireEvent.click(screen.getByText("Seguir comprando"))

        expect(close).toHaveBeenCalledTimes(1)
        expect(onGoToCart).not.toHaveBeenCalled()
    })
})
