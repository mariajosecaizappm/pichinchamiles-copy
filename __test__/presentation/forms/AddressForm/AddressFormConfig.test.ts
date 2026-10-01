import { describe, expect, it } from "vitest"
import {
    addressFormInitialValues,
    addressFormValidationSchema,
} from "@/presentation/forms/AddressForm/AddressFormConfig"

describe("addressFormValidationSchema", () => {
    it("should use Figma required messages for empty form", async () => {
        try {
            await addressFormValidationSchema.validate(addressFormInitialValues, {
                abortEarly: false,
            })
            expect.fail("Expected validation to fail")
        } catch (error) {
            const validationError = error as { errors: string[] }
            expect(validationError.errors).toEqual(
                expect.arrayContaining([
                    "Campo requerido",
                    "Calle principal requerida",
                    "Calle secundaria requerida",
                    "Provincia requerida",
                    "Ciudad requerida",
                    "Sector requerido",
                    "Número de dirección requerida",
                    "Número telefónico requerido",
                ])
            )
        }
    })

    it("should reject invalid phone format with Figma message", async () => {
        await expect(
            addressFormValidationSchema.validate({
                ...addressFormInitialValues,
                alias: "Casa",
                street1: "Espejo",
                street2: "10 de agosto",
                number: "210",
                reference: "Frente a la farmacia",
                secondPhone: "095123456776796",
                state: { id: "1", name: "PICHINCHA", grade: "state", parentId: null },
                city: { id: "2", name: "QUITO", grade: "city", parentId: "1" },
                zone: { id: "3", name: "CONOCOTO", grade: "zone", parentId: "2" },
            })
        ).rejects.toMatchObject({
            errors: expect.arrayContaining(["Ingresar un número telefónico valido"]),
        })
    })

    it("should validate a complete address successfully", async () => {
        const validAddress = {
            ...addressFormInitialValues,
            alias: "Casa",
            street1: "Espejo",
            street2: "10 de agosto",
            number: "210",
            reference: "Frente a la farmacia",
            secondPhone: "0991234567",
            state: { id: "1", name: "PICHINCHA", grade: "state", parentId: null },
            city: { id: "2", name: "QUITO", grade: "city", parentId: "1" },
            zone: { id: "3", name: "CONOCOTO", grade: "zone", parentId: "2" },
        }

        await expect(addressFormValidationSchema.validate(validAddress)).resolves.toEqual(
            expect.objectContaining({ alias: "Casa", secondPhone: "0991234567" })
        )
    })

    it("should reject address fields with special characters", async () => {
        await expect(
            addressFormValidationSchema.validate({
                ...addressFormInitialValues,
                alias: "Casa",
                street1: "Calle@Principal#1",
                street2: "10 de agosto",
                number: "210",
                reference: "Frente a la farmacia",
                secondPhone: "0991234567",
                state: { id: "1", name: "PICHINCHA", grade: "state", parentId: null },
                city: { id: "2", name: "QUITO", grade: "city", parentId: "1" },
                zone: { id: "3", name: "CONOCOTO", grade: "zone", parentId: "2" },
            })
        ).rejects.toThrow(
            "Vuelve a ingresar la información sin caracteres especiales (ej. -, ., _, @, #)."
        )
    })

    it("should reject accented letters and ñ in address fields", async () => {
        await expect(
            addressFormValidationSchema.validate({
                ...addressFormInitialValues,
                alias: "Casa Ñusta",
                street1: "Avenida Cañar",
                street2: "10 de agosto",
                number: "210",
                reference: "Frente a la farmacia",
                secondPhone: "0991234567",
                state: { id: "1", name: "PICHINCHA", grade: "state", parentId: null },
                city: { id: "2", name: "QUITO", grade: "city", parentId: "1" },
                zone: { id: "3", name: "CONOCOTO", grade: "zone", parentId: "2" },
            })
        ).rejects.toThrow(
            "Vuelve a ingresar la información sin caracteres especiales (ej. -, ., _, @, #)."
        )
    })

    it("should accept plain ASCII letters and numbers in address fields", async () => {
        const validAddress = {
            ...addressFormInitialValues,
            alias: "Casa Nueva",
            street1: "Avenida Amazonas",
            street2: "10 de Agosto",
            number: "210",
            reference: "Frente al parque",
            secondPhone: "0991234567",
            state: { id: "1", name: "PICHINCHA", grade: "state", parentId: null },
            city: { id: "2", name: "QUITO", grade: "city", parentId: "1" },
            zone: { id: "3", name: "CENTRO", grade: "zone", parentId: "2" },
        }

        await expect(addressFormValidationSchema.validate(validAddress)).resolves.toEqual(
            expect.objectContaining({
                alias: "Casa Nueva",
                street1: "Avenida Amazonas",
            }),
        )
    })

    it("should reject address fields longer than 50 characters", async () => {
        const longStreet = "CallecallecallecalleCallecallecallecalleCallecallecallecal"

        await expect(
            addressFormValidationSchema.validate({
                ...addressFormInitialValues,
                alias: "Casa",
                street1: longStreet,
                street2: "10 de agosto",
                number: "210",
                reference: "Frente a la farmacia",
                secondPhone: "0991234567",
                state: { id: "1", name: "PICHINCHA", grade: "state", parentId: null },
                city: { id: "2", name: "QUITO", grade: "city", parentId: "1" },
                zone: { id: "3", name: "CONOCOTO", grade: "zone", parentId: "2" },
            })
        ).rejects.toThrow("La calle principal no puede exceder 50 caracteres")
    })

    it("should reject address number longer than 15 characters", async () => {
        await expect(
            addressFormValidationSchema.validate({
                ...addressFormInitialValues,
                alias: "Casa",
                street1: "Espejo",
                street2: "10 de agosto",
                number: "1234567890123456",
                reference: "Frente a la farmacia",
                secondPhone: "0991234567",
                state: { id: "1", name: "PICHINCHA", grade: "state", parentId: null },
                city: { id: "2", name: "QUITO", grade: "city", parentId: "1" },
                zone: { id: "3", name: "CONOCOTO", grade: "zone", parentId: "2" },
            })
        ).rejects.toThrow("El número de dirección no puede exceder 15 caracteres")
    })

    it("should require third party fields when isThirdPartyAddress is true", async () => {
        try {
            await addressFormValidationSchema.validate(
                {
                    ...addressFormInitialValues,
                    alias: "Casa",
                    street1: "Espejo",
                    street2: "10 de agosto",
                    number: "210",
                    reference: "Frente a la farmacia",
                    secondPhone: "0991234567",
                    state: { id: "1", name: "PICHINCHA", grade: "state", parentId: null },
                    city: { id: "2", name: "QUITO", grade: "city", parentId: "1" },
                    zone: { id: "3", name: "CONOCOTO", grade: "zone", parentId: "2" },
                    isThirdPartyAddress: true,
                },
                { abortEarly: false }
            )
            expect.fail("Expected validation to fail")
        } catch (error) {
            const validationError = error as { errors: string[] }
            expect(validationError.errors).toEqual(
                expect.arrayContaining([
                    "Nombres requeridos",
                    "Apellidos requeridos",
                    "Tipo de identificación requerido",
                    "Documento de identificación requerido",
                ])
            )
        }
    })

    it("should reject invalid CI document for third party address", async () => {
        await expect(
            addressFormValidationSchema.validate({
                ...addressFormInitialValues,
                alias: "Casa",
                street1: "Espejo",
                street2: "10 de agosto",
                number: "210",
                reference: "Frente a la farmacia",
                secondPhone: "0991234567",
                state: { id: "1", name: "PICHINCHA", grade: "state", parentId: null },
                city: { id: "2", name: "QUITO", grade: "city", parentId: "1" },
                zone: { id: "3", name: "CONOCOTO", grade: "zone", parentId: "2" },
                isThirdPartyAddress: true,
                customerReceivingFirstName: "Juan",
                customerReceivingLastName: "Perez",
                customerReceivingPhone: "0991234567",
                customerReceivingIdentificationType: "CI",
                customerReceivingIdentificationNumber: "123",
            })
        ).rejects.toMatchObject({
            errors: expect.arrayContaining([
                "Ingresar un documento de identificación válido",
            ]),
        })
    })

    it("should reject reference longer than 200 characters with max length message", async () => {
        const longReference = "a".repeat(201)

        await expect(
            addressFormValidationSchema.validate({
                ...addressFormInitialValues,
                alias: "Casa",
                street1: "Espejo",
                street2: "10 de agosto",
                number: "210",
                reference: longReference,
                secondPhone: "0991234567",
                state: { id: "1", name: "PICHINCHA", grade: "state", parentId: null },
                city: { id: "2", name: "QUITO", grade: "city", parentId: "1" },
                zone: { id: "3", name: "CONOCOTO", grade: "zone", parentId: "2" },
            })
        ).rejects.toMatchObject({
            errors: expect.arrayContaining([
                "Has superado el límite de 200 caracteres permitidos",
            ]),
        })
    })

    it("should accept reference with exactly 200 characters", async () => {
        const validAddress = {
            ...addressFormInitialValues,
            alias: "Casa",
            street1: "Espejo",
            street2: "10 de agosto",
            number: "210",
            reference: "a".repeat(200),
            secondPhone: "0991234567",
            state: { id: "1", name: "PICHINCHA", grade: "state", parentId: null },
            city: { id: "2", name: "QUITO", grade: "city", parentId: "1" },
            zone: { id: "3", name: "CONOCOTO", grade: "zone", parentId: "2" },
        }

        await expect(addressFormValidationSchema.validate(validAddress)).resolves.toEqual(
            expect.objectContaining({ reference: "a".repeat(200) })
        )
    })

    it("should accept valid CI document for third party address", async () => {
        const validThirdParty = {
            ...addressFormInitialValues,
            alias: "Casa",
            street1: "Espejo",
            street2: "10 de agosto",
            number: "210",
            reference: "Frente a la farmacia",
            secondPhone: "0991234567",
            state: { id: "1", name: "PICHINCHA", grade: "state", parentId: null },
            city: { id: "2", name: "QUITO", grade: "city", parentId: "1" },
            zone: { id: "3", name: "CONOCOTO", grade: "zone", parentId: "2" },
            isThirdPartyAddress: true,
            customerReceivingFirstName: "Juan",
            customerReceivingLastName: "Perez",
            customerReceivingPhone: "0991234567",
            customerReceivingIdentificationType: "CI",
            customerReceivingIdentificationNumber: "1713175071",
        }

        await expect(addressFormValidationSchema.validate(validThirdParty)).resolves.toEqual(
            expect.objectContaining({
                customerReceivingIdentificationNumber: "1713175071",
            })
        )
    })
})
