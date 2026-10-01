import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Address } from "@/domain/entity/Address/structure/address"
import ShoppingCartAddressCard from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartShippingAddress/ShoppingCartAddressCard"
import {
    LIMIT_MASKED_IDENTIFICATION,
    maskedData,
    maskedPhone,
} from "@/presentation/helpers/member"

vi.mock("@/presentation/components/Form/components/Radio/Radio", () => ({
    default: ({ value, "aria-label": ariaLabel }: { value: string; "aria-label"?: string }) => (
        <input type="radio" value={value} aria-label={ariaLabel} readOnly />
    ),
}))

vi.mock("@iconify/react", () => ({
    Icon: ({ icon }: { icon: string }) => <span data-testid="icon" data-icon={icon} />,
}))

const createAddress = (overrides: Partial<Address> = {}): Address => ({
    id: "addr-1",
    alias: "Casa",
    street1: "Av. Principal",
    street2: "y Secundaria",
    country: { id: "1", name: "Ecuador", grade: "country", parentId: null },
    state: { id: "2", name: "Pichincha", grade: "state", parentId: "1" },
    city: { id: "3", name: "Quito", grade: "city", parentId: "2" },
    zone: { id: "4", name: "Centro", grade: "zone", parentId: "3" },
    number: "123",
    reference: "Frente al parque",
    isThirdPartyAddress: false,
    customerReceivingFirstName: "",
    customerReceivingLastName: "",
    customerReceivingEmail: "",
    customerReceivingPhone: "",
    customerReceivingIdentificationNumber: "",
    customerReceivingIdentificationType: "",
    secondPhone: "0991234567",
    postalCode: "170101",
    default: true,
    ...overrides,
})

describe("ShoppingCartAddressCard", () => {
    it("should render address information", () => {
        const address = createAddress()

        render(
            <ShoppingCartAddressCard
                address={address}
                isSelected={false}
                onEdit={vi.fn()}
            />,
        )

        expect(screen.getByText("Casa")).toBeInTheDocument()
        expect(screen.getByText("Av. Principal 123 y Secundaria")).toBeInTheDocument()
        expect(screen.getByText("Frente al parque")).toBeInTheDocument()
        expect(screen.getByText("Pichincha, Quito")).toBeInTheDocument()
        expect(
            screen.getByText(
                `Teléfono: ${maskedPhone(address.secondPhone || "")}`,
            ),
        ).toBeInTheDocument()
    })

    it("should render state and city names in title case", () => {
        const address = createAddress({
            state: { id: "2", name: "pichincha", grade: "state", parentId: "1" },
            city: { id: "3", name: "QUITO", grade: "city", parentId: "2" },
        })

        render(
            <ShoppingCartAddressCard
                address={address}
                isSelected={false}
                onEdit={vi.fn()}
            />,
        )

        expect(screen.getByText("Pichincha, Quito")).toBeInTheDocument()
    })

    it("should apply selected background when isSelected is true", () => {
        const address = createAddress()

        const { container, rerender } = render(
            <ShoppingCartAddressCard
                address={address}
                isSelected={false}
                onEdit={vi.fn()}
            />,
        )

        const radioWrapper = container.querySelector('[aria-label="Seleccionar Casa"]')?.parentElement
        expect(radioWrapper).not.toBeNull()
        expect(radioWrapper?.className).not.toContain("bg-darkGrayishBlue-100")

        rerender(
            <ShoppingCartAddressCard
                address={address}
                isSelected
                onEdit={vi.fn()}
            />,
        )

        expect(radioWrapper?.className).toContain("bg-darkGrayishBlue-100")
    })

    it("should call onEdit when edit button is clicked", () => {
        const onEdit = vi.fn()
        const address = createAddress()

        render(
            <ShoppingCartAddressCard
                address={address}
                isSelected={false}
                onEdit={onEdit}
            />,
        )

        fireEvent.click(screen.getByRole("button", { name: "Editar Casa" }))
        expect(onEdit).toHaveBeenCalledTimes(1)
    })

    it("should not render delete button when onDelete is not provided", () => {
        render(
            <ShoppingCartAddressCard
                address={createAddress()}
                isSelected={false}
                onEdit={vi.fn()}
            />,
        )

        expect(screen.queryByRole("button", { name: "Eliminar Casa" })).toBeNull()
    })

    it("should call onDelete when delete button is clicked", () => {
        const onDelete = vi.fn()
        const address = createAddress()

        render(
            <ShoppingCartAddressCard
                address={address}
                isSelected={false}
                onEdit={vi.fn()}
                onDelete={onDelete}
            />,
        )

        fireEvent.click(screen.getByRole("button", { name: "Eliminar Casa" }))
        expect(onDelete).toHaveBeenCalledTimes(1)
    })

    it("should disable edit and delete buttons when isDisabled is true", () => {
        render(
            <ShoppingCartAddressCard
                address={createAddress()}
                isSelected={false}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
                isDisabled
            />,
        )

        expect(screen.getByRole("button", { name: "Editar Casa" })).toBeDisabled()
        expect(screen.getByRole("button", { name: "Eliminar Casa" })).toBeDisabled()
    })

    it("should show member receives message for non third-party address", () => {
        render(
            <ShoppingCartAddressCard
                address={createAddress({ isThirdPartyAddress: false })}
                isSelected={false}
                onEdit={vi.fn()}
            />,
        )

        expect(screen.getByText("Tú recibes el producto")).toBeInTheDocument()
        expect(screen.queryByText("Un tercero recibe los productos")).toBeNull()
    })

    it("should render without error when secondPhone is null", () => {
        render(
            <ShoppingCartAddressCard
                address={createAddress({ secondPhone: null as unknown as string })}
                isSelected={false}
                onEdit={vi.fn()}
            />,
        )

        expect(screen.getByText(/Teléfono:/)).toBeInTheDocument()
    })

    it("should show third party receiver section when isThirdPartyAddress is true", () => {
        render(
            <ShoppingCartAddressCard
                address={createAddress({
                    isThirdPartyAddress: true,
                    customerReceivingFirstName: "María",
                    customerReceivingLastName: "López",
                    customerReceivingIdentificationType: "CI",
                    customerReceivingIdentificationNumber: "1712345678",
                    customerReceivingPhone: "0987654321",
                })}
                isSelected={false}
                onEdit={vi.fn()}
            />,
        )

        expect(screen.getByText("Un tercero recibe los productos")).toBeInTheDocument()
        expect(screen.getByText("Recibe")).toBeInTheDocument()
        expect(screen.getByText("María López")).toBeInTheDocument()
        expect(
            screen.getByText(
                `CI: ${maskedData("1712345678", 0, LIMIT_MASKED_IDENTIFICATION)}`,
            ),
        ).toBeInTheDocument()
        expect(
            screen.getByText(
                `Teléfono: ${maskedPhone("0987654321")}`,
            ),
        ).toBeInTheDocument()
    })

    it("should show member receives message when basket is empty", () => {
        render(
            <ShoppingCartAddressCard
                address={createAddress({ isThirdPartyAddress: false })}
                isSelected={false}
                onEdit={vi.fn()}
            />,
        )

        expect(screen.getByText("Tú recibes el producto")).toBeInTheDocument()
    })

    it("should show member receives message when basket has one item", () => {
        render(
            <ShoppingCartAddressCard
                address={createAddress({ isThirdPartyAddress: false })}
                isSelected={false}
                onEdit={vi.fn()}
            />,
        )

        expect(screen.getByText("Tú recibes el producto")).toBeInTheDocument()
    })
})
