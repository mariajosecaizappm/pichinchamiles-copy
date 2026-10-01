import { describe, expect, it } from "vitest"
import { Address } from "@/domain/entity/Address/structure/address"
import {
    canDeleteAddress,
    sortAddressesNewestFirst,
} from "@/presentation/pages/Profile/Addresses/utils"

const createAddress = (overrides: Partial<Address> = {}): Address => ({
    id: "addr-1",
    alias: "Casa",
    street1: "Calle",
    street2: "Sec",
    country: { id: "1", name: "Ecuador", grade: "country", parentId: null },
    state: { id: "2", name: "Pichincha", grade: "state", parentId: "1" },
    city: { id: "3", name: "Quito", grade: "city", parentId: "2" },
    zone: { id: "4", name: "Centro", grade: "zone", parentId: "3" },
    number: "1",
    reference: "Ref",
    isThirdPartyAddress: false,
    customerReceivingFirstName: "",
    customerReceivingLastName: "",
    customerReceivingEmail: "",
    customerReceivingPhone: "",
    customerReceivingIdentificationNumber: "",
    customerReceivingIdentificationType: "",
    secondPhone: "099",
    postalCode: "170101",
    default: false,
    ...overrides,
})

describe("Addresses utils", () => {
    describe("canDeleteAddress", () => {
        it("returns false when only one address exists", () => {
            const address = createAddress()
            expect(canDeleteAddress(address, [address])).toBe(false)
        })

        it("hides delete on the only personal address when a third-party also exists", () => {
            const personal = createAddress({ id: "p1", isThirdPartyAddress: false })
            const thirdParty = createAddress({ id: "t1", isThirdPartyAddress: true })

            expect(canDeleteAddress(personal, [personal, thirdParty])).toBe(false)
            expect(canDeleteAddress(thirdParty, [personal, thirdParty])).toBe(true)
        })

        it("allows delete on personal when more than one personal exists", () => {
            const personal1 = createAddress({ id: "p1", isThirdPartyAddress: false })
            const personal2 = createAddress({ id: "p2", isThirdPartyAddress: false })

            expect(canDeleteAddress(personal1, [personal1, personal2])).toBe(true)
        })
    })

    describe("sortAddressesNewestFirst", () => {
        it("sorts by createdAt descending when dates exist", () => {
            const older = createAddress({ id: "old", createdAt: "2024-01-01T00:00:00.000Z" })
            const newer = createAddress({ id: "new", createdAt: "2025-01-01T00:00:00.000Z" })

            expect(sortAddressesNewestFirst([older, newer]).map(a => a.id)).toEqual(["new", "old"])
        })

        it("reverses list when no createdAt is present", () => {
            const first = createAddress({ id: "a" })
            const second = createAddress({ id: "b" })

            expect(sortAddressesNewestFirst([first, second]).map(a => a.id)).toEqual(["b", "a"])
        })
    })
})
