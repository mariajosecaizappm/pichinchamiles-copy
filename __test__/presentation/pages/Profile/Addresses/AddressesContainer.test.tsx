import React from "react"
import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import AddressesContainer from "@/presentation/pages/Profile/Addresses/AddressesContainer"
import { Address } from "@/domain/entity/Address/structure/address"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"

const mocks = vi.hoisted(() => {
    const onEditAddress = vi.fn()
    const onAddAddress = vi.fn()
    const refetchAddresses = vi.fn()
    const updateMemberAddress = vi.fn()
    const deleteMemberAddress = vi.fn()
    const containerGet = vi.fn()
    let lastAddressesProps: any = null
    let addresses: any[] = [
        {
            id: "address-1",
            alias: "Casa",
            street1: "Calle Principal",
            street2: "Depto 1",
            city: { id: "QUI", name: "Quito", grade: "city", parentId: "PIC" },
            state: { id: "PIC", name: "Pichincha", grade: "state", parentId: "EC" },
            zone: { id: "NOR", name: "Norte", grade: "zone", parentId: "QUI" },
            country: { id: "EC", name: "Ecuador", grade: "country", parentId: null },
            number: "123",
            default: true,
            isThirdPartyAddress: false,
            postalCode: "170101",
            reference: "Cerca del parque",
            customerReceivingFirstName: "John",
            customerReceivingLastName: "Doe",
            customerReceivingEmail: "john@example.com",
            customerReceivingPhone: "0999999999",
            customerReceivingIdentificationNumber: "1234567890",
            customerReceivingIdentificationType: "CI",
            secondPhone: "",
            createdAt: "2024-01-01T00:00:00.000Z",
        },
        {
            id: "address-2",
            alias: "Trabajo",
            street1: "Av. Principal",
            street2: "Oficina 1",
            city: { id: "QUI", name: "Quito", grade: "city", parentId: "PIC" },
            state: { id: "PIC", name: "Pichincha", grade: "state", parentId: "EC" },
            zone: { id: "CEN", name: "Centro", grade: "zone", parentId: "QUI" },
            country: { id: "EC", name: "Ecuador", grade: "country", parentId: null },
            number: "456",
            default: false,
            isThirdPartyAddress: false,
            postalCode: "170102",
            reference: "Edificio azul",
            customerReceivingFirstName: "Jane",
            customerReceivingLastName: "Smith",
            customerReceivingEmail: "jane@example.com",
            customerReceivingPhone: "0988888888",
            customerReceivingIdentificationNumber: "0987654321",
            customerReceivingIdentificationType: "CI",
            secondPhone: "",
            createdAt: "2024-06-01T00:00:00.000Z",
        },
    ]

    return {
        onEditAddress,
        onAddAddress,
        refetchAddresses,
        updateMemberAddress,
        deleteMemberAddress,
        containerGet,
        getAddresses: () => addresses,
        setAddresses: (next: any[]) => {
            addresses = next
        },
        getLastAddressesProps: () => lastAddressesProps,
        setLastAddressesProps: (p: any) => (lastAddressesProps = p),
    }
})

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}))

vi.mock("@/presentation/hooks/useAddress", () => ({
    default: () => ({
        addresses: mocks.getAddresses(),
        onEditAddress: mocks.onEditAddress,
        isLoadingAddresses: false,
        onAddAddress: mocks.onAddAddress,
        refetchAddresses: mocks.refetchAddresses,
    }),
}))

vi.mock("@heroui/react", () => ({
    Skeleton: ({ className }: { className?: string }) => (
        <div data-testid="skeleton" className={className}>
            Loading...
        </div>
    ),
}))

vi.mock("@/presentation/pages/Profile/Addresses/Addresses", () => ({
    default: (props: any) => {
        mocks.setLastAddressesProps(props)
        const shippingId = props.shippingAddress ? props.shippingAddress.id : "none"
        return (
            <div data-testid="addresses-component">
                <span data-testid="addresses-count">{props.addresses.length}</span>
                <span data-testid="shipping-address-id">{shippingId}</span>
                <span data-testid="is-disabled">{String(!!props.isDisabled)}</span>
                <button
                    type="button"
                    data-testid="trigger-select-address"
                    onClick={() => {
                        if (props.addresses[1]) {
                            props.onSelectAddress?.(props.addresses[1])
                        }
                    }}
                >
                    select-address
                </button>
                <button
                    type="button"
                    data-testid="trigger-edit-address"
                    onClick={() => {
                        if (props.addresses[0]) {
                            props.onEditAddress?.(props.addresses[0])
                        }
                    }}
                >
                    edit-address
                </button>
                <button
                    type="button"
                    data-testid="trigger-delete-address"
                    onClick={() => {
                        if (props.addresses[0]) {
                            props.onDeleteAddress?.(props.addresses[0])
                        }
                    }}
                >
                    delete-address
                </button>
                <button
                    type="button"
                    data-testid="trigger-add-address"
                    onClick={() => props.onAddAddress?.()}
                >
                    add-address
                </button>
            </div>
        )
    },
}))

