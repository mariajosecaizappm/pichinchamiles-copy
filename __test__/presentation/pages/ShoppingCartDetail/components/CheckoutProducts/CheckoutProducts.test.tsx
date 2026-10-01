import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import CheckoutProducts from "@/presentation/pages/ShoppingCartDetail/components/CheckoutProducts/CheckoutProducts"

const mocks = vi.hoisted(() => ({
    lastProductsListProps: null as Record<string, unknown> | null,
}))

vi.mock("@/presentation/pages/ShoppingCartDetail/components/ShoppingCartProductsList", () => ({
    default: (props: Record<string, unknown>) => {
        mocks.lastProductsListProps = props
        return <div data-testid="shopping-cart-products-list" />
    },
}))

describe("CheckoutProducts", () => {
    it("when it renders should show the title and products list", () => {
        const basketState = {
            items: [{ id: "item-1", quantity: 1 }],
        } as any

        render(<CheckoutProducts basketState={basketState} />)

        expect(screen.getByText("Carrito de compras")).toBeInTheDocument()
        expect(screen.getByTestId("shopping-cart-products-list")).toBeInTheDocument()
        expect(mocks.lastProductsListProps?.basketState).toBe(basketState)
    })
})
