"use client"

import { forwardRef, useMemo } from "react"
import { Address } from "@/domain/entity/Address/structure/address"
import Form, { FormRef } from "@/presentation/components/Form/context/Form"
import { ObjectSchema } from "yup"
import { useAddressFormLocations } from "@/presentation/forms/AddressForm/useAddressFormLocations"
import BillingFormFields from "./BillingFormFields"
import {
    addressToBillingFormValues,
    billingFormValidationSchema,
    BillingFormValues,
} from "./BillingFormConfig"

type BillingFormContainerProps = {
    billingAddress: Address
    fullName: string
    maskedDocument: string
    onSubmit: (address: Address) => void
}

const BillingFormContainer = forwardRef<FormRef, BillingFormContainerProps>(
    ({ billingAddress, fullName, maskedDocument, onSubmit }, ref) => {
        const initialValues = useMemo(
            () =>
                addressToBillingFormValues(billingAddress, {
                    billingFullName: fullName,
                    billingMaskedDocument: maskedDocument,
                }),
            [billingAddress, fullName, maskedDocument],
        )

        const {
            stateOptions,
            cityOptions,
            zoneOptions,
            searchStates,
            searchCitiesForForm,
            searchZonesForForm,
            onStateChange,
            onCityChange,
        } = useAddressFormLocations({
            country: billingAddress.country,
            stateId: billingAddress.state?.id,
            cityId: billingAddress.city?.id,
        })

        const handleSubmit = async (values: BillingFormValues) => {
            const {
                billingFullName: _billingFullName,
                billingMaskedDocument: _billingMaskedDocument,
                ...editableValues
            } = values

            const updatedAddress: Address = {
                ...billingAddress,
                ...editableValues,
                state: values.state ?? billingAddress.state,
                city: values.city ?? billingAddress.city,
                zone: values.zone ?? billingAddress.zone,
            }
            onSubmit(updatedAddress)
        }

        return (
            <Form<BillingFormValues>
                ref={ref}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                schema={billingFormValidationSchema as unknown as ObjectSchema<BillingFormValues>}
                className="flex flex-col"
            >
                <BillingFormFields
                    stateOptions={stateOptions}
                    cityOptions={cityOptions}
                    zoneOptions={zoneOptions}
                    onSearchState={searchStates}
                    onSearchCity={searchCitiesForForm}
                    onSearchZone={searchZonesForForm}
                    onStateChange={onStateChange}
                    onCityChange={onCityChange}
                />
            </Form>
        )
    },
)

BillingFormContainer.displayName = "BillingFormContainer"

export default BillingFormContainer
