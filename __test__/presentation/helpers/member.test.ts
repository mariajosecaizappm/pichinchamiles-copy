import { describe, it, expect } from "vitest"
import {
    getMemberFullNameCapitalized, getMemberLastnames,
    getMemberNames,
    getMemberFullName,
    getPersonalFullName,
    getUserName,
    LIMIT_MASKED_EMAIL,
    LIMIT_MASKED_EMAIL_LOCAL_PREFIX,
    LIMIT_MASKED_EMAIL_LOCAL_SUFFIX,
    maskedData,
    maskedEmail,
    maskedEmailUsername,
    maskedPhone,
} from "@/presentation/helpers/member"
import { CorporateMember, MemberType, PersonalMember } from "@/domain/entity/Member/member"

describe("maskedData", () => {
    describe("when init and finish are provided", () => {
        it("should mask the middle characters and keep the ends", () => {
            expect(
                maskedData(
                    "abcdef",
                    LIMIT_MASKED_EMAIL_LOCAL_PREFIX,
                    LIMIT_MASKED_EMAIL_LOCAL_SUFFIX,
                ),
            ).toBe("a****f")
        })
    })

    describe("when init is 0", () => {
        it("should mask from the start and keep the last characters", () => {
            expect(maskedData("abcdef", 0, LIMIT_MASKED_EMAIL)).toBe("***def")
        })
    })

    describe("when there is nothing to mask", () => {
        it("should return the original value", () => {
            expect(maskedData("abc", 1, 2)).toBe("abc")
        })
    })

    describe("when data is null or undefined", () => {
        it("should return an empty string", () => {
            expect(maskedData(null, 0, LIMIT_MASKED_EMAIL)).toBe("")
            expect(maskedData(undefined, 0, LIMIT_MASKED_EMAIL)).toBe("")
        })
    })

    describe("when all parameter is true", () => {
        it("should mask entire string", () => {
            expect(maskedData("password123", 0, 1, true)).toBe("***********")
        })

        it("should mask entire string regardless of init and finish values", () => {
            expect(maskedData("test", 2, 1, true)).toBe("****")
        })

        it("should return empty string for null when all is true", () => {
            expect(maskedData(null, 0, 0, true)).toBe("")
        })

        it("should return empty string for undefined when all is true", () => {
            expect(maskedData(undefined, 0, 0, true)).toBe("")
        })
    })

    describe("when all parameter is false", () => {
        it("should use existing masking logic", () => {
            expect(maskedData("abcdef", 1, 1, false)).toBe("a****f")
        })
    })

    describe("when all parameter is undefined", () => {
        it("should use existing masking logic", () => {
            expect(maskedData("abcdef", 1, 1, undefined)).toBe("a****f")
        })
    })
})

describe("maskedEmailUsername", () => {
    it("should mask the username keeping prefix and suffix", () => {
        expect(maskedEmailUsername("jane")).toBe("j**e")
    })

    it("should return an empty string for null or undefined", () => {
        expect(maskedEmailUsername(null)).toBe("")
        expect(maskedEmailUsername(undefined)).toBe("")
    })
})

describe("maskedEmail", () => {
    it("should mask the local part and keep the domain visible", () => {
        expect(maskedEmail("jane@example.com")).toBe("j**e@example.com")
    })

    it("should mask emails without a domain separator", () => {
        expect(maskedEmail("abcdef")).toBe("***def")
    })

    it("should return an empty string for null, undefined or empty values", () => {
        expect(maskedEmail(null)).toBe("")
        expect(maskedEmail(undefined)).toBe("")
        expect(maskedEmail("")).toBe("")
    })
})

describe("maskedPhone", () => {
    it("should mask the phone keeping the last digits visible", () => {
        expect(maskedPhone("022222222")).toBe("******222")
    })

    it("should return an empty string for null or undefined", () => {
        expect(maskedPhone(null)).toBe("")
        expect(maskedPhone(undefined)).toBe("")
    })
})

