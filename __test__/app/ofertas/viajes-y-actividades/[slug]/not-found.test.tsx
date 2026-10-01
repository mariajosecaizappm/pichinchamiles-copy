import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import NotFoundPage, { metadata } from "@/app/ofertas/viajes-y-actividades/[slug]/not-found"

describe("Offer campaign not found page", () => {
    it("should export metadata with the 404 page title", () => {
        expect(metadata.title).toBe("No existe esta página")
    })

    it("should render the not found message", () => {
        render(<NotFoundPage />)

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Oferta no encontrada")
    })
})