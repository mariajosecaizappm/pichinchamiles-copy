import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import type {Banner} from "@/domain/entity/Banner/banner"
import {MarketingPositions} from "@/domain/entity/Marketing/marketing"

vi.mock("next/image", () => ({
    getImageProps: (options: any) => ({
        props: { src: options.src, srcSet: options.src, alt: options.alt || "", width: String(options.width), height: String(options.height) }
    }),
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    default: (props: Record<string, unknown>) => <img {...props} />,
}))

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}))

vi.mock("@/presentation/pages/Home/components/HomeFeaturedRewards/componenets", () => ({
    HomeFeaturedRewardCard: ({reward}: {reward: Banner}) => (
        <div data-testid="reward-card">{reward.title}</div>
    ),
}))

vi.mock("@/presentation/pages/Home/components/HomeFeaturedRewards/componenets/MobileCarouselHomeFeaturedRewards", () => ({
    default: () => <div data-testid="mobile-carousel">MobileCarousel</div>,
}))

import HomeFeaturedRewards from "@/presentation/pages/Home/components/HomeFeaturedRewards/HomeFeaturedRewards"

const mockRewards: Banner[] = [
    {
        id: "c-1",
        campaignId: "campaign-1",
        title: "Producto A",
        subtitle: "5000",
        description: "Descripción del producto A",
        summary: "Resumen del producto A",
        link: "/producto-a",
        linkText: "Ver más",
        textColor: "#FFFFFF",
        isOutstanding: true,
        segmentCodes: [],
        positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
        priority: 1,
        image: {desktopUrl: "https://example.com/d.jpg", mobileUrl: "https://example.com/m.jpg"},
    },
    {
        id: "c-2",
        campaignId: "campaign-2",
        title: "Producto B",
        subtitle: "3000",
        description: "Descripción del producto B",
        summary: "Resumen del producto B",
        link: "/producto-b",
        linkText: "Ver más",
        textColor: "#FFFFFF",
        isOutstanding: true,
        segmentCodes: [],
        positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
        priority: 2,
        image: {desktopUrl: "https://example.com/d2.jpg", mobileUrl: "https://example.com/m2.jpg"},
    },
    {
        id: "c-3",
        campaignId: "campaign-3",
        title: "Producto C",
        subtitle: "7000",
        description: "Descripción del producto C",
        summary: "Resumen del producto C",
        link: "/producto-c",
        linkText: "Ver más",
        textColor: "#FFFFFF",
        isOutstanding: true,
        segmentCodes: [],
        positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
        priority: 3,
        image: {desktopUrl: "https://example.com/d3.jpg", mobileUrl: "https://example.com/m3.jpg"},
    },
]

describe("HomeFeaturedRewards", () => {
    it("should render the section title", () => {
        render(<HomeFeaturedRewards rewards={mockRewards} />)
        expect(screen.getByText("Mira lo que otros ya están disfrutando")).toBeInTheDocument()
    })

    it("should render the section subtitle", () => {
        render(<HomeFeaturedRewards rewards={mockRewards} />)
        expect(screen.getByText("Estas son las recompensas destacadas de este mes")).toBeInTheDocument()
    })

    it("should render reward cards for each reward", () => {
        render(<HomeFeaturedRewards rewards={mockRewards} />)
        expect(screen.getAllByTestId("reward-card")).toHaveLength(3)
    })

    it("should render the mobile carousel", async () => {
        render(<HomeFeaturedRewards rewards={mockRewards} />)
        expect(await screen.findByTestId("mobile-carousel")).toBeInTheDocument()
    })

    it("should use semantic section element with proper ARIA attributes", () => {
        render(<HomeFeaturedRewards rewards={mockRewards} />)
        const section = screen.getByRole("region")
        expect(section).toBeInTheDocument()
        expect(section).toHaveAttribute("aria-labelledby", "featured-rewards-title")
    })

    it("should have proper heading structure", () => {
        render(<HomeFeaturedRewards rewards={mockRewards} />)
        const heading = screen.getByRole("heading", { name: "Mira lo que otros ya están disfrutando" })
        expect(heading).toBeInTheDocument()
        expect(heading).toHaveAttribute("id", "featured-rewards-title")
    })

    it("should render rewards as list items", () => {
        render(<HomeFeaturedRewards rewards={mockRewards} />)
        const list = screen.getByRole("list")
        expect(list).toBeInTheDocument()
        
        const listItems = screen.getAllByRole("listitem")
        expect(listItems).toHaveLength(3)
    })

    it("should be accessible by screen readers", () => {
        render(<HomeFeaturedRewards rewards={mockRewards} />)
        
        // Check that all important elements are accessible
        expect(screen.getByRole("region")).toBeInTheDocument()
        expect(screen.getByRole("heading", { name: "Mira lo que otros ya están disfrutando" })).toBeInTheDocument()
        expect(screen.getByRole("list")).toBeInTheDocument()
    })
})
