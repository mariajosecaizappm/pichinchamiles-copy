import React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import CheckoutConfirmation from "@/presentation/pages/ShoppingCartDetail/components/CheckoutConfirmation/CheckoutConfirmation"
import CheckoutBillingAddressCard from "@/presentation/pages/ShoppingCartDetail/components/CheckoutConfirmation/components/CheckoutBillingAddressCard/CheckoutBillingAddressCard"
import CheckoutShippingAddressCard from "@/presentation/pages/ShoppingCartDetail/components/CheckoutConfirmation/components/CheckoutShippingAddressCard/CheckoutShippingAddressCard"
import CheckoutShipping from "@/presentation/pages/ShoppingCartDetail/components/CheckoutShipping/CheckoutShipping"
import CheckoutShippingContainer from "@/presentation/pages/ShoppingCartDetail/components/CheckoutShipping/CheckoutShippingContainer"
import {
    maskedEmail,
    maskedPhone,
} from "@/presentation/helpers/member"

const mocks = vi.hoisted(() => ({
    useCheckout: vi.fn(),
    useAddress: vi.fn(),
}))

vi.mock("@/presentation/pages/ShoppingCartDetail/hooks/useCheckout", () => ({
    __esModule: true,
    default: mocks.useCheckout,
}))

vi.mock("@/presentation/hooks/useAddress", () => ({
    __esModule: true,
    default: mocks.useAddress,
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    __esModule: true,
    default: () => ({ basket: { items: [] } }),
}))

vi.mock(
    "@/presentation/pages/ShoppingCartDetail/components/CheckoutConfirmation/CheckoutConfirmation.module.css",
    () => ({
        __esModule: true,
        default: {
            addressCardTitle: "address-card-title",
            addressCard: "address-card",
            addressText: "address-text",
        },
    }),
)

vi.mock("@/presentation/components/IconButton", () => ({
    __esModule: true,
    default: ({
        children,
        onClick,
        ...props
    }: {
        children: React.ReactNode
        onClick?: () => void
    } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button type="button" onClick={onClick} {...props}>
            {children}
        </button>
    ),
}))

vi.mock("@iconify/react", () => ({
    __esModule: true,
    Icon: ({ icon }: { icon: string }) => <span>{icon}</span>,
}))

vi.mock(
    "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartShippingAddress/ShoppingCartShippingAddress",
    () => ({
        __esModule: true,
        default: (props: Record<string, unknown>) => (
            <div
                data-testid="shopping-cart-shipping-address"
                data-basket={JSON.stringify(props.basket)}
            >
                {JSON.stringify({
                    shippingAddress: props.shippingAddress,
                    addresses: props.addresses,
                    isLoadingAddresses: props.isLoadingAddresses,
                })}
            </div>
        ),
    }),
)

