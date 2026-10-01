import { describe, expect, it } from "vitest"
import { hasLocation } from "@/presentation/forms/AddressForm/addressLocationValidation"
import {
    addressToBillingFormValues,
    billingFormValidationSchema,
} from "@/presentation/forms/BillingForm/BillingFormConfig"
import { Address } from "@/domain/entity/Address/structure/address"

const validValues = {
    customerReceivingEmail: "user@test.com",
    customerReceivingPhone: "0999999999",
    street1: "Av Principal",
    street2: "Calle Secundaria",
    number: "100",
    state: { id: "1", name: "Pichincha" },
    city: { id: "2", name: "Quito" },
    zone: { id: "3", name: "Centro" },
}

const billingAddress: Address = {
    id: "addr-1",
    alias: "Casa",
    street1: "Av. Principal",
    street2: "Calle Secundaria",
    country: { id: "1", name: "Ecuador", grade: "country", parentId: null },
    state: { id: "1", name: "Pichincha", grade: "state", parentId: "1" },
    city: { id: "2", name: "Quito", grade: "city", parentId: "1" },
    zone: { id: "3", name: "Centro", grade: "zone", parentId: "2" },
    number: "100",
    reference: "",
    isThirdPartyAddress: false,
    customerReceivingFirstName: "Juan",
    customerReceivingLastName: "Pérez",
    customerReceivingEmail: "juan@test.com",
    customerReceivingPhone: "0999999999",
    customerReceivingIdentificationNumber: "1234567890",
    customerReceivingIdentificationType: "CI",
    secondPhone: "",
    postalCode: "",
    default: true,
}

describe("billingFormValidationSchema", () => {
    it("should validate complete billing form values", async () => {
        await expect(billingFormValidationSchema.validate(validValues)).resolves.toBeDefined()
    })

    it("should reject invalid phone number", async () => {
        await expect(
            billingFormValidationSchema.validate({
                ...validValues,
                customerReceivingPhone: "123",
            })
        ).rejects.toThrow("Ingresar un número telefónico válido")
    })

    it("should reject invalid email", async () => {
        await expect(
            billingFormValidationSchema.validate({
                ...validValues,
                customerReceivingEmail: "invalid-email",
            })
        ).rejects.toThrow("El correo es inválido")
    })

    it("should require province before city and zone", async () => {
        await expect(
            billingFormValidationSchema.validate(
                {
                    ...validValues,
                    state: null,
                    city: null,
                    zone: null,
                },
                { abortEarly: false }
            )
        ).rejects.toMatchObject({
            errors: expect.arrayContaining(["Provincia requerida"]),
        })
    })

    it("should require city when state is selected", async () => {
        await expect(
            billingFormValidationSchema.validate(
                {
                    ...validValues,
                    city: null,
                    zone: null,
                },
                { abortEarly: false }
            )
        ).rejects.toMatchObject({
            errors: expect.arrayContaining(["Ciudad requerida"]),
        })
    })

    it("should require zone when city is selected", async () => {
        await expect(
            billingFormValidationSchema.validate({
                ...validValues,
                zone: null,
            })
        ).rejects.toThrow("Sector requerido")
    })

    it("should reject missing street fields", async () => {
        await expect(
            billingFormValidationSchema.validate({
                ...validValues,
                street1: "ab",
            })
        ).rejects.toThrow("La calle principal es requerida")
    })

    it("should reject street fields with special characters", async () => {
        await expect(
            billingFormValidationSchema.validate({
                ...validValues,
                street1: "---.-12.312312312",
            })
        ).rejects.toThrow(
            "Vuelve a ingresar la información sin caracteres especiales (ej. -, ., _, @, #)."
        )
    })

    it("should reject street fields longer than 50 characters", async () => {
        const longStreet = "CallecallecallecalleCallecallecallecalleCallecallecallecal"

        await expect(
            billingFormValidationSchema.validate({
                ...validValues,
                street1: longStreet,
            })
        ).rejects.toThrow("El Calle principal no puede exceder 50 caracteres")

        await expect(
            billingFormValidationSchema.validate({
                ...validValues,
                street2: longStreet,
            })
        ).rejects.toThrow("El Calle secundaria no puede exceder 50 caracteres")

        await expect(
            billingFormValidationSchema.validate({
                ...validValues,
                number: longStreet,
            })
        ).rejects.toThrow("El Número de dirección no puede exceder 15 caracteres")
    })
})

describe("addressToBillingFormValues", () => {
    it("should map address and display values to billing form values", () => {
        const result = addressToBillingFormValues(billingAddress, {
            billingFullName: "Juan Pérez",
            billingMaskedDocument: "123***890",
        })

        expect(result).toEqual(
            expect.objectContaining({
                customerReceivingEmail: "juan@test.com",
                street1: "Av. Principal",
                billingFullName: "Juan Pérez",
                billingMaskedDocument: "123***890",
            })
        )
    })
})

describe("hasLocation", () => {
    it("should return false when location has no id", () => {
        expect(hasLocation({ id: "", name: "Pichincha" })).toBe(false)
    })
})
