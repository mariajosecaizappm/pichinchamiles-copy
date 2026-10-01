import { describe, it, expect, vi, beforeEach } from "vitest"
import GetActivitiesSearchUrlUseCase from "@/domain/interactors/Home/UseYourMiles/Travels/GetActivitiesSearchUrlUseCase"
import { ActivityParams } from "@/domain/entity/Travel/structure/activity"
import { TravelType } from "@/domain/entity/Travel/structure/travels"

// Mock the UltraviajesService
vi.mock("@/domain/services/UltraviajesService", () => ({
    default: {
        getBaseUrl: vi.fn()
    }
}))

// Mock the parseActivityParamsToStructure
vi.mock("@/domain/entity/Travel/models/parseActivityParamsToStructure", () => ({
    parseActivityParamsToStructure: vi.fn()
}))

describe("GetActivitiesSearchUrlUseCase", () => {
    let useCase: GetActivitiesSearchUrlUseCase
    let mockUltraviajesService: any
    let mockParseActivityParamsToStructure: any

    beforeEach(async () => {
        // Reset all mocks
        vi.resetModules()
        
        // Get the mocked modules
        const { default: UltraviajesService } = await import("@/domain/services/UltraviajesService")
        const { parseActivityParamsToStructure } = await import("@/domain/entity/Travel/models/parseActivityParamsToStructure")
        
        mockUltraviajesService = UltraviajesService
        mockParseActivityParamsToStructure = parseActivityParamsToStructure

        useCase = new GetActivitiesSearchUrlUseCase()
    })

    describe("execute", () => {
        it("should generate correct search URL with all parameters", async () => {
            const params: ActivityParams = {
                destination: "NYC",
                endDate: new Date("2024-06-15"),
                age: 25
            }

            const mockParsedParams = {
                destination: "NYC",
                startDate: "2024-06-15",
                endDate: "2024-06-15",
                passengers: "passengers-25",
                promoCode: "0"
            }

            mockUltraviajesService.getBaseUrl.mockReturnValue("https://example.com")
            mockParseActivityParamsToStructure.mockReturnValue(mockParsedParams)

            const result = useCase.execute(params)

            expect(mockUltraviajesService.getBaseUrl).toHaveBeenCalledWith(TravelType.ACTIVITIES)
            expect(mockParseActivityParamsToStructure).toHaveBeenCalledWith(params)
            expect(result).toBe("https://example.com/activities/NYC/2024-06-15/2024-06-15/passengers-25")
        })

        it("should handle minimum age (18)", async () => {
            const params: ActivityParams = {
                destination: "LAX",
                endDate: new Date("2024-07-20"),
                age: 18
            }

            const mockParsedParams = {
                destination: "LAX",
                startDate: "2024-07-20",
                endDate: "2024-07-20",
                passengers: "passengers-18",
                promoCode: "0"
            }

            mockUltraviajesService.getBaseUrl.mockReturnValue("https://activities.com")
            mockParseActivityParamsToStructure.mockReturnValue(mockParsedParams)

            const result = useCase.execute(params)

            expect(result).toBe("https://activities.com/activities/LAX/2024-07-20/2024-07-20/passengers-18")
        })

        it("should handle older passengers", async () => {
            const params: ActivityParams = {
                destination: "MIA",
                endDate: new Date("2024-08-10"),
                age: 65
            }

            const mockParsedParams = {
                destination: "MIA",
                startDate: "2024-08-10",
                endDate: "2024-08-10",
                passengers: "passengers-65",
                promoCode: "0"
            }

            mockUltraviajesService.getBaseUrl.mockReturnValue("https://test.com")
            mockParseActivityParamsToStructure.mockReturnValue(mockParsedParams)

            const result = useCase.execute(params)

            expect(result).toBe("https://test.com/activities/MIA/2024-08-10/2024-08-10/passengers-65")
        })

        it("should handle leap year dates", async () => {
            const params: ActivityParams = {
                destination: "CHI",
                endDate: new Date("2024-02-29"),
                age: 30
            }

            const mockParsedParams = {
                destination: "CHI",
                startDate: "2024-02-29",
                endDate: "2024-02-29",
                passengers: "passengers-30",
                promoCode: "0"
            }

            mockUltraviajesService.getBaseUrl.mockReturnValue("https://leap.com")
            mockParseActivityParamsToStructure.mockReturnValue(mockParsedParams)

            const result = useCase.execute(params)

            expect(result).toBe("https://leap.com/activities/CHI/2024-02-29/2024-02-29/passengers-30")
        })

        it("should handle single digit months and days", async () => {
            const params: ActivityParams = {
                destination: "BOS",
                endDate: new Date("2024-01-05"),
                age: 22
            }

            const mockParsedParams = {
                destination: "BOS",
                startDate: "2024-01-05",
                endDate: "2024-01-05",
                passengers: "passengers-22",
                promoCode: "0"
            }

            mockUltraviajesService.getBaseUrl.mockReturnValue("https://single.com")
            mockParseActivityParamsToStructure.mockReturnValue(mockParsedParams)

            const result = useCase.execute(params)

            expect(result).toBe("https://single.com/activities/BOS/2024-01-05/2024-01-05/passengers-22")
        })

        it("should handle double digit months and days", async () => {
            const params: ActivityParams = {
                destination: "DEN",
                endDate: new Date("2024-12-25"),
                age: 35
            }

            const mockParsedParams = {
                destination: "DEN",
                startDate: "2024-12-25",
                endDate: "2024-12-25",
                passengers: "passengers-35",
                promoCode: "0"
            }

            mockUltraviajesService.getBaseUrl.mockReturnValue("https://double.com")
            mockParseActivityParamsToStructure.mockReturnValue(mockParsedParams)

            const result = useCase.execute(params)

            expect(result).toBe("https://double.com/activities/DEN/2024-12-25/2024-12-25/passengers-35")
        })

        it("should handle empty destination", async () => {
            const params: ActivityParams = {
                destination: "",
                endDate: new Date("2024-09-15"),
                age: 28
            }

            const mockParsedParams = {
                destination: "",
                startDate: "2024-09-15",
                endDate: "2024-09-15",
                passengers: "passengers-28",
                promoCode: "0"
            }

            mockUltraviajesService.getBaseUrl.mockReturnValue("https://empty.com")
            mockParseActivityParamsToStructure.mockReturnValue(mockParsedParams)

            const result = useCase.execute(params)

            expect(result).toBe("https://empty.com/activities//2024-09-15/2024-09-15/passengers-28")
        })

        it("should handle different years", async () => {
            const params: ActivityParams = {
                destination: "ATL",
                endDate: new Date("2025-03-15"),
                age: 40
            }

            const mockParsedParams = {
                destination: "ATL",
                startDate: "2025-03-15",
                endDate: "2025-03-15",
                passengers: "passengers-40",
                promoCode: "0"
            }

            mockUltraviajesService.getBaseUrl.mockReturnValue("https://future.com")
            mockParseActivityParamsToStructure.mockReturnValue(mockParsedParams)

            const result = useCase.execute(params)

            expect(result).toBe("https://future.com/activities/ATL/2025-03-15/2025-03-15/passengers-40")
        })

        it("should use correct travel type", async () => {
            const params: ActivityParams = {
                destination: "DFW",
                endDate: new Date("2024-06-15"),
                age: 25
            }

            const mockParsedParams = {
                destination: "DFW",
                startDate: "2024-06-15",
                endDate: "2024-06-15",
                passengers: "passengers-25",
                promoCode: "0"
            }

            mockUltraviajesService.getBaseUrl.mockReturnValue("https://type.com")
            mockParseActivityParamsToStructure.mockReturnValue(mockParsedParams)

            useCase.execute(params)

            expect(mockUltraviajesService.getBaseUrl).toHaveBeenCalledWith(TravelType.ACTIVITIES)
        })

        it("should handle various destination codes", async () => {
            const destinations = ["NYC", "LAX", "CHI", "MIA", "SEA", "BOS", "DEN", "ATL", "DFW", "SFO"]

            destinations.forEach((destination) => {
                const params: ActivityParams = {
                    destination,
                    endDate: new Date("2024-06-15"),
                    age: 25
                }

                const mockParsedParams = {
                    destination,
                    startDate: "2024-06-15",
                    endDate: "2024-06-15",
                    passengers: "passengers-25",
                    promoCode: "0"
                }

                mockUltraviajesService.getBaseUrl.mockReturnValue("https://test.com")
                mockParseActivityParamsToStructure.mockReturnValue(mockParsedParams)

                const result = useCase.execute(params)

                expect(result).toBe(`https://test.com/activities/${destination}/2024-06-15/2024-06-15/passengers-25`)
            })
        })

        it("should handle edge case age values", async () => {
            const testCases = [
                { age: 18, expected: "passengers-18" },
                { age: 99, expected: "passengers-99" },
                { age: 50, expected: "passengers-50" },
            ]

            testCases.forEach(({ age, expected }) => {
                const params: ActivityParams = {
                    destination: "SFO",
                    endDate: new Date("2024-06-15"),
                    age,
                }

                const mockParsedParams = {
                    destination: "SFO",
                    startDate: "2024-06-15",
                    endDate: "2024-06-15",
                    passengers: expected,
                    promoCode: "0"
                }

                mockUltraviajesService.getBaseUrl.mockReturnValue("https://edge.com")
                mockParseActivityParamsToStructure.mockReturnValue(mockParsedParams)

                const result = useCase.execute(params)

                expect(result).toBe(`https://edge.com/activities/SFO/2024-06-15/2024-06-15/${expected}`)
            })
        })

        it("should handle different base URLs", async () => {
            const params: ActivityParams = {
                destination: "NYC",
                endDate: new Date("2024-06-15"),
                age: 25
            }

            const mockParsedParams = {
                destination: "NYC",
                startDate: "2024-06-15",
                endDate: "2024-06-15",
                passengers: "passengers-25",
                promoCode: "0"
            }

            const baseUrls = [
                "https://activities.example.com",
                "https://travel.example.org",
                "https://test.example.net",
                "https://api.example.io"
            ]

            baseUrls.forEach((baseUrl) => {
                mockUltraviajesService.getBaseUrl.mockReturnValue(baseUrl)
                mockParseActivityParamsToStructure.mockReturnValue(mockParsedParams)

                const result = useCase.execute(params)

                expect(result).toBe(`${baseUrl}/activities/NYC/2024-06-15/2024-06-15/passengers-25`)
            })
        })

        it("should always include promoCode in parsed params", async () => {
            const params: ActivityParams = {
                destination: "NYC",
                endDate: new Date("2024-06-15"),
                age: 25
            }

            const mockParsedParams = {
                destination: "NYC",
                startDate: "2024-06-15",
                endDate: "2024-06-15",
                passengers: "passengers-25",
                promoCode: "0"
            }

            mockUltraviajesService.getBaseUrl.mockReturnValue("https://promo.com")
            mockParseActivityParamsToStructure.mockReturnValue(mockParsedParams)

            const result = useCase.execute(params)

            expect(mockParseActivityParamsToStructure).toHaveBeenCalledWith(params)
            expect(result).toBe("https://promo.com/activities/NYC/2024-06-15/2024-06-15/passengers-25")
        })

        it("should construct URL in correct order", async () => {
            const params: ActivityParams = {
                destination: "TEST",
                endDate: new Date("2024-06-15"),
                age: 25
            }

            const mockParsedParams = {
                destination: "TEST",
                startDate: "2024-06-15",
                endDate: "2024-06-15",
                passengers: "passengers-25",
                promoCode: "0"
            }

            mockUltraviajesService.getBaseUrl.mockReturnValue("https://order.com")
            mockParseActivityParamsToStructure.mockReturnValue(mockParsedParams)

            const result = useCase.execute(params)

            // Verify URL structure: baseUrl/activities/destination/startDate/endDate/passengers
            expect(result).toMatch(/^https:\/\/order\.com\/activities\/[^\/]+\/[^\/]+\/[^\/]+\/[^\/]+$/)
            expect(result).toContain("/activities/TEST/2024-06-15/2024-06-15/passengers-25")
        })
    })
})
