import {describe, it, expect, vi, beforeEach} from "vitest"
import GetRequierimentTypesUseCase from "@/domain/interactors/Faq/GetRequierimentTypesUseCase"
import type IRequirementRepository from "@/domain/repository/Pqrs/IRequirementRepository"
import type {RequerimentType} from "@/domain/entity/Pqrs/requirement"

describe("GetRequierimentTypesUseCase", () => {
    let repository: IRequirementRepository
    let useCase: GetRequierimentTypesUseCase

    beforeEach(() => {
        repository = {
            getRequerimentTypes: vi.fn(),
            createRequeriment: vi.fn(),
        } as unknown as IRequirementRepository

        useCase = new GetRequierimentTypesUseCase(repository)
    })

    it("should call repository.getRequerimentTypes with page 1 and pageSize 100", async () => {
        vi.mocked(repository.getRequerimentTypes).mockResolvedValue({
            data: [],
            pagination: {page: 1, pageSize: 100, total: 0, totalPages: 0},
        })

        await useCase.execute()

        expect(repository.getRequerimentTypes).toHaveBeenCalledWith({
            page: 1,
            pageSize: 100,
        })
    })

    it("should return the data from the repository list", async () => {
        const mockTypes: RequerimentType[] = [
            {id: "type-1", name: "Type one", subtypes: []},
            {id: "type-2", name: "Type two", subtypes: [{id: "sub-1", name: "Subtype one"}]},
        ]

        vi.mocked(repository.getRequerimentTypes).mockResolvedValue({
            data: mockTypes,
            pagination: {page: 1, pageSize: 100, total: 2, totalPages: 1},
        })

        const result = await useCase.execute()

        expect(result).toEqual(mockTypes)
        expect(result).toHaveLength(2)
    })

    it("should return empty array when no types are found", async () => {
        vi.mocked(repository.getRequerimentTypes).mockResolvedValue({
            data: [],
            pagination: {page: 1, pageSize: 100, total: 0, totalPages: 0},
        })

        const result = await useCase.execute()

        expect(result).toEqual([])
    })

    it("should propagate repository errors", async () => {
        vi.mocked(repository.getRequerimentTypes).mockRejectedValue(new Error("repository error"))

        await expect(useCase.execute()).rejects.toThrow("repository error")
    })
})
