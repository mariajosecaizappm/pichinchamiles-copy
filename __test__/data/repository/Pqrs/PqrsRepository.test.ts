import {describe, it, expect, vi, beforeEach} from "vitest"

const algoliaSearchMock = vi.fn()
vi.mock("@/data/provider/algolia/algoliaClient", () => ({
    default: class {
        search = algoliaSearchMock
    },
}))

describe("when interacting with PqrsRepository", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        process.env.NEXT_PUBLIC_PROGRAM_ID = "test-program-id"
    })

    describe("getFaqCategories", () => {
        it("should call algoliaClient.search with correct params", async () => {
            vi.resetModules()

            algoliaSearchMock.mockResolvedValue({
                list: {
                    data: [],
                    pagination: {page: 1, pageSize: 100, total: 0, totalPages: 0},
                },
            })

            const {default: PQRSSRepository} = await import("@/data/repository/Pqrs/PqrsRepository")
            const repository = new PQRSSRepository()

            await repository.getFaqCategories()

            expect(algoliaSearchMock).toHaveBeenCalledWith({
                params: {
                    programId: "test-program-id",
                    type: "faqcategory",
                    page: 1,
                    pageSize: 100,
                },
                adapter: expect.any(Function),
            })
        })

        it("should return list of faq categories", async () => {
            vi.resetModules()

            const mockCategories = [
                {id: "cat-1", name: "Información del programa"},
                {id: "cat-2", name: "Canjeo de millas"},
            ]

            algoliaSearchMock.mockResolvedValue({
                list: {
                    data: mockCategories,
                    pagination: {page: 1, pageSize: 100, total: 2, totalPages: 1},
                },
            })

            const {default: PQRSSRepository} = await import("@/data/repository/Pqrs/PqrsRepository")
            const repository = new PQRSSRepository()

            const result = await repository.getFaqCategories()

            expect(result).toEqual(mockCategories)
            expect(result).toHaveLength(2)
        })

        it("should return empty array when no categories found", async () => {
            vi.resetModules()

            algoliaSearchMock.mockResolvedValue({
                list: {
                    data: [],
                    pagination: {page: 1, pageSize: 100, total: 0, totalPages: 0},
                },
            })

            const {default: PQRSSRepository} = await import("@/data/repository/Pqrs/PqrsRepository")
            const repository = new PQRSSRepository()

            const result = await repository.getFaqCategories()

            expect(result).toEqual([])
        })

        it("should handle algolia search errors", async () => {
            vi.resetModules()

            algoliaSearchMock.mockRejectedValue(new Error("Algolia search failed"))

            const {default: PQRSSRepository} = await import("@/data/repository/Pqrs/PqrsRepository")
            const repository = new PQRSSRepository()

            await expect(repository.getFaqCategories()).rejects.toThrow("Algolia search failed")
        })
    })

    describe("getFrequentQuestions", () => {
        it("should call algoliaClient.search with correct params", async () => {
            vi.resetModules()

            algoliaSearchMock.mockResolvedValue({
                list: {
                    data: [],
                    pagination: {page: 1, pageSize: 100, total: 0, totalPages: 0},
                },
            })

            const {default: PQRSSRepository} = await import("@/data/repository/Pqrs/PqrsRepository")
            const repository = new PQRSSRepository()

            await repository.getFrequentQuestions()

            expect(algoliaSearchMock).toHaveBeenCalledWith({
                params: {
                    programId: "test-program-id",
                    type: "faq",
                    page: 1,
                    pageSize: 100,
                },
                adapter: expect.any(Function),
            })
        })

        it("should return list of frequent questions from algolia response", async () => {
            vi.resetModules()

            const mockQuestions = [
                {
                    id: "q1",
                    title: "¿Cuánto tiempo tardan en acreditarse las millas?",
                    faqCategoryId: "0d98e5bc-3a0d-4222-ad50-7a63d6f6514d",
                    description: "<p>Las millas se acreditan en 48 horas hábiles</p>",
                },
                {
                    id: "q2",
                    title: "¿Cómo puedo canjear mis millas?",
                    faqCategoryId: "0d98e5bc-3a0d-4222-ad50-7a63d6f6514d",
                    description: "<p>Puedes canjear tus millas en nuestra tienda online</p>",
                },
            ]

            algoliaSearchMock.mockResolvedValue({
                list: {
                    data: mockQuestions,
                    pagination: {page: 1, pageSize: 100, total: 2, totalPages: 1},
                },
            })

            const {default: PQRSSRepository} = await import("@/data/repository/Pqrs/PqrsRepository")
            const repository = new PQRSSRepository()

            const result = await repository.getFrequentQuestions()

            expect(result).toEqual(mockQuestions)
            expect(result).toHaveLength(2)
        })

        it("should return empty array when no questions are found", async () => {
            vi.resetModules()

            algoliaSearchMock.mockResolvedValue({
                list: {
                    data: [],
                    pagination: {page: 1, pageSize: 100, total: 0, totalPages: 0},
                },
            })

            const {default: PQRSSRepository} = await import("@/data/repository/Pqrs/PqrsRepository")
            const repository = new PQRSSRepository()

            const result = await repository.getFrequentQuestions()

            expect(result).toEqual([])
            expect(result).toHaveLength(0)
        })

        it("should handle algolia search errors", async () => {
            vi.resetModules()

            algoliaSearchMock.mockRejectedValue(new Error("Algolia search failed"))

            const {default: PQRSSRepository} = await import("@/data/repository/Pqrs/PqrsRepository")
            const repository = new PQRSSRepository()

            await expect(repository.getFrequentQuestions()).rejects.toThrow("Algolia search failed")
        })
    })
})
