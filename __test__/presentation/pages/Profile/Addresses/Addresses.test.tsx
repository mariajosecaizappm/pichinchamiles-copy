import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import Addresses from "@/presentation/pages/Profile/Addresses/Addresses"
import { Address } from "@/domain/entity/Address/structure/address"

const mocks = vi.hoisted(() => {
    const onSelectAddress = vi.fn()
    const onEditAddress = vi.fn()
    const onDeleteAddress = vi.fn()
    const onAddAddress = vi.fn()
    let lastRadioGroupProps: any = null
    let lastAddressCardProps: any[] = []
    let lastButtonProps: any = null

    return {
        onSelectAddress,
        onEditAddress,
        onDeleteAddress,
        onAddAddress,
        getLastRadioGroupProps: () => lastRadioGroupProps,
        setLastRadioGroupProps: (p: any) => (lastRadioGroupProps = p),
        getLastAddressCardProps: () => lastAddressCardProps,
        addAddressCardProps: (p: any) => lastAddressCardProps.push(p),
        clearAddressCardProps: () => (lastAddressCardProps = []),
        getLastButtonProps: () => lastButtonProps,
        setLastButtonProps: (p: any) => (lastButtonProps = p),
    }
})

vi.mock("@/presentation/pages/Profile/Addresses/LimitAdressesModal", () => ({
    default: () => null,
}))

vi.mock("@iconify/react", () => ({
    Icon: ({ icon, className }: { icon: string; className?: string }) => (
        <span data-testid="icon" data-icon={icon} className={className}>
            icon
        </span>
    ),
}))

vi.mock("@heroui/react", () => ({
    Divider: () => <hr data-testid="divider" />,
    RadioGroup: ({ children, value, onValueChange, classNames, isDisabled, isRequired }: any) => {
        mocks.setLastRadioGroupProps({ value, onValueChange, classNames, isDisabled, isRequired })
        return (
            <div data-testid="radio-group" data-disabled={String(!!isDisabled)} data-required={String(!!isRequired)}>
                <button
                    type="button"
                    data-testid="trigger-value-change"
                    onClick={() => onValueChange?.("address-2")}
                >
                    change-value
                </button>
                {children}
            </div>
        )
    },
}))

vi.mock("@/presentation/pages/ShoppingCartDetail/components/ShoppingCartShippingAddress/ShoppingCartAddressCard", () => ({
    default: ({ address, isSelected, onEdit, onDelete, isDisabled }: any) => {
        mocks.addAddressCardProps({ address, isSelected, onEdit, onDelete, isDisabled })
        return (
            <div data-testid={`address-card-${address.id}`} data-selected={String(!!isSelected)} data-disabled={String(!!isDisabled)}>
                <span>{address.alias}</span>
                <button type="button" data-testid={`edit-${address.id}`} onClick={onEdit}>
                    edit
                </button>
                {onDelete ? (
                    <button type="button" data-testid={`delete-${address.id}`} onClick={onDelete}>
                        delete
                    </button>
                ) : null}
            </div>
        )
    },
}))

vi.mock("@/presentation/components/Form/components/Button", () => ({
    Button: ({ children, color, onPress, disabled, startContent }: any) => {
        mocks.setLastButtonProps({ color, onPress, disabled, startContent })
        return (
            <button
                type="button"
                data-testid="add-address-button"
                onClick={onPress}
                disabled={disabled}
                data-color={color}
            >
                {startContent}
                {children}
            </button>
        )
    },
}))

