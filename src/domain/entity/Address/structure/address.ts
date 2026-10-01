export interface Address {
    id: string
    alias: string
    street1: string
    street2: string
    country: AddressLocation
    state: AddressLocation
    city: AddressLocation
    zone: AddressLocation
    number: string
    reference: string
    companyName?: string
    isThirdPartyAddress: boolean
    customerReceivingFirstName: string
    customerReceivingLastName: string
    customerReceivingEmail: string
    customerReceivingPhone: string
    customerReceivingIdentificationNumber: string
    customerReceivingIdentificationType: string
    secondPhone: string
    postalCode: string
    default: boolean
    createdAt?: string
}

export type AddressLocation = {
    id: string
    name: string
    grade: string
    parentId: null | string
}
