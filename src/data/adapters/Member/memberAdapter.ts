import { Member, MemberSecurityUpdate, MemberType, UnformattedMember } from "@/domain/entity/Member/member"

export const capitalize = (word: string) => {
    const wordLowerCase = word.toLowerCase();
    return (
        wordLowerCase.charAt(0).toUpperCase() + wordLowerCase.slice(1).toLowerCase()
    );
};

export const memberInformationAdapter = (unformattedMember: UnformattedMember): Member => {
    if (unformattedMember.memberType === "personal") {
        return {
            memberType: MemberType.PERSONAL,
            acceptLopd: unformattedMember.acceptLopd,
            acceptedTermsAndCondition: unformattedMember.acceptedTermsAndCondition,
            address: unformattedMember.address,
            birthDay: unformattedMember.birthDay,
            city: capitalize(unformattedMember.city),
            country: capitalize(unformattedMember.country),
            cellPhone: unformattedMember.cellPhone,
            enrollmentEmail: unformattedMember.enrollmentEmail,
            gender: unformattedMember.gender,
            state: capitalize(unformattedMember.state),
            identificationNumber: unformattedMember.identification,
            identificationType: unformattedMember.identificationType,
            firstName: unformattedMember.firstName,
            secondName: unformattedMember.secondName,
            firstLastName: unformattedMember.firstLastName,
            secondLastName: unformattedMember.secondLastName,
            phone: unformattedMember.phone,
            registrationDate: new Date(
                unformattedMember.registrationDate
            ).toLocaleDateString("en-GB"),
            segment: "",
        };
    } else {
        const administratorName = [
            unformattedMember.firstNameAdministrator,
            unformattedMember.secondNameAdministrator,
            unformattedMember.firstLastNameAdministrator,
            unformattedMember.secondLastNameAdministrator,
        ]
            .filter((value) => value)
            .join(" ");

        return {
            memberType: MemberType.CORPORATE,
            companyName: unformattedMember.companyName,
            identificationNumber: unformattedMember.identification,
            identificationType: unformattedMember.identificationType,
            firstNameAdministrator: unformattedMember.firstNameAdministrator,
            secondNameAdministrator: unformattedMember.secondNameAdministrator,
            firstLastNameAdministrator: unformattedMember.firstLastNameAdministrator,
            secondLastNameAdministrator:
                unformattedMember.secondLastNameAdministrator,
            address: unformattedMember.address,
            acceptLopd: unformattedMember.acceptLopd,
            acceptedTermsAndCondition: unformattedMember.acceptedTermsAndCondition,
            identificationNumberAdministrator:
                unformattedMember.identificationNumberAdministrator,
            enrollmentEmailAdministrator:
                unformattedMember.enrollmentEmailAdministrator,
            enrollmentEmail: unformattedMember.enrollmentEmail,
            birthDay: unformattedMember.birthDay,
            cellPhone: unformattedMember.cellPhone,
            city: capitalize(unformattedMember.city),
            country: capitalize(unformattedMember.country),
            state: capitalize(unformattedMember.state),
            administratorName,
            registrationDate: new Date(
                unformattedMember.registrationDate
            ).toLocaleDateString("en-GB"),
            segment: "",
        };
    }
};

export const memberOtpInformationAdapter = (memberSecurityUpdate: MemberSecurityUpdate) => {
    const { address, mfaCode, mfaToken } = memberSecurityUpdate
    if (address) {
        const formattedAddress: Record<string, unknown> = {
            reference: address.reference,
            street1: address.street1,
            street2: address.street2,
            number: address.number,
            addressName: address.alias,
            secondPhone: address.secondPhone,
            alias: address.alias,
            isThirdPartyAddress: address.isThirdPartyAddress,
            default: address.default,
            countryLocationId: address.country.id,
            stateLocationId: address.state.id,
            cityLocationId: address.city.id,
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

        if (address.id) {
            formattedAddress.addressId = address.id
        }

        return { address: formattedAddress, mfaCode, mfaToken }
    }

    return memberSecurityUpdate
}