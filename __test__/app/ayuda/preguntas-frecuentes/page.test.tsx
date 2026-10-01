import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@/presentation/pages/Help/Faq", () => ({
    default: () => <div data-testid="faq-container">FaqContainer</div>,
}))

import PreguntasFrecuentesPage from "@/app/ayuda/preguntas-frecuentes/page"

describe("PreguntasFrecuentesPage", () => {
    it("should render the Faq component", () => {
        render(<PreguntasFrecuentesPage />)
        expect(screen.getByTestId("faq-container")).toBeInTheDocument()
    })
})
