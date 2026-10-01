import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import CategoriesPage from "@/app/utilice-sus-millas/(main)/@categories/viajes-y-actividades/[activity]/page"

// Mock the TravelCategories component
vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/categories", () => ({
    default: () => <div data-testid="travel-categories-component">Travel Categories Component</div>
}))

describe("Viajes y Actividades Categories Page", () => {
    it("should render the TravelCategories component", () => {
        render(<CategoriesPage />)
        
        expect(screen.getByTestId("travel-categories-component")).toBeInTheDocument()
        expect(screen.getByText("Travel Categories Component")).toBeInTheDocument()
    })

    it("should be a simple wrapper component", () => {
        const { container } = render(<CategoriesPage />)
        
        // The page should just render the TravelCategories component without additional wrapper elements
        expect(container.firstChild).toBe(screen.getByTestId("travel-categories-component"))
    })

    it("should have correct default export", () => {
        expect(CategoriesPage).toBeDefined()
        expect(typeof CategoriesPage).toBe("function")
    })

    it("should have correct component name", () => {
        expect(CategoriesPage.name).toBe("ViajesYActividadesPage")
    })
})
