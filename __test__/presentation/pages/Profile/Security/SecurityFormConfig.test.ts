import { describe, it, expect, vi } from "vitest"
import * as Yup from "yup"
import {
    emailFormValidationSchema,
    passwordFormValidationSchema,
    securityValidationSchema,
    getSecurityFormValidationSchema,
    getInitialFormValues,
    getOtpValidationData,
    SecurityFormSchemaType,
    emailFormInitialValues,
    passwordFormInitialValues,
} from "@/presentation/pages/Profile/Security/SecurityFormConfig"
import { PersonalMember, MemberType } from "@/domain/entity/Member/member"
import { EmailFormValues, PasswordFormValues } from "@/presentation/pages/Profile/Security/types"

vi.mock("@/presentation/helpers/member", () => ({
    maskedData: vi.fn((data: string, init: number, finish: number, all?: boolean) => {
        if (all) {
            return data?.slice(0, data.length).replace(/./g, "*") || ""
        }
        return "********"
    }),
}))

describe("SecurityFormConfig", () => {
    describe("emailFormValidationSchema", () => {
        it("should validate required newEmail field", async () => {
            const values = {
                email: "old@test.com",
                newEmail: "",
                emailConfirmation: "",
            }

            try {
                await emailFormValidationSchema.validate(values, { abortEarly: false })
            } catch (error: any) {
                // Check that one of the errors is about newEmail being required
                expect(error.errors).toContain("El nuevo correo electrónico es requerido")
                return
            }
            throw new Error("Expected validation to fail")
        })

        it("should validate email format for newEmail", async () => {
            const values = {
                email: "old@test.com",
                newEmail: "invalid-email",
                emailConfirmation: "invalid-email",
            }

            await expect(emailFormValidationSchema.validate(values)).rejects.toThrow(
                "Por favor ingrese un correo electrónico válido"
            )
        })

        it("should validate max length (50 chars) for newEmail", async () => {
            const longEmail = "a".repeat(40) + "@example.com"
            const values = {
                email: "old@test.com",
                newEmail: longEmail,
                emailConfirmation: longEmail,
            }

            await expect(emailFormValidationSchema.validate(values)).rejects.toThrow(
                "El correo electrónico no puede exceder los 50 caracteres"
            )
        })

        it("should validate newEmail is different from current email", async () => {
            const values = {
                email: "same@test.com",
                newEmail: "same@test.com",
                emailConfirmation: "same@test.com",
            }

            await expect(emailFormValidationSchema.validate(values)).rejects.toThrow(
                "El nuevo correo electrónico debe ser diferente al anterior"
            )
        })

        it("should validate required emailConfirmation field", async () => {
            const values = {
                email: "old@test.com",
                newEmail: "new@test.com",
                emailConfirmation: "",
            }

            await expect(emailFormValidationSchema.validate(values)).rejects.toThrow(
                "El correo electrónico de confirmación es requerido"
            )
        })

        it("should validate email format for emailConfirmation", async () => {
            const values = {
                email: "old@test.com",
                newEmail: "new@test.com",
                emailConfirmation: "invalid-email",
            }

            await expect(emailFormValidationSchema.validate(values)).rejects.toThrow(
                "Por favor ingrese un correo electrónico válido"
            )
        })

        it("should validate emailConfirmation matches newEmail", async () => {
            const values = {
                email: "old@test.com",
                newEmail: "new@test.com",
                emailConfirmation: "different@test.com",
            }

            await expect(emailFormValidationSchema.validate(values)).rejects.toThrow(
                "Los correos electrónicos no coinciden"
            )
        })

        it("should pass validation with valid email values", async () => {
            const values = {
                email: "old@test.com",
                newEmail: "new@test.com",
                emailConfirmation: "new@test.com",
            }

            await expect(emailFormValidationSchema.validate(values)).resolves.toEqual(values)
        })
    })

    describe("passwordFormValidationSchema", () => {
        it("should validate required newPassword field", async () => {
            const values = {
                password: "oldpass",
                newPassword: "",
                newPasswordConfirm: "",
            }

            try {
                await passwordFormValidationSchema.validate(values, { abortEarly: false })
            } catch (error: any) {
                expect(error.errors).toContain("La nueva contraseña es requerida")
                return
            }
            throw new Error("Expected validation to fail")
        })

        it("should validate required newPasswordConfirm field", async () => {
            const values = {
                password: "oldpass",
                newPassword: "newpass123",
                newPasswordConfirm: "",
            }

            await expect(passwordFormValidationSchema.validate(values)).rejects.toThrow(
                "La confirmación de contraseña es requerida"
            )
        })

        it("should validate newPasswordConfirm matches newPassword", async () => {
            const values = {
                password: "oldpass",
                newPassword: "Abcdef1!",
                newPasswordConfirm: "differentpass",
            }

            await expect(passwordFormValidationSchema.validate(values)).rejects.toThrow(
                "Las contraseñas no coinciden"
            )
        })

        it("should reject newPassword that does not meet complexity rules", async () => {
            const values = {
                password: "oldpass",
                newPassword: "newpass123",
                newPasswordConfirm: "newpass123",
            }

            await expect(passwordFormValidationSchema.validate(values)).rejects.toThrow()
        })

        it("should pass validation with valid password values", async () => {
            const values = {
                password: "oldpass",
                newPassword: "Abcdef1!",
                newPasswordConfirm: "Abcdef1!",
            }

            await expect(passwordFormValidationSchema.validate(values)).resolves.toEqual(values)
        })
    })

    describe("securityValidationSchema", () => {
        it("should be an empty Yup object schema", () => {
            expect(securityValidationSchema).toBeInstanceOf(Yup.ObjectSchema)
        })

        it("should pass validation with any values", async () => {
            const values = { anything: "value" }
            await expect(securityValidationSchema.validate(values)).resolves.toBeDefined()
        })
    })

    describe("getSecurityFormValidationSchema", () => {
        it("should return emailFormValidationSchema when type is EMAIL", () => {
            const schema = getSecurityFormValidationSchema(SecurityFormSchemaType.EMAIL)
            expect(schema).toBe(emailFormValidationSchema)
        })

        it("should return passwordFormValidationSchema when type is PASSWORD", () => {
            const schema = getSecurityFormValidationSchema(SecurityFormSchemaType.PASSWORD)
            expect(schema).toBe(passwordFormValidationSchema)
        })

        it("should return securityValidationSchema for other types", () => {
            const schema = getSecurityFormValidationSchema("other" as SecurityFormSchemaType)
            expect(schema).toBe(securityValidationSchema)
        })
    })

    describe("emailFormInitialValues", () => {
        it("should have correct structure", () => {
            expect(emailFormInitialValues).toEqual({
                email: "",
                newEmail: undefined,
                emailConfirmation: undefined,
            })
        })
    })

    describe("passwordFormInitialValues", () => {
        it("should have correct structure with masked password", () => {
            expect(passwordFormInitialValues).toHaveProperty("password")
            expect(passwordFormInitialValues).toHaveProperty("newPassword", "")
            expect(passwordFormInitialValues).toHaveProperty("newPasswordConfirm", "")
        })
    })

    describe("getInitialFormValues", () => {
        it("should return correct structure with member email", () => {
            const member: PersonalMember = {
                acceptLopd: false,
                acceptedTermsAndCondition: false,
                cellPhone: "0999999999",
                enrollmentEmail: "user@test.com",
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

            const result = getInitialFormValues(member)

            expect(result.email).toBe("user@test.com")
            expect(result.newEmail).toBeUndefined()
            expect(result.emailConfirmation).toBeUndefined()
            expect(result.password).toBeDefined()
            expect(result.newPassword).toBe("")
            expect(result.newPasswordConfirm).toBe("")
        })

        it("should handle member with null enrollmentEmail", () => {
            const member: PersonalMember = {
                acceptLopd: false,
                acceptedTermsAndCondition: false,
                cellPhone: "0999999999",
                enrollmentEmail: null as any,
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

            const result = getInitialFormValues(member)

            expect(result.email).toBe("")
        })
    })

    describe("getOtpValidationData", () => {
        it("should return password from PasswordFormValues.newPasswordConfirm", () => {
            const values: PasswordFormValues = {
                password: "oldpass",
                newPassword: "newpass123",
                newPasswordConfirm: "newpass123",
            }
            const show = { emailForm: false, passwordForm: true }

            const result = getOtpValidationData(values, show)

            expect(result.password).toBe("newpass123")
            expect(result.enrollmentEmail).toBeUndefined()
        })

        it("should return enrollmentEmail from EmailFormValues.emailConfirmation", () => {
            const values: EmailFormValues = {
                email: "old@test.com",
                newEmail: "new@test.com",
                emailConfirmation: "new@test.com",
            }
            const show = { emailForm: true, passwordForm: false }

            const result = getOtpValidationData(values, show)

            expect(result.enrollmentEmail).toBe("new@test.com")
            expect(result.password).toBeUndefined()
        })

        it("should return undefined for missing values", () => {
            const values = {}
            const show = { emailForm: false, passwordForm: false }

            const result = getOtpValidationData(values, show)

            expect(result.password).toBeUndefined()
            expect(result.enrollmentEmail).toBeUndefined()
        })

        it("should handle partial EmailFormValues", () => {
            const values: Partial<EmailFormValues> = {
                email: "old@test.com",
                newEmail: "new@test.com",
            }
            const show = { emailForm: true, passwordForm: false }

            const result = getOtpValidationData(values, show)

            expect(result.enrollmentEmail).toBeUndefined()
        })
    })
})
