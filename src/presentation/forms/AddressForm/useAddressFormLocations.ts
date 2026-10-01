"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Address } from "@/domain/entity/Address/structure/address"
import { LocationGrade } from "@/domain/entity/Location/structure/location"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"
import GetLocationsUseCase from "@/domain/interactors/Location/GetLocationsUseCase"
import { AutocompleteOption } from "@/presentation/components/Form/controls/FormAutocomplete/FormAutocomplete"
import container from "@/presentation/config/inversify.config"
import { getFormAutocompleteOptions } from "./formatData"
import { resolveCountryLocation } from "./resolveCountryLocation"

const getLocationsUseCase = container.get<GetLocationsUseCase>(UseCaseTypes.GetLocationsUseCase)

const DEFAULT_COUNTRY_NAME = "ECUADOR"

export type AddressFormCountryInput = {
    id?: string
    name?: string | null
    grade?: string
    parentId?: string | null
} | null | undefined

const toAddressCountry = (location: {
    id: string
    name?: string | null
    grade?: string
    parentId?: string | null
}): Address["country"] => ({
    id: location.id,
    name: location.name ?? "",
    grade: location.grade ?? LocationGrade.COUNTRY,
    parentId: location.parentId ?? null,
})

type UseAddressFormLocationsParams = {
    country?: AddressFormCountryInput
    stateId?: string | null
    cityId?: string | null
    /**
     * When true, State/Provincia and City/Ciudad searches (and the City
     * cascade load) are restricted to locations with delivery coverage,
     * on top of the existing Zone filtering. Used by the shipping address
     * flow (AddressFormContainer); left off (false) for Billing, which
     * shares this hook but does not care about delivery coverage.
     */
    filterLocationsByDelivery?: boolean
}