describe("getMemberNames", () => {
    describe("when secondName is empty", () => {
        it("should return only firstName", () => {
            const member: PersonalMember = {
                acceptLopd: false,
                acceptedTermsAndCondition: false,
                cellPhone: "0999999999",
                enrollmentEmail: "a@b.com",
                firstName: "Juan",
                secondName: "",
                firstLastName: "Pérez",
                secondLastName: "",
                gender: "M",
                birthDay: "1990-01-01",
                state: "Pichincha",
                city: "Quito",
                address: "Av. 1",
                identificationNumber: "123",
                identificationType: "CI",
                memberType: MemberType.PERSONAL,
                phone: "000",
                country: "EC",
                registrationDate: "2026-01-01",
                segment: "SEG",
            }

            expect(getMemberNames(member)).toBe("Juan")
        })
    })

    describe("when secondName is present", () => {
        it("should return firstName and secondName", () => {
            const member: PersonalMember = {
                acceptLopd: false,
                acceptedTermsAndCondition: false,
                cellPhone: "0999999999",
                enrollmentEmail: "a@b.com",
                firstName: "Juan",
                secondName: "Carlos",
                firstLastName: "Pérez",
                secondLastName: "",
                gender: "M",
                birthDay: "1990-01-01",
                state: "Pichincha",
                city: "Quito",
                address: "Av. 1",
                identificationNumber: "123",
                identificationType: "CI",
                memberType: MemberType.PERSONAL,
                phone: "000",
                country: "EC",
                registrationDate: "2026-01-01",
                segment: "SEG",
            }

            expect(getMemberNames(member)).toBe("Juan Carlos")
        })
    })
})

describe("getMemberLastnames", () => {
    describe("when secondLastName is empty", () => {
        it("should return only firstLastName", () => {
            const member: PersonalMember = {
                acceptLopd: false,
                acceptedTermsAndCondition: false,
                cellPhone: "0999999999",
                enrollmentEmail: "a@b.com",
                firstName: "Juan",
                secondName: "",
                firstLastName: "Pérez",
                secondLastName: "",
                gender: "M",
                birthDay: "1990-01-01",
                state: "Pichincha",
                city: "Quito",
                address: "Av. 1",
                identificationNumber: "123",
                identificationType: "CI",
                memberType: MemberType.PERSONAL,
                phone: "000",
                country: "EC",
                registrationDate: "2026-01-01",
                segment: "SEG",
            }

            expect(getMemberLastnames(member)).toBe("Pérez")
        })
    })

    describe("when secondLastName is present", () => {
        it("should return firstLastName and secondLastName", () => {
            const member: PersonalMember = {
                acceptLopd: false,
                acceptedTermsAndCondition: false,
                cellPhone: "0999999999",
                enrollmentEmail: "a@b.com",
                firstName: "Juan",
                secondName: "",
                firstLastName: "Pérez",
                secondLastName: "Gómez",
                gender: "M",
                birthDay: "1990-01-01",
                state: "Pichincha",
                city: "Quito",
                address: "Av. 1",
                identificationNumber: "123",
                identificationType: "CI",
                memberType: MemberType.PERSONAL,
                phone: "000",
                country: "EC",
                registrationDate: "2026-01-01",
                segment: "SEG",
            }

            expect(getMemberLastnames(member)).toBe("Pérez Gómez")
        })
    })
})

