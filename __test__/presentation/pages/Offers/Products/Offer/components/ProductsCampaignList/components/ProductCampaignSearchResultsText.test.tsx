import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import ProductCampaignSearchResultsText from "@/presentation/pages/Offers/Products/Offer/components/ProductsCampaignList/components/ProductCampaignSearchResultsText"

describe("ProductCampaignSearchResultsText", () => {
    it("returns null when there is no search query", () => {
        const { container } = render(
            <ProductCampaignSearchResultsText searchQuery="" total={5} />
        )

        expect(container.firstChild).toBeNull()
    })

    it("renders the no-results message when total is zero", () => {
        render(<ProductCampaignSearchResultsText searchQuery="shoes" total={0} />)

        expect(screen.getByText("No se encontraron resultados")).toBeInTheDocument()
    })

    it("renders the result text with total when there are matches", () => {
        render(<ProductCampaignSearchResultsText searchQuery="  miles  " total={7} />)

        expect(screen.getByText(/Resultado de/i)).toHaveTextContent(/Resultado de .*miles.* \(7\)/)
    })
})
