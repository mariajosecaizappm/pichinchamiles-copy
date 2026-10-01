import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import {MarketingPositions} from "@/domain/entity/Marketing/marketing"
import type {Banner} from "@/domain/entity/Banner/banner"

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn() }),
}))

vi.mock("@/presentation/components/AssetImage", () => ({
    default: (props: Record<string, unknown>) => <img data-testid="asset-image" alt={props.alt as string} />,
}))

import HomeFeaturedRewardCard from "@/presentation/pages/Home/components/HomeFeaturedRewards/componenets/HomeFeaturedRewardCard"

const baseReward: Banner = {
    id: "c-1",
    campaignId: "campaign-1",
    title: "Audífonos Sony WH-1000XM5",
    subtitle: "12500",
    description: "",
    summary: "",
    link: "#",
    textColor: "",
    image: {desktopUrl: "https://example.com/d.jpg", mobileUrl: "https://example.com/m.jpg"},
    positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
    segmentCodes: [],
    priority: 1,
    isOutstanding: true,
}

const rewardWithoutSecondaryTitle: Banner = {
    ...baseReward,
    id: "c-2",
    campaignId: "campaign-2",
    title: "Experiencia Spa",
    subtitle: "",
}

describe("HomeFeaturedRewardCard", () => {
    it("should render the reward main title", () => {
        render(<HomeFeaturedRewardCard reward={baseReward} />)
        expect(screen.getByText("Audífonos Sony WH-1000XM5")).toBeInTheDocument()
    })

    it("should render the asset image", () => {
        render(<HomeFeaturedRewardCard reward={baseReward} />)
        expect(screen.getByTestId("asset-image")).toBeInTheDocument()
    })

    it("should render secondary title with millas when subtitle exists", () => {
        render(<HomeFeaturedRewardCard reward={baseReward} />)
        expect(screen.getByText("Desde")).toBeInTheDocument()
        expect(screen.getByText("12.500 millas")).toBeInTheDocument()
    })

    it("should not render secondary title when subtitle is empty", () => {
        render(<HomeFeaturedRewardCard reward={rewardWithoutSecondaryTitle} />)
        expect(screen.queryByText("Desde")).not.toBeInTheDocument()
    })

    it("should render the millas + tarjeta text", () => {
        render(<HomeFeaturedRewardCard reward={baseReward} />)
        expect(screen.getByText("También puedes pagar millas + tarjeta")).toBeInTheDocument()
    })

    it("should format subtitle with dot separator for numbers > 3 digits", () => {
        const rewardWithLargeSubtitle: Banner = {
            ...baseReward,
            subtitle: "91567",
        }
        render(<HomeFeaturedRewardCard reward={rewardWithLargeSubtitle} />)
        expect(screen.getByText("91.567 millas")).toBeInTheDocument()
    })

    it("should not format subtitle when it has less than 4 digits", () => {
        const rewardWithSmallSubtitle: Banner = {
            ...baseReward,
            subtitle: "500",
        }
        render(<HomeFeaturedRewardCard reward={rewardWithSmallSubtitle} />)
        expect(screen.getByText("500 millas")).toBeInTheDocument()
    })

    it("should handle subtitle with non-numeric characters", () => {
        const rewardWithFormattedSubtitle: Banner = {
            ...baseReward,
            subtitle: "30,834",
        }
        render(<HomeFeaturedRewardCard reward={rewardWithFormattedSubtitle} />)
        expect(screen.getByText("30.834 millas")).toBeInTheDocument()
    })

    it("should have accessible link with proper aria-label", () => {
        render(<HomeFeaturedRewardCard reward={baseReward} />)
        const link = screen.getByRole("link")
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute("aria-label", "Audífonos Sony WH-1000XM5. Desde 12500 millas. También puedes pagar millas más tarjeta.")
    })

    it("should have accessible image with proper alt text", () => {
        render(<HomeFeaturedRewardCard reward={baseReward} />)
        const image = screen.getByAltText("Imagen de producto destacado: Audífonos Sony WH-1000XM5")
        expect(image).toBeInTheDocument()
    })

    it("should have accessible product title", () => {
        render(<HomeFeaturedRewardCard reward={baseReward} />)
        const productTitle = screen.getByText("Audífonos Sony WH-1000XM5")
        expect(productTitle).toHaveAttribute("aria-label", "Producto: Audífonos Sony WH-1000XM5")
    })

    it("should have proper aria-label for reward without subtitle", () => {
        render(<HomeFeaturedRewardCard reward={rewardWithoutSecondaryTitle} />)
        const link = screen.getByRole("link")
        expect(link).toHaveAttribute("aria-label", "Experiencia Spa. También puedes pagar millas más tarjeta.")
    })

    it("should be accessible by screen readers", () => {
        render(<HomeFeaturedRewardCard reward={baseReward} />)
        
        // Check that all important elements are accessible
        expect(screen.getByRole("link")).toBeInTheDocument()
        expect(screen.getByRole("img", { name: "Imagen de producto destacado: Audífonos Sony WH-1000XM5" })).toBeInTheDocument()
    })

    it("should have proper link structure", () => {
        render(<HomeFeaturedRewardCard reward={baseReward} />)
        const link = screen.getByRole("link")
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute("aria-label", "Audífonos Sony WH-1000XM5. Desde 12500 millas. También puedes pagar millas más tarjeta.")
    })
})
