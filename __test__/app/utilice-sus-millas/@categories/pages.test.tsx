import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/Categories", () => ({
    default: () => <div data-testid="product-categories">ProductCategories</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/categories", () => ({
    default: () => <div data-testid="travel-categories">TravelCategories</div>,
}))

import Default from "@/app/utilice-sus-millas/(main)/@categories/default"
import ProductsPage from "@/app/utilice-sus-millas/(main)/@categories/productos/page"
import ViajesYActividadesPage from "@/app/utilice-sus-millas/(main)/@categories/viajes-y-actividades/[activity]/page"

describe("@categories pages", () => {
    it("default should render null", () => {
        const { container } = render(<Default />)
        expect(container.innerHTML).toBe("")
    })

    it("productos page should render ProductCategories", () => {
        render(<ProductsPage />)
        expect(screen.getByTestId("product-categories")).toBeInTheDocument()
    })

    it("viajes-y-actividades [activity] page should render TravelCategories", () => {
        render(<ViajesYActividadesPage />)
        expect(screen.getByTestId("travel-categories")).toBeInTheDocument()
    })
})
