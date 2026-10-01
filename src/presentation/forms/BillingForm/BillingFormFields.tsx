"use client"

import { AutocompleteOption } from "@/presentation/components/Form/controls/FormAutocomplete/FormAutocomplete"
import { useAddressFormLocationSync } from "@/presentation/forms/AddressForm/useAddressFormLocationSync"
import BillingForm from "./BillingForm"

export type BillingFormFieldsProps = {
    stateOptions: AutocompleteOption[]
    cityOptions: AutocompleteOption[]
    zoneOptions: AutocompleteOption[]
    onSearchState: (search: string) => Promise<AutocompleteOption[]>
    onSearchCity: (search: string) => Promise<AutocompleteOption[]>
    onSearchZone: (search: string) => Promise<AutocompleteOption[]>
    onStateChange: (stateId: string | null) => void
    onCityChange: (cityId: string | null) => void
}

const BillingFormFields = ({
    stateOptions,
    cityOptions,
    zoneOptions,
    onSearchState,
    onSearchCity,
    onSearchZone,
    onStateChange,
    onCityChange,
}: BillingFormFieldsProps) => {
    const locationSync = useAddressFormLocationSync({
        onSearchCity,
        onSearchZone,
        onStateChange,
        onCityChange,
    })

    return (
        <BillingForm
            stateOptions={stateOptions}
            cityOptions={cityOptions}
            zoneOptions={zoneOptions}
            onSearchState={onSearchState}
            onSearchCity={locationSync.onSearchCity}
            onSearchZone={locationSync.onSearchZone}
            onCityFocus={locationSync.onCityFocus}
            onZoneFocus={locationSync.onZoneFocus}
            isCityDisabled={locationSync.isCityDisabled}
            isZoneDisabled={locationSync.isZoneDisabled}
        />
    )
}

export default BillingFormFields
