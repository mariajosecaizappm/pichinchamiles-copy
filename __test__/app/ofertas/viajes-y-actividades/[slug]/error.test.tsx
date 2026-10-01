import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/presentation/pages/Offers/Campaign/OfferCampaignLandingSkeleton", () => ({
    default: () => <div data-testid="offer-campaign-landing-skeleton" />,
}))

import ErrorPage from "@/app/ofertas/viajes-y-actividades/[slug]/error"

describe("Offer campaign error page", () => {
    it("should render the campaign landing skeleton", () => {
        render(<ErrorPage />)

        expect(screen.getByTestId("offer-campaign-landing-skeleton")).toBeInTheDocument()
    })
})
