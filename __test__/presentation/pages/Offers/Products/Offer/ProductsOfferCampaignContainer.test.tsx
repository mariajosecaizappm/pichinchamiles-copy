import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"
import type { ProductsCampaign } from "@/domain/entity/Campaign/campaign"

const mocks = vi.hoisted(() => ({
    getOfferCampaignProducts: vi.fn(),
    containerGet: vi.fn(() => ({
        getOfferCampaignProducts: mocks.getOfferCampaignProducts,
    })),
    mockNotFound: vi.fn(),
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: { get: mocks.containerGet },
}))

vi.mock("next/navigation", () => ({
    notFound: () => {
        mocks.mockNotFound()
        throw new Error("NEXT_NOT_FOUND")
    },
}))

vi.mock("@/presentation/pages/Offers/Products/Offer/ProductsOfferCampaign", () => ({
    default: ({
        campaign,
        searchParams,
    }: {
        campaign: { mainTitle: string; slug: string }
        searchParams?: unknown
    }) => (
        <div
            data-testid="products-offer-campaign"
            data-title={campaign.mainTitle}
            data-slug={campaign.slug}
            data-search-params={JSON.stringify(searchParams)}
        />
    ),
}))

vi.mock("@/presentation/pages/Offers/Products/Offer/ProductsOfferCampaignSkeleton", () => ({
    default: ({ className }: { className?: string }) => (
        <div data-testid="products-offer-campaign-skeleton" data-class={className ?? ""} />
    ),
}))

import ProductsOfferCampaignContainer from "@/presentation/pages/Offers/Products/Offer/ProductsOfferCampaignContainer"

const buildCampaign = (): ProductsCampaign =>
    ({
        id: "c-1",
        mainTitle: "Cyber Days",
        secondaryTitle: "Best deals",
        slug: "cyber-days",
        categories: ["cat-1"],
        productIds: ["p-1"],
        priorityProducts: [],
        campaignType: "products",
        isOutstanding: false,
        positions: [],
        segmentCodes: [],
        hasLanding: false,
        numberElementsSlide: 0,
        order: 0,
        status: "active",
        priority: 0,
    } as unknown as ProductsCampaign)

describe("ProductsOfferCampaignContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.getOfferCampaignProducts.mockReset()
        mocks.containerGet.mockReturnValue({
            getOfferCampaignProducts: mocks.getOfferCampaignProducts,
        })
    })

    it("should resolve the GetOfferCampaignUseCase from the container", async () => {
        mocks.getOfferCampaignProducts.mockResolvedValue(buildCampaign())

        render(await ProductsOfferCampaignContainer({ slug: "cyber-days" }))

        expect(mocks.containerGet).toHaveBeenCalledWith(UseCaseTypes.GetOfferCampaignUseCase)
    })

    it("should call getOfferCampaignProducts with the provided slug", async () => {
        mocks.getOfferCampaignProducts.mockResolvedValue(buildCampaign())

        await ProductsOfferCampaignContainer({ slug: "cyber-days" })

        expect(mocks.getOfferCampaignProducts).toHaveBeenCalledWith("cyber-days")
    })

    it("should render ProductsOfferCampaign with the campaign and search params", async () => {
        mocks.getOfferCampaignProducts.mockResolvedValue(buildCampaign())

        render(
            await ProductsOfferCampaignContainer({
                slug: "cyber-days",
                searchParams: Promise.resolve({ category: "cat-1" }),
            }),
        )

        expect(screen.getByTestId("products-offer-campaign")).toHaveAttribute(
            "data-title",
            "Cyber Days",
        )
        expect(screen.getByTestId("products-offer-campaign")).toHaveAttribute(
            "data-search-params",
            JSON.stringify({ category: "cat-1" }),
        )
    })

    it("should call notFound and render skeleton when the campaign is not found", async () => {
        mocks.getOfferCampaignProducts.mockResolvedValue(null)

        render(await ProductsOfferCampaignContainer({ slug: "missing-campaign" }))

        expect(mocks.mockNotFound).toHaveBeenCalled()
        expect(screen.getByTestId("products-offer-campaign-skeleton")).toBeInTheDocument()
    })

    it("should render the skeleton when the use case throws", async () => {
        mocks.getOfferCampaignProducts.mockRejectedValue(new Error("boom"))

        render(await ProductsOfferCampaignContainer({ slug: "cyber-days" }))

        expect(screen.getByTestId("products-offer-campaign-skeleton")).toBeInTheDocument()
    })
})
