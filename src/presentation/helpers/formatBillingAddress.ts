import { Address } from "@/domain/entity/Address/structure/address"
import { Member, MemberType } from "@/domain/entity/Member/member"
import { getMemberLastnames, getMemberNames } from "@/presentation/helpers/member"

const getBillingNames = (member: Extract<Member, { memberType: MemberType.PERSONAL }>) => {
    const names = getMemberNames(member)
    const lastnames = getMemberLastnames(member)
    return { names: names.trim(), lastnames: lastnames.trim() }
}

export const formatBillingAddress = (member: Member, shippingAddress: Address): Address => {
    if (member.memberType === MemberType.CORPORATE) {
        return {
            ...shippingAddress,
            companyName: member.companyName,
            customerReceivingFirstName: member.firstNameAdministrator,
            customerReceivingLastName: member.firstLastNameAdministrator,
            customerReceivingEmail: member.enrollmentEmail,
            customerReceivingIdentificationNumber: member.identificationNumber,
            customerReceivingIdentificationType: member.identificationType,
            customerReceivingPhone: member.cellPhone,
        }
    }

    const { names, lastnames } = getBillingNames(member)

    return {
        ...shippingAddress,
        customerReceivingFirstName: names,
        customerReceivingLastName: lastnames,
        customerReceivingEmail: member.enrollmentEmail,
        customerReceivingIdentificationNumber: member.identificationNumber,
        customerReceivingIdentificationType: member.identificationType,
        customerReceivingPhone: member.cellPhone,
    }
}
