import { describe, it, expect } from "vitest"
import AddressesIndex from "@/presentation/pages/Profile/Addresses/index"
import AddressesContainer from "@/presentation/pages/Profile/Addresses/AddressesContainer"

describe("ProfileAddresses index", () => {
    it("should export AddressesContainer as default", () => {
        expect(AddressesIndex).toBeDefined()
        expect(AddressesIndex).toBe(AddressesContainer)
    })
})
