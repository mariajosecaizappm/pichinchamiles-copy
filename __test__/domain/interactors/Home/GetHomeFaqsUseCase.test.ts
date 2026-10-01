import {describe, it, expect, vi, beforeEach} from "vitest"
import GetHomeFaqsUseCase from "@/domain/interactors/Home/GetHomeFaqsUseCase"
import type { IPQRSSRepository } from "@/domain/repository/Pqrs/IPqrsRepository"
import type { FaqFrequentQuestion } from "@/domain/entity/Pqrs/pqrs"

const HOME_FAQS: FaqFrequentQuestion[] = [
    {
        id: '1',
        faqCategoryId: 'home',
        title: '¿Cuál es el tiempo de entrega de los productos?',
        description: 'Los productos del catálogo Pichincha Miles se entregan en un plazo máximo de 7 días hábiles a partir de la fecha de canje.\n\nSi tienes alguna duda adicional, comunícate al 1800 PBMILE (276453).',
    },
    {
        id: '2',
        faqCategoryId: 'home',
        title: '¿Los productos tienen garantía?',
        description: 'Si, los productos tienen la garantía del proveedor que los suministra.',
    },
    {
        id: '3',
        faqCategoryId: 'home',
        title: '¿Existe un límite para hacer uso de las millas?',
        description: 'No existe un límite para utilizar tus millas en el programa de recompensas.',
    },
    {
        id: '4',
        faqCategoryId: 'home',
        title: '¿Cuánto tiempo tardan en acreditarse en mi cuenta las millas generadas?',
        description: 'Las millas generadas se acreditarán en tu cuenta Pichincha Miles en aproximadamente 45 días a partir de la fecha en que se realizó el consumo y una vez que hayas efectuado el pago puntual de tu tarjeta de crédito.\n\nSi tienes dudas adicionales, comunícate al 1800 al PBMILE (276453)',
    },
    {
        id: '5',
        faqCategoryId: 'home',
        title: '¿Cómo acumulo millas en el Programa Pichincha Miles?',
        description: 'Acumulas millas cada vez que realizas compras con tus tarjetas de crédito Pichincha Miles Mastercard o Pichincha Miles Visa.\n\nLas millas se registran en tu cuenta Pichincha Miles y podrás usarlas para canjear viajes, productos, experiencias y otras opciones disponibles en el catálogo.',
    },
    {
        id: '6',
        faqCategoryId: 'home',
        title: '¿Qué tipo de canjes se pueden realizar con las millas de Pichincha Miles?',
        description: 'Puedes realizar el canje de tus millas Pichincha Miles por pasajes aéreos en más de 250 aerolíneas, alojamiento en más de 175.000 hoteles alrededor del mundo, actividades turísticas nacionales e internacionales, alquiler de automóviles, tickets Disney y mucho más. No existe un valor mínimo requerido para el uso de tus millas.\n\nSi tienes alguna duda adicional, comunícate al 1800 PBMILE (276453).',
    },
]

describe("GetHomeFaqsUseCase", () => {
    let pqrsRepository: IPQRSSRepository
    let useCase: GetHomeFaqsUseCase

    beforeEach(() => {
        pqrsRepository = {
            getHomeFaqs: vi.fn().mockReturnValue(HOME_FAQS),
            getFrequentQuestions: vi.fn(),
            getFaqCategories: vi.fn(),
        } as unknown as IPQRSSRepository

        useCase = new GetHomeFaqsUseCase(pqrsRepository)
    })

    describe("getFrequentQuestions", () => {
        it("should return exactly 6 hardcoded FAQ items", () => {
            const result = useCase.getFrequentQuestions()

            expect(result).toHaveLength(6)
        })

        it("should return all expected question titles in order", () => {
            const result = useCase.getFrequentQuestions()

            expect(result[0].title).toBe("¿Cuál es el tiempo de entrega de los productos?")
            expect(result[1].title).toBe("¿Los productos tienen garantía?")
            expect(result[2].title).toBe("¿Existe un límite para hacer uso de las millas?")
            expect(result[3].title).toBe("¿Cuánto tiempo tardan en acreditarse en mi cuenta las millas generadas?")
            expect(result[4].title).toBe("¿Cómo acumulo millas en el Programa Pichincha Miles?")
            expect(result[5].title).toBe("¿Qué tipo de canjes se pueden realizar con las millas de Pichincha Miles?")
        })

        it("should return items with non-empty descriptions", () => {
            const result = useCase.getFrequentQuestions()

            result.forEach((faq) => {
                expect(faq.description.trim().length).toBeGreaterThan(0)
            })
        })

        it("should return items with unique ids", () => {
            const result = useCase.getFrequentQuestions()
            const ids = result.map((faq) => faq.id)

            expect(new Set(ids).size).toBe(result.length)
        })

        it("should return the same result on every call", () => {
            const first = useCase.getFrequentQuestions()
            const second = useCase.getFrequentQuestions()

            expect(first).toEqual(second)
        })
    })
})
