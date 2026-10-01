import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@/presentation/pages/Offers/Activities", () => ({
    default: () => <div data-testid="activity-offers">ActivityOffers</div>,
}))

vi.mock("@/presentation/pages/Offers/components/skeletons/OffersSkeleton", () => ({
    default: () => <div>Loading...</div>,
}))

vi.mock("next/dynamic", () => ({
    default: (importFn: () => Promise<{ default: React.ComponentType }>) => {
        let Comp: React.ComponentType | null = null
        importFn().then((mod) => { Comp = mod.default })
        return (props: Record<string, unknown>) => Comp ? <Comp {...props} /> : null
    },
}))

import Page from "@/app/ofertas/viajes-y-actividades/page"

describe("Travel offers page", () => {
    it("should render ActivityOffers", async () => {
        render(<Page />)

        expect(await screen.findByTestId("activity-offers")).toBeInTheDocument()
    })
})
