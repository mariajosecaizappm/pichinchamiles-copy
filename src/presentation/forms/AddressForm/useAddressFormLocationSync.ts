"use client"

import { useCallback, useContext, useEffect, useRef } from "react"
import FormContext from "@/presentation/components/Form/context/FormContext"
import { AutocompleteOption } from "@/presentation/components/Form/controls/FormAutocomplete/FormAutocomplete"

type UseAddressFormLocationSyncParams = {
    onSearchCity: (search: string) => Promise<AutocompleteOption[]>
    onSearchZone: (search: string) => Promise<AutocompleteOption[]>
    onStateChange?: (stateId: string | null) => void
    onCityChange?: (cityId: string | null) => void
    cityOptions?: AutocompleteOption[]
    cityOptionsLoaded?: boolean
    initialCityId?: string | null
    zoneOptions?: AutocompleteOption[]
    zoneOptionsLoaded?: boolean
    initialZoneId?: string | null
}

const CITY_NO_LONGER_AVAILABLE_MESSAGE =
    "La ciudad seleccionada ya no tiene cobertura de entrega. Selecciona otra."
const ZONE_NO_LONGER_AVAILABLE_MESSAGE =
    "La zona seleccionada ya no tiene cobertura de entrega. Selecciona otra."

export const useAddressFormLocationSync = ({
    onSearchCity,
    onSearchZone,
    onStateChange,
    onCityChange,
    cityOptions = [],
    cityOptionsLoaded = false,
    initialCityId = null,
    zoneOptions = [],
    zoneOptionsLoaded = false,
    initialZoneId = null,
}: UseAddressFormLocationSyncParams) => {
    const { values, setFieldValue, setFieldError } = useContext(FormContext)
    const onStateChangeRef = useRef(onStateChange)
    const onCityChangeRef = useRef(onCityChange)
    const prevStateIdRef = useRef<string | null | undefined>(undefined)
    const prevCityIdRef = useRef<string | null | undefined>(undefined)
    const staleCityCheckedRef = useRef(false)
    const staleZoneCheckedRef = useRef(false)

    onStateChangeRef.current = onStateChange
    onCityChangeRef.current = onCityChange

    useEffect(() => {
        const stateId = values.state?.id ?? null

        if (prevStateIdRef.current !== undefined && prevStateIdRef.current !== stateId) {
            setFieldValue("city", null)
            setFieldValue("zone", null)
            setFieldError?.("city", undefined)
            setFieldError?.("zone", undefined)
            onStateChangeRef.current?.(stateId)
        } else if (prevStateIdRef.current === undefined && stateId) {
            onStateChangeRef.current?.(stateId)
        }

        prevStateIdRef.current = stateId
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.state?.id])

    useEffect(() => {
        const cityId = values.city?.id ?? null

        if (prevCityIdRef.current !== undefined && prevCityIdRef.current !== cityId) {
            setFieldValue("zone", null)
            setFieldError?.("zone", undefined)
            onCityChangeRef.current?.(cityId)
        } else if (prevCityIdRef.current === undefined && cityId) {
            onCityChangeRef.current?.(cityId)
        }

        prevCityIdRef.current = cityId
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.city?.id])

    useEffect(() => {
        if (staleCityCheckedRef.current) return
        if (!cityOptionsLoaded) return

        staleCityCheckedRef.current = true

        if (!initialCityId) return

        const isInitialCityStillAvailable = cityOptions.some(
            option => option.value === initialCityId,
        )

        if (!isInitialCityStillAvailable) {
            setFieldValue("city", null)
            setFieldValue("zone", null)
            setFieldError?.("city", CITY_NO_LONGER_AVAILABLE_MESSAGE)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cityOptionsLoaded, cityOptions, initialCityId])

    useEffect(() => {
        if (staleZoneCheckedRef.current) return
        if (!zoneOptionsLoaded) return

        staleZoneCheckedRef.current = true

        if (!initialZoneId) return

        const isInitialZoneStillAvailable = zoneOptions.some(
            option => option.value === initialZoneId,
        )

        if (!isInitialZoneStillAvailable) {
            setFieldValue("zone", null)
            setFieldError?.("zone", ZONE_NO_LONGER_AVAILABLE_MESSAGE)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [zoneOptionsLoaded, zoneOptions, initialZoneId])

    const handleCitySearch = useCallback(
        async (search: string) => {
            if (!values.state?.id) return []
            return onSearchCity(search)
        },
        [onSearchCity, values.state?.id]
    )

    const handleZoneSearch = useCallback(
        async (search: string) => {
            if (!values.state?.id || !values.city?.id) return []
            return onSearchZone(search)
        },
        [onSearchZone, values.city?.id, values.state?.id]
    )

    return {
        isThirdPartyAddress: Boolean(values.isThirdPartyAddress),
        isCityDisabled: !values.state?.id,
        isZoneDisabled: !values.state?.id || !values.city?.id,
        onCityFocus: () => undefined,
        onZoneFocus: () => undefined,
        onSearchCity: handleCitySearch,
        onSearchZone: handleZoneSearch,
    }
}
