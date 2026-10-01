"use client"

import FormInput from "@/presentation/components/Form/controls/FormInput"
import { FormCheckbox } from "@/presentation/components/Form/controls/FormCheckbox"
import FormSelect from "@/presentation/components/Form/controls/FormSelect"
import FormAutocomplete from "@/presentation/components/Form/controls/FormAutocomplete"
import { AutocompleteOption } from "@/presentation/components/Form/controls/FormAutocomplete/FormAutocomplete"
import { addressInputRegExp } from "@/presentation/helpers/regexp"
import { phoneInputRegExp } from "@/presentation/helpers/validation"
import { typesDocuments } from "./typesDocuments"

type AddressFormProps = {
    stateOptions: AutocompleteOption[]
    cityOptions: AutocompleteOption[]
    zoneOptions: AutocompleteOption[]
    isThirdPartyAddress: boolean
    onSearchState: (search: string) => Promise<AutocompleteOption[]>
    onSearchCity: (search: string) => Promise<AutocompleteOption[]>
    onSearchZone: (search: string) => Promise<AutocompleteOption[]>
    onCityFocus: () => void
    onZoneFocus: () => void
    isCityDisabled?: boolean
    isZoneDisabled?: boolean
}

const AddressForm = ({
    stateOptions,
    cityOptions,
    zoneOptions,
    isThirdPartyAddress,
    onSearchState,
    onSearchCity,
    onSearchZone,
    onCityFocus,
    onZoneFocus,
    isCityDisabled = false,
    isZoneDisabled = false,
}: AddressFormProps) => {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
                name="alias"
                label="Nombre de la dirección"
                placeholder="Ej: Casa"
                regExp={addressInputRegExp}
            />
            <FormInput
                name="street1"
                label="Calle principal"
                placeholder="Ej: Espejo"
                regExp={addressInputRegExp}
            />
            <FormInput
                name="street2"
                label="Calle secundaria"
                placeholder="Ej: 10 de agosto"
                regExp={addressInputRegExp}
            />
            <FormAutocomplete
                name="state"
                label="Provincia"
                placeholder="Ej: Pichincha"
                options={stateOptions}
                onSearch={onSearchState}
                valueAsObject
            />
            <FormAutocomplete
                name="city"
                label="Ciudad"
                placeholder="Ej: Quito"
                options={cityOptions}
                onSearch={onSearchCity}
                valueAsObject
                onFocus={onCityFocus}
                isDisabled={isCityDisabled}
            />
            <FormAutocomplete
                name="zone"
                label="Sector/Zona"
                placeholder="Ej: Floresta"
                options={zoneOptions}
                onSearch={onSearchZone}
                valueAsObject
                onFocus={onZoneFocus}
                isDisabled={isZoneDisabled}
            />
            <FormInput
                name="number"
                label="Número de dirección"
                placeholder="Ej: 210"
                regExp={addressInputRegExp}
                maxLength={15}
            />
            <FormInput
                name="secondPhone"
                label="Número telefónico"
                placeholder="Ej: 0951234567"
                regExp={phoneInputRegExp}
            />
            <div className="md:col-span-2">
                <FormInput
                    name="reference"
                    label="Referencia"
                    placeholder="Ej: Frente a la farmacia de color azul"
                    regExp={addressInputRegExp}
                />
            </div>
            <div className="md:col-span-2">
                <FormCheckbox
                    name="isThirdPartyAddress"
                    label="Un tercero recibe el producto"
                />
            </div>
            {isThirdPartyAddress && (
                <>
                    <FormInput
                        name="customerReceivingFirstName"
                        label="Nombres"
                        placeholder="Ej: Juan Andrés"
                        regExp={addressInputRegExp}
                    />
                    <FormInput
                        name="customerReceivingLastName"
                        label="Apellidos"
                        placeholder="Ej: Pérez López"
                        regExp={addressInputRegExp}
                    />
                    <div className="grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-3">
                        <FormSelect
                            name="customerReceivingIdentificationType"
                            label="Tipo de identificación"
                            placeholder="Identificación"
                            options={typesDocuments}
                        />
                        <FormInput
                            name="customerReceivingIdentificationNumber"
                            label="Documento de identificación"
                            placeholder="Ej: 1234567890"
                            regExp={addressInputRegExp}
                        />
                        <FormInput
                            name="customerReceivingPhone"
                            label="Número telefónico"
                            placeholder="Ej: 0987654321"
                            regExp={phoneInputRegExp}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default AddressForm