describe("getUserName", () => {
    describe("when member is personal", () => {
        it("should return firstName and firstLastName", () => {
            const member: PersonalMember = {
                acceptLopd: false,
                acceptedTermsAndCondition: false,
                cellPhone: "0999999999",
                enrollmentEmail: "a@b.com",
                firstName: "Juan",
                secondName: "Carlos",
                firstLastName: "Pérez",
                secondLastName: "Gómez",
                gender: "M",
                birthDay: "1990-01-01",
                state: "Pichincha",
                city: "Quito",
                address: "Av. 1",
                identificationNumber: "123",
                identificationType: "CI",
                memberType: MemberType.PERSONAL,
                phone: "000",
                country: "EC",
                registrationDate: "2026-01-01",
                segment: "SEG",
            }

            expect(getUserName(member)).toBe("Juan Pérez")
        })

        it("should title-case lowercase names", () => {
            const member: PersonalMember = {
                acceptLopd: false,
                acceptedTermsAndCondition: false,
                cellPhone: "0999999999",
                enrollmentEmail: "a@b.com",
                firstName: "juan",
                secondName: "carlos",
                firstLastName: "PÉREZ",
                secondLastName: "gómez",
                gender: "M",
                birthDay: "1990-01-01",
                state: "Pichincha",
                city: "Quito",
                address: "Av. 1",
                identificationNumber: "123",
                identificationType: "CI",
                memberType: MemberType.PERSONAL,
                phone: "000",
                country: "EC",
                registrationDate: "2026-01-01",
                segment: "SEG",
            }

            expect(getUserName(member)).toBe("Juan Pérez")
        })
    })

    describe("when member is corporate", () => {
        it("should return companyName", () => {
            const member: CorporateMember = {
                companyName: "Mi Empresa S.A.",
                identificationNumber: "1790012345001",
                firstNameAdministrator: "Juan",
                secondNameAdministrator: "Carlos",
                firstLastNameAdministrator: "Pérez",
                secondLastNameAdministrator: "Gómez",
                administratorName: "Juan Carlos Pérez Gómez",
                enrollmentEmail: "empresa@b.com",
                birthDay: "1990-01-01",
                identificationNumberAdministrator: "1234567890",
                enrollmentEmailAdministrator: "admin@b.com",
                address: "Av. 1",
                acceptLopd: false,
                acceptedTermsAndCondition: false,
                memberType: MemberType.CORPORATE,
                cellPhone: "0999999999",
                city: "Quito",
                country: "EC",
                state: "Pichincha",
                identificationType: "RUC",
                registrationDate: "2026-01-01",
                segment: "SEG",
            }

            expect(getUserName(member)).toBe("Mi Empresa S.a.")
        })
    })
})

describe("getPersonalFullName", () => {
    it("builds full name from personal name parts", () => {
        expect(
            getPersonalFullName({
                firstName: "Guadalupe",
                secondName: "Ana",
                firstLastName: "Bedoya",
                secondLastName: "Ruiz",
            })
        ).toBe("Guadalupe Ana Bedoya Ruiz")
    })
})

describe("getMemberFullName", () => {
    it("builds member full name for personal members", () => {
        const member: PersonalMember = {
            acceptLopd: false,
            acceptedTermsAndCondition: false,
            cellPhone: "0999999999",
            enrollmentEmail: "a@b.com",
            firstName: "Valentina",
            secondName: "Maria",
            firstLastName: "Bustamante",
            secondLastName: "Lopez",
            gender: "F",
            birthDay: "1990-01-01",
            state: "Pichincha",
            city: "Quito",
            address: "Av. 1",
            identificationNumber: "123",
            identificationType: "CI",
            memberType: MemberType.PERSONAL,
            phone: "000",
            country: "EC",
            registrationDate: "2026-01-01",
            segment: "SEG",
        }

        expect(getMemberFullName(member)).toBe("Valentina Maria Bustamante Lopez")
    })

    it("builds member full name for corporate members", () => {
        const member: CorporateMember = {
            companyName: "Empresa XYZ",
            identificationNumber: "999",
            firstNameAdministrator: "Admin",
            firstLastNameAdministrator: "User",
            administratorName: "Admin User",
            enrollmentEmail: "admin@example.com",
            birthDay: "",
            acceptLopd: true,
            acceptedTermsAndCondition: true,
            cellPhone: "",
            state: "",
            city: "",
            address: "",
            identificationType: "RUC",
            country: "",
            registrationDate: "",
            segment: "",
            identificationNumberAdministrator: "1234567890",
            enrollmentEmailAdministrator: "admin@example.com",
            memberType: MemberType.CORPORATE,
        }

        expect(getMemberFullName(member)).toBe("Empresa Xyz")
    })
})

