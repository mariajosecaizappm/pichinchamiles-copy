import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/presentation/pages/Offers/Campaign/OfferCampaignLandingContainer", () => ({
    default: ({
        slug,
        searchParams,
    }: {
        slug: string
        searchParams?: { page?: string }
    }) => (
        <div
            data-testid="offer-campaign-landing"
            data-slug={slug}
            data-page={searchParams?.page ?? "1"}
        />
    ),
}))

import Page from "@/app/ofertas/viajes-y-actividades/[slug]/page"

describe("Offer campaign page", () => {
    it("should render campaign landing with route slug", async () => {
        const element = await Page({
            params: Promise.resolve({ slug: "cyber-days" }),
        })

        render(element)

        expect(screen.getByTestId("offer-campaign-landing")).toHaveAttribute("data-slug", "cyber-days")
    })

    it("should forward searchParams page to campaign landing container", async () => {
        const element = await Page({
            params: Promise.resolve({ slug: "cyber-days" }),
            searchParams: Promise.resolve({ page: "2" }),
        })

        render(element)

        expect(screen.getByTestId("offer-campaign-landing")).toHaveAttribute("data-page", "2")
    })

})
