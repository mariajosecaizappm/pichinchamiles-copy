import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { Banner } from "@/domain/entity/Banner/banner"

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/CardsSliderWrapper/CardsSliderWrapper", () => ({
    default: ({
        items,
        renderItem,
        className,
    }: {
        items: Banner[]
        renderItem: (item: Banner) => React.ReactNode
        className?: string
    }) => (
        <div data-testid="cards-slider" className={className}>
            {items.map((item) => (
                <div key={item.id} data-testid="slider-item">
                    {renderItem(item)}
                </div>
            ))}
        </div>
    ),
}))

vi.mock("@heroui/react", () => ({
    cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
}))

vi.mock("@/presentation/pages/Offers/Products/components/Promotions/PromotionCardItem", () => ({
    default: ({ banner }: { banner: Banner }) => (
        <div data-testid="promotion-card-item">{banner.title}</div>
    ),
}))

import PromotionBanners from "@/presentation/pages/Offers/Products/components/Promotions/PromotionCards"

const mockBanners: Banner[] = [
    {
        id: "banner-1",
        title: "Banner One",
        subtitle: "",
        description: "",
        summary: "",
        link: "/one",
        textColor: "",
        isOutstanding: false,
        segmentCodes: [],
        positions: [],
        priority: 1,
        image: { desktopUrl: "/d.jpg", mobileUrl: "/m.jpg" },
        campaignId: "c-1",
    },
    {
        id: "banner-2",
        title: "Banner Two",
        subtitle: "",
        description: "",
        summary: "",
        link: "/two",
        textColor: "",
        isOutstanding: false,
        segmentCodes: [],
        positions: [],
        priority: 2,
        image: { desktopUrl: "/d2.jpg", mobileUrl: "/m2.jpg" },
        campaignId: "c-2",
    },
]

describe("PromotionBanners", () => {
    it("should render a card for each banner", () => {
        render(<PromotionBanners banners={mockBanners} />)

        expect(screen.getByTestId("cards-slider")).toBeInTheDocument()
        expect(screen.getAllByTestId("promotion-card-item")).toHaveLength(2)
        expect(screen.getByText("Banner One")).toBeInTheDocument()
        expect(screen.getByText("Banner Two")).toBeInTheDocument()
    })

    it("should use justify-between layout when there are exactly four banners", () => {
        const fourBanners = [
            ...mockBanners,
            { ...mockBanners[0], id: "banner-3", title: "Banner Three" },
            { ...mockBanners[1], id: "banner-4", title: "Banner Four" },
        ]

        render(<PromotionBanners banners={fourBanners} />)

        expect(screen.getByTestId("cards-slider")).toHaveClass("justify-between")
    })

    it("should use justify-start layout when there are fewer than four banners", () => {
        render(<PromotionBanners banners={[mockBanners[0]]} />)

        expect(screen.getByTestId("cards-slider")).toHaveClass("justify-start")
    })
})