export const useAddressFormLocations = ({
    country: addressCountry,
    stateId: addressStateId,
    cityId: addressCityId,
    filterLocationsByDelivery = false,
}: UseAddressFormLocationsParams) => {
    const [country, setCountry] = useState<Address["country"] | null>(() =>
        addressCountry?.id ? toAddressCountry({ ...addressCountry, id: addressCountry.id }) : null,
    )
    const [stateOptions, setStateOptions] = useState<AutocompleteOption[]>([])
    const [cityOptions, setCityOptions] = useState<AutocompleteOption[]>([])
    const [cityOptionsLoaded, setCityOptionsLoaded] = useState(false)
    const [zoneOptions, setZoneOptions] = useState<AutocompleteOption[]>([])
    const [zoneOptionsLoaded, setZoneOptionsLoaded] = useState(false)

    const selectedStateIdRef = useRef<string | null>(addressStateId ?? null)
    const selectedCityIdRef = useRef<string | null>(addressCityId ?? null)

    useEffect(() => {
        selectedStateIdRef.current = addressStateId ?? null
    }, [addressStateId])

    useEffect(() => {
        selectedCityIdRef.current = addressCityId ?? null
    }, [addressCityId])

    const countryId = addressCountry?.id ?? null
    const countryName =
        addressCountry?.name?.trim() || (!countryId ? DEFAULT_COUNTRY_NAME : "")

    useEffect(() => {
        const loadStates = async (resolvedCountry: Address["country"]) => {
            setCountry(resolvedCountry)

            const states = await getLocationsUseCase.getLocation({
                grade: LocationGrade.STATE,
                query: resolvedCountry.id,
            })

            setStateOptions(getFormAutocompleteOptions(states))
        }

        const resolveCountry = async () => {
            if (!countryName) {
                if (!countryId) return
                await loadStates(
                    toAddressCountry({
                        id: countryId,
                        name: addressCountry?.name,
                        grade: addressCountry?.grade,
                        parentId: addressCountry?.parentId,
                    }),
                )
                return
            }

            const countries = await getLocationsUseCase.getLocation({
                grade: LocationGrade.COUNTRY,
                query: countryName,
            })

            const resolvedCountry =
                resolveCountryLocation(countries, countryName) ??
                (countryId
                    ? toAddressCountry({
                        id: countryId,
                        name: addressCountry?.name,
                        grade: addressCountry?.grade,
                        parentId: addressCountry?.parentId,
                    })
                    : null)

            if (!resolvedCountry) return

            await loadStates(resolvedCountry)
        }

        resolveCountry()
    }, [addressCountry?.grade, addressCountry?.name, addressCountry?.parentId, countryId, countryName])

    useEffect(() => {
        if (!addressStateId) return

        getLocationsUseCase
            .getLocations(
                addressStateId,
                LocationGrade.CITY,
                "",
                ...(filterLocationsByDelivery ? ([true] as const) : ([] as const)),
            )
            .then(data => {
                setCityOptions(getFormAutocompleteOptions(data))
                setCityOptionsLoaded(true)
            })
    }, [addressStateId, filterLocationsByDelivery])

    useEffect(() => {
        if (!addressCityId) return

        getLocationsUseCase
            .getLocations(
                addressCityId,
                LocationGrade.ZONE,
                "",
                ...(filterLocationsByDelivery ? ([true] as const) : ([] as const)),
            )
            .then(data => {
                setZoneOptions(getFormAutocompleteOptions(data))
                setZoneOptionsLoaded(true)
            })
    }, [addressCityId, filterLocationsByDelivery])

    const searchStates = useCallback(
        async (search: string) => {
            if (!country) return []

            const data = await getLocationsUseCase.getLocations(
                country.id,
                LocationGrade.STATE,
                search,
                ...(filterLocationsByDelivery ? ([true] as const) : ([] as const)),
            )
            const options = getFormAutocompleteOptions(data)
            setStateOptions(options)
            return options
        },
        [country, filterLocationsByDelivery],
    )

    const searchCities = useCallback(
        async (search: string, stateId: string) => {
            const data = await getLocationsUseCase.getLocations(
                stateId,
                LocationGrade.CITY,
                search,
                ...(filterLocationsByDelivery ? ([true] as const) : ([] as const)),
            )
            const options = getFormAutocompleteOptions(data)
            setCityOptions(options)
            return options
        },
        [filterLocationsByDelivery],
    )

    const searchZones = useCallback(
        async (search: string, cityId: string) => {
            const data = await getLocationsUseCase.getLocations(
                cityId,
                LocationGrade.ZONE,
                search,
                ...(filterLocationsByDelivery ? ([true] as const) : ([] as const)),
            )
            const options = getFormAutocompleteOptions(data)
            setZoneOptions(options)
            return options
        },
        [filterLocationsByDelivery],
    )

    const handleStateChange = useCallback(
        (stateId: string | null) => {
            setCityOptions([])
            setZoneOptions([])

            if (stateId) {
                searchCities("", stateId)
            }
        },
        [searchCities],
    )

    const handleCityChange = useCallback(
        (cityId: string | null) => {
            setZoneOptions([])

            if (cityId) {
                searchZones("", cityId)
            }
        },
        [searchZones],
    )

    const searchCitiesForForm = useCallback(
        async (search: string) => {
            const stateId = selectedStateIdRef.current
            if (!stateId) return []
            return searchCities(search, stateId)
        },
        [searchCities],
    )

    const searchZonesForForm = useCallback(
        async (search: string) => {
            const cityId = selectedCityIdRef.current
            if (!cityId) return []
            return searchZones(search, cityId)
        },
        [searchZones],
    )

    const onStateChange = useCallback(
        (stateId: string | null) => {
            selectedStateIdRef.current = stateId
            handleStateChange(stateId)
        },
        [handleStateChange],
    )

    const onCityChange = useCallback(
        (cityId: string | null) => {
            selectedCityIdRef.current = cityId
            handleCityChange(cityId)
        },
        [handleCityChange],
    )

    return {
        country,
        stateOptions,
        cityOptions,
        cityOptionsLoaded,
        zoneOptions,
        zoneOptionsLoaded,
        searchStates,
        searchCitiesForForm,
        searchZonesForForm,
        onStateChange,
        onCityChange,
    }
}
