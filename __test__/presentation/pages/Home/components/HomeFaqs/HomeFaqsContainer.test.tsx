import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"

const mockGetFrequentQuestions = vi.fn()

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: () => ({
            getFrequentQuestions: mockGetFrequentQuestions,
        }),
    },
}))

vi.mock("@/presentation/pages/Home/components/HomeFaqs/HomeFaqsSkeleton", () => ({
    default: () => <div data-testid="home-faqs-skeleton" />,
}))

vi.mock("@/presentation/components/Accordion/Accordion", () => ({
    default: ({items}: {items: {id: string; title: string}[]}) => (
        <div data-testid="accordion">
            {items.map((item) => (
                <div key={item.id} data-testid="accordion-item">{item.title}</div>
            ))}
        </div>
    ),
}))

import HomeFaqsContainer from "@/presentation/pages/Home/components/HomeFaqs/HomeFaqsContainer"

const mockQuestions = [
    {
        id: "q1",
        title: "¿Cuánto tiempo tardan en acreditarse las millas?",
        faqCategoryId: "0d98e5bc-3a0d-4222-ad50-7a63d6f6514d",
        description: "<p>Las millas se acreditan en 48 horas</p>",
    },
    {
        id: "q2",
        title: "¿Cómo puedo canjear mis millas?",
        faqCategoryId: "0d98e5bc-3a0d-4222-ad50-7a63d6f6514d",
        description: "<p>Puedes canjear en la tienda online</p>",
    },
]

describe("HomeFaqsContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockGetFrequentQuestions.mockReset()
    })

    it("should render HomeFaqs when getFrequentQuestions succeeds", () => {
        mockGetFrequentQuestions.mockReturnValueOnce(mockQuestions)
        const Component = HomeFaqsContainer()
        render(Component)
        expect(screen.getByText("¿Tienes dudas?")).toBeInTheDocument()
    })

    it("should render skeleton when getFrequentQuestions throws", () => {
        mockGetFrequentQuestions.mockImplementationOnce(() => { throw new Error("Network error") })
        const Component = HomeFaqsContainer()
        render(Component)
        expect(screen.getByTestId("home-faqs-skeleton")).toBeInTheDocument()
    })
})
