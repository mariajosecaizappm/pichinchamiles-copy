import {render, screen, fireEvent} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import React, {useState} from "react"
import type {FaqFrequentQuestion} from "@/domain/entity/Pqrs/pqrs"

vi.mock("@/presentation/components/Accordion/Accordion", () => {
    function MockAccordion({ items }: { items: { id: string; title: string; content: React.ReactNode }[] }) {
        const [openId, setOpenId] = useState<string | null>(null)
        return (
            <div data-testid="accordion">
                {items.map((item) => (
                    <div key={item.id} data-testid="accordion-item">
                        <button
                            aria-expanded={openId === item.id}
                            onClick={() => setOpenId(openId === item.id ? null : item.id)}
                        >
                            {item.title}
                        </button>
                        {openId === item.id && <div data-testid="accordion-content">{item.content}</div>}
                    </div>
                ))}
            </div>
        )
    }
    return {default: MockAccordion}
})

import HomeFaqs from "@/presentation/pages/Home/components/HomeFaqs/HomeFaqs"

const CATEGORY_ID = "0d98e5bc-3a0d-4222-ad50-7a63d6f6514d"

const mockQuestions: FaqFrequentQuestion[] = [
    {
        id: "q1",
        title: "¿Cuánto tiempo tardan en acreditarse las millas?",
        faqCategoryId: CATEGORY_ID,
        description: "<p>Las millas se acreditan en 48 horas</p>",
    },
    {
        id: "q2",
        title: "¿Cómo puedo canjear mis millas?",
        faqCategoryId: CATEGORY_ID,
        description: "<p>Puedes canjear en la tienda online</p>",
    },
    {
        id: "q3",
        title: "Pregunta de otra categoría",
        faqCategoryId: "different-category-id",
        description: "<p>Esta no debería mostrarse</p>",
    },
]

