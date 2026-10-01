import { describe, it, expect } from "vitest"
import {
    carsInitialValues,
    carsSchema,
    getMinPickUpDate,
    MIN_DAYS_AHEAD,
    parseValuesToParams,
    type CarsValues,
} from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Cars/Form/CarsFormConfig"

const makeFutureDate = (daysAhead: number, hour = 10, minute = 0): Date => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + daysAhead)
    d.setHours(hour, minute, 0, 0)
    return d
}

const makeValues = (overrides: Partial<CarsValues> = {}): CarsValues => ({
    pickUpLocation: { id: "UIO", name: "Quito" },
    pickUpDateTime: makeFutureDate(MIN_DAYS_AHEAD + 1, 10, 0),
    returnDateTime: makeFutureDate(MIN_DAYS_AHEAD + 3, 11, 0),
    showDifferentDestination: false,
    dropOffLocation: null,
    ...overrides,
})

describe("CarsFormConfig", () => {
    describe("carsInitialValues", () => {
        it("should expose null defaults and showDifferentDestination=false", () => {
            expect(carsInitialValues).toEqual({
                pickUpLocation: null,
                pickUpDateTime: null,
                returnDateTime: null,
                showDifferentDestination: false,
                dropOffLocation: null,
            })
        })
    })

    describe("getMinPickUpDate", () => {
        it("should return today + MIN_DAYS_AHEAD at midnight", () => {
            const min = getMinPickUpDate()
            const expected = new Date()
            expected.setHours(0, 0, 0, 0)
            expected.setDate(expected.getDate() + MIN_DAYS_AHEAD)

            expect(min.getTime()).toBe(expected.getTime())
            expect(min.getHours()).toBe(0)
            expect(min.getMinutes()).toBe(0)
        })
    })

    describe("parseValuesToParams", () => {
        it("should map ids and dates when same destination is used", () => {
            const values = makeValues()
            const result = parseValuesToParams(values)

            expect(result.pickUpLocation).toBe("UIO")
            expect(result.dropOffLocation).toBe("UIO")
            expect(result.pickUpDate).toBe(values.pickUpDateTime)
            expect(result.pickUpTime).toBe(values.pickUpDateTime)
            expect(result.dropOffDate).toBe(values.returnDateTime)
            expect(result.dropOffTime).toBe(values.returnDateTime)
        })

        it("should use dropOffLocation when showDifferentDestination is true", () => {
            const values = makeValues({
                showDifferentDestination: true,
                dropOffLocation: { id: "GYE", name: "Guayaquil" },
            })
            const result = parseValuesToParams(values)

            expect(result.pickUpLocation).toBe("UIO")
            expect(result.dropOffLocation).toBe("GYE")
        })

        it("should fallback dropOffLocation to empty string when showDifferentDestination=true and dropOff is null", () => {
            const values = makeValues({
                showDifferentDestination: true,
                dropOffLocation: null,
            })
            const result = parseValuesToParams(values)

            expect(result.dropOffLocation).toBe("")
        })

        it("should fallback locations to empty string and dates to current date when nullish", () => {
            const values: CarsValues = {
                pickUpLocation: null,
                pickUpDateTime: null,
                returnDateTime: null,
                showDifferentDestination: false,
                dropOffLocation: null,
            }
            const result = parseValuesToParams(values)

            expect(result.pickUpLocation).toBe("")
            expect(result.dropOffLocation).toBe("")
            expect(result.pickUpDate).toBeInstanceOf(Date)
            expect(result.dropOffDate).toBeInstanceOf(Date)
        })
    })

    describe("carsSchema validation", () => {
        it("should pass with valid values", async () => {
            await expect(carsSchema.validate(makeValues())).resolves.toBeDefined()
        })

        it("should fail when pickUpLocation is null", async () => {
            await expect(
                carsSchema.validate(makeValues({ pickUpLocation: null })),
            ).rejects.toThrow(/lugar de recogida/i)
        })

        it("should fail when pickUpDateTime is before MIN_DAYS_AHEAD", async () => {
            await expect(
                carsSchema.validate(
                    makeValues({ pickUpDateTime: makeFutureDate(MIN_DAYS_AHEAD - 1) }),
                ),
            ).rejects.toThrow(/al menos .* d[ií]as/i)
        })

        it("should fail when returnDateTime is before pickUpDateTime", async () => {
            const pickUp = makeFutureDate(MIN_DAYS_AHEAD + 5, 10, 0)
            const ret = makeFutureDate(MIN_DAYS_AHEAD + 2, 10, 0)
            await expect(
                carsSchema.validate(makeValues({ pickUpDateTime: pickUp, returnDateTime: ret })),
            ).rejects.toThrow(/posterior/i)
        })

        it("should fail when showDifferentDestination=true and dropOffLocation is null", async () => {
            await expect(
                carsSchema.validate(
                    makeValues({ showDifferentDestination: true, dropOffLocation: null }),
                ),
            ).rejects.toThrow(/lugar de devoluci[oó]n/i)
        })

        it("should pass when showDifferentDestination=false even if dropOffLocation is null", async () => {
            await expect(
                carsSchema.validate(
                    makeValues({ showDifferentDestination: false, dropOffLocation: null }),
                ),
            ).resolves.toBeDefined()
        })
    })
})
