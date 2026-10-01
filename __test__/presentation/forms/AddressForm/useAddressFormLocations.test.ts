import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { LocationGrade } from "@/domain/entity/Location/structure/location"
import { useAddressFormLocations } from "@/presentation/forms/AddressForm/useAddressFormLocations"

const mocks = vi.hoisted(() => ({
    getLocation: vi.fn(),
    getLocations: vi.fn(),
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: () => ({
            getLocation: mocks.getLocation,
            getLocations: mocks.getLocations,
        }),
    },
}))

const ecuadorCountry = {
    id: "ec-1",
    name: "ECUADOR",
    grade: LocationGrade.COUNTRY,
    parentId: null,
}

const pichinchaState = {
    id: "st-1",
    name: "PICHINCHA",
    grade: LocationGrade.STATE,
    parentId: "ec-1",
}

describe("useAddressFormLocations", () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    it("should load country and state options when country name is provided", async () => {
        mocks.getLocation
            .mockResolvedValueOnce([ecuadorCountry])
            .mockResolvedValueOnce([pichinchaState])

        const { result } = renderHook(() =>
            useAddressFormLocations({
                country: ecuadorCountry,
                stateId: null,
                cityId: null,
            }),
        )

        await waitFor(() => {
            expect(mocks.getLocation).toHaveBeenCalledWith({
                grade: LocationGrade.COUNTRY,
                query: "ECUADOR",
            })
        })

        await waitFor(() => {
            expect(result.current.stateOptions).toEqual([
                {
                    value: "st-1",
                    label: "PICHINCHA",
                    data: { grade: LocationGrade.STATE, parentId: "ec-1" },
                },
            ])
        })

        expect(result.current.country).toEqual({
            id: "ec-1",
            name: "ECUADOR",
            grade: LocationGrade.COUNTRY,
            parentId: null,
        })
    })

    it("should load states by country id when country name is missing", async () => {
        mocks.getLocation.mockResolvedValueOnce([pichinchaState])

        const { result } = renderHook(() =>
            useAddressFormLocations({
                country: { id: "ec-1", name: "", grade: LocationGrade.COUNTRY, parentId: null },
                stateId: null,
                cityId: null,
            }),
        )

        await waitFor(() => {
            expect(mocks.getLocation).toHaveBeenCalledWith({
                grade: LocationGrade.STATE,
                query: "ec-1",
            })
        })

        await waitFor(() => {
            expect(result.current.stateOptions).toHaveLength(1)
        })
    })

    it("should load states with default country when country is missing", async () => {
        mocks.getLocation
            .mockResolvedValueOnce([ecuadorCountry])
            .mockResolvedValueOnce([pichinchaState])

        const { result } = renderHook(() =>
            useAddressFormLocations({
                country: null,
                stateId: null,
                cityId: null,
            }),
        )

        await waitFor(() => {
            expect(mocks.getLocation).toHaveBeenCalledWith({
                grade: LocationGrade.COUNTRY,
                query: "ECUADOR",
            })
        })

        await waitFor(() => {
            expect(result.current.stateOptions).toHaveLength(1)
        })
    })

    it("should fall back to address country when Algolia does not resolve a match", async () => {
        mocks.getLocation
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([pichinchaState])

        const { result } = renderHook(() =>
            useAddressFormLocations({
                country: ecuadorCountry,
                stateId: null,
                cityId: null,
            }),
        )

        await waitFor(() => {
            expect(result.current.country?.id).toBe("ec-1")
        })
    })

    it("should load city options without the delivery filter by default (billing use case)", async () => {
        mocks.getLocation.mockResolvedValue([])
        mocks.getLocations.mockResolvedValue([
            { id: "city-1", name: "QUITO", grade: LocationGrade.CITY, parentId: "st-1" },
        ])

        const { result } = renderHook(() =>
            useAddressFormLocations({
                country: ecuadorCountry,
                stateId: "st-1",
                cityId: null,
            }),
        )

        await waitFor(() => {
            expect(mocks.getLocations).toHaveBeenCalledWith("st-1", LocationGrade.CITY, "")
        })

        await waitFor(() => {
            expect(result.current.cityOptions).toEqual([
                {
                    value: "city-1",
                    label: "QUITO",
                    data: { grade: LocationGrade.CITY, parentId: "st-1" },
                },
            ])
        })
    })

    it("should load city options filtered by delivery when filterLocationsByDelivery is enabled", async () => {
        mocks.getLocation.mockResolvedValue([])
        mocks.getLocations.mockResolvedValue([
            { id: "city-1", name: "QUITO", grade: LocationGrade.CITY, parentId: "st-1" },
        ])

        const { result } = renderHook(() =>
            useAddressFormLocations({
                country: ecuadorCountry,
                stateId: "st-1",
                cityId: null,
                filterLocationsByDelivery: true,
            }),
        )

        await waitFor(() => {
            expect(mocks.getLocations).toHaveBeenCalledWith(
                "st-1",
                LocationGrade.CITY,
                "",
                true,
            )
        })

        await waitFor(() => {
            expect(result.current.cityOptionsLoaded).toBe(true)
        })
    })

    it("should load zone options filtered by delivery when filterLocationsByDelivery is enabled", async () => {
        mocks.getLocation.mockResolvedValue([])
        mocks.getLocations.mockResolvedValue([
            { id: "zone-1", name: "CENTRO", grade: LocationGrade.ZONE, parentId: "city-1" },
        ])

        const { result } = renderHook(() =>
            useAddressFormLocations({
                country: ecuadorCountry,
                stateId: "st-1",
                cityId: "city-1",
                filterLocationsByDelivery: true,
            }),
        )

        await waitFor(() => {
            expect(mocks.getLocations).toHaveBeenCalledWith("city-1", LocationGrade.ZONE, "", true)
        })

        await waitFor(() => {
            expect(result.current.zoneOptions).toEqual([
                {
                    value: "zone-1",
                    label: "CENTRO",
                    data: { grade: LocationGrade.ZONE, parentId: "city-1" },
                },
            ])
        })
    })

    it("should load zone options without the delivery filter by default (billing use case)", async () => {
        mocks.getLocation.mockResolvedValue([])
        mocks.getLocations.mockResolvedValue([
            { id: "zone-1", name: "CENTRO", grade: LocationGrade.ZONE, parentId: "city-1" },
        ])

        renderHook(() =>
            useAddressFormLocations({
                country: ecuadorCountry,
                stateId: "st-1",
                cityId: "city-1",
            }),
        )

        await waitFor(() => {
            expect(mocks.getLocations).toHaveBeenCalledWith("city-1", LocationGrade.ZONE, "")
        })
    })

    it("should mark zoneOptionsLoaded as true once the initial zone fetch resolves", async () => {
        mocks.getLocation.mockResolvedValue([])
        mocks.getLocations.mockResolvedValue([
            { id: "zone-1", name: "CENTRO", grade: LocationGrade.ZONE, parentId: "city-1" },
        ])

        const { result } = renderHook(() =>
            useAddressFormLocations({
                country: ecuadorCountry,
                stateId: "st-1",
                cityId: "city-1",
            }),
        )

        expect(result.current.zoneOptionsLoaded).toBe(false)

        await waitFor(() => {
            expect(result.current.zoneOptionsLoaded).toBe(true)
        })
    })

    it("should keep zoneOptionsLoaded false when there is no city id", async () => {
        mocks.getLocation.mockResolvedValue([])

        const { result } = renderHook(() =>
            useAddressFormLocations({
                country: ecuadorCountry,
                stateId: "st-1",
                cityId: null,
            }),
        )

        expect(result.current.zoneOptionsLoaded).toBe(false)

        await waitFor(() => {
            expect(mocks.getLocation).toHaveBeenCalled()
        })
    })

    it("should search states and update options", async () => {
        mocks.getLocation
            .mockResolvedValueOnce([ecuadorCountry])
            .mockResolvedValueOnce([pichinchaState])
        mocks.getLocations.mockResolvedValue([
            { id: "st-2", name: "GUAYAS", grade: LocationGrade.STATE, parentId: "ec-1" },
        ])

        const { result } = renderHook(() =>
            useAddressFormLocations({
                country: ecuadorCountry,
                stateId: null,
                cityId: null,
            }),
        )

        await waitFor(() => {
            expect(result.current.country).not.toBeNull()
        })

        let options: unknown[] = []
        await act(async () => {
            options = await result.current.searchStates("GUA")
        })

        expect(options).toEqual([
            {
                value: "st-2",
                label: "GUAYAS",
                data: { grade: LocationGrade.STATE, parentId: "ec-1" },
            },
        ])
        expect(mocks.getLocations).toHaveBeenCalledWith("ec-1", LocationGrade.STATE, "GUA")
    })

    it("should search states filtered by delivery when filterLocationsByDelivery is enabled", async () => {
        mocks.getLocation
            .mockResolvedValueOnce([ecuadorCountry])
            .mockResolvedValueOnce([pichinchaState])
        mocks.getLocations.mockResolvedValue([
            { id: "st-2", name: "GUAYAS", grade: LocationGrade.STATE, parentId: "ec-1" },
        ])

        const { result } = renderHook(() =>
            useAddressFormLocations({
                country: ecuadorCountry,
                stateId: null,
                cityId: null,
                filterLocationsByDelivery: true,
            }),
        )

        await waitFor(() => {
            expect(result.current.country).not.toBeNull()
        })

        await act(async () => {
            await result.current.searchStates("GUA")
        })

        expect(mocks.getLocations).toHaveBeenCalledWith(
            "ec-1",
            LocationGrade.STATE,
            "GUA",
            true,
        )
    })

    it("should return empty state options when country resolution fails", async () => {
        mocks.getLocation.mockResolvedValue([])

        const { result } = renderHook(() =>
            useAddressFormLocations({
                country: null,
                stateId: null,
                cityId: null,
            }),
        )

        await waitFor(() => {
            expect(mocks.getLocation).toHaveBeenCalled()
        })

        let options: unknown[] = []
        await act(async () => {
            options = await result.current.searchStates("GUA")
        })

        expect(options).toEqual([])
    })

    it("should return empty city options when state is not selected", async () => {
        mocks.getLocation.mockResolvedValue([])

        const { result } = renderHook(() =>
            useAddressFormLocations({
                country: ecuadorCountry,
                stateId: null,
                cityId: null,
            }),
        )

        await waitFor(() => {
            expect(mocks.getLocation).toHaveBeenCalled()
        })

        let options: unknown[] = []
        await act(async () => {
            options = await result.current.searchCitiesForForm("QUI")
        })

        expect(options).toEqual([])
    })

    it("should search cities when state is selected", async () => {
        mocks.getLocation.mockResolvedValue([])
        mocks.getLocations.mockResolvedValue([
            { id: "city-2", name: "GUAYAQUIL", grade: LocationGrade.CITY, parentId: "st-2" },
        ])

        const { result } = renderHook(() =>
            useAddressFormLocations({
                country: ecuadorCountry,
                stateId: "st-2",
                cityId: null,
            }),
        )

        await waitFor(() => {
            expect(result.current.searchCitiesForForm).toBeDefined()
        })

        let options: unknown[] = []
        await act(async () => {
            options = await result.current.searchCitiesForForm("GUA")
        })

        expect(options).toEqual([
            {
                value: "city-2",
                label: "GUAYAQUIL",
                data: { grade: LocationGrade.CITY, parentId: "st-2" },
            },
        ])
    })

    it("should search cities filtered by delivery when filterLocationsByDelivery is enabled", async () => {
        mocks.getLocation.mockResolvedValue([])
        mocks.getLocations.mockResolvedValue([
            { id: "city-2", name: "GUAYAQUIL", grade: LocationGrade.CITY, parentId: "st-2" },
        ])

        const { result } = renderHook(() =>
            useAddressFormLocations({
                country: ecuadorCountry,
                stateId: "st-2",
                cityId: null,
                filterLocationsByDelivery: true,
            }),
        )

        await waitFor(() => {
            expect(result.current.searchCitiesForForm).toBeDefined()
        })

        await act(async () => {
            await result.current.searchCitiesForForm("GUA")
        })

        expect(mocks.getLocations).toHaveBeenCalledWith(
            "st-2",
            LocationGrade.CITY,
            "GUA",
            true,
        )
    })

    it("should return empty zone options when city is not selected", async () => {
        mocks.getLocation.mockResolvedValue([])

        const { result } = renderHook(() =>
            useAddressFormLocations({
                country: ecuadorCountry,
                stateId: "st-1",
                cityId: null,
            }),
        )

        let options: unknown[] = []
        await act(async () => {
            options = await result.current.searchZonesForForm("NOR")
        })

        expect(options).toEqual([])
    })

    it("should search zones when city is selected", async () => {
        mocks.getLocation.mockResolvedValue([])
        mocks.getLocations.mockResolvedValue([
            { id: "zone-2", name: "NORTE", grade: LocationGrade.ZONE, parentId: "city-1" },
        ])

        const { result } = renderHook(() =>
            useAddressFormLocations({
                country: ecuadorCountry,
                stateId: "st-1",
                cityId: "city-1",
                filterLocationsByDelivery: true,
            }),
        )

        let options: unknown[] = []
        await act(async () => {
            options = await result.current.searchZonesForForm("NOR")
        })

        expect(options).toEqual([
            {
                value: "zone-2",
                label: "NORTE",
                data: { grade: LocationGrade.ZONE, parentId: "city-1" },
            },
        ])
        expect(mocks.getLocations).toHaveBeenCalledWith("city-1", LocationGrade.ZONE, "NOR", true)
    })

    it("should search zones without the delivery filter by default (billing use case)", async () => {
        mocks.getLocation.mockResolvedValue([])
        mocks.getLocations.mockResolvedValue([
            { id: "zone-2", name: "NORTE", grade: LocationGrade.ZONE, parentId: "city-1" },
        ])

        const { result } = renderHook(() =>
            useAddressFormLocations({
                country: ecuadorCountry,
                stateId: "st-1",
                cityId: "city-1",
            }),
        )

        await act(async () => {
            await result.current.searchZonesForForm("NOR")
        })

        expect(mocks.getLocations).toHaveBeenCalledWith("city-1", LocationGrade.ZONE, "NOR")
    })

    it("should reload cities when state changes", async () => {
        mocks.getLocation.mockResolvedValue([])
        mocks.getLocations.mockResolvedValue([])

        const { result } = renderHook(() =>
            useAddressFormLocations({
                country: ecuadorCountry,
                stateId: "st-1",
                cityId: null,
            }),
        )

        await act(async () => {
            result.current.onStateChange("st-2")
        })

        await waitFor(() => {
            expect(mocks.getLocations).toHaveBeenCalledWith("st-2", LocationGrade.CITY, "")
        })
    })

    it("should reload zones when city changes", async () => {
        mocks.getLocation.mockResolvedValue([])
        mocks.getLocations.mockResolvedValue([])

        const { result } = renderHook(() =>
            useAddressFormLocations({
                country: ecuadorCountry,
                stateId: "st-1",
                cityId: "city-1",
                filterLocationsByDelivery: true,
            }),
        )

        await act(async () => {
            result.current.onCityChange("city-2")
        })

        await waitFor(() => {
            expect(mocks.getLocations).toHaveBeenCalledWith("city-2", LocationGrade.ZONE, "", true)
        })
    })

    it("should clear city and zone options when state is cleared", async () => {
        mocks.getLocation.mockResolvedValue([])
        mocks.getLocations.mockResolvedValue([
            { id: "city-1", name: "QUITO", grade: LocationGrade.CITY, parentId: "st-1" },
        ])

        const { result } = renderHook(() =>
            useAddressFormLocations({
                country: ecuadorCountry,
                stateId: "st-1",
                cityId: null,
            }),
        )

        await waitFor(() => {
            expect(result.current.cityOptions.length).toBeGreaterThan(0)
        })

        await act(async () => {
            result.current.onStateChange(null)
        })

        expect(result.current.cityOptions).toEqual([])
        expect(result.current.zoneOptions).toEqual([])
    })
})
