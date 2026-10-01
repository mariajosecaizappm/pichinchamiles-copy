import {describe, it, expect, vi, beforeEach} from "vitest"
import type {Requeriment} from "@/domain/entity/Pqrs/requirement"

const algoliaSearchMock = vi.fn()
const axiosPostMock = vi.fn()

vi.mock("@/data/provider/algolia/algoliaClient", () => ({
    default: class {
        search = algoliaSearchMock
    },
}))

vi.mock("@/data/provider/axios/axiosPrivate", () => ({
    default: {
        post: axiosPostMock,
    },
}))

describe("RequirementRepository", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        process.env.NEXT_PUBLIC_PROGRAM_ID = "test-program-id"
    })

    describe("getRequerimentTypes", () => {
        it("should call algoliaClient.search with correct params", async () => {
            vi.resetModules()
            algoliaSearchMock.mockResolvedValue({
                list: {
                    data: [],
                    pagination: {page: 1, pageSize: 100, total: 0, totalPages: 0},
                },
            })

            const {default: RequirementRepository} = await import("@/data/repository/Pqrs/RequirementRepository")
            const repository = new RequirementRepository()

            await repository.getRequerimentTypes({page: 1, pageSize: 100})

            expect(algoliaSearchMock).toHaveBeenCalledWith({
                params: {
                    page: 1,
                    pageSize: 100,
                    type: "pqrsrequirementtype",
                    programId: "test-program-id",
                },
                adapter: expect.any(Function),
            })
        })

        it("should return the list data", async () => {
            vi.resetModules()
            const mockTypes = [
                {id: "type-1", name: "Type one", subtypes: []},
            ]
            algoliaSearchMock.mockResolvedValue({
                list: {
                    data: mockTypes,
                    pagination: {page: 1, pageSize: 100, total: 1, totalPages: 1},
                },
            })

            const {default: RequirementRepository} = await import("@/data/repository/Pqrs/RequirementRepository")
            const repository = new RequirementRepository()

            const result = await repository.getRequerimentTypes({page: 1, pageSize: 100})

            expect(result).toEqual({
                data: mockTypes,
                pagination: {page: 1, pageSize: 100, total: 1, totalPages: 1},
            })
        })

        it("should propagate algolia errors", async () => {
            vi.resetModules()
            algoliaSearchMock.mockRejectedValue(new Error("algolia error"))

            const {default: RequirementRepository} = await import("@/data/repository/Pqrs/RequirementRepository")
            const repository = new RequirementRepository()

            await expect(repository.getRequerimentTypes({})).rejects.toThrow("algolia error")
        })
    })

    describe("createRequeriment", () => {
        it("should post to the help-form-responses endpoint with recaptcha headers", async () => {
            vi.resetModules()
            axiosPostMock.mockResolvedValue(undefined)

            const {default: RequirementRepository} = await import("@/data/repository/Pqrs/RequirementRepository")
            const repository = new RequirementRepository()

            const requeriment = {
                identificationNumber: "1234567890",
                identificationType: "CI",
                fullname: "Juan Pérez",
                description: "Test description",
                email: "juan@example.com",
                pqrsRequirementTypeId: "type-1",
                pqrsRequirementSubTypeId: "sub-1",
            }

            await repository.createRequeriment(requeriment, "action", "token")

            expect(axiosPostMock).toHaveBeenCalledWith(
                expect.stringContaining("/test-program-id/help-form-responses"),
                requeriment,
                {
                    headers: {
                        Recaptchaaction: "action",
                        Recaptchatoken: "token",
                    },
                },
            )
        })

        it("should propagate axios errors", async () => {
            vi.resetModules()
            axiosPostMock.mockRejectedValue(new Error("post error"))

            const {default: RequirementRepository} = await import("@/data/repository/Pqrs/RequirementRepository")
            const repository = new RequirementRepository()

            await expect(repository.createRequeriment({} as unknown as Requeriment, "action", "token")).rejects.toThrow("post error")
        })
    })
})
