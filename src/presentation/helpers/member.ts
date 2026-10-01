import { Member, MemberType, PersonalMember } from "@/domain/entity/Member/member";
import { toTitleCase } from "@/presentation/helpers/text";

export const LIMIT_MASKED_PHONE = 3
export const LIMIT_MASKED_EMAIL = 3
export const LIMIT_MASKED_IDENTIFICATION = 3
export const LIMIT_MASKED_EMAIL_LOCAL_PREFIX = 1
export const LIMIT_MASKED_EMAIL_LOCAL_SUFFIX = 1

export const maskedData = (data: string | null | undefined, init: number, finish: number, all?: boolean) => {

    if (all) {
        return data?.slice(0, data.length).replace(/./g, "*") || ""
    }

    const value = data ?? ""
    return value.slice(0, init) + value.slice(init, -finish).replace(/./g, '*') + value.slice(-finish)
}

export const maskedEmailUsername = (username: string | null | undefined) =>
    maskedData(username, LIMIT_MASKED_EMAIL_LOCAL_PREFIX, LIMIT_MASKED_EMAIL_LOCAL_SUFFIX)

export const maskedEmail = (email: string | null | undefined) => {
    if (!email) {
        return ""
    }

    if (email.includes("@")) {
        const [username, domain] = email.split("@")
        return `${maskedEmailUsername(username)}@${domain}`
    }

    return maskedData(email, 0, LIMIT_MASKED_EMAIL)
}

export const maskedPhone = (phone: string | null | undefined) =>
    maskedData(phone ?? "", 0, LIMIT_MASKED_PHONE)

export const getMemberNames = (member: PersonalMember) => {
    return [member.firstName, member.secondName].filter(value => Boolean(value)).join(" ")
}

export const getMemberLastnames = (member: PersonalMember) => {
    return [member.firstLastName, member.secondLastName].filter(value => Boolean(value)).join(" ")
}

export const getUserName = (member: Member) => {
    if (member.memberType === MemberType.PERSONAL) {
        return toTitleCase([member.firstName, member.firstLastName].join(" "));
    }

    return toTitleCase(member.companyName)
}

type PersonalNameParts = {
    firstName: string
    secondName?: string
    firstLastName: string
    secondLastName?: string
}

export const getPersonalFullName = ({
    firstName,
    secondName,
    firstLastName,
    secondLastName,
}: PersonalNameParts) => {
    return [firstName, secondName, firstLastName, secondLastName].filter(Boolean).join(" ")
}

export const getMemberFullName = (member: Member) => {
    if (member.memberType === MemberType.PERSONAL) {
        return getPersonalFullName(member)
    }

    return getUserName(member)
}

export const getMemberFullNameCapitalized = (member: Member) => {
    if (member.memberType === MemberType.PERSONAL) {
        return [member.firstName, member.secondName, member.firstLastName, member.secondLastName].filter(value => Boolean(value)).join(" ");
    } else {
        return [member.firstNameAdministrator, member.firstLastNameAdministrator].filter(value => Boolean(value)).join(" ");
    }
}