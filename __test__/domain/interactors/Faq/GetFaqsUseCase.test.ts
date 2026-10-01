import {describe, it, expect, vi, beforeEach} from "vitest"
import type {IPQRSSRepository} from "@/domain/repository/Pqrs/IPqrsRepository"
import GetFaqsUseCase from "@/domain/interactors/Faq/GetFaqsUseCase"

const ALL_CATEGORY_NAMES = [
    "Información del programa",
    "Mi cuenta",
    "Productos",
    "Viajes",
] as const

const mockCategories = [
    {id: "cat-viajes", name: "Viajes"},
    {id: "cat-cuenta", name: "Mi cuenta"},
    {id: "cat-productos", name: "Productos"},
    {id: "cat-programa", name: "Información del programa"},
]

const mockQuestions = [
    {id: "q1", title: "Pregunta programa 1", faqCategoryId: "cat-programa", description: "<p>Resp 1</p>"},
    {id: "q2", title: "Pregunta programa 2", faqCategoryId: "cat-programa", description: "<p>Resp 2</p>"},
    {id: "q3", title: "Pregunta cuenta", faqCategoryId: "cat-cuenta", description: "<p>Resp 3</p>"},
    {id: "q4", title: "Pregunta productos", faqCategoryId: "cat-productos", description: "<p>Resp 4</p>"},
    {id: "q5", title: "Pregunta viajes", faqCategoryId: "cat-viajes", description: "<p>Resp 5</p>"},
]

describe("GetFaqsUseCase", () => {
    let pqrsRepository: IPQRSSRepository
    let useCase: GetFaqsUseCase

    beforeEach(() => {
        pqrsRepository = {
            getFaqCategories: vi.fn(),
            getFrequentQuestions: vi.fn(),
        } as unknown as IPQRSSRepository

        useCase = new GetFaqsUseCase(pqrsRepository)
    })

    it("should call both repository methods", async () => {
        vi.mocked(pqrsRepository.getFaqCategories).mockResolvedValue(mockCategories)
        vi.mocked(pqrsRepository.getFrequentQuestions).mockResolvedValue(mockQuestions)

        await useCase.execute()

        expect(pqrsRepository.getFaqCategories).toHaveBeenCalledTimes(1)
        expect(pqrsRepository.getFrequentQuestions).toHaveBeenCalledTimes(1)
    })

    it("should return categories in the fixed business order", async () => {
        vi.mocked(pqrsRepository.getFaqCategories).mockResolvedValue(mockCategories)
        vi.mocked(pqrsRepository.getFrequentQuestions).mockResolvedValue(mockQuestions)

        const result = await useCase.execute()

        expect(result.map((category) => category.name)).toEqual(ALL_CATEGORY_NAMES)
    })

    it("should filter out backend categories not in the fixed list", async () => {
        vi.mocked(pqrsRepository.getFaqCategories).mockResolvedValue([
            ...mockCategories,
            {id: "cat-otra", name: "Otra categoría"},
        ])
        vi.mocked(pqrsRepository.getFrequentQuestions).mockResolvedValue(mockQuestions)

        const result = await useCase.execute()

        expect(result).toHaveLength(4)
        expect(result.some((category) => category.name === "Otra categoría")).toBe(false)
    })

    it("should associate each question with the correct category", async () => {
        vi.mocked(pqrsRepository.getFaqCategories).mockResolvedValue(mockCategories)
        vi.mocked(pqrsRepository.getFrequentQuestions).mockResolvedValue(mockQuestions)

        const result = await useCase.execute()

        const programCategory = result.find((category) => category.name === "Información del programa")
        expect(programCategory?.questions).toHaveLength(2)
        expect(programCategory?.questions.every((q) => q.faqCategoryId === "cat-programa")).toBe(true)
    })

    it("should return only categories that exist in the backend", async () => {
        vi.mocked(pqrsRepository.getFaqCategories).mockResolvedValue([
            {id: "cat-programa", name: "Información del programa"},
            {id: "cat-cuenta", name: "Mi cuenta"},
        ])
        vi.mocked(pqrsRepository.getFrequentQuestions).mockResolvedValue(mockQuestions)

        const result = await useCase.execute()

        expect(result).toHaveLength(2)
        expect(result[0].name).toBe("Información del programa")
        expect(result[1].name).toBe("Mi cuenta")
    })

    it("should return empty categories array when backend returns none", async () => {
        vi.mocked(pqrsRepository.getFaqCategories).mockResolvedValue([])
        vi.mocked(pqrsRepository.getFrequentQuestions).mockResolvedValue([])

        const result = await useCase.execute()

        expect(result).toEqual([])
    })

    it("should match category names after trimming leading and trailing whitespace", async () => {
        vi.mocked(pqrsRepository.getFaqCategories).mockResolvedValue([
            {id: "cat-programa", name: "  Información del programa  "},
        ])
        vi.mocked(pqrsRepository.getFrequentQuestions).mockResolvedValue([
            {id: "q1", title: "Question", faqCategoryId: "cat-programa", description: "Answer"},
        ])

        const result = await useCase.execute()

        expect(result).toHaveLength(1)
        expect(result[0].id).toBe("cat-programa")
        expect(result[0].questions).toHaveLength(1)
    })

    it("should ignore categories whose names do not match any known category even after trimming", async () => {
        vi.mocked(pqrsRepository.getFaqCategories).mockResolvedValue([
            {id: "cat-unknown", name: "  Categoría desconocida  "},
        ])
        vi.mocked(pqrsRepository.getFrequentQuestions).mockResolvedValue([])

        const result = await useCase.execute()

        expect(result).toEqual([])
    })
})