describe("getMemberFullNameCapitalized", () => {
    it("should return all personal member name parts joined", () => {
        const member: PersonalMember = {
            acceptLopd: false,
            acceptedTermsAndCondition: false,
            cellPhone: "0999999999",
            enrollmentEmail: "a@b.com",
            firstName: "Juan",
            secondName: "Carlos",
            firstLastName: "Pérez",
            secondLastName: "Gómez",
            gender: "M",
            birthDay: "1990-01-01",
            state: "Pichincha",
            city: "Quito",
            address: "Av. 1",
            identificationNumber: "123",
            identificationType: "CI",
            memberType: MemberType.PERSONAL,
            phone: "000",
            country: "EC",
            registrationDate: "2026-01-01",
            segment: "SEG",
        }

        expect(getMemberFullNameCapitalized(member)).toBe("Juan Carlos Pérez Gómez")
    })

    it("should skip empty personal name parts", () => {
        const member: PersonalMember = {
            acceptLopd: false,
            acceptedTermsAndCondition: false,
            cellPhone: "0999999999",
            enrollmentEmail: "a@b.com",
            firstName: "Juan",
            secondName: "",
            firstLastName: "Pérez",
            secondLastName: "",
            gender: "M",
            birthDay: "1990-01-01",
            state: "Pichincha",
            city: "Quito",
            address: "Av. 1",
            identificationNumber: "123",
            identificationType: "CI",
            memberType: MemberType.PERSONAL,
            phone: "000",
            country: "EC",
            registrationDate: "2026-01-01",
            segment: "SEG",
        }

        expect(getMemberFullNameCapitalized(member)).toBe("Juan Pérez")
    })

    it("should return corporate administrator full name", () => {
        const member: CorporateMember = {
            companyName: "Mi Empresa S.A.",
            identificationNumber: "1790012345001",
            firstNameAdministrator: "Ana",
            secondNameAdministrator: "María",
            firstLastNameAdministrator: "López",
            secondLastNameAdministrator: "Ruiz",
            administratorName: "Ana López",
            enrollmentEmail: "empresa@b.com",
            birthDay: "1990-01-01",
            identificationNumberAdministrator: "1234567890",
            enrollmentEmailAdministrator: "admin@b.com",
            address: "Av. 1",
            acceptLopd: false,
            acceptedTermsAndCondition: false,
            memberType: MemberType.CORPORATE,
            cellPhone: "0999999999",
            city: "Quito",
            country: "EC",
            state: "Pichincha",
            identificationType: "RUC",
            registrationDate: "2026-01-01",
            segment: "SEG",
        }

        expect(getMemberFullNameCapitalized(member)).toBe("Ana López")
    })

    it("should skip empty corporate administrator name parts", () => {
        const member: CorporateMember = {
            companyName: "Mi Empresa S.A.",
            identificationNumber: "1790012345001",
            firstNameAdministrator: "Ana",
            secondNameAdministrator: "",
            firstLastNameAdministrator: "López",
            secondLastNameAdministrator: "",
            administratorName: "Ana López",
            enrollmentEmail: "empresa@b.com",
            birthDay: "1990-01-01",
            identificationNumberAdministrator: "1234567890",
            enrollmentEmailAdministrator: "admin@b.com",
            address: "Av. 1",
            acceptLopd: false,
            acceptedTermsAndCondition: false,
            memberType: MemberType.CORPORATE,
            cellPhone: "0999999999",
            city: "Quito",
            country: "EC",
            state: "Pichincha",
            identificationType: "RUC",
            registrationDate: "2026-01-01",
            segment: "SEG",
        }

        expect(getMemberFullNameCapitalized(member)).toBe("Ana López")
    })
})
