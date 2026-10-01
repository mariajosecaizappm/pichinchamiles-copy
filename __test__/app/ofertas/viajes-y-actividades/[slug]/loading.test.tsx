import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/presentation/pages/Offers/Campaign/OfferCampaignLandingSkeleton", () => ({
    default: () => <div data-testid="offer-campaign-landing-skeleton" />,
}))

import Loading from "@/app/ofertas/viajes-y-actividades/[slug]/loading"

describe("Offer campaign loading page", () => {
    it("should render the campaign landing skeleton", () => {
        render(<Loading />)

        expect(screen.getByTestId("offer-campaign-landing-skeleton")).toBeInTheDocument()
    })
})
