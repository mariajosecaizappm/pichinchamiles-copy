import {describe, it, expect} from "vitest"
import getMemberSummary from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ActivationFlow/components/ActivationSummary/getMemberSummary"
import {MemberType} from "@/domain/entity/Member/member"

describe("getMemberSummary", () => {
    describe("when member is personal", () => {
        it("should map expected fields", () => {
            const member = {
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
            } as any

            const summary = getMemberSummary(member)

            expect(summary).toEqual([
                {label: "Nombres", value: "Juan"},
                {label: "Apellidos", value: "Pérez Gómez"},
                {label: "Documento de identificación", value: "123"},
                {label: "Fecha de nacimiento:", value: "1990-01-01"},
                {label: "Correo electrónico", value: "a@b.com"},
                {label: "Teléfono celular", value: "0999999999"},
            ])
        })
    })

    describe("when member is corporate", () => {
        it("should map expected fields", () => {
            const member = {
                companyName: "ACME",
                identificationNumber: "999",
                firstNameAdministrator: "Ana",
                firstLastNameAdministrator: "Pérez",
                administratorName: "Ana Pérez",
                enrollmentEmail: "corp@acme.com",
                birthDay: "2000-01-01",
                identificationNumberAdministrator: "111",
                enrollmentEmailAdministrator: "admin@acme.com",
                address: "Av. 2",
                acceptLopd: false,
                acceptedTermsAndCondition: false,
                memberType: MemberType.CORPORATE,
                cellPhone: "0888888888",
                city: "Quito",
                country: "EC",
                state: "Pichincha",
                identificationType: "RUC",
                registrationDate: "2026-01-01",
                segment: "SEG",
            } as any

            const summary = getMemberSummary(member)

            expect(summary).toEqual([
                {label: "Nombre de la empresa", value: "ACME"},
                {label: "RUC", value: "999"},
                {label: "Administrador de millas", value: "Ana Pérez"},
                {label: "Documento de identificación", value: "111"},
                {label: "Teléfono celular", value: "0888888888"},
                {label: "Correo electrónico", value: "admin@acme.com"},
            ])
        })
    })
})

