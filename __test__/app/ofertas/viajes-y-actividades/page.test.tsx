import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("next/dynamic", () => ({
    default: (loader: () => Promise<{ default: React.ComponentType }>) => {
        let Component: React.ComponentType | null = null;
        const loadPromise = loader().then(mod => { Component = mod.default });
        const DynamicComponent = (props: any) => {
            if (Component) return <Component {...props} />
            return null
        }
        DynamicComponent.displayName = "DynamicMock"
        DynamicComponent.preload = () => loadPromise
        return DynamicComponent
    }
}))

vi.mock("@/presentation/pages/Offers/Activities", () => ({
    default: () => <div data-testid="activity-offers">ActivityOffers</div>,
}))

import Page from "@/app/ofertas/viajes-y-actividades/page"

describe("Activity offers page", () => {
    it("should render ActivityOffers", async () => {
        render(<Page />)

        expect(await screen.findByTestId("activity-offers")).toBeInTheDocument()
    })
})