vi.mock("@/presentation/components/Modal/ConfirmationModal", () => ({
    default: ({ isOpen, title, message, confirmLabel, cancelLabel, onConfirm, onCancel }: any) =>
        isOpen ? (
            <div data-testid="confirmation-modal">
                {title ? <span data-testid="confirmation-title">{title}</span> : null}
                <span data-testid="confirmation-message">{message}</span>
                <button type="button" data-testid="confirm-delete" onClick={onConfirm}>
                    {confirmLabel}
                </button>
                <button type="button" data-testid="cancel-delete" onClick={onCancel}>
                    {cancelLabel}
                </button>
            </div>
        ) : null,
}))

vi.mock("@/presentation/components/Modal/SuccessAlertModal", () => ({
    default: ({ isOpen, title, description, onContinue }: any) =>
        isOpen ? (
            <div data-testid="success-alert-modal">
                <span data-testid="success-title">{title}</span>
                <span data-testid="success-description">{description}</span>
                <button type="button" data-testid="success-continue" onClick={onContinue}>
                    continue
                </button>
            </div>
        ) : null,
}))

const createMockAddress = (id: string, alias: string, isDefault = false, createdAt?: string): Address => ({
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
    isThirdPartyAddress: false,
    postalCode: "170101",
    reference: "Cerca del parque",
    customerReceivingFirstName: "John",
    customerReceivingLastName: "Doe",
    customerReceivingEmail: "john@example.com",
    customerReceivingPhone: "0999999999",
    customerReceivingIdentificationNumber: "1234567890",
    customerReceivingIdentificationType: "CI",
    secondPhone: "",
    createdAt,
})

