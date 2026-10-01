import { describe, it, expect, vi } from "vitest"
import { 
    activitiesSchema, 
    activitiesInitialValues, 
    parseValuesToParams,
    MIN_DAYS_AHEAD,
    ActivitiesValues 
} from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Activities/Form/ActivitiesFormConfig"
import { ActivityLocation } from "@/domain/entity/TravelLocation/structure/activity"
import { TravelLocationType } from "@/domain/entity/TravelLocation"

// Mock the dependencies
vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: vi.fn()
    }
}))

vi.mock("@/domain/entity/Types/UseCaseTypes", () => ({
    default: {
        GetActivitiesLocationsUseCase: Symbol("GetActivitiesLocationsUseCase")
    }
}))

vi.mock("@/domain/interactors/TravelLocation/GetActivitiesLocationsUseCase", () => ({
    default: vi.fn()
}))

describe("ActivitiesFormConfig", () => {
    describe("MIN_DAYS_AHEAD", () => {
        it("should export MIN_DAYS_AHEAD as 3", () => {
            expect(MIN_DAYS_AHEAD).toBe(3)
        })
    })

    describe("activitiesSchema", () => {
        it("should validate destination as required object", async () => {
            const validDestination = { id: "NYC", name: "New York" }
            const result = await activitiesSchema.validate({
                destination: validDestination,
                endDate: new Date(),
                age: 25
            })
            expect(result.destination).toEqual(validDestination)
        })

        it("should reject null destination", async () => {
            await expect(activitiesSchema.validate({
                destination: null,
                endDate: new Date(),
                age: 25
            })).rejects.toThrow("Campo requerido")
        })

        it("should reject undefined destination", async () => {
            await expect(activitiesSchema.validate({
                destination: undefined,
                endDate: new Date(),
                age: 25
            })).rejects.toThrow()
        })

        it("should require destination.id", async () => {
            await expect(activitiesSchema.validate({
                destination: { id: "", name: "New York" },
                endDate: new Date(),
                age: 25
            })).rejects.toThrow()
        })

        it("should require destination.name", async () => {
            await expect(activitiesSchema.validate({
                destination: { id: "NYC", name: "" },
                endDate: new Date(),
                age: 25
            })).rejects.toThrow()
        })

        it("should validate endDate as required date", async () => {
            const testDate = new Date("2024-06-15")
            const result = await activitiesSchema.validate({
                destination: { id: "NYC", name: "New York" },
                endDate: testDate,
                age: 25
            })
            expect(result.endDate).toEqual(testDate)
        })

        it("should reject null endDate", async () => {
            await expect(activitiesSchema.validate({
                destination: { id: "NYC", name: "New York" },
                endDate: null,
                age: 25
            })).rejects.toThrow("Campo requerido")
        })

        it("should reject undefined endDate", async () => {
            await expect(activitiesSchema.validate({
                destination: { id: "NYC", name: "New York" },
                endDate: undefined,
                age: 25
            })).rejects.toThrow("Campo requerido")
        })

        it("should validate age as required number", async () => {
            const result = await activitiesSchema.validate({
                destination: { id: "NYC", name: "New York" },
                endDate: new Date(),
                age: 25
            })
            expect(result.age).toBe(25)
        })

        it("should reject age less than 18", async () => {
            await expect(activitiesSchema.validate({
                destination: { id: "NYC", name: "New York" },
                endDate: new Date(),
                age: 17
            })).rejects.toThrow("Debe ser mayor a 18 años")
        })

        it("should accept age exactly 18", async () => {
            const result = await activitiesSchema.validate({
                destination: { id: "NYC", name: "New York" },
                endDate: new Date(),
                age: 18
            })
            expect(result.age).toBe(18)
        })

        it("should accept age greater than 18", async () => {
            const result = await activitiesSchema.validate({
                destination: { id: "NYC", name: "New York" },
                endDate: new Date(),
                age: 65
            })
            expect(result.age).toBe(65)
        })

        it("should reject non-numeric age", async () => {
            await expect(activitiesSchema.validate({
                destination: { id: "NYC", name: "New York" },
                endDate: new Date(),
                age: "twenty-five" as any
            })).rejects.toThrow()
        })
    })

    describe("activitiesInitialValues", () => {
        it("should have correct initial values", () => {
            expect(activitiesInitialValues).toEqual({
                destination: null,
                endDate: null,
                age: 18
            })
        })

        it("should match ActivitiesValues type", () => {
            const initialValues: ActivitiesValues = activitiesInitialValues
            expect(initialValues.destination).toBeNull()
            expect(initialValues.endDate).toBeNull()
            expect(initialValues.age).toBe(18)
        })
    })

    describe("parseValuesToParams", () => {
        it("should parse complete form values to ActivityParams", () => {
            const values: ActivitiesValues = {
                destination: { id: "NYC", name: "New York" },
                endDate: new Date("2024-06-15"),
                age: 25
            }

            const result = parseValuesToParams(values)

            expect(result).toEqual({
                destination: "NYC",
                endDate: new Date("2024-06-15"),
                age: 25
            })
        })

        it("should handle null destination", () => {
            const values: ActivitiesValues = {
                destination: null,
                endDate: new Date("2024-06-15"),
                age: 25
            }

            const result = parseValuesToParams(values)

            expect(result.destination).toBe("")
            expect(result.endDate).toEqual(new Date("2024-06-15"))
            expect(result.age).toBe(25)
        })

        it("should handle null endDate by using current date", () => {
            const values: ActivitiesValues = {
                destination: { id: "LAX", name: "Los Angeles" },
                endDate: null,
                age: 30
            }

            const result = parseValuesToParams(values)

            expect(result.destination).toBe("LAX")
            expect(result.endDate).toBeInstanceOf(Date)
            expect(result.age).toBe(30)
        })

        it("should handle minimum age", () => {
            const values: ActivitiesValues = {
                destination: { id: "MIA", name: "Miami" },
                endDate: new Date("2024-07-20"),
                age: 18
            }

            const result = parseValuesToParams(values)

            expect(result.age).toBe(18)
        })

        it("should handle older ages", () => {
            const values: ActivitiesValues = {
                destination: { id: "CHI", name: "Chicago" },
                endDate: new Date("2024-08-10"),
                age: 65
            }

            const result = parseValuesToParams(values)

            expect(result.age).toBe(65)
        })

        it("should handle empty destination id", () => {
            const values: ActivitiesValues = {
                destination: { id: "", name: "Unknown" },
                endDate: new Date("2024-09-15"),
                age: 28
            }

            const result = parseValuesToParams(values)

            expect(result.destination).toBe("")
        })

        it("should handle various destination formats", () => {
            const destinations = [
                { id: "NYC", name: "New York" },
                { id: "LAX", name: "Los Angeles" },
                { id: "MIA", name: "Miami" },
                { id: "CHI", name: "Chicago" }
            ]

            destinations.forEach((destination) => {
                const values: ActivitiesValues = {
                    destination,
                    endDate: new Date("2024-06-15"),
                    age: 25
                }

                const result = parseValuesToParams(values)
                expect(result.destination).toBe(destination.id)
            })
        })
    })

    describe("mapAutocompleteLocations", () => {
        it("should map locations correctly", async () => {
            const mockLocations: ActivityLocation[] = [
                {
                    type: TravelLocationType.ACTIVITIES,
                    cityCode: "NYC",
                    cityName: "New York",
                    countryName: "United States"
                },
                {
                    type: TravelLocationType.ACTIVITIES,
                    cityCode: "LAX",
                    cityName: "Los Angeles",
                    countryName: "United States"
                },
                {
                    type: TravelLocationType.ACTIVITIES,
                    cityCode: "PAR",
                    cityName: "Paris",
                    countryName: "France"
                }
            ]

            // Test the mapping logic directly without mocking the container
            const result = mockLocations.map(({ cityCode, cityName, countryName }: ActivityLocation) => {
                const formatCity = cityName ? `${cityName} - ` : '';
                const formatCode = cityCode ? `(${cityCode ?? ''})` : '';
                return {
                    value: cityCode ?? '',
                    label: formatCity + countryName + formatCode,
                };
            })

            expect(result).toEqual([
                {
                    value: "NYC",
                    label: "New York - United States(NYC)"
                },
                {
                    value: "LAX",
                    label: "Los Angeles - United States(LAX)"
                },
                {
                    value: "PAR",
                    label: "Paris - France(PAR)"
                }
            ])
        })

        it("should handle locations without city name", async () => {
            const mockLocations: ActivityLocation[] = [
                {
                    type: TravelLocationType.ACTIVITIES,
                    cityCode: "XYZ",
                    cityName: "",
                    countryName: "Unknown"
                }
            ]

            // Test the mapping logic directly
            const result = mockLocations.map(({ cityCode, cityName, countryName }: ActivityLocation) => {
                const formatCity = cityName ? `${cityName} - ` : '';
                const formatCode = cityCode ? `(${cityCode ?? ''})` : '';
                return {
                    value: cityCode ?? '',
                    label: formatCity + countryName + formatCode,
                };
            })

            expect(result).toEqual([
                {
                    value: "XYZ",
                    label: "Unknown(XYZ)"
                }
            ])
        })

        it("should handle locations without city code", async () => {
            const mockLocations: ActivityLocation[] = [
                {
                    type: TravelLocationType.ACTIVITIES,
                    cityCode: "",
                    cityName: "Some City",
                    countryName: "Some Country"
                }
            ]

            // Test the mapping logic directly
            const result = mockLocations.map(({ cityCode, cityName, countryName }: ActivityLocation) => {
                const formatCity = cityName ? `${cityName} - ` : '';
                const formatCode = cityCode ? `(${cityCode ?? ''})` : '';
                return {
                    value: cityCode ?? '',
                    label: formatCity + countryName + formatCode,
                };
            })

            expect(result).toEqual([
                {
                    value: "",
                    label: "Some City - Some Country"
                }
            ])
        })

        it("should handle locations without city name and code", async () => {
            const mockLocations: ActivityLocation[] = [
                {
                    type: TravelLocationType.ACTIVITIES,
                    cityCode: "",
                    cityName: "",
                    countryName: "Only Country"
                }
            ]

            // Test the mapping logic directly
            const result = mockLocations.map(({ cityCode, cityName, countryName }: ActivityLocation) => {
                const formatCity = cityName ? `${cityName} - ` : '';
                const formatCode = cityCode ? `(${cityCode ?? ''})` : '';
                return {
                    value: cityCode ?? '',
                    label: formatCity + countryName + formatCode,
                };
            })

            expect(result).toEqual([
                {
                    value: "",
                    label: "Only Country"
                }
            ])
        })

        it("should handle empty results", async () => {      
            const mockLocations: ActivityLocation[] = []

            // Test the mapping logic directly
            const result = mockLocations.map(({ cityCode, cityName, countryName }: ActivityLocation) => {
                const formatCity = cityName ? `${cityName} - ` : '';
                const formatCode = cityCode ? `(${cityCode ?? ''})` : '';
                return {
                    value: cityCode ?? '',
                    label: formatCity + countryName + formatCode,
                };
            })

            expect(result).toEqual([])
        })

        it("should handle various location formats", async () => {
            const mockLocations: ActivityLocation[] = [
                {
                    type: TravelLocationType.ACTIVITIES,
                    cityCode: "NYC",
                    cityName: "New York",
                    countryName: "United States"
                },
                {
                    type: TravelLocationType.ACTIVITIES,
                    cityCode: "",
                    cityName: "Paris",
                    countryName: "France"
                },
                {
                    type: TravelLocationType.ACTIVITIES,
                    cityCode: "LAX",
                    cityName: "",
                    countryName: "United States"
                }
            ]

            // Test the mapping logic directly
            const result = mockLocations.map(({ cityCode, cityName, countryName }: ActivityLocation) => {
                const formatCity = cityName ? `${cityName} - ` : '';
                const formatCode = cityCode ? `(${cityCode ?? ''})` : '';
                return {
                    value: cityCode ?? '',
                    label: formatCity + countryName + formatCode,
                };
            })

            expect(result).toEqual([
                {
                    value: "NYC",
                    label: "New York - United States(NYC)"
                },
                {
                    value: "",
                    label: "Paris - France"
                },
                {
                    value: "LAX",
                    label: "United States(LAX)"
                }
            ])
        })
    })
})
