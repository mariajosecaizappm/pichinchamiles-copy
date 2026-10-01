import { describe, it, expect } from "vitest"
import {
    parseValuesToParams,
    flightsSchema,
    flightsInitialValues,
    createDefaultTrip,
    MIN_DAYS_AHEAD,
    FlightsValues,
    Trip,
} from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form/FlightsFormConfig"
import {
    CabinType,
    LegsType,
    RouteType,
    TripType,
} from "@/domain/entity/Travel/structure/flight"

const makeFutureDate = (daysAhead: number): Date => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + daysAhead)
    return d
}

const makeTrip = (overrides: Partial<Trip> = {}): Trip => ({
    id: "trip-1",
    origin: { id: "UIO", name: "Quito", countryCode: "EC" },
    destination: { id: "GYE", name: "Guayaquil", countryCode: "EC" },
    startDate: makeFutureDate(MIN_DAYS_AHEAD + 1),
    ...overrides,
})

const makeValues = (overrides: Partial<FlightsValues> = {}): FlightsValues => ({
    flightTravelType: TripType.SINGLE,
    oneWayTrip: makeTrip(),
    multidestinationTrips: [],
    showAdvancedOptions: false,
    passengersInfo: "1 Pasajero",
    adults: 1,
    childrens: 0,
    infants: 0,
    stops: LegsType.ALL_STOPS,
    class: CabinType.ANY,
    airline: "all",
    ...overrides,
})

