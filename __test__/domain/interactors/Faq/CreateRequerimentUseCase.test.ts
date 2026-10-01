import {describe, it, expect, vi, beforeEach} from "vitest"
import CreateRequerimentUseCase from "@/domain/interactors/Faq/CreateRequerimentUseCase"
import type IRequirementRepository from "@/domain/repository/Pqrs/IRequirementRepository"
import type {Requeriment} from "@/domain/entity/Pqrs/requirement"
import RecaptchaService from "@/domain/services/RecaptchaService"

vi.mock("@/domain/services/RecaptchaService", () => ({
    default: {
        getToken: vi.fn(),
    },
}))

describe("CreateRequerimentUseCase", () => {
    let repository: IRequirementRepository
    let useCase: CreateRequerimentUseCase

    const requeriment: Requeriment = {
        identificationNumber: "1234567890",
        identificationType: "CI",
        fullname: "Juan Pérez",
        description: "Test description",
        email: "juan@example.com",
        pqrsRequirementTypeId: "type-1",
        pqrsRequirementSubTypeId: "sub-1",
    }

    beforeEach(() => {
        repository = {
            getRequerimentTypes: vi.fn(),
            createRequeriment: vi.fn(),
        } as unknown as IRequirementRepository

        useCase = new CreateRequerimentUseCase(repository)

        vi.mocked(RecaptchaService.getToken).mockReset()
    })

    it("should request a recaptcha token with the PqrsRequest action", async () => {
        vi.mocked(RecaptchaService.getToken).mockResolvedValue("token")
        vi.mocked(repository.createRequeriment).mockResolvedValue(undefined)

        await useCase.addPqrs(requeriment)

        expect(RecaptchaService.getToken).toHaveBeenCalledWith("PqrsRequest")
    })

    it("should call repository.createRequeriment with the requeriment and recaptcha values", async () => {
        vi.mocked(RecaptchaService.getToken).mockResolvedValue("recaptcha-token")
        vi.mocked(repository.createRequeriment).mockResolvedValue(undefined)

        await useCase.addPqrs(requeriment)

        expect(repository.createRequeriment).toHaveBeenCalledWith(
            requeriment,
            "PqrsRequest",
            "recaptcha-token",
        )
    })

    it("should propagate repository errors", async () => {
        vi.mocked(RecaptchaService.getToken).mockResolvedValue("token")
        vi.mocked(repository.createRequeriment).mockRejectedValue(new Error("repository error"))

        await expect(useCase.addPqrs(requeriment)).rejects.toThrow("repository error")
    })

    it("should propagate recaptcha errors", async () => {
        vi.mocked(RecaptchaService.getToken).mockRejectedValue(new Error("recaptcha error"))

        await expect(useCase.addPqrs(requeriment)).rejects.toThrow("recaptcha error")
    })
})