describe("HomeFaqs", () => {
    it("should render the title", () => {
        render(<HomeFaqs frequentQuestions={mockQuestions} />)
        expect(screen.getByText("¿Tienes dudas?")).toBeInTheDocument()
    })

    it("should render the subtitle", () => {
        render(<HomeFaqs frequentQuestions={mockQuestions} />)
        expect(screen.getByText("Resolvemos tus preguntas más frecuentes")).toBeInTheDocument()
    })

    it("should render all provided question titles", () => {
        render(<HomeFaqs frequentQuestions={mockQuestions} />)
        expect(screen.getByText("¿Cuánto tiempo tardan en acreditarse las millas?")).toBeInTheDocument()
        expect(screen.getByText("¿Cómo puedo canjear mis millas?")).toBeInTheDocument()
        expect(screen.getByText("Pregunta de otra categoría")).toBeInTheDocument()
    })

    it("should render one accordion item per question", () => {
        const manyQuestions: FaqFrequentQuestion[] = Array.from({length: 10}, (_, i) => ({
            id: `q${i}`,
            title: `Pregunta ${i}`,
            faqCategoryId: CATEGORY_ID,
            description: `<p>Respuesta ${i}</p>`,
        }))

        render(<HomeFaqs frequentQuestions={manyQuestions} />)
        expect(screen.getAllByTestId("accordion-item")).toHaveLength(10)
    })

    it("should render the Ver más preguntas button", () => {
        render(<HomeFaqs frequentQuestions={mockQuestions} />)
        expect(screen.getByText("Ver más preguntas")).toBeInTheDocument()
    })

    it("should render empty accordion when no questions are provided", () => {
        render(<HomeFaqs frequentQuestions={[]} />)
        expect(screen.queryAllByTestId("accordion-item")).toHaveLength(0)
    })

    it("should use semantic section element with proper ARIA attributes", () => {
        render(<HomeFaqs frequentQuestions={mockQuestions} />)
        const section = screen.getByRole("region")
        expect(section).toBeInTheDocument()
        expect(section).toHaveAttribute("aria-labelledby", "faqs-title")
        expect(section).toHaveAttribute("aria-describedby", "faqs-description")
    })

    it("should have proper heading structure", () => {
        render(<HomeFaqs frequentQuestions={mockQuestions} />)
        const heading = screen.getByRole("heading", {name: "¿Tienes dudas?"})
        expect(heading).toBeInTheDocument()
        expect(heading).toHaveAttribute("id", "faqs-title")
    })

    it("should have accessible description element", () => {
        render(<HomeFaqs frequentQuestions={mockQuestions} />)
        const description = screen.getByText("Resolvemos tus preguntas más frecuentes")
        expect(description).toBeInTheDocument()
        expect(description).toHaveAttribute("id", "faqs-description")
    })

    it("should render the accordion container with the Preguntas frecuentes label", () => {
        render(<HomeFaqs frequentQuestions={mockQuestions} />)
        expect(screen.getByLabelText("Preguntas frecuentes")).toBeInTheDocument()
        expect(screen.getByTestId("accordion")).toBeInTheDocument()
    })

    it("should start with all accordion items closed", () => {
        render(<HomeFaqs frequentQuestions={mockQuestions} />)
        const buttons = screen.getAllByRole("button", {name: /¿/})
        buttons.forEach((btn) => {
            expect(btn).toHaveAttribute("aria-expanded", "false")
        })
    })

    it("should open an accordion item when its button is clicked", () => {
        render(<HomeFaqs frequentQuestions={mockQuestions} />)
        const firstButton = screen.getByRole("button", {name: /acreditarse/})
        fireEvent.click(firstButton)
        expect(firstButton).toHaveAttribute("aria-expanded", "true")
        expect(screen.getByTestId("accordion-content")).toBeInTheDocument()
    })

    it("should show only one accordion open at a time", () => {
        render(<HomeFaqs frequentQuestions={mockQuestions} />)
        const firstButton = screen.getByRole("button", {name: /acreditarse/})
        const secondButton = screen.getByRole("button", {name: /canjear/})

        fireEvent.click(firstButton)
        fireEvent.click(secondButton)

        expect(firstButton).toHaveAttribute("aria-expanded", "false")
        expect(secondButton).toHaveAttribute("aria-expanded", "true")
        expect(screen.getAllByTestId("accordion-content")).toHaveLength(1)
    })

    it("should close an open accordion item when clicked again", () => {
        render(<HomeFaqs frequentQuestions={mockQuestions} />)
        const firstButton = screen.getByRole("button", {name: /acreditarse/})

        fireEvent.click(firstButton)
        expect(firstButton).toHaveAttribute("aria-expanded", "true")

        fireEvent.click(firstButton)
        expect(firstButton).toHaveAttribute("aria-expanded", "false")
        expect(screen.queryByTestId("accordion-content")).not.toBeInTheDocument()
    })

    it("should render the answer HTML when a question is opened", () => {
        render(<HomeFaqs frequentQuestions={mockQuestions} />)
        fireEvent.click(screen.getByRole("button", {name: /acreditarse/}))
        expect(screen.getByTestId("accordion-content")).toBeInTheDocument()
        expect(screen.getByText("Las millas se acreditan en 48 horas")).toBeInTheDocument()
    })

    it("should have accessible Ver más button", () => {
        render(<HomeFaqs frequentQuestions={mockQuestions} />)
        const button = screen.getByRole("button", {name: "Ver más preguntas frecuentes"})
        expect(button).toBeInTheDocument()
    })

    it("should have focus management classes on the Ver más button", () => {
        render(<HomeFaqs frequentQuestions={mockQuestions} />)
        const button = screen.getByRole("button", {name: "Ver más preguntas frecuentes"})
        expect(button).toHaveClass("focus:outline-none", "focus:ring-2", "focus:ring-blue-500", "focus:ring-offset-2")
    })

    it("should render the Ver más SVG with aria-hidden", () => {
        render(<HomeFaqs frequentQuestions={mockQuestions} />)
        const hiddenIcons = document.querySelectorAll("[aria-hidden='true']")
        expect(hiddenIcons.length).toBeGreaterThan(0)
    })

    it("should be accessible by screen readers", () => {
        render(<HomeFaqs frequentQuestions={mockQuestions} />)
        expect(screen.getByRole("region")).toBeInTheDocument()
        expect(screen.getByRole("heading", {name: "¿Tienes dudas?"})).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Ver más preguntas frecuentes"})).toBeInTheDocument()
    })
})
