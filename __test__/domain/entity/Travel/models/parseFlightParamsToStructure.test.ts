import { describe, it, expect } from "vitest"
import { parseFlightParamsToStructure } from "@/domain/entity/Travel/models/parseFlightParamsToStructure"
import { TripType, CabinType, LegsType, RouteType } from "@/domain/entity/Travel/structure/flight"
import type { FlightParams } from "@/domain/entity/Travel/structure/flight"

const baseParams: FlightParams = {
    tripType: TripType.SINGLE,
    trips: [
        {
            origin: "UIO",
            destination: "GYE",
            startDate: new Date(2024, 5, 15), // 2024-06-15
        },
    ],
    adults: 1,
    childrens: 0,
    infants: 0,
    stops: LegsType.ALL_STOPS,
    class: CabinType.ECONOMY,
    airline: "",
    routeType: RouteType.DOMESTIC,
}

describe("parseFlightParamsToStructure", () => {
    it("should parse a single trip correctly", () => {
        const result = parseFlightParamsToStructure(baseParams)

        expect(result.tripType).toBe(TripType.SINGLE)
        expect(result.schedule).toBe("20240615_UIO_GYE")
        expect(result.cabin).toBe(CabinType.ECONOMY)
        expect(result.legsType).toBe(LegsType.ALL_STOPS)
        expect(result.routeType).toBe(RouteType.DOMESTIC)
        expect(result.adult).toBe("1_adult")
        expect(result.child).toBe("0_child")
        expect(result.infant).toBe("0_infant")
        expect(result.promoCode).toBe("0")
    })

    it("should set airline to 'all' when airline is empty", () => {
        const result = parseFlightParamsToStructure(baseParams)
        expect(result.airline).toBe("all")
    })

    it("should keep airline value when specified", () => {
        const params: FlightParams = { ...baseParams, airline: "LA" }
        const result = parseFlightParamsToStructure(params)
        expect(result.airline).toBe("LA")
    })

    it("should parse a round trip with return date", () => {
        const params: FlightParams = {
            ...baseParams,
            tripType: TripType.ROUND,
            trips: [
                {
                    origin: "UIO",
                    destination: "MIA",
                    startDate: new Date(2024, 5, 15),
                    endDate: new Date(2024, 5, 25),
                },
            ],
        }
        const result = parseFlightParamsToStructure(params)

        expect(result.tripType).toBe(TripType.ROUND)
        expect(result.schedule).toBe("20240615_UIO_MIA-20240625_MIA_UIO")
    })

    it("should parse a multiple-leg trip", () => {
        const params: FlightParams = {
            ...baseParams,
            tripType: TripType.MULTIPLE,
            trips: [
                {
                    origin: "UIO",
                    destination: "BOG",
                    startDate: new Date(2024, 5, 10),
                },
                {
                    origin: "BOG",
                    destination: "MIA",
                    startDate: new Date(2024, 5, 15),
                },
                {
                    origin: "MIA",
                    destination: "UIO",
                    startDate: new Date(2024, 5, 20),
                },
            ],
        }
        const result = parseFlightParamsToStructure(params)

        expect(result.tripType).toBe(TripType.MULTIPLE)
        expect(result.schedule).toBe("20240610_UIO_BOG-20240615_BOG_MIA-20240620_MIA_UIO")
    })

    it("should format passenger counts correctly", () => {
        const params: FlightParams = { ...baseParams, adults: 2, childrens: 1, infants: 1 }
        const result = parseFlightParamsToStructure(params)

        expect(result.adult).toBe("2_adult")
        expect(result.child).toBe("1_child")
        expect(result.infant).toBe("1_infant")
    })

    it("should map class and stops correctly", () => {
        const params: FlightParams = {
            ...baseParams,
            class: CabinType.BUSINESS,
            stops: LegsType.NON_STOP,
            routeType: RouteType.INTERNATIONAL,
        }
        const result = parseFlightParamsToStructure(params)

        expect(result.cabin).toBe(CabinType.BUSINESS)
        expect(result.legsType).toBe(LegsType.NON_STOP)
        expect(result.routeType).toBe(RouteType.INTERNATIONAL)
    })

    it("should zero-pad months in schedule dates", () => {
        const params: FlightParams = {
            ...baseParams,
            trips: [
                {
                    origin: "UIO",
                    destination: "GYE",
                    startDate: new Date(2024, 0, 5), // January 5
                },
            ],
        }
        const result = parseFlightParamsToStructure(params)
        expect(result.schedule).toBe("20240105_UIO_GYE")
    })
})
