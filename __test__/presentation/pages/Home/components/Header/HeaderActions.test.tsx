import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"

vi.mock("@/presentation/pages/Home/components/Button/LoginButton", () => ({
    default: () => <button data-testid="login-button">Ingresar</button>,
}))

vi.mock("@/presentation/pages/Home/components/Header/components/Cart/CartButton", () => ({
    default: () => <button data-testid="cart-button">Cart</button>,
}))

vi.mock("@/presentation/pages/Home/components/Header/components/Miles", () => ({
    default: () => <div data-testid="miles-component">Miles</div>,
}))

const mockUseSession = vi.fn()
vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

import HeaderActions from "@/presentation/pages/Home/components/Header/components/HeaderActions/HeaderActions"

describe("HeaderActions", () => {
    beforeEach(() => {
        mockUseSession.mockClear()
    })

    it("should render LoginButton", () => {
        render(<HeaderActions />)
        expect(screen.getByTestId("login-button")).toBeInTheDocument()
        expect(screen.getByText("Ingresar")).toBeInTheDocument()
    })

    it("should render CartButton", () => {
        render(<HeaderActions />)
        expect(screen.getByTestId("cart-button")).toBeInTheDocument()
        expect(screen.getByText("Cart")).toBeInTheDocument()
    })

    it("should render Miles component", () => {
        render(<HeaderActions />)
        expect(screen.getByTestId("miles-component")).toBeInTheDocument()
        expect(screen.getByText("Miles")).toBeInTheDocument()
    })
})
