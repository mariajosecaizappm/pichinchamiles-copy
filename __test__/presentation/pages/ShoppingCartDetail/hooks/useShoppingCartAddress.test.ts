import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { Address } from "@/domain/entity/Address/structure/address"
import { MemberType } from "@/domain/entity/Member/member"

const mocks = vi.hoisted(() => ({
    getMemberAddresses: vi.fn(),
    useSession: vi.fn(),
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: mocks.useSession,
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: () => ({
            getMemberAddresses: mocks.getMemberAddresses,
        }),
    },
}))

import { useShoppingCartAddress } from "@/presentation/pages/ShoppingCartDetail/hooks/useShoppingCartAddress"

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

describe("useShoppingCartAddress", () => {
    beforeEach(() => {
        mocks.useSession.mockReturnValue({
            member: {
                memberType: MemberType.PERSONAL,
                enrollmentEmail: "member@test.com",
                firstName: "Juan",
                secondName: "",
                firstLastName: "Pérez",
                secondLastName: "",
                cellPhone: "0999999999",
                identificationNumber: "1234567890",
                identificationType: "CI",
            },
        })
        mocks.getMemberAddresses.mockResolvedValue([])
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it("should not fetch addresses when step is not 2", () => {
        renderHook(() => useShoppingCartAddress(1))

        expect(mocks.getMemberAddresses).not.toHaveBeenCalled()
    })

    it("should fetch addresses when step is 2", async () => {
        const addresses = [createAddress()]
        mocks.getMemberAddresses.mockResolvedValue(addresses)

        const { result } = renderHook(() => useShoppingCartAddress(2))

        await waitFor(() => {
            expect(mocks.getMemberAddresses).toHaveBeenCalledTimes(1)
        })

        await waitFor(() => {
            expect(result.current.addressList).toEqual(addresses)
            expect(result.current.isLoadingAddresses).toBe(false)
        })
    })

    it("should set empty address list when fetch fails", async () => {
        mocks.getMemberAddresses.mockRejectedValue(new Error("Network error"))

        const { result } = renderHook(() => useShoppingCartAddress(2))

        await waitFor(() => {
            expect(result.current.addressList).toEqual([])
            expect(result.current.isLoadingAddresses).toBe(false)
        })
    })

    it("should select default shipping address with enrollment email", async () => {
        const defaultAddress = createAddress({ id: "default", default: true })
        const otherAddress = createAddress({ id: "other", default: false, alias: "Oficina" })
        mocks.getMemberAddresses.mockResolvedValue([otherAddress, defaultAddress])

        const { result } = renderHook(() => useShoppingCartAddress(2))

        await waitFor(() => {
            expect(result.current.shippingAddress).toEqual({
                ...defaultAddress,
                customerReceivingEmail: "member@test.com",
            })
        })
    })

    it("should select first address when no default exists", async () => {
        const firstAddress = createAddress({ id: "first", default: false })
        const secondAddress = createAddress({ id: "second", default: false, alias: "Oficina" })
        mocks.getMemberAddresses.mockResolvedValue([firstAddress, secondAddress])

        const { result } = renderHook(() => useShoppingCartAddress(2))

        await waitFor(() => {
            expect(result.current.shippingAddress).toEqual({
                ...firstAddress,
                customerReceivingEmail: "member@test.com",
            })
        })
    })

    it("should update shipping address via selectShippingAddress", async () => {
        const firstAddress = createAddress({ id: "first", default: true })
        const secondAddress = createAddress({ id: "second", default: false, alias: "Oficina" })
        mocks.getMemberAddresses.mockResolvedValue([firstAddress, secondAddress])

        const { result } = renderHook(() => useShoppingCartAddress(2))

        await waitFor(() => {
            expect(result.current.shippingAddress?.id).toBe("first")
        })

        act(() => {
            result.current.selectShippingAddress(secondAddress)
        })

        expect(result.current.shippingAddress).toEqual({
            ...secondAddress,
            customerReceivingEmail: "member@test.com",
        })
    })

    it("should allow updating selectedAddress form values", () => {
        const { result } = renderHook(() => useShoppingCartAddress(1))

        act(() => {
            result.current.setSelectedAddress({ alias: "Nueva dirección" } as any)
        })

        expect(result.current.selectedAddress).toEqual({ alias: "Nueva dirección" })
    })

    it("should build billing address from member and shipping address", async () => {
        const address = createAddress({ id: "billing-source", default: true })
        mocks.getMemberAddresses.mockResolvedValue([address])

        const { result } = renderHook(() => useShoppingCartAddress(2))

        await waitFor(() => {
            expect(result.current.billingAddress).toEqual(
                expect.objectContaining({
                    id: "billing-source",
                    customerReceivingEmail: "member@test.com",
                    customerReceivingPhone: "0999999999",
                    customerReceivingIdentificationNumber: "1234567890",
                    customerReceivingFirstName: "Juan",
                    customerReceivingLastName: "Pérez",
                })
            )
        })
    })

    it("should expose getAddress for manual refresh", async () => {
        const addresses = [createAddress()]
        mocks.getMemberAddresses.mockResolvedValue(addresses)

        const { result } = renderHook(() => useShoppingCartAddress(1))

        await act(async () => {
            await result.current.getAddress()
        })

        expect(mocks.getMemberAddresses).toHaveBeenCalledTimes(1)
        expect(result.current.addressList).toEqual(addresses)
    })

    it("should update billing address via setBillingAddress", async () => {
        const address = createAddress({ id: "billing-source", default: true })
        mocks.getMemberAddresses.mockResolvedValue([address])

        const { result } = renderHook(() => useShoppingCartAddress(2))

        await waitFor(() => {
            expect(result.current.billingAddress).not.toBeNull()
        })

        const updatedAddress = createAddress({
            id: "billing-source",
            street1: "Calle actualizada",
        })

        act(() => {
            result.current.setBillingAddress(updatedAddress)
        })

        expect(result.current.billingAddress).toEqual(updatedAddress)
    })

    it("should keep billing address when shipping address id does not change", async () => {
        const address = createAddress({ id: "billing-source", default: true })
        mocks.getMemberAddresses.mockResolvedValue([address])

        const { result } = renderHook(() => useShoppingCartAddress(2))

        await waitFor(() => {
            expect(result.current.billingAddress).not.toBeNull()
        })

        const customizedBilling = createAddress({
            id: "billing-source",
            street1: "Facturación personalizada",
        })

        act(() => {
            result.current.setBillingAddress(customizedBilling)
        })

        mocks.getMemberAddresses.mockResolvedValue([
            createAddress({ id: "billing-source", default: true, street2: "Nueva secundaria" }),
        ])

        await act(async () => {
            await result.current.getAddress()
        })

        await waitFor(() => {
            expect(result.current.shippingAddress?.street2).toBe("Nueva secundaria")
        })

        expect(result.current.billingAddress).toEqual(customizedBilling)
    })

    it("should default memberType to personal when member is missing", () => {
        mocks.useSession.mockReturnValue({ member: null })

        const { result } = renderHook(() => useShoppingCartAddress(1))

        expect(result.current.memberType).toBe(MemberType.PERSONAL)
    })

    it("should refresh existing shipping address when address list updates", async () => {
        const initialAddress = createAddress({ id: "addr-1", default: true, street1: "Original" })
        mocks.getMemberAddresses.mockResolvedValue([initialAddress])

        const { result } = renderHook(() => useShoppingCartAddress(2))

        await waitFor(() => {
            expect(result.current.shippingAddress?.street1).toBe("Original")
        })

        const updatedAddress = createAddress({ id: "addr-1", default: true, street1: "Actualizada" })
        mocks.getMemberAddresses.mockResolvedValue([updatedAddress])

        await act(async () => {
            await result.current.getAddress()
        })

        await waitFor(() => {
            expect(result.current.shippingAddress?.street1).toBe("Actualizada")
        })
    })

    it("should keep previous shipping address when refreshed list no longer contains it", async () => {
        const initialAddress = createAddress({ id: "addr-1", default: true })
        mocks.getMemberAddresses.mockResolvedValue([initialAddress])

        const { result } = renderHook(() => useShoppingCartAddress(2))

        await waitFor(() => {
            expect(result.current.shippingAddress?.id).toBe("addr-1")
        })

        mocks.getMemberAddresses.mockResolvedValue([
            createAddress({ id: "addr-2", default: true, alias: "Otra" }),
        ])

        await act(async () => {
            await result.current.getAddress()
        })

        await waitFor(() => {
            expect(result.current.shippingAddress?.id).toBe("addr-1")
        })
    })

    it("should rebuild billing address when shipping address id changes", async () => {
        const firstAddress = createAddress({ id: "first", default: true })
        const secondAddress = createAddress({ id: "second", default: false, alias: "Oficina" })
        mocks.getMemberAddresses.mockResolvedValue([firstAddress, secondAddress])

        const { result } = renderHook(() => useShoppingCartAddress(2))

        await waitFor(() => {
            expect(result.current.billingAddress?.id).toBe("first")
        })

        act(() => {
            result.current.selectShippingAddress(secondAddress)
        })

        await waitFor(() => {
            expect(result.current.billingAddress?.id).toBe("second")
        })
    })
})
