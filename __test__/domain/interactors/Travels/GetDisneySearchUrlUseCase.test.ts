import { describe, it, expect, vi, beforeEach } from "vitest"

const mocks = vi.hoisted(() => {
    const getBaseUrl = vi.fn()
    return { getBaseUrl }
})

vi.mock("@/domain/services/UltraviajesService", () => ({
    default: {
        getBaseUrl: mocks.getBaseUrl,
    },
}))

import GetDisneySearchUrlUseCase from "@/domain/interactors/Home/UseYourMiles/Travels/GetDisneySearchUrlUseCase"
import { DisneyParams } from "@/domain/entity/Travel/structure/disney"
import { TravelType } from "@/domain/entity/Travel/structure/travels"

describe("GetDisneySearchUrlUseCase", () => {
    beforeEach(() => {
        mocks.getBaseUrl.mockReset()
    })

    it("should generate Disney search URL with correct parameters", () => {
        const useCase = new GetDisneySearchUrlUseCase()
        const params: DisneyParams = {
            adults: 2,
            childrens: 1,
            date: new Date("2024-06-15"),
        }

        mocks.getBaseUrl.mockReturnValueOnce("https://api.example.com")

        const result = useCase.execute(params)

        expect(mocks.getBaseUrl).toHaveBeenCalledWith(TravelType.DISNEY)
        expect(result).toBe("https://api.example.com/disney/recommendations?adults=2&children=1&date=2024-06-14")
    })

    it("should handle zero children", () => {
        const useCase = new GetDisneySearchUrlUseCase()
        const params: DisneyParams = {
            adults: 1,
            childrens: 0,
            date: new Date("2024-06-15"),
        }

        mocks.getBaseUrl.mockReturnValueOnce("https://api.example.com")

        const result = useCase.execute(params)

        expect(result).toBe("https://api.example.com/disney/recommendations?adults=1&children=0&date=2024-06-14")
    })

    it("should handle single digit months and days", () => {
        const useCase = new GetDisneySearchUrlUseCase()
        const params: DisneyParams = {
            adults: 1,
            childrens: 0,
            date: new Date("2024-01-05"),
        }

        mocks.getBaseUrl.mockReturnValueOnce("https://api.example.com")

        const result = useCase.execute(params)

        expect(result).toBe("https://api.example.com/disney/recommendations?adults=1&children=0&date=2024-01-04")
    })

    it("should handle multiple adults and children", () => {
        const useCase = new GetDisneySearchUrlUseCase()
        const params: DisneyParams = {
            adults: 5,
            childrens: 4,
            date: new Date("2024-12-25"),
        }

        mocks.getBaseUrl.mockReturnValueOnce("https://api.example.com")

        const result = useCase.execute(params)

        expect(result).toBe("https://api.example.com/disney/recommendations?adults=5&children=4&date=2024-12-24")
    })
})
