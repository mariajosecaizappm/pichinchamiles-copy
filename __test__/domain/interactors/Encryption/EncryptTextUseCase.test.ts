import { describe, expect, it, vi } from "vitest"
import EncryptTextUseCase from "@/domain/interactors/Encryption/EncryptTextUseCase"

describe("EncryptTextUseCase", () => {
    it("delegates encryption to the service", async () => {
        const encryptionService = {
            encryptText: vi.fn().mockResolvedValue("encrypted-value"),
        }

        const useCase = new EncryptTextUseCase(encryptionService)

        await expect(useCase.encryptText("1234567890")).resolves.toBe("encrypted-value")
        expect(encryptionService.encryptText).toHaveBeenCalledWith("1234567890")
    })
})
