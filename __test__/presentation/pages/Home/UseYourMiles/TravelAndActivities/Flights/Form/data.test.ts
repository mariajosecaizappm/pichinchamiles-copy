import { describe, it, expect } from "vitest"
import {
    flightTravelTypes,
    stopOptions,
    classes,
    airlines,
    maxPassengers,
    maxAdultsPassengers,
    maxChildrenPassegengers,
    maxInfantsPassengers,
} from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form/data"
import { CabinType, LegsType } from "@/domain/entity/Travel/structure/flight"

describe("Flights Form data", () => {
    describe("flightTravelTypes", () => {
        it("should contain 3 travel types", () => {
            expect(flightTravelTypes).toHaveLength(3)
        })

        it("should include ROUND, SINGLE, and MULTIPLE", () => {
            const ids = flightTravelTypes.map((t) => t.id)
            expect(ids).toContain("ROUND")
            expect(ids).toContain("SINGLE")
            expect(ids).toContain("MULTIPLE")
        })
    })

    describe("stopOptions", () => {
        it("should contain 4 stop options", () => {
            expect(stopOptions).toHaveLength(4)
        })

        it("should include all LegsType values", () => {
            const ids = stopOptions.map((s) => s.id)
            expect(ids).toContain(LegsType.ALL_STOPS)
            expect(ids).toContain(LegsType.NON_STOP)
            expect(ids).toContain(LegsType.ONE_STOP)
            expect(ids).toContain(LegsType.SECOND_STOP)
        })
    })

    describe("classes", () => {
        it("should contain 4 class options", () => {
            expect(classes).toHaveLength(4)
        })

        it("should include key CabinType values", () => {
            const ids = classes.map((c) => c.id)
            expect(ids).toContain(CabinType.ANY)
            expect(ids).toContain(CabinType.ECONOMY)
            expect(ids).toContain(CabinType.BUSINESS)
            expect(ids).toContain(CabinType.FIRST)
        })
    })

    describe("airlines", () => {
        it("should contain more than 100 airlines", () => {
            expect(airlines.length).toBeGreaterThan(100)
        })

        it("should have 'all' as the first option", () => {
            expect(airlines[0].id).toBe("all")
            expect(airlines[0].name).toBe("Todas")
        })

        it("should have unique ids", () => {
            const ids = airlines.map((a) => a.id)
            const uniqueIds = new Set(ids)
            expect(uniqueIds.size).toBe(ids.length)
        })
    })

    describe("passenger limits", () => {
        it("should have maxPassengers set to 7", () => {
            expect(maxPassengers).toBe(7)
        })

        it("should have maxAdultsPassengers set to 7", () => {
            expect(maxAdultsPassengers).toBe(7)
        })

        it("should have maxChildrenPassegengers set to 5", () => {
            expect(maxChildrenPassegengers).toBe(5)
        })

        it("should have maxInfantsPassengers set to 7", () => {
            expect(maxInfantsPassengers).toBe(7)
        })
    })
})
