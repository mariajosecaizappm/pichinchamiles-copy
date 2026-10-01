import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import pageMetadata from "@/presentation/config/metadata"

vi.mock("next/dynamic", () => ({
    __esModule: true,
    default: () => () => <div data-testid="product-offers" />,
}))

import Page, { metadata } from "@/app/ofertas/productos/(landing)/page"

describe("OfertasProductosLandingPage", () => {
    it("exports the correct metadata", () => {
        expect(metadata).toBe(pageMetadata.ofertasProductos)
    })

    it("renders ProductOffers", () => {
        render(<Page />)

        expect(screen.getByTestId("product-offers")).toBeInTheDocument()
    })
})
