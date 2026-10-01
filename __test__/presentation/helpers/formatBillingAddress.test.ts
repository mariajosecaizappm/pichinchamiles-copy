import { describe, expect, it } from "vitest"
import { Address } from "@/domain/entity/Address/structure/address"
import { CorporateMember, MemberType, PersonalMember } from "@/domain/entity/Member/member"
import { formatBillingAddress } from "@/presentation/helpers/formatBillingAddress"

const shippingAddress: Address = {
    id: "addr-1",
    alias: "Casa",
    street1: "Av. Principal",
    street2: "y Secundaria",
    country: { id: "1", name: "Ecuador", grade: "country", parentId: null },
    state: { id: "2", name: "Pichincha", grade: "state", parentId: "1" },
    city: { id: "3", name: "Quito", grade: "city", parentId: "2" },
    zone: { id: "4", name: "Centro", grade: "zone", parentId: "3" },
    number: "123",
    reference: "Frente al parque",
    isThirdPartyAddress: false,
    customerReceivingFirstName: "",
    customerReceivingLastName: "",
    customerReceivingEmail: "",
    customerReceivingPhone: "",
    customerReceivingIdentificationNumber: "",
    customerReceivingIdentificationType: "",
    secondPhone: "0991234567",
    postalCode: "170101",
    default: true,
}

const personalMember: PersonalMember = {
    acceptLopd: true,
    acceptedTermsAndCondition: true,
    cellPhone: "0999999999",
    enrollmentEmail: "socio@test.com",
    firstName: "Juan",
    secondName: "Andrés",
    firstLastName: "Pérez",
    secondLastName: "López",
    gender: "M",
    birthDay: "1990-01-01",
    state: "Pichincha",
    city: "Quito",
    address: "Av. Principal",
    identificationNumber: "1234567890",
    identificationType: "CI",
    memberType: MemberType.PERSONAL,
    phone: "022222222",
    country: "Ecuador",
    registrationDate: "2020-01-01",
    segment: "A",
}

const corporateMember: CorporateMember = {
    companyName: "Empresa SA",
    identificationNumber: "1234567890001",
    firstNameAdministrator: "María",
    firstLastNameAdministrator: "García",
    administratorName: "María García",
    enrollmentEmail: "empresa@test.com",
    birthDay: "1985-05-05",
    identificationNumberAdministrator: "0987654321",
    enrollmentEmailAdministrator: "admin@test.com",
    address: "Av. Empresarial",
    acceptLopd: true,
    acceptedTermsAndCondition: true,
    memberType: MemberType.CORPORATE,
    cellPhone: "0988888888",
    city: "Guayaquil",
    country: "Ecuador",
    state: "Guayas",
    identificationType: "RUC",
    registrationDate: "2019-01-01",
    segment: "B",
}

describe("formatBillingAddress", () => {
    it("should merge personal member data with shipping address", () => {
        const result = formatBillingAddress(personalMember, shippingAddress)

        expect(result.street1).toBe(shippingAddress.street1)
        expect(result.customerReceivingFirstName).toBe("Juan Andrés")
        expect(result.customerReceivingLastName).toBe("Pérez López")
        expect(result.customerReceivingEmail).toBe("socio@test.com")
        expect(result.customerReceivingPhone).toBe("0999999999")
        expect(result.customerReceivingIdentificationNumber).toBe("1234567890")
    })

    it("should merge corporate member data with shipping address", () => {
        const result = formatBillingAddress(corporateMember, shippingAddress)

        expect(result.companyName).toBe("Empresa SA")
        expect(result.customerReceivingFirstName).toBe("María")
        expect(result.customerReceivingLastName).toBe("García")
        expect(result.customerReceivingEmail).toBe("empresa@test.com")
        expect(result.customerReceivingIdentificationNumber).toBe("1234567890001")
    })
})
