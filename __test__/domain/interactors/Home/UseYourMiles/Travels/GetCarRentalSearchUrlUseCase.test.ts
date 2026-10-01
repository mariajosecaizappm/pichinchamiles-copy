import { describe, it, expect, beforeEach, vi } from "vitest"
import GetCarRentalSearchUrlUseCase from "@/domain/interactors/Home/UseYourMiles/Travels/GetCarRentalSearchUrlUseCase"
import type { CarRentalParams } from "@/domain/entity/Travel/structure/carRental"

vi.stubEnv("NEXT_PUBLIC_UV_METEOR", "https://meteor.example.com")

const baseParams: CarRentalParams = {
    pickUpLocation: "UIO",
    dropOffLocation: "GYE",
    pickUpDate: new Date(2024, 5, 15, 10, 30),
    pickUpTime: new Date(2024, 5, 15, 10, 30),
    dropOffDate: new Date(2024, 5, 20, 11, 5),
    dropOffTime: new Date(2024, 5, 20, 11, 5),
}

describe("GetCarRentalSearchUrlUseCase", () => {
    let useCase: GetCarRentalSearchUrlUseCase

    beforeEach(() => {
        useCase = new GetCarRentalSearchUrlUseCase()
    })

    it("should build the car rental search URL with the meteor base url", () => {
        const url = useCase.execute(baseParams)

        expect(url).toBe(
            "https://meteor.example.com/cars/search/UIO-GYE/2024-06-15_1030/2024-06-20_1105/standard",
        )
    })

    it("should default dropOffLocation to pickUpLocation when not provided", () => {
        const params: CarRentalParams = { ...baseParams, dropOffLocation: undefined }
        const url = useCase.execute(params)

        expect(url).toContain("/UIO-UIO/")
    })

    it("should always include the standard car type segment", () => {
        const url = useCase.execute(baseParams)
        expect(url).toMatch(/\/standard$/)
    })
})
