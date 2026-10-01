"use client"

import FormInput from "@/presentation/components/Form/controls/FormInput"
import FormAutocomplete from "@/presentation/components/Form/controls/FormAutocomplete"
import { AutocompleteOption } from "@/presentation/components/Form/controls/FormAutocomplete/FormAutocomplete"
import { addressInputRegExp } from "@/presentation/helpers/regexp"
import { phoneInputRegExp } from "@/presentation/helpers/validation"

type BillingFormProps = {
    stateOptions: AutocompleteOption[]
    cityOptions: AutocompleteOption[]
    zoneOptions: AutocompleteOption[]
    onSearchState: (search: string) => Promise<AutocompleteOption[]>
    onSearchCity: (search: string) => Promise<AutocompleteOption[]>
    onSearchZone: (search: string) => Promise<AutocompleteOption[]>
    onCityFocus: () => void
    onZoneFocus: () => void
    isCityDisabled?: boolean
    isZoneDisabled?: boolean
}

const BillingForm = ({
    stateOptions,
    cityOptions,
    zoneOptions,
    onSearchState,
    onSearchCity,
    onSearchZone,
    onCityFocus,
    onZoneFocus,
    isCityDisabled = false,
    isZoneDisabled = false,
}: BillingFormProps) => {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
                name="billingFullName"
                label="Nombre completo"
                isDisabled
                disableAnimation
                readOnly
            />
            <FormInput
                name="billingMaskedDocument"
                label="Documento de identificación"
                isDisabled
                disableAnimation
                readOnly
            />
            <FormInput
                name="customerReceivingEmail"
                label="Correo electrónico"
                placeholder="correo@mail.com"
            />
            <FormInput
                name="customerReceivingPhone"
                label="Número telefónico"
                placeholder="0912345678"
                regExp={phoneInputRegExp}
            />
            <FormInput
                name="street1"
                label="Calle principal"
                placeholder="Calle principal"
                regExp={addressInputRegExp}
            />
            <FormInput
                name="street2"
                label="Calle secundaria"
                placeholder="Calle secundaria"
                regExp={addressInputRegExp}
            />
            <FormAutocomplete
                name="state"
                label="Provincia"
                placeholder="Elige una provincia"
                options={stateOptions}
                onSearch={onSearchState}
                valueAsObject
            />
            <FormAutocomplete
                name="city"
                label="Ciudad"
                placeholder="Elige una ciudad"
                options={cityOptions}
                onSearch={onSearchCity}
                valueAsObject
                onFocus={onCityFocus}
                isDisabled={isCityDisabled}
            />
            <FormInput
                name="number"
                label="Número de dirección"
                placeholder="Número de dirección"
                regExp={addressInputRegExp}
                maxLength={15}
            />
            <FormAutocomplete
                name="zone"
                label="Sector/Zona"
                placeholder="Elige un sector"
                options={zoneOptions}
                onSearch={onSearchZone}
                valueAsObject
                onFocus={onZoneFocus}
                isDisabled={isZoneDisabled}
            />
        </div>
    )
}

export default BillingForm
