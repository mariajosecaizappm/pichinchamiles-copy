import { describe, it, expect } from "vitest"
import { transferBeneficiaryAdapter } from "@/data/adapters/Transfer/transferBeneficiaryAdapter"

describe("transferBeneficiaryAdapter", () => {
    it("returns empty beneficiary when data is not a record", () => {
        expect(transferBeneficiaryAdapter(null)).toEqual({
            id: "",
            status: "",
            firstName: "",
            secondName: "",
            firstLastName: "",
            secondLastName: "",
            identificationNumber: "",
        })
    })

    it("maps beneficiary fields from api payload", () => {
        expect(
            transferBeneficiaryAdapter({
                id: "member-1",
                status: "active",
                firstName: "Ana",
                secondName: "Maria",
                firstLastName: "Perez",
                secondLastName: "Lopez",
                identificationNumber: "1234567890",
            })
        ).toEqual({
            id: "member-1",
            status: "active",
            firstName: "Ana",
            secondName: "Maria",
            firstLastName: "Perez",
            secondLastName: "Lopez",
            identificationNumber: "1234567890",
        })
    })
})