describe("Checkout new components", () => {
    beforeEach(() => {
        mocks.useCheckout.mockReset()
        mocks.useAddress.mockReset()

        mocks.useCheckout.mockReturnValue({
            step: 4,
            onPrevStep: vi.fn(),
            shippingAddress: {
                id: "shipping-1",
                alias: "Casa",
                street1: "Av. Principal",
                number: "123",
                street2: "Depto 1",
                reference: "Frente al parque",
                state: { name: "CAÑAR" },
                city: { name: "LA TRONCAL" },
                secondPhone: "0999736900",
                customerReceivingPhone: "0999999999",
                isThirdPartyAddress: false,
            },
            billingAddress: {
                id: "billing-1",
                customerReceivingEmail: "jane@example.com",
                customerReceivingPhone: "022222222",
                street1: "Av. Factura",
                street2: "Oficina",
                zone: { name: "Centro" },
            },
            selectShippingAddress: vi.fn(),
        })

        mocks.useAddress.mockReturnValue({
            addresses: [
                {
                    id: "shipping-1",
                    alias: "Casa actualizada",
                    street1: "Av. Principal",
                    number: "123",
                    street2: "Depto 1",
                    reference: "Frente al parque",
                    state: { name: "CAÑAR" },
                    city: { name: "LA TRONCAL" },
                    secondPhone: "0999736900",
                    customerReceivingPhone: "0999999999",
                    isThirdPartyAddress: false,
                },
                {
                    id: "shipping-2",
                    alias: "Oficina",
                    default: true,
                },
            ],
            isLoadingAddresses: false,
            onAddAddress: vi.fn(),
            onEditAddress: vi.fn(),
        })
    })

    it("renders CheckoutConfirmation only on step 4", () => {
        const { rerender } = render(<CheckoutConfirmation />)

        expect(screen.getByText("Confirmación de pedido")).toBeInTheDocument()
        expect(screen.getByText("Dirección de envío")).toBeInTheDocument()
        expect(screen.getByText("Dirección de facturación")).toBeInTheDocument()

        mocks.useCheckout.mockReturnValue({
            ...mocks.useCheckout.mock.results[0]?.value,
            step: 3,
        })

        rerender(<CheckoutConfirmation />)

        expect(screen.queryByText("Confirmación de pedido")).not.toBeInTheDocument()
    })

    it("renders CheckoutBillingAddressCard and sends the user back to step 3", () => {
        const onPrevStep = vi.fn()
        mocks.useCheckout.mockReturnValue({
            ...mocks.useCheckout(),
            onPrevStep,
        })

        render(<CheckoutBillingAddressCard />)

        expect(screen.getByText(/Correo electrónico:/)).toBeInTheDocument()
        expect(
            screen.getByText(maskedEmail("jane@example.com")),
        ).toBeInTheDocument()
        expect(
            screen.getByText(maskedPhone("022222222")),
        ).toBeInTheDocument()
        expect(screen.getByText(/Sector:/)).toBeInTheDocument()

        fireEvent.click(screen.getByRole("button"))

        expect(onPrevStep).toHaveBeenCalledWith(3)
    })

    it("renders CheckoutShippingAddressCard, syncs the selected address and opens edit", async () => {
        const selectShippingAddress = vi.fn()
        const onEditAddress = vi.fn()
        mocks.useCheckout.mockReturnValue({
            ...mocks.useCheckout(),
            selectShippingAddress,
        })
        mocks.useAddress.mockReturnValue({
            ...mocks.useAddress(),
            onEditAddress,
        })

        render(<CheckoutShippingAddressCard />)

        await waitFor(() => {
            expect(selectShippingAddress).toHaveBeenCalledWith(
                expect.objectContaining({
                    alias: "Casa actualizada",
                }),
            )
        })

        expect(screen.getByText("Casa")).toBeInTheDocument()
        expect(screen.getByText(/Frente al parque/)).toBeInTheDocument()
        expect(screen.getByText("Cañar, La Troncal")).toBeInTheDocument()
        expect(
            screen.getByText(
                `Teléfono: ${maskedPhone("0999736900")}`,
            ),
        ).toBeInTheDocument()

        fireEvent.click(screen.getByRole("button"))

        expect(onEditAddress).toHaveBeenCalledWith(
            expect.objectContaining({
                id: "shipping-1",
            }),
        )
    })

    it("renders the third-party receiver label with plural products in CheckoutShippingAddressCard", () => {
        mocks.useCheckout.mockReturnValue({
            ...mocks.useCheckout(),
            shippingAddress: {
                ...mocks.useCheckout().shippingAddress,
                isThirdPartyAddress: true,
                customerReceivingPhone: "0991234321",
            },
        })

        render(<CheckoutShippingAddressCard />)

        expect(screen.getByText("Un tercero recibe los productos")).toBeInTheDocument()
        expect(
            screen.getByText(
                `Teléfono: ${maskedPhone("0991234321")}`,
            ),
        ).toBeInTheDocument()
    })

    it("renders the socio receiver label with a single product in CheckoutShippingAddressCard", () => {
        mocks.useCheckout.mockReturnValue({
            ...mocks.useCheckout(),
            shippingAddress: {
                ...mocks.useCheckout().shippingAddress,
                isThirdPartyAddress: false,
            },
        })

        render(<CheckoutShippingAddressCard />)

        expect(screen.getByText("Tú recibes el producto")).toBeInTheDocument()
    })

    it("returns null in CheckoutShippingAddressCard when there is no shipping address", () => {
        mocks.useCheckout.mockReturnValue({
            ...mocks.useCheckout(),
            shippingAddress: null,
        })

        render(<CheckoutShippingAddressCard />)

        expect(screen.queryByText("Dirección de envío")).not.toBeInTheDocument()
    })

    it("loads addresses in CheckoutShipping and auto-selects the default one", async () => {
        const selectShippingAddress = vi.fn()
        const onAddAddress = vi.fn()
        const onEditAddress = vi.fn()

        mocks.useCheckout.mockReturnValue({
            ...mocks.useCheckout(),
            step: 2,
            shippingAddress: null,
            selectShippingAddress,
        })
        mocks.useAddress.mockReturnValue({
            addresses: [
                { id: "shipping-1", alias: "Casa", default: false },
                { id: "shipping-2", alias: "Oficina", default: true },
            ],
            isLoadingAddresses: true,
            onAddAddress,
            onEditAddress,
        })

        render(<CheckoutShipping />)

        await waitFor(() => {
            expect(selectShippingAddress).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: "shipping-2",
                }),
            )
        })

        expect(screen.getByTestId("shopping-cart-shipping-address")).toHaveTextContent(
            '"isLoadingAddresses":true',
        )
    })

    it("renders CheckoutShippingContainer only on step 2", () => {
        mocks.useCheckout.mockReturnValue({
            ...mocks.useCheckout(),
            step: 2,
        })

        const { rerender } = render(<CheckoutShippingContainer />)

        expect(screen.getByTestId("shopping-cart-shipping-address")).toBeInTheDocument()

        mocks.useCheckout.mockReturnValue({
            ...mocks.useCheckout(),
            step: 1,
        })

        rerender(<CheckoutShippingContainer />)

        expect(screen.queryByTestId("shopping-cart-shipping-address")).not.toBeInTheDocument()
    })
})
