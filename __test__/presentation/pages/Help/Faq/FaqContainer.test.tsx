import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import type { FaqCategoryWithQuestions } from "@/domain/entity/Pqrs/pqrs"

const mocks = vi.hoisted(() => ({
    execute: vi.fn(),
    get: vi.fn(),
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.get,
    },
}))

vi.mock("@/presentation/pages/Help/Faq/Faq", () => ({
    default: ({ faqCategories }: { faqCategories: FaqCategoryWithQuestions[] }) => (
        <div data-testid="faq-component" data-count={faqCategories.length}>Faq</div>
    ),
}))

import FaqContainer from "@/presentation/pages/Help/Faq/FaqContainer"

describe("FaqContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.get.mockReturnValue({ execute: mocks.execute })
    })

    it("should render the Faq component with categories when the use case succeeds", async () => {
        const faqCategories: FaqCategoryWithQuestions[] = [
            { id: "cat-1", name: "Información del programa", questions: [] },
            { id: "cat-2", name: "Mi cuenta", questions: [] },
        ]
        mocks.execute.mockResolvedValue(faqCategories)

        const jsx = await FaqContainer()
        render(jsx as React.ReactElement)

        expect(screen.getByTestId("faq-component")).toBeInTheDocument()
        expect(screen.getByTestId("faq-component")).toHaveAttribute("data-count", "2")
    })

    it("should return null when the use case throws an error", async () => {
        mocks.execute.mockRejectedValue(new Error("API error"))

        const result = await FaqContainer()

        expect(result).toBeNull()
    })

    it("should return null when container.get throws", async () => {
        mocks.get.mockImplementation(() => { throw new Error("DI error") })

        const result = await FaqContainer()

        expect(result).toBeNull()
    })

    it("should pass empty categories array to Faq when use case returns empty array", async () => {
        mocks.execute.mockResolvedValue([])

        const jsx = await FaqContainer()
        render(jsx as React.ReactElement)

        expect(screen.getByTestId("faq-component")).toHaveAttribute("data-count", "0")
    })
})
