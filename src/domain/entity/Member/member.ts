import { Address } from "../Address/structure/address"

export enum MemberType{
    PERSONAL = "personal",
    CORPORATE = "corporate"
}

export type PersonalMember = {
    acceptLopd: boolean
    acceptedTermsAndCondition: boolean
    cellPhone: string
    enrollmentEmail: string
    firstName: string
    secondName: string
    firstLastName: string
    secondLastName: string
    gender: string
    birthDay: string
    state: string
    city: string
    address: string
    identificationNumber: string
    identificationType: string
    memberType: MemberType.PERSONAL
    phone: string
    country: string
    registrationDate: string
    segment: string
}

export type CorporateMember = {
    companyName: string
    identificationNumber: string
    firstNameAdministrator: string
    secondNameAdministrator?: string
    firstLastNameAdministrator: string
    secondLastNameAdministrator?: string
    administratorName: string
    enrollmentEmail: string
    birthDay: string
    identificationNumberAdministrator: string
    enrollmentEmailAdministrator: string
    address: string
    acceptLopd: boolean
    acceptedTermsAndCondition: boolean
    memberType: MemberType.CORPORATE
    cellPhone: string
    city: string
    country: string
    state: string
    identificationType: string
    registrationDate: string
    segment: string
}

export type Member = PersonalMember | CorporateMember

export type MemberSecurityUpdate = {
    password?: string
    enrollmentEmail?: string
    mfaCode?: string
    mfaToken?: string
    isAddress?: boolean
    address?: Address
    acceptedTermsAndCondition?: boolean
}

export type UnformattedPersonalMember = {
    memberType: "personal"
    acceptLopd: boolean
    acceptedTermsAndCondition: boolean
    address: string
    birthDay: string
    city: string
    country: string
    cellPhone: string
    enrollmentEmail: string
    gender: string
    state: string
    identification: string
    identificationType: string
    firstName: string
    secondName: string
    firstLastName: string
    secondLastName: string
    phone: string
    registrationDate: string
}

export type UnformattedCorporateMember = {
    memberType: "corporate"
    companyName: string
    identification: string
    identificationType: string
    firstNameAdministrator: string
    secondNameAdministrator?: string
    firstLastNameAdministrator: string
    secondLastNameAdministrator?: string
    address: string
    acceptLopd: boolean
    acceptedTermsAndCondition: boolean
    identificationNumberAdministrator: string
    enrollmentEmailAdministrator: string
    enrollmentEmail: string
    birthDay: string
    cellPhone: string
    city: string
    country: string
    state: string
    registrationDate: string
}

export type UnformattedMember = UnformattedPersonalMember | UnformattedCorporateMember
