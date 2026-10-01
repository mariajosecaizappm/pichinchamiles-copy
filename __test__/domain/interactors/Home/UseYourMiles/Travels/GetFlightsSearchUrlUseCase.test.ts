import { describe, it, expect, vi, beforeEach } from "vitest"
import GetFlightsSearchUrlUseCase from "@/domain/interactors/Home/UseYourMiles/Travels/GetFlightsSearchUrlUseCase"
import { TripType, CabinType, LegsType, RouteType } from "@/domain/entity/Travel/structure/flight"
import type { FlightParams } from "@/domain/entity/Travel/structure/flight"

vi.stubEnv("NEXT_PUBLIC_UV_ANGULAR", "https://ultraviajes.example.com")

const baseParams: FlightParams = {
    tripType: TripType.SINGLE,
    trips: [
        {
            origin: "UIO",
            destination: "GYE",
            startDate: new Date(2024, 5, 15),
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

describe("GetFlightsSearchUrlUseCase", () => {
    let useCase: GetFlightsSearchUrlUseCase

    beforeEach(() => {
        useCase = new GetFlightsSearchUrlUseCase()
    })

    it("should build a single-trip flight URL", () => {
        const url = useCase.execute(baseParams)

        expect(url).toBe(
            "https://ultraviajes.example.com/flights/availability/SINGLE/20240615_UIO_GYE/all/economy/all-stops/domestic/1_adult/0_child/0_infant"
        )
    })

    it("should build a round-trip flight URL", () => {
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
            routeType: RouteType.INTERNATIONAL,
        }
        const url = useCase.execute(params)

        expect(url).toContain("/ROUND/")
        expect(url).toContain("20240615_UIO_MIA-20240625_MIA_UIO")
        expect(url).toContain("/international/")
    })

    it("should build a multi-leg flight URL", () => {
        const params: FlightParams = {
            ...baseParams,
            tripType: TripType.MULTIPLE,
            trips: [
                { origin: "UIO", destination: "BOG", startDate: new Date(2024, 5, 10) },
                { origin: "BOG", destination: "MIA", startDate: new Date(2024, 5, 15) },
            ],
        }
        const url = useCase.execute(params)

        expect(url).toContain("/MULTIPLE/")
        expect(url).toContain("20240610_UIO_BOG-20240615_BOG_MIA")
    })

    it("should include correct passenger counts in URL", () => {
        const params: FlightParams = { ...baseParams, adults: 2, childrens: 1, infants: 1 }
        const url = useCase.execute(params)

        expect(url).toContain("/2_adult/1_child/1_infant")
    })

    it("should use specified airline in URL", () => {
        const params: FlightParams = { ...baseParams, airline: "LA" }
        const url = useCase.execute(params)

        expect(url).toContain("/LA/")
    })

    it("should use 'all' when airline is empty", () => {
        const url = useCase.execute(baseParams)
        expect(url).toContain("/all/")
    })

    it("should include cabin class in URL", () => {
        const params: FlightParams = { ...baseParams, class: CabinType.BUSINESS }
        const url = useCase.execute(params)

        expect(url).toContain("/business/")
    })

    it("should include stops in URL", () => {
        const params: FlightParams = { ...baseParams, stops: LegsType.NON_STOP }
        const url = useCase.execute(params)

        expect(url).toContain("/non-stop/")
    })
})
