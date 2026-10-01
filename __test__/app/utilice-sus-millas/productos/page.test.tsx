import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import ProductosPage from "@/app/utilice-sus-millas/(main)/productos/page"

// Mock dependencies
vi.mock("@/presentation/pages/Home/UseYourMiles/Products/HeroCarousel", () => ({
    default: () => <div data-testid="home-explore-products-banner">Home Explore Products Banner</div>,
}))

vi.mock("@/presentation/pages/Home/components/HomeExploreProducts/components/BodyBanners", () => ({
    default: () => <div data-testid="body-banners">Body Banners</div>,
}))

vi.mock("@/presentation/pages/Home/components/HomeExploreProducts/components/NewItemsForYou", () => ({
    default: () => <div data-testid="new-items-for-you">New Items For You</div>,
}))

vi.mock("@/presentation/pages/Home/components/HomeExploreProducts/components/Offers", () => ({
    default: () => <div data-testid="offers">Offers</div>,
}))

describe("productospage", () => {
    it("should render all components", () => {
        render(<ProductosPage />)
        
        expect(screen.getByTestId("home-explore-products-banner")).toBeInTheDocument()
        expect(screen.getByTestId("new-items-for-you")).toBeInTheDocument()
        expect(screen.getByTestId("offers")).toBeInTheDocument()
        expect(screen.getByTestId("body-banners")).toBeInTheDocument()
    })

    it("should render as a div element", () => {
        const {container} = render(<ProductosPage />)
        
        const contentDiv = container.firstChild as HTMLElement
        expect(contentDiv.tagName).toBe("DIV")
    })
})
