import {describe, it, expect} from "vitest"
import {ContactFormValidationSchema, contactFormInitialValues} from "@/presentation/pages/Help/Contact/Form/ContactFormConfig"

describe("ContactFormValidationSchema", () => {
    const validValues = {
        identificationNumber: "1234567897",
        identificationType: "CI",
        fullname: "Juan Pérez",
        description: "This is a valid description with at least 20 chars.",
        email: "juan@example.com",
        pqrsRequirementTypeId: "type-1",
        pqrsRequirementSubTypeId: "sub-1",
    }

    it("should validate a complete valid form", async () => {
        const result = await ContactFormValidationSchema.isValid(validValues)
        expect(result).toBe(true)
    })

    it("should fail when required fields are missing", async () => {
        const result = await ContactFormValidationSchema.isValid({})
        expect(result).toBe(false)
    })

    it("should fail with invalid email format", async () => {
        const result = await ContactFormValidationSchema.isValid({
            ...validValues,
            email: "not-an-email",
        })
        expect(result).toBe(false)
    })

    it("should fail when email starts with a special character", async () => {
        const result = await ContactFormValidationSchema.isValid({
            ...validValues,
            email: ".juan@example.com",
        })
        expect(result).toBe(false)
    })

    it("should fail when email exceeds 50 characters", async () => {
        const longEmail = "a".repeat(40) + "@example.com"

        await expect(
            ContactFormValidationSchema.validate({
                ...validValues,
                email: longEmail,
            })
        ).rejects.toThrow("El correo electrónico no puede exceder 50 caracteres")
    })

    it("should fail when description is too short", async () => {
        const result = await ContactFormValidationSchema.isValid({
            ...validValues,
            description: "short",
        })
        expect(result).toBe(false)
    })

    it("should fail when document is invalid for the identification type", async () => {
        const result = await ContactFormValidationSchema.isValid({
            ...validValues,
            identificationType: "RUC",
            identificationNumber: "123",
        })
        expect(result).toBe(false)
    })

    it("should have correct initial values", () => {
        expect(contactFormInitialValues).toEqual({
            identificationNumber: "",
            identificationType: "",
            fullname: "",
            description: "",
            email: "",
            pqrsRequirementTypeId: "",
            pqrsRequirementSubTypeId: "",
        })
    })
})