const createMockAddress = (id: string, alias: string, isDefault = false, isThirdParty = false): Address => ({
    id,
    alias,
    street1: "Calle Principal",
    street2: "Depto 1",
    city: { id: "QUI", name: "Quito", grade: "city", parentId: "PIC" },
    state: { id: "PIC", name: "Pichincha", grade: "state", parentId: "EC" },
    zone: { id: "NOR", name: "Norte", grade: "zone", parentId: "QUI" },
    country: { id: "EC", name: "Ecuador", grade: "country", parentId: null },
    number: "123",
    default: isDefault,
    isThirdPartyAddress: isThirdParty,
    postalCode: "170101",
    reference: "Cerca del parque",
    customerReceivingFirstName: "John",
    customerReceivingLastName: "Doe",
    customerReceivingEmail: "john@example.com",
    customerReceivingPhone: "0999999999",
    customerReceivingIdentificationNumber: "1234567890",
    customerReceivingIdentificationType: "CI",
    secondPhone: "",
})

describe("Addresses", () => {
    beforeEach(() => {
        mocks.onSelectAddress.mockReset()
        mocks.onEditAddress.mockReset()
        mocks.onDeleteAddress.mockReset()
        mocks.onAddAddress.mockReset()
        mocks.clearAddressCardProps()
        mocks.setLastRadioGroupProps(null)
        mocks.setLastButtonProps(null)
    })

    describe("when rendered with addresses", () => {
        it("should render the main title", () => {
            const addresses = [createMockAddress("address-1", "Casa", true)]

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={addresses[0]}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                />
            )

            expect(screen.getByText("Mis direcciones")).toBeInTheDocument()
        })

        it("should render RadioGroup with correct props", () => {
            const addresses = [createMockAddress("address-1", "Casa", true)]

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={addresses[0]}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                />
            )

            const radioGroup = screen.getByTestId("radio-group")
            expect(radioGroup).toBeInTheDocument()
            expect(radioGroup).toHaveAttribute("data-disabled", "false")
            expect(radioGroup).toHaveAttribute("data-required", "true")

            const props = mocks.getLastRadioGroupProps()
            expect(props.value).toBe("address-1")
            expect(props.classNames).toEqual({ wrapper: "gap-3 flex-nowrap" })
        })

        it("should render address cards for each address", () => {
            const addresses = [
                createMockAddress("address-1", "Casa", true),
                createMockAddress("address-2", "Trabajo"),
            ]

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={addresses[0]}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                />
            )

            expect(screen.getByTestId("address-card-address-1")).toBeInTheDocument()
            expect(screen.getByTestId("address-card-address-2")).toBeInTheDocument()
            expect(screen.getByText("Casa")).toBeInTheDocument()
            expect(screen.getByText("Trabajo")).toBeInTheDocument()
        })

        it("should mark the shipping address as selected", () => {
            const addresses = [
                createMockAddress("address-1", "Casa", true),
                createMockAddress("address-2", "Trabajo"),
            ]

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={addresses[0]}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                />
            )

            expect(screen.getByTestId("address-card-address-1")).toHaveAttribute("data-selected", "true")
            expect(screen.getByTestId("address-card-address-2")).toHaveAttribute("data-selected", "false")
        })

        it("should render dividers between addresses", () => {
            const addresses = [
                createMockAddress("address-1", "Casa", true),
                createMockAddress("address-2", "Trabajo"),
            ]

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={addresses[0]}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                />
            )

            const dividers = screen.getAllByTestId("divider")
            expect(dividers.length).toBeGreaterThan(0)
        })
    })

    describe("when rendered with third-party addresses", () => {
        it("should separate regular and third-party addresses", () => {
            const addresses = [
                createMockAddress("address-1", "Casa", true, false),
                createMockAddress("address-2", "Trabajo", false, false),
                createMockAddress("address-3", "Casa de Juan", false, true),
            ]

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={addresses[0]}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                />
            )

            expect(screen.getByText("Casa")).toBeInTheDocument()
            expect(screen.getByText("Trabajo")).toBeInTheDocument()
            expect(screen.getByText("Casa de Juan")).toBeInTheDocument()
        })

        it("should render third-party addresses section title", () => {
            const addresses = [
                createMockAddress("address-1", "Casa", true, false),
                createMockAddress("address-2", "Casa de Juan", false, true),
            ]

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={addresses[0]}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                />
            )

            expect(screen.getByText("Direcciones de terceros")).toBeInTheDocument()
        })

        it("should not render third-party section when there are no third-party addresses", () => {
            const addresses = [
                createMockAddress("address-1", "Casa", true, false),
                createMockAddress("address-2", "Trabajo", false, false),
            ]

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={addresses[0]}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                />
            )

            expect(screen.queryByText("Direcciones de terceros")).not.toBeInTheDocument()
        })

        it("should render a divider between third-party addresses", () => {
            const addresses = [
                createMockAddress("address-1", "Casa", true, false),
                createMockAddress("address-2", "Casa de Juan", false, true),
                createMockAddress("address-3", "Casa de Pedro", false, true),
            ]

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={addresses[0]}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                />
            )

            const dividers = screen.getAllByTestId("divider")
            expect(dividers.length).toBe(2)
        })
    })

    describe("when rendered with empty addresses", () => {
        it("should render empty state message", () => {
            render(
                <Addresses
                    addresses={[]}
                    shippingAddress={null}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                />
            )

            expect(screen.getByText("No hay direcciones registradas")).toBeInTheDocument()
        })

        it("should not render RadioGroup when addresses are empty", () => {
            render(
                <Addresses
                    addresses={[]}
                    shippingAddress={null}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                />
            )

            expect(screen.queryByTestId("radio-group")).not.toBeInTheDocument()
        })

        it("should render empty state description", () => {
            render(
                <Addresses
                    addresses={[]}
                    shippingAddress={null}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                />
            )

            expect(screen.getByText(/Puedes agregar una dirección/)).toBeInTheDocument()
        })
    })

    describe("when user interacts with addresses", () => {
        it("should call onSelectAddress when address is selected", () => {
            const addresses = [
                createMockAddress("address-1", "Casa", true),
                createMockAddress("address-2", "Trabajo"),
            ]

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={addresses[0]}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                />
            )

            fireEvent.click(screen.getByTestId("trigger-value-change"))

            expect(mocks.onSelectAddress).toHaveBeenCalledTimes(1)
            expect(mocks.onSelectAddress).toHaveBeenCalledWith(addresses[1])
        })

        it("should not call onSelectAddress when selected address is not found", () => {
            const addresses = [createMockAddress("address-1", "Casa", true)]

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={addresses[0]}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                />
            )

            fireEvent.click(screen.getByTestId("trigger-value-change"))

            expect(mocks.onSelectAddress).not.toHaveBeenCalled()
        })

        it("should call onEditAddress when edit button is clicked", () => {
            const addresses = [createMockAddress("address-1", "Casa", true)]

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={addresses[0]}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                />
            )

            fireEvent.click(screen.getByTestId("edit-address-1"))

            expect(mocks.onEditAddress).toHaveBeenCalledTimes(1)
            expect(mocks.onEditAddress).toHaveBeenCalledWith(addresses[0])
        })

        it("should call onDeleteAddress when delete button is clicked", () => {
            const addresses = [
                createMockAddress("address-1", "Casa", true),
                createMockAddress("address-2", "Trabajo"),
            ]

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={addresses[0]}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                />
            )

            fireEvent.click(screen.getByTestId("delete-address-1"))

            expect(mocks.onDeleteAddress).toHaveBeenCalledTimes(1)
            expect(mocks.onDeleteAddress).toHaveBeenCalledWith(addresses[0])
        })

        it("should hide delete when only one address is registered", () => {
            const addresses = [createMockAddress("address-1", "Casa", true)]

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={addresses[0]}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                />
            )

            expect(screen.queryByTestId("delete-address-1")).not.toBeInTheDocument()
        })

        it("should only show delete on third-party when there is a single personal address", () => {
            const addresses = [
                createMockAddress("address-1", "Casa", true, false),
                createMockAddress("address-2", "Casa de Juan", false, true),
            ]

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={addresses[0]}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                />
            )

            expect(screen.queryByTestId("delete-address-1")).not.toBeInTheDocument()
            expect(screen.getByTestId("delete-address-2")).toBeInTheDocument()
        })

        it("should call onAddAddress when add button is clicked", () => {
            const addresses = [createMockAddress("address-1", "Casa", true)]

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={addresses[0]}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                />
            )

            fireEvent.click(screen.getByTestId("add-address-button"))

            expect(mocks.onAddAddress).toHaveBeenCalledTimes(1)
        })
    })

    describe("when disabled state is active", () => {
        it("should disable RadioGroup when isDisabled is true", () => {
            const addresses = [createMockAddress("address-1", "Casa", true)]

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={addresses[0]}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                    isDisabled={true}
                />
            )

            const radioGroup = screen.getByTestId("radio-group")
            expect(radioGroup).toHaveAttribute("data-disabled", "true")
        })

        it("should pass isDisabled to address cards", () => {
            const addresses = [createMockAddress("address-1", "Casa", true)]

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={addresses[0]}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                    isDisabled={true}
                />
            )

            const card = screen.getByTestId("address-card-address-1")
            expect(card).toHaveAttribute("data-disabled", "true")
        })

        it("should pass isDisabled to third-party address cards", () => {
            const addresses = [
                createMockAddress("address-1", "Casa", true, false),
                createMockAddress("address-2", "Casa de Juan", false, true),
            ]

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={addresses[0]}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                    isDisabled={true}
                />
            )

            const card = screen.getByTestId("address-card-address-2")
            expect(card).toHaveAttribute("data-disabled", "true")
        })
    })

    describe("when loading state is active", () => {
        it("should disable add button when isLoadingAddresses is true", () => {
            const addresses = [createMockAddress("address-1", "Casa", true)]

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={addresses[0]}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                    isLoadingAddresses={true}
                />
            )

            const button = screen.getByTestId("add-address-button")
            expect(button).toBeDisabled()
        })

        it("should not disable add button when isLoadingAddresses is false", () => {
            const addresses = [createMockAddress("address-1", "Casa", true)]

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={addresses[0]}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                    isLoadingAddresses={false}
                />
            )

            const button = screen.getByTestId("add-address-button")
            expect(button).not.toBeDisabled()
        })
    })

    describe("add address button", () => {
        it("should render with correct text and icon", () => {
            const addresses = [createMockAddress("address-1", "Casa", true)]

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={addresses[0]}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                />
            )

            const button = screen.getByTestId("add-address-button")
            expect(button).toHaveTextContent("Agregar nueva dirección")
            expect(button).toHaveAttribute("data-color", "secondary")

            const icon = screen.getByTestId("icon")
            expect(icon).toHaveAttribute("data-icon", "mdi:plus")
        })

        it("should call onAddAddress when the maximum number of addresses is reached", () => {
            const addresses = Array.from({ length: 10 }, (_, index) =>
                createMockAddress(`address-${index + 1}`, `Dirección ${index + 1}`, index === 0)
            )

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={addresses[0]}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                />
            )

            fireEvent.click(screen.getByTestId("add-address-button"))
            expect(mocks.onAddAddress).toHaveBeenCalledTimes(1)
        })
    })

    describe("when shippingAddress is null", () => {
        it("should render without errors and use empty string as value", () => {
            const addresses = [createMockAddress("address-1", "Casa")]

            render(
                <Addresses
                    addresses={addresses}
                    shippingAddress={null}
                    onSelectAddress={mocks.onSelectAddress}
                    onEditAddress={mocks.onEditAddress}
                    onDeleteAddress={mocks.onDeleteAddress}
                    onAddAddress={mocks.onAddAddress}
                />
            )

            const props = mocks.getLastRadioGroupProps()
            expect(props.value).toBe("")
        })
    })
})
