import { describe, it, expect } from "vitest"
import { parseCarRentalParamsToStructure } from "@/domain/entity/Travel/models/parseCarRentalParamsToStructure"
import { CarType, type CarRentalParams } from "@/domain/entity/Travel/structure/carRental"

const baseParams: CarRentalParams = {
    pickUpLocation: "UIO",
    dropOffLocation: "GYE",
    pickUpDate: new Date(2024, 5, 15, 10, 30),
    pickUpTime: new Date(2024, 5, 15, 10, 30),
    dropOffDate: new Date(2024, 5, 20, 11, 5),
    dropOffTime: new Date(2024, 5, 20, 11, 5),
}

describe("parseCarRentalParamsToStructure", () => {
    it("should map all params to the CarRental structure with default carType STANDARD", () => {
        const result = parseCarRentalParamsToStructure(baseParams)

        expect(result.carType).toBe(CarType.STANDARD)
        expect(result.corporateDiscount).toBe("0")
        expect(result.pickUpLocation).toBe("UIO")
        expect(result.dropOffLocation).toBe("GYE")
        expect(result.pickUpDate).toBe("2024-06-15_1030")
        expect(result.dropOffDate).toBe("2024-06-20_1105")
    })

    it("should fallback dropOffLocation to pickUpLocation when dropOffLocation is undefined", () => {
        const params: CarRentalParams = { ...baseParams, dropOffLocation: undefined }
        const result = parseCarRentalParamsToStructure(params)

        expect(result.dropOffLocation).toBe("UIO")
    })

    it("should pad single-digit hours and minutes with leading zeros", () => {
        const params: CarRentalParams = {
            ...baseParams,
            pickUpDate: new Date(2024, 0, 5, 9, 7),
            pickUpTime: new Date(2024, 0, 5, 9, 7),
        }
        const result = parseCarRentalParamsToStructure(params)

        expect(result.pickUpDate).toBe("2024-01-05_0907")
    })
})