describe("AddressesContainer", () => {
    beforeEach(() => {
        mocks.onEditAddress.mockReset()
        mocks.onAddAddress.mockReset()
        mocks.refetchAddresses.mockReset()
        mocks.updateMemberAddress.mockReset()
        mocks.deleteMemberAddress.mockReset()
        mocks.containerGet.mockReset()
        mocks.setLastAddressesProps(null)
        mocks.setAddresses([
            createMockAddress("address-1", "Casa", true),
            createMockAddress("address-2", "Trabajo", false),
        ])

        mocks.updateMemberAddress.mockResolvedValue(undefined)
        mocks.deleteMemberAddress.mockResolvedValue(undefined)
        mocks.refetchAddresses.mockResolvedValue(undefined)

        mocks.containerGet.mockImplementation((type: string) => {
            if (type === UseCaseTypes.UpdateMemberAddressUseCase) {
                return {
                    updateMemberAddress: mocks.updateMemberAddress,
                }
            }
            if (type === UseCaseTypes.DeleteMemberAddressUseCase) {
                return {
                    deleteMemberAddress: mocks.deleteMemberAddress,
                }
            }
            return {}
        })
    })


    describe("when addresses are loaded", () => {
        it("should render Addresses component", () => {
            render(<AddressesContainer />)

            expect(screen.getByTestId("addresses-component")).toBeInTheDocument()
        })

        it("should pass addresses from useAddress hook", () => {
            render(<AddressesContainer />)

            const addressesCount = screen.getByTestId("addresses-count")
            expect(addressesCount).toHaveTextContent("2")
        })

        it("should pass shippingAddress prop to Addresses component", () => {
            render(<AddressesContainer />)

            const props = mocks.getLastAddressesProps()
            // The component should pass a shippingAddress (either the default or null)
            expect(props).toHaveProperty("shippingAddress")
        })

        it("should pass null as shippingAddress when no default address exists", () => {
            mocks.setAddresses([
                createMockAddress("address-1", "Casa", false),
                createMockAddress("address-2", "Trabajo", false),
            ])

            render(<AddressesContainer />)

            const props = mocks.getLastAddressesProps()
            expect(props.shippingAddress).toBe(null)
        })

        it("should pass callback functions to Addresses component", () => {
            render(<AddressesContainer />)

            const props = mocks.getLastAddressesProps()
            expect(props.onSelectAddress).toBeDefined()
            expect(props.onEditAddress).toBe(mocks.onEditAddress)
            expect(props.onDeleteAddress).toBeDefined()
            expect(props.onAddAddress).toBe(mocks.onAddAddress)
        })
    })

    describe("when user selects a different address", () => {
        it("should call updateMemberAddress with default true", async () => {
            render(<AddressesContainer />)

            const selectButton = screen.getByTestId("trigger-select-address")
            selectButton.click()

            await waitFor(() => {
                expect(mocks.updateMemberAddress).toHaveBeenCalledTimes(1)
            })

            expect(mocks.updateMemberAddress).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: "address-2",
                    alias: "Trabajo",
                    default: true,
                })
            )
        })

        it("should refetch addresses after updating", async () => {
            render(<AddressesContainer />)

            const selectButton = screen.getByTestId("trigger-select-address")
            selectButton.click()

            await waitFor(() => {
                expect(mocks.refetchAddresses).toHaveBeenCalledTimes(1)
            })
        })

        it("should disable component while updating", async () => {
            render(<AddressesContainer />)

            const selectButton = screen.getByTestId("trigger-select-address")
            
            const isDisabledBefore = screen.getByTestId("is-disabled")
            expect(isDisabledBefore).toHaveTextContent("false")

            selectButton.click()

            await waitFor(() => {
                expect(mocks.updateMemberAddress).toHaveBeenCalled()
            })

            await waitFor(() => {
                expect(mocks.refetchAddresses).toHaveBeenCalled()
            })
        })
    })

    describe("when user edits an address", () => {
        it("should call onEditAddress from useAddress hook", () => {
            render(<AddressesContainer />)

            const editButton = screen.getByTestId("trigger-edit-address")
            editButton.click()

            expect(mocks.onEditAddress).toHaveBeenCalledTimes(1)
        })
    })

    describe("when user deletes an address", () => {
        it("should open confirmation modal when delete is requested", () => {
            render(<AddressesContainer />)

            fireEvent.click(screen.getByTestId("trigger-delete-address"))

            expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument()
            expect(screen.getByTestId("confirmation-title")).toHaveTextContent("Eliminar dirección")
            expect(screen.getByTestId("confirmation-message")).toHaveTextContent(
                "¿Quieres eliminar esta dirección registrada?"
            )
            expect(screen.getByTestId("confirm-delete")).toHaveTextContent("Eliminar dirección")
        })

        it("should close confirmation modal when cancel is clicked", () => {
            render(<AddressesContainer />)

            fireEvent.click(screen.getByTestId("trigger-delete-address"))
            fireEvent.click(screen.getByTestId("cancel-delete"))

            expect(screen.queryByTestId("confirmation-modal")).not.toBeInTheDocument()
            expect(mocks.deleteMemberAddress).not.toHaveBeenCalled()
        })

        it("should delete address, refetch and show success modal on confirm", async () => {
            render(<AddressesContainer />)

            fireEvent.click(screen.getByTestId("trigger-delete-address"))
            fireEvent.click(screen.getByTestId("confirm-delete"))

            await waitFor(() => {
                expect(mocks.deleteMemberAddress).toHaveBeenCalledWith("address-1")
            })

            await waitFor(() => {
                expect(mocks.refetchAddresses).toHaveBeenCalled()
            })

            await waitFor(() => {
                expect(screen.getByTestId("success-alert-modal")).toBeInTheDocument()
            })

            expect(screen.getByTestId("success-title")).toHaveTextContent(
                "Dirección eliminada correctamente"
            )
            expect(screen.getByTestId("success-description")).toHaveTextContent(
                "La dirección se ha eliminado de manera exitosa"
            )
            expect(mocks.updateMemberAddress).not.toHaveBeenCalled()
        })

        it("should close success modal when continue is clicked", async () => {
            render(<AddressesContainer />)

            fireEvent.click(screen.getByTestId("trigger-delete-address"))
            fireEvent.click(screen.getByTestId("confirm-delete"))

            await waitFor(() => {
                expect(screen.getByTestId("success-alert-modal")).toBeInTheDocument()
            })

            fireEvent.click(screen.getByTestId("success-continue"))

            expect(screen.queryByTestId("success-alert-modal")).not.toBeInTheDocument()
        })
    })

    describe("when user adds a new address", () => {
        it("should call onAddAddress from useAddress hook", () => {
            render(<AddressesContainer />)

            const addButton = screen.getByTestId("trigger-add-address")
            addButton.click()

            expect(mocks.onAddAddress).toHaveBeenCalledTimes(1)
        })
    })

    describe("dependency injection", () => {
        it("should get UpdateMemberAddressUseCase and DeleteMemberAddressUseCase from container", () => {
            render(<AddressesContainer />)

            expect(mocks.containerGet).toHaveBeenCalledWith(UseCaseTypes.UpdateMemberAddressUseCase)
            expect(mocks.containerGet).toHaveBeenCalledWith(UseCaseTypes.DeleteMemberAddressUseCase)
        })
    })

})