describe("FlightsFormConfig", () => {
    describe("createDefaultTrip", () => {
        it("should return a trip with null origin, destination, and startDate", () => {
            const trip = createDefaultTrip()
            expect(trip.origin).toBeNull()
            expect(trip.destination).toBeNull()
            expect(trip.startDate).toBeNull()
            expect(trip.id).toBeDefined()
            expect(typeof trip.id).toBe("string")
        })

        it("should generate unique ids for each call", () => {
            const trip1 = createDefaultTrip()
            const trip2 = createDefaultTrip()
            expect(trip1.id).not.toBe(trip2.id)
        })
    })

    describe("flightsInitialValues", () => {
        it("should have expected default values", () => {
            expect(flightsInitialValues.flightTravelType).toBe(TripType.ROUND)
            expect(flightsInitialValues.adults).toBe(1)
            expect(flightsInitialValues.childrens).toBe(0)
            expect(flightsInitialValues.infants).toBe(0)
            expect(flightsInitialValues.stops).toBe(LegsType.ALL_STOPS)
            expect(flightsInitialValues.class).toBe(CabinType.ANY)
            expect(flightsInitialValues.airline).toBe("all")
            expect(flightsInitialValues.showAdvancedOptions).toBe(false)
            expect(flightsInitialValues.passengersInfo).toBe("1 Pasajero")
        })

        it("should have oneWayTrip with endDate null", () => {
            expect(flightsInitialValues.oneWayTrip.endDate).toBeNull()
        })

        it("should have one default trip in multidestinationTrips", () => {
            expect(flightsInitialValues.multidestinationTrips).toHaveLength(1)
        })
    })

    describe("parseValuesToParams", () => {
        it("should map a SINGLE trip correctly", () => {
            const values = makeValues({ flightTravelType: TripType.SINGLE })
            const result = parseValuesToParams(values)

            expect(result.tripType).toBe(TripType.SINGLE)
            expect(result.trips).toHaveLength(1)
            expect(result.trips[0].origin).toBe("UIO")
            expect(result.trips[0].destination).toBe("GYE")
            expect(result.adults).toBe(1)
            expect(result.childrens).toBe(0)
            expect(result.infants).toBe(0)
            expect(result.stops).toBe(LegsType.ALL_STOPS)
            expect(result.class).toBe(CabinType.ANY)
            expect(result.airline).toBe("all")
        })

        it("should map a ROUND trip correctly", () => {
            const endDate = makeFutureDate(MIN_DAYS_AHEAD + 5)
            const values = makeValues({
                flightTravelType: TripType.ROUND,
                oneWayTrip: makeTrip({ endDate }),
            })
            const result = parseValuesToParams(values)

            expect(result.tripType).toBe(TripType.ROUND)
            expect(result.trips).toHaveLength(1)
            expect(result.trips[0].endDate).toEqual(endDate)
        })

        it("should add multidestination trips for MULTIPLE type", () => {
            const values = makeValues({
                flightTravelType: TripType.MULTIPLE,
                multidestinationTrips: [
                    makeTrip({
                        id: "multi-1",
                        origin: { id: "BOG", name: "Bogotá", countryCode: "CO" },
                        destination: { id: "MDE", name: "Medellín", countryCode: "CO" },
                        startDate: makeFutureDate(MIN_DAYS_AHEAD + 3),
                    }),
                ],
            })
            const result = parseValuesToParams(values)

            expect(result.trips).toHaveLength(2)
            expect(result.trips[1].origin).toBe("BOG")
            expect(result.trips[1].destination).toBe("MDE")
        })

        it("should use empty string when origin/destination is null in multidestination", () => {
            const values = makeValues({
                flightTravelType: TripType.MULTIPLE,
                multidestinationTrips: [
                    makeTrip({
                        id: "multi-1",
                        origin: null,
                        destination: null,
                    }),
                ],
            })
            const result = parseValuesToParams(values)

            expect(result.trips[1].origin).toBe("")
            expect(result.trips[1].destination).toBe("")
        })

        it("should use empty string when oneWayTrip origin/destination is null", () => {
            const values = makeValues({
                oneWayTrip: makeTrip({ origin: null, destination: null }),
            })
            const result = parseValuesToParams(values)

            expect(result.trips[0].origin).toBe("")
            expect(result.trips[0].destination).toBe("")
        })

        it("should return DOMESTIC route when origin and destination have the same country code", () => {
            const values = makeValues({
                oneWayTrip: makeTrip({
                    origin: { id: "UIO", name: "Quito", countryCode: "EC" },
                    destination: { id: "GYE", name: "Guayaquil", countryCode: "EC" },
                }),
            })
            const result = parseValuesToParams(values)
            expect(result.routeType).toBe(RouteType.DOMESTIC)
        })

        it("should return INTERNATIONAL route when origin and destination have different country codes", () => {
            const values = makeValues({
                oneWayTrip: makeTrip({
                    origin: { id: "UIO", name: "Quito", countryCode: "EC" },
                    destination: { id: "BOG", name: "Bogotá", countryCode: "CO" },
                }),
            })
            const result = parseValuesToParams(values)
            expect(result.routeType).toBe(RouteType.INTERNATIONAL)
        })

        it("should return DOMESTIC route when origin country code is undefined", () => {
            const values = makeValues({
                oneWayTrip: makeTrip({
                    origin: { id: "UIO", name: "Quito", countryCode: undefined },
                    destination: { id: "BOG", name: "Bogotá", countryCode: "CO" },
                }),
            })
            const result = parseValuesToParams(values)
            expect(result.routeType).toBe(RouteType.DOMESTIC)
        })

        it("should return DOMESTIC route when destination country code is undefined", () => {
            const values = makeValues({
                oneWayTrip: makeTrip({
                    origin: { id: "UIO", name: "Quito", countryCode: "EC" },
                    destination: { id: "BOG", name: "Bogotá", countryCode: undefined },
                }),
            })
            const result = parseValuesToParams(values)
            expect(result.routeType).toBe(RouteType.DOMESTIC)
        })

        it("should fallback to new Date() when startDate is null in multidestination trip", () => {
            const values = makeValues({
                flightTravelType: TripType.MULTIPLE,
                multidestinationTrips: [
                    makeTrip({ id: "multi-1", startDate: null }),
                ],
            })
            const result = parseValuesToParams(values)
            expect(result.trips[1].startDate).toBeInstanceOf(Date)
        })

        it("should pass passenger counts correctly", () => {
            const values = makeValues({
                adults: 3,
                childrens: 2,
                infants: 1,
            })
            const result = parseValuesToParams(values)
            expect(result.adults).toBe(3)
            expect(result.childrens).toBe(2)
            expect(result.infants).toBe(1)
        })
    })

    describe("flightsSchema validation", () => {
        it("should fail when flightTravelType is undefined", async () => {
            const values = makeValues({ flightTravelType: undefined })
            await expect(flightsSchema.validate(values)).rejects.toThrow()
        })

        it("should pass with valid SINGLE trip values", async () => {
            const values = makeValues({ flightTravelType: TripType.SINGLE })
            const result = await flightsSchema.validate(values)
            expect(result.flightTravelType).toBe(TripType.SINGLE)
        })

        it("should fail when oneWayTrip origin is missing", async () => {
            const values = makeValues({
                oneWayTrip: makeTrip({ origin: undefined }),
            })
            await expect(flightsSchema.validate(values)).rejects.toThrow()
        })

        it("should fail when oneWayTrip destination is missing", async () => {
            const values = makeValues({
                oneWayTrip: makeTrip({ destination: undefined }),
            })
            await expect(flightsSchema.validate(values)).rejects.toThrow()
        })

        it("should fail when startDate is before min date", async () => {
            const values = makeValues({
                oneWayTrip: makeTrip({ startDate: new Date("2020-01-01") }),
            })
            await expect(flightsSchema.validate(values)).rejects.toThrow()
        })

        it("should fail for ROUND trip when endDate is missing", async () => {
            const values = makeValues({
                flightTravelType: TripType.ROUND,
                oneWayTrip: makeTrip({ endDate: undefined }),
            })
            await expect(flightsSchema.validate(values)).rejects.toThrow()
        })

        it("should fail for ROUND trip when endDate is before startDate", async () => {
            const startDate = makeFutureDate(MIN_DAYS_AHEAD + 5)
            const endDate = makeFutureDate(MIN_DAYS_AHEAD + 1)
            const values = makeValues({
                flightTravelType: TripType.ROUND,
                oneWayTrip: makeTrip({ startDate, endDate }),
            })
            await expect(flightsSchema.validate(values)).rejects.toThrow()
        })

        it("should pass for ROUND trip with valid endDate after startDate", async () => {
            const startDate = makeFutureDate(MIN_DAYS_AHEAD + 1)
            const endDate = makeFutureDate(MIN_DAYS_AHEAD + 5)
            const values = makeValues({
                flightTravelType: TripType.ROUND,
                oneWayTrip: makeTrip({ startDate, endDate }),
            })
            const result = await flightsSchema.validate(values)
            expect(result.flightTravelType).toBe(TripType.ROUND)
        })

        it("should fail for MULTIPLE trip when multidestination date is before base startDate", async () => {
            const baseStartDate = makeFutureDate(MIN_DAYS_AHEAD + 5)
            const multiStartDate = makeFutureDate(MIN_DAYS_AHEAD + 1)
            const values = makeValues({
                flightTravelType: TripType.MULTIPLE,
                oneWayTrip: makeTrip({ startDate: baseStartDate }),
                multidestinationTrips: [
                    makeTrip({ id: "multi-1", startDate: multiStartDate }),
                ],
            })
            await expect(flightsSchema.validate(values, { abortEarly: false })).rejects.toThrow()
        })

        it("should fail for MULTIPLE trip when second trip date is not after first trip date", async () => {
            const baseStartDate = makeFutureDate(MIN_DAYS_AHEAD + 1)
            const sameDate = makeFutureDate(MIN_DAYS_AHEAD + 3)
            const values = makeValues({
                flightTravelType: TripType.MULTIPLE,
                oneWayTrip: makeTrip({ startDate: baseStartDate }),
                multidestinationTrips: [
                    makeTrip({ id: "multi-1", startDate: sameDate }),
                    makeTrip({ id: "multi-2", startDate: sameDate }),
                ],
            })
            await expect(flightsSchema.validate(values, { abortEarly: false })).rejects.toThrow()
        })

        it("should pass for MULTIPLE trip with chronologically ordered dates", async () => {
            const baseStartDate = makeFutureDate(MIN_DAYS_AHEAD + 1)
            const values = makeValues({
                flightTravelType: TripType.MULTIPLE,
                oneWayTrip: makeTrip({ startDate: baseStartDate }),
                multidestinationTrips: [
                    makeTrip({ id: "multi-1", startDate: makeFutureDate(MIN_DAYS_AHEAD + 3) }),
                    makeTrip({ id: "multi-2", startDate: makeFutureDate(MIN_DAYS_AHEAD + 5) }),
                ],
            })
            const result = await flightsSchema.validate(values)
            expect(result.flightTravelType).toBe(TripType.MULTIPLE)
        })

        it("should pass for MULTIPLE when multidestinationTrips is empty", async () => {
            const values = makeValues({
                flightTravelType: TripType.MULTIPLE,
                multidestinationTrips: [],
            })
            const result = await flightsSchema.validate(values)
            expect(result.flightTravelType).toBe(TripType.MULTIPLE)
        })

        it("should pass multidestination validation when oneWayTrip startDate is null", async () => {
            const values = makeValues({
                flightTravelType: TripType.MULTIPLE,
                oneWayTrip: makeTrip({ startDate: null }),
                multidestinationTrips: [
                    makeTrip({ id: "multi-1", startDate: makeFutureDate(MIN_DAYS_AHEAD + 3) }),
                ],
            })
            // startDate itself will fail, but the ordered-start-dates test should pass
            // We test that the ordered-start-dates validation returns true when baseDate is undefined
            try {
                await flightsSchema.validate(values, { abortEarly: false })
            } catch (err: unknown) {
                // The error should be about startDate being required, not about ordering
                const yupErr = err as { errors: string[] }
                expect(yupErr.errors.some((m: string) => m.includes("cronológicamente"))).toBe(false)
            }
        })
    })
})
