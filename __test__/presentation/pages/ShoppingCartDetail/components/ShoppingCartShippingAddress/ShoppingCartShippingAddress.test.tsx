import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Address } from "@/domain/entity/Address/structure/address"
import { Basket } from "@/domain/entity/Basket/structure/basket"
import ShoppingCartShippingAddress from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartShippingAddress/ShoppingCartShippingAddress"

vi.mock("@/presentation/pages/ShoppingCartDetail/components/ShoppingCartShippingAddress/ShoppingCartAddressCard", () => ({
    default: ({
        address,
        onEdit,
        basket,
    }: {
        address: Address
        onEdit: () => void
        basket: Basket
    }) => (
        <div data-testid={`address-card-${address.id}`} data-basket={JSON.stringify(basket)}>
            <button type="button" onClick={onEdit}>
                edit-{address.id}
            </button>
        </div>
    ),
}))

vi.mock("@iconify/react", () => ({
    Icon: () => <span data-testid="plus-icon" />,
}))

const createAddress = (id: string): Address => ({
    id,
    alias: `Alias ${id}`,
    street1: "Calle 1",
    street2: "Calle 2",
    country: { id: "1", name: "Ecuador", grade: "country", parentId: null },
    state: { id: "2", name: "Pichincha", grade: "state", parentId: "1" },
    city: { id: "3", name: "Quito", grade: "city", parentId: "2" },
    zone: { id: "4", name: "Centro", grade: "zone", parentId: "3" },
    number: "100",
    reference: "Ref",
    isThirdPartyAddress: false,
    customerReceivingFirstName: "",
    customerReceivingLastName: "",
    customerReceivingEmail: "",
    customerReceivingPhone: "",
    customerReceivingIdentificationNumber: "",
    customerReceivingIdentificationType: "",
    secondPhone: "0991234567",
    postalCode: "",
    default: false,
})

describe("ShoppingCartShippingAddress", () => {
    const basket: Basket = { buyerId: "buyer", items: [{ id: "item-1" }] } as Basket

    const defaultProps = {
        addresses: [createAddress("addr-1"), createAddress("addr-2")],
        shippingAddress: createAddress("addr-1"),
        isLoadingAddresses: false,
        onAddAddress: vi.fn(),
        onSelectAddress: vi.fn(),
        onEditAddress: vi.fn(),
        basket,
    }

    it("should render title and description", () => {
        render(<ShoppingCartShippingAddress {...defaultProps} />)

        expect(screen.getByText("Dirección de envío")).toBeInTheDocument()
        expect(
            screen.getByText("Elige la dirección a la que deseas enviar tus productos.")
        ).toBeInTheDocument()
    })

    it("should show loading skeleton when isLoadingAddresses is true", () => {
        const { container } = render(
            <ShoppingCartShippingAddress {...defaultProps} isLoadingAddresses />
        )

        expect(container.querySelector(".animate-pulse")).toBeInTheDocument()
        expect(screen.queryByTestId("address-card-addr-1")).not.toBeInTheDocument()
    })

    it("should render address cards when not loading", () => {
        render(<ShoppingCartShippingAddress {...defaultProps} />)

        expect(screen.getByTestId("address-card-addr-1")).toBeInTheDocument()
        expect(screen.getByTestId("address-card-addr-2")).toBeInTheDocument()
    })

    it("should call onAddAddress when add button is clicked", () => {
        const onAddAddress = vi.fn()
        render(
            <ShoppingCartShippingAddress {...defaultProps} onAddAddress={onAddAddress} />
        )

        fireEvent.click(screen.getByText("Agregar nueva dirección"))
        expect(onAddAddress).toHaveBeenCalledTimes(1)
    })

    it("should disable add button while loading", () => {
        render(<ShoppingCartShippingAddress {...defaultProps} isLoadingAddresses />)

        expect(screen.getByText("Agregar nueva dirección")).toBeDisabled()
    })

    it("should call onEditAddress when edit is triggered on a card", () => {
        const onEditAddress = vi.fn()
        render(
            <ShoppingCartShippingAddress {...defaultProps} onEditAddress={onEditAddress} />
        )

        fireEvent.click(screen.getByText("edit-addr-2"))
        expect(onEditAddress).toHaveBeenCalledWith(
            expect.objectContaining({ id: "addr-2" })
        )
    })
})
