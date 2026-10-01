"use client"

import { useCallback, useContext, useRef } from "react"
import { Address } from "@/domain/entity/Address/structure/address"
import Form, { FormRef } from "@/presentation/components/Form/context/Form"
import { ObjectSchema } from "yup"
import FormButton from "@/presentation/components/Form/controls/FormButton"
import FormContext from "@/presentation/components/Form/context/FormContext"
import { AutocompleteOption } from "@/presentation/components/Form/controls/FormAutocomplete/FormAutocomplete"
import AddressForm from "./AddressForm"
import { addressFormValidationSchema, AddressFormValues } from "./AddressFormConfig"
import { hasAddressFormChanged } from "./formatData"
import { useAddressFormLocationSync } from "./useAddressFormLocationSync"
import { useAddressFormLocations } from "./useAddressFormLocations"

const NO_CHANGES_MESSAGE = "No se han realizado cambios"

type AddressFormSubmitButtonProps = {
    saveText: string
    isLoading?: boolean
    isEditMode: boolean
    initialAddress: AddressFormValues
}

const AddressFormSubmitButton = ({
    saveText,
    isLoading = false,
    isEditMode,
    initialAddress,
}: AddressFormSubmitButtonProps) => {
    const { values } = useContext(FormContext)
    const hasChanges = !isEditMode || hasAddressFormChanged(initialAddress, values)

    return (
        <FormButton
            className="h-12 w-full"
            isLoading={isLoading}
            alwaysEnabled
            disabled={isEditMode && !hasChanges}
        >
            {saveText}
        </FormButton>
    )
}

type AddressFormContainerProps = {
    address: AddressFormValues
    onSubmit: (values: AddressFormValues, country: Address["country"]) => Promise<void>
    saveText: string
    isLoading?: boolean
}

type AddressFormFieldsProps = {
    stateOptions: AutocompleteOption[]
    cityOptions: AutocompleteOption[]
    cityOptionsLoaded: boolean
    initialCityId: string | null
    zoneOptions: AutocompleteOption[]
    zoneOptionsLoaded: boolean
    initialZoneId: string | null
    onSearchState: (search: string) => Promise<AutocompleteOption[]>
    onSearchCity: (search: string) => Promise<AutocompleteOption[]>
    onSearchZone: (search: string) => Promise<AutocompleteOption[]>
    onStateChange: (stateId: string | null) => void
    onCityChange: (cityId: string | null) => void
}

const AddressFormFields = ({
    stateOptions,
    cityOptions,
    cityOptionsLoaded,
    initialCityId,
    zoneOptions,
    zoneOptionsLoaded,
    initialZoneId,
    onSearchState,
    onSearchCity,
    onSearchZone,
    onStateChange,
    onCityChange,
}: AddressFormFieldsProps) => {
    const locationSync = useAddressFormLocationSync({
        onSearchCity,
        onSearchZone,
        onStateChange,
        onCityChange,
        cityOptions,
        cityOptionsLoaded,
        initialCityId,
        zoneOptions,
        zoneOptionsLoaded,
        initialZoneId,
    })

    return (
        <AddressForm
            stateOptions={stateOptions}
            cityOptions={cityOptions}
            zoneOptions={zoneOptions}
            isThirdPartyAddress={locationSync.isThirdPartyAddress}
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

const AddressFormContainer = ({
    address,
    onSubmit,
    saveText,
    isLoading = false,
}: AddressFormContainerProps) => {
    const formRef = useRef<FormRef>(null)
    const isEditMode = Boolean(address.id)
    const {
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
    } = useAddressFormLocations({
        country: address.country,
        stateId: address.state?.id,
        cityId: address.city?.id,
        filterLocationsByDelivery: true,
    })

    const handleSubmit = useCallback(
        async (values: AddressFormValues) => {
            if (isEditMode && !hasAddressFormChanged(address, values)) {
                formRef.current?.addAlert(NO_CHANGES_MESSAGE)
                return
            }
            if (!country) return
            await onSubmit(values, country)
        },
        [address, country, isEditMode, onSubmit],
    )

    return (
        <Form<AddressFormValues>
            ref={formRef}
            initialValues={address}
            onSubmit={handleSubmit}
            schema={addressFormValidationSchema as unknown as ObjectSchema<AddressFormValues>}
            formErrorId="addressFormAlert"
            className="flex h-full min-h-0 flex-col"
        >
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-6">
                <div id="addressFormAlert" />
                <AddressFormFields
                    stateOptions={stateOptions}
                    cityOptions={cityOptions}
                    cityOptionsLoaded={cityOptionsLoaded}
                    initialCityId={address.city?.id ?? null}
                    zoneOptions={zoneOptions}
                    zoneOptionsLoaded={zoneOptionsLoaded}
                    initialZoneId={address.zone?.id ?? null}
                    onSearchState={searchStates}
                    onSearchCity={searchCitiesForForm}
                    onSearchZone={searchZonesForForm}
                    onStateChange={onStateChange}
                    onCityChange={onCityChange}
                />
            </div>
            <div className="shrink-0 border-t border-darkGrayishBlue-300 p-6">
                <AddressFormSubmitButton
                    saveText={saveText}
                    isLoading={isLoading}
                    isEditMode={isEditMode}
                    initialAddress={address}
                />
            </div>
        </Form>
    )
}

export default AddressFormContainer
