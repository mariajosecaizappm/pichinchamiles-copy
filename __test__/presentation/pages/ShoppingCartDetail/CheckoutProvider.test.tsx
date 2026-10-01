import React from "react"
import { act, fireEvent, render, renderHook, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import CheckoutProvider from "@/presentation/pages/ShoppingCartDetail/context/CheckoutProvider"
import useCheckout from "@/presentation/pages/ShoppingCartDetail/hooks/useCheckout"

const mocks = vi.hoisted(() => ({
    useSession: vi.fn(),
    useKount: vi.fn(),
    formatBillingAddress: vi.fn(),
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    __esModule: true,
    default: mocks.useSession,
}))

vi.mock("@/presentation/hooks/useKount", () => ({
    __esModule: true,
    default: mocks.useKount,
}))

vi.mock("@/presentation/helpers/formatBillingAddress", () => ({
    __esModule: true,
    formatBillingAddress: mocks.formatBillingAddress,
}))

const CheckoutConsumer = () => {
    const {
        step,
        shippingAddress,
        billingAddress,
        sessionId,
        billingFormRef,
        onNextStep,
        onPrevStep,
        resetCheckout,
        selectShippingAddress,
        selectBillingAddress,
    } = useCheckout()

    return (
        <div>
            <div data-testid="step">{step}</div>
            <div data-testid="shipping">{shippingAddress?.alias ?? "none"}</div>
            <div data-testid="shipping-email">{shippingAddress?.customerReceivingEmail ?? "none"}</div>
            <div data-testid="billing">{billingAddress?.alias ?? "none"}</div>
            <div data-testid="session">{sessionId}</div>
            <div data-testid="form-ref">{String(billingFormRef.current === null)}</div>
            <button type="button" onClick={() => onNextStep()}>
                next
            </button>
            <button type="button" onClick={() => onNextStep(4)}>
                next-to-4
            </button>
            <button type="button" onClick={() => onPrevStep()}>
                prev
            </button>
            <button type="button" onClick={() => onPrevStep(2)}>
                prev-to-2
            </button>
            <button type="button" onClick={resetCheckout}>
                reset
            </button>
            <button
                type="button"
                onClick={() =>
                    selectShippingAddress({
                        id: "shipping-1",
                        alias: "Casa",
                        customerReceivingPhone: "0999999999",
                        customerReceivingEmail: "shipping@example.com",
                        street1: "Av. Principal",
                        street2: "Depto 1",
                        zone: { name: "Norte" },
                    } as any)
                }
            >
                set-shipping
            </button>
            <button
                type="button"
                onClick={() =>
                    selectBillingAddress({
                        id: "billing-1",
                        alias: "Factura",
                    } as any)
                }
            >
                set-billing
            </button>
        </div>
    )
}

describe("CheckoutProvider and useCheckout", () => {
    beforeEach(() => {
        mocks.useSession.mockReset()
        mocks.useKount.mockReset()
        mocks.formatBillingAddress.mockReset()

        mocks.useSession.mockReturnValue({
            member: {
                firstName: "Jane",
                firstLastName: "Doe",
                enrollmentEmail: "jane@example.com",
                cellPhone: "0999999999",
            },
        })
        mocks.useKount.mockReturnValue({ sessionId: "kount-session" })
        mocks.formatBillingAddress.mockReturnValue({
            id: "billing-derived",
            alias: "Facturación",
        })
    })

    it("exposes the default checkout context outside the provider", () => {
        const { result } = renderHook(() => useCheckout())

        expect(result.current.step).toBe(1)
        expect(result.current.shippingAddress).toBeNull()
        expect(result.current.billingAddress).toBeNull()
        expect(result.current.sessionId).toBe("")
        expect(result.current.billingFormRef.current).toBeNull()
    })

    it("handles step navigation, addresses and reset inside the provider", () => {
        render(
            <CheckoutProvider>
                <CheckoutConsumer />
            </CheckoutProvider>,
        )

        expect(screen.getByTestId("step")).toHaveTextContent("1")
        expect(screen.getByTestId("session")).toHaveTextContent("kount-session")
        expect(screen.getByTestId("form-ref")).toHaveTextContent("true")

        fireEvent.click(screen.getByRole("button", { name: "next" }))
        expect(screen.getByTestId("step")).toHaveTextContent("2")

        fireEvent.click(screen.getByRole("button", { name: "next-to-4" }))
        expect(screen.getByTestId("step")).toHaveTextContent("4")

        fireEvent.click(screen.getByRole("button", { name: "next" }))
        expect(screen.getByTestId("step")).toHaveTextContent("4")

        fireEvent.click(screen.getByRole("button", { name: "prev" }))
        expect(screen.getByTestId("step")).toHaveTextContent("3")

        fireEvent.click(screen.getByRole("button", { name: "prev-to-2" }))
        expect(screen.getByTestId("step")).toHaveTextContent("2")

        fireEvent.click(screen.getByRole("button", { name: "set-billing" }))
        expect(screen.getByTestId("billing")).toHaveTextContent("Factura")

        fireEvent.click(screen.getByRole("button", { name: "set-shipping" }))
        expect(screen.getByTestId("shipping")).toHaveTextContent("Casa")
        expect(screen.getByTestId("shipping-email")).toHaveTextContent("jane@example.com")

        fireEvent.click(screen.getByRole("button", { name: "reset" }))
        expect(screen.getByTestId("step")).toHaveTextContent("1")
        expect(screen.getByTestId("shipping")).toHaveTextContent("none")
        expect(screen.getByTestId("billing")).toHaveTextContent("none")
    })

    it("derives the billing address from the selected shipping address only when needed", async () => {
        render(
            <CheckoutProvider>
                <CheckoutConsumer />
            </CheckoutProvider>,
        )

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: "set-shipping" }))
        })

        expect(mocks.formatBillingAddress).toHaveBeenCalledWith(
            expect.objectContaining({
                firstName: "Jane",
            }),
            expect.objectContaining({
                alias: "Casa",
            }),
        )
        expect(screen.getByTestId("billing")).toHaveTextContent("Facturación")
    })
})
