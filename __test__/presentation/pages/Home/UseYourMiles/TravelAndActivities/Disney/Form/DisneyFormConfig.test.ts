import { describe, it, expect } from "vitest"
import {
    disneySchema,
    disneyInitialValues,
    parseValuesToParams,
    DisneyValues,
    MIN_DAYS_AHEAD,
} from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Disney/Form/DisneyFormConfig"
import { DisneyParams } from "@/domain/entity/Travel/structure/disney"
import { getMinDate } from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/helpers/dates"

const getValidDisneyDate = () => getMinDate(MIN_DAYS_AHEAD)

describe("DisneyFormConfig", () => {
    describe("disneySchema", () => {
        it("should validate required fields correctly", async () => {
            const validData = {
                date: getValidDisneyDate(),
                adults: 2,
                childrens: 1,
                passengersInfo: "3 Pasajeros",
            }

            await expect(disneySchema.validate(validData)).resolves.toEqual(validData)
        })

        it("should require date field", async () => {
            const invalidData = {
                adults: 2,
                childrens: 1,
                passengersInfo: "3 Pasajeros",
            }

            await expect(disneySchema.validate(invalidData)).rejects.toThrow("Campo requerido")
        })

        it("should require at least 1 adult", async () => {
            const invalidData = {
                date: getValidDisneyDate(),
                adults: 0,
                childrens: 1,
                passengersInfo: "1 Pasajero",
            }

            await expect(disneySchema.validate(invalidData)).rejects.toThrow("Debe haber al menos 1 adulto")
        })

        it("should not allow negative children count", async () => {
            const invalidData = {
                date: getValidDisneyDate(),
                adults: 1,
                childrens: -1,
                passengersInfo: "1 Pasajero",
            }

            await expect(disneySchema.validate(invalidData)).rejects.toThrow("No puede ser negativo")
        })

        it("should accept zero children", async () => {
            const validData = {
                date: getValidDisneyDate(),
                adults: 1,
                childrens: 0,
                passengersInfo: "1 Pasajero",
            }

            await expect(disneySchema.validate(validData)).resolves.toEqual(validData)
        })
    })

    describe("disneyInitialValues", () => {
        it("should have correct initial values", () => {
            expect(disneyInitialValues).toEqual({
                adults: 1,
                childrens: 0,
                date: null,
                passengersInfo: "1 Pasajero",
            })
        })
    })

    describe("parseValuesToParams", () => {
        it("should parse DisneyValues to DisneyParams correctly", () => {
            const values: DisneyValues = {
                adults: 2,
                childrens: 1,
                date: new Date("2024-06-15"),
                passengersInfo: "3 Pasajeros",
            }

            const result = parseValuesToParams(values)

            const expected: DisneyParams = {
                adults: 2,
                childrens: 1,
                date: new Date("2024-06-15"),
            }

            expect(result).toEqual(expected)
        })

        it("should handle null date by using current date", () => {
            const values: DisneyValues = {
                adults: 1,
                childrens: 0,
                date: null,
                passengersInfo: "1 Pasajero",
            }

            const result = parseValuesToParams(values)

            expect(result.adults).toBe(1)
            expect(result.childrens).toBe(0)
            expect(result.date).toBeInstanceOf(Date)
        })

        it("should handle multiple adults and children", () => {
            const values: DisneyValues = {
                adults: 5,
                childrens: 4,
                date: new Date("2024-12-25"),
                passengersInfo: "9 Pasajeros",
            }

            const result = parseValuesToParams(values)

            expect(result.adults).toBe(5)
            expect(result.childrens).toBe(4)
            expect(result.date).toEqual(new Date("2024-12-25"))
        })
    })
})
