import { Address, AddressLocation } from "@/domain/entity/Address/structure/address"
import { Location } from "@/domain/entity/Location/structure/location"
import { AutocompleteOption } from "@/presentation/components/Form/controls/FormAutocomplete/FormAutocomplete"
import { AddressFormValues } from "./AddressFormConfig"

const normalizeString = (value: unknown): string => {
    if (typeof value === "string") return value.trim()
    return ""
}

const locationIdsMatch = (a: AddressLocation | null, b: AddressLocation | null) =>
    (a?.id ?? null) === (b?.id ?? null)

const ADDRESS_SCALAR_FIELDS = [
    "alias",
    "street1",
    "street2",
    "number",
    "reference",
    "secondPhone",
    "isThirdPartyAddress",
    "customerReceivingFirstName",
    "customerReceivingLastName",
    "customerReceivingPhone",
    "customerReceivingIdentificationNumber",
    "customerReceivingIdentificationType",
] as const

export const hasAddressFormChanged = (
    initial: AddressFormValues,
    current: AddressFormValues,
): boolean => {
    for (const field of ADDRESS_SCALAR_FIELDS) {
        const initialValue = initial[field]
        const currentValue = current[field]

        if (typeof initialValue === "boolean" || typeof currentValue === "boolean") {
            if (Boolean(initialValue) !== Boolean(currentValue)) return true
            continue
        }

        if (normalizeString(initialValue) !== normalizeString(currentValue)) return true
    }

    if (!locationIdsMatch(initial.state, current.state)) return true
    if (!locationIdsMatch(initial.city, current.city)) return true
    if (!locationIdsMatch(initial.zone, current.zone)) return true

    return false
}

export const getFormAutocompleteOptions = (data: Location[]): AutocompleteOption[] =>
    data.map(item => ({
        value: item.id,
        label: item.name,
        data: { grade: item.grade, parentId: item.parentId },
    }))

export const addressToFormValues = (address: Address): AddressFormValues => {
    const isThirdPartyAddress = address.isThirdPartyAddress

    return {
        ...address,
        country: address.country,
        state: address.state,
        city: address.city,
        zone: address.zone,
        isThirdPartyAddress,
        ...(!isThirdPartyAddress && {
            customerReceivingFirstName: "",
            customerReceivingLastName: "",
            customerReceivingEmail: "",
            customerReceivingPhone: "",
            customerReceivingIdentificationNumber: "",
            customerReceivingIdentificationType: "",
        }),
    }
}
