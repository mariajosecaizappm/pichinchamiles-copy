import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/presentation/pages/Offers/components/skeletons/OffersSkeleton", () => ({
    default: () => <div data-testid="offers-skeleton" />,
}))

import Loading from "@/app/ofertas/productos/(landing)/loading"

describe("Offers loading page", () => {
    it("should render the offers skeleton", () => {
        render(<Loading />)

        expect(screen.getByTestId("offers-skeleton")).toBeInTheDocument()
    })
})
