import { Address } from "@/domain/entity/Address/structure/address"

type AddressEntity = Record<string, unknown> & {
    countryLocation: Record<string, unknown>
    stateLocation: Record<string, unknown>
    cityLocation: Record<string, unknown>
    zoneLocation: Record<string, unknown>
}

export const getAddressesAdapter = (entities: AddressEntity[]): Address[] => {
    return entities.map(entity => ({
        id: entity.id as string,
        alias: entity.alias as string,
        street1: entity.street1 as string,
        street2: entity.street2 as string,
        country: mapLocation(entity.countryLocation),
        state: mapLocation(entity.stateLocation),
        city: mapLocation(entity.cityLocation),
        zone: mapLocation(entity.zoneLocation),
        number: entity.number as string,
        reference: entity.reference as string,
        isThirdPartyAddress: entity.isThirdPartyAddress as boolean,
        customerReceivingFirstName: entity.customerReceivingFirstName as string,
        customerReceivingLastName: entity.customerReceivingLastName as string,
        customerReceivingEmail: entity.customerReceivingEmail as string,
        customerReceivingPhone: entity.customerReceivingPhone as string,
        customerReceivingIdentificationNumber: entity.customerReceivingIdentificationNumber as string,
        customerReceivingIdentificationType: entity.customerReceivingIdentificationType as string,
        secondPhone: (entity.secondPhone as string | null) ?? "",
        postalCode: entity.postalCode as string,
        default: entity.default as boolean,
        createdAt: (entity.createdAt as string | undefined) ?? undefined,
    }))
}

const mapLocation = (location: Record<string, unknown>) => ({
    id: location.id as string,
    name: location.name as string,
    grade: location.grade as string,
    parentId: location.parentId as null | string,
})

export const updateAddressAdapter = (address: Address) => {
    const formattedAddress: Record<string, unknown> = {
        reference: address.reference,
        street1: address.street1,
        street2: address.street2,
        number: address.number,
        secondPhone: address.secondPhone,
        alias: address.alias,
        isThirdPartyAddress: address.isThirdPartyAddress,
        default: address.default,
        countryLocationID: address.country.id,
        stateLocationID: address.state.id,
        cityLocationID: address.city.id,
        zoneLocationId: address.zone.id,
    }

    if (address.isThirdPartyAddress) {
        formattedAddress.customerReceivingFirstName = address.customerReceivingFirstName
        formattedAddress.customerReceivingLastName = address.customerReceivingLastName
        formattedAddress.customerReceivingEmail = address.customerReceivingEmail
        formattedAddress.customerReceivingPhone = address.customerReceivingPhone
        formattedAddress.customerReceivingIdentificationNumber =
            address.customerReceivingIdentificationNumber
        formattedAddress.customerReceivingIdentificationType =
            address.customerReceivingIdentificationType
    }

    return formattedAddress
}
