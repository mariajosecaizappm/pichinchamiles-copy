import { describe, it, expect } from "vitest"
import { ApiError } from "@/domain/entity/Error/models/ApiError"
import { ErrorCode } from "@/domain/entity/Error/structure/error"
import {
    getTransferBeneficiaryFieldErrorMessage,
    transferBeneficiaryFormSchema,
} from "@/presentation/pages/TransferMiles/TransferMilesFormConfig"

describe("transferBeneficiaryFormSchema", () => {
    it("rejects documents shorter than 4 characters", async () => {
        await expect(
            transferBeneficiaryFormSchema.validate({ identificationNumber: "123" })
        ).rejects.toThrow("El documento del beneficiario debe tener al menos 4 dígitos")
    })

    it("rejects documents longer than 17 characters", async () => {
        await expect(
            transferBeneficiaryFormSchema.validate({
                identificationNumber: "123456789012345678",
            })
        ).rejects.toThrow("El documento del beneficiario no puede exceder 17 caracteres")
    })

    it("rejects special characters", async () => {
        await expect(
            transferBeneficiaryFormSchema.validate({ identificationNumber: "123-456" })
        ).rejects.toThrow("Vuelve a ingresar la información sin caracteres especiales")
    })

    it("rejects empty document", async () => {
        await expect(
            transferBeneficiaryFormSchema.validate({ identificationNumber: "" })
        ).rejects.toThrow("El documento del beneficiario es requerido")
    })

    it("accepts valid alphanumeric documents", async () => {
        await expect(
            transferBeneficiaryFormSchema.validate({ identificationNumber: "EC1234" })
        ).resolves.toEqual({ identificationNumber: "EC1234" })
    })
})

describe("getTransferBeneficiaryFieldErrorMessage", () => {
    it("maps self transfer error", () => {
        expect(getTransferBeneficiaryFieldErrorMessage(new ApiError(ErrorCode.SELF_TRANSFER))).toBe(
            "No puedes transferir millas a tu propia cuenta. Ingresa el documento de otro socio."
        )
    })

    it("maps beneficiary not found error", () => {
        expect(
            getTransferBeneficiaryFieldErrorMessage(new ApiError(ErrorCode.BENEFICIARY_NOT_FOUND))
        ).toBe("Este usuario no está registrado en Pichincha Miles.")
    })

    it("maps canceled user error", () => {
        expect(getTransferBeneficiaryFieldErrorMessage(new ApiError(ErrorCode.USER_CANCELED))).toContain(
            "bloqueado"
        )
    })

    it("returns null for unmapped errors", () => {
        expect(getTransferBeneficiaryFieldErrorMessage(new ApiError(ErrorCode.UNKNOWN))).toBeNull()
    })
})
