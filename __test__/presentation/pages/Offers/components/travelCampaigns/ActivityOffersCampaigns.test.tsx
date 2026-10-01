import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { ExperienceCampaignBanner, CampaignType, CampaignStatus, CampaignExperienceType } from "@/domain/entity/Campaign/campaign"

const mocks = vi.hoisted(() => ({ isDesktop: false, currentSlide: 0, handleUpdate: vi.fn() }))

vi.mock("@/presentation/hooks/useIsDesktop", () => ({ default: () => ({ isDesktop: mocks.isDesktop }) }))
vi.mock("@/presentation/hooks/useScrollMenuSlideTracker", () => ({ useScrollMenuSlideTracker: () => ({ currentSlide: mocks.currentSlide, handleUpdate: mocks.handleUpdate }) }))
vi.mock("next/link", () => ({ default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a> }))
vi.mock("@/presentation/components/icons/IconArrow", () => ({ default: () => <span /> }))
vi.mock("@/presentation/components/Banner/SectionBanner", () => ({ SectionBanner: ({ title }: { title: string }) => <div data-testid="section-banner">{title}</div> }))
vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/CardsSliderWrapper/CardsSliderWrapper", () => ({
    default: ({ items, renderItem }: { items: unknown[]; renderItem: (item: unknown) => React.ReactNode; showLeftArrow?: boolean; showRightArrow?: boolean; onScroll?: () => void }) => (
        <div data-testid="experience-carousel">{items.map((item, i) => <div key={i}>{renderItem(item)}</div>)}<button type="button">scroll</button></div>
    ),
}))
vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/ExperienceItemCard", () => ({
    default: ({ href, asset, title, address, points, orientation }: { href: string; asset: { desktopUrl: string; mobileUrl: string }; title: string; address?: string; points: number; previousPoints?: number; tag?: string; orientation?: string }) => (
        <div data-testid="experience-item" data-href={href} data-desktop={asset.desktopUrl} data-mobile={asset.mobileUrl} data-title={title} data-address={address} data-points={points} data-orientation={orientation ?? "vertical"} />
    ),
}))

import ActivityOffersCampaigns from "@/presentation/pages/Offers/Activities/Campaigns/ActivityOffersCampaigns"

const buildExperience = (overrides = {}) => ({
    name: "Paris",
    slug: "/paris",
    address: "Avenue des Champs-Élysées",
    experience: "20%",
    description: "",
    validTo: new Date(),
    url: "/paris-url",
    type: CampaignExperienceType.INTERNATIONAL,
    image: { desktopUrl: "https://bucket.s3.us-east-2.amazonaws.com/paris.jpg", mobileUrl: "https://bucket.s3.us-east-1.amazonaws.com/paris-m.jpg" },
    pointsAmount: 5000,
    ...overrides,
})

const buildOffer = (id: string, title: string, experiences = [buildExperience()]): ExperienceCampaignBanner => ({
    banner: {
        id: `b-${id}`,
        title: "Banner",
        subtitle: "",
        description: "",
        summary: "",
        link: "",
        textColor: "",
        isOutstanding: false,
        segmentCodes: [],
        positions: [],
        priority: 1,
        image: { desktopUrl: "", mobileUrl: "" },
        campaignId: id,
    },
    campaign: {
        id,
        mainTitle: title,
        slug: id,
        isOutstanding: false,
        positions: [],
        segmentCodes: [],
        hasLanding: true,
        image: { desktopUrl: "", mobileUrl: "" },
        numberElementsSlide: 1,
        order: 1,
        status: CampaignStatus.ACTIVE,
        priority: 1,
        campaignType: CampaignType.EXPERIENCES,
        experiences,
    },
    experiences,
})

describe("ActivityOffersCampaigns", () => {
    it("should render one section per offer", () => {
        render(<ActivityOffersCampaigns offers={[buildOffer("c1", "Campaign 1"), buildOffer("c2", "Campaign 2")]} />)
        expect(screen.getAllByTestId("experience-item").length).toBeGreaterThan(0)
    })

    it("should render no experience items when offers is empty", () => {
        render(<ActivityOffersCampaigns offers={[]} />)
        expect(screen.queryByTestId("experience-item")).not.toBeInTheDocument()
    })

    it("should strip S3 bucket from desktop image URL via getCampaignExperienceCardImage", () => {
        render(<ActivityOffersCampaigns offers={[buildOffer("c1", "Campaign")]} />)
        const item = screen.getAllByTestId("experience-item")[0]
        expect(item.dataset.desktop).toBe("https://bucket/paris.jpg")
    })

    it("should strip S3 bucket from mobile image URL via getCampaignExperienceCardImage", () => {
        render(<ActivityOffersCampaigns offers={[buildOffer("c1", "Campaign")]} />)
        const item = screen.getAllByTestId("experience-item")[0]
        expect(item.dataset.mobile).toBe("https://bucket/paris-m.jpg")
    })

    it("should pass experience url, title, address and points to ExperienceItemCard", () => {
        render(<ActivityOffersCampaigns offers={[buildOffer("c1", "Campaign")]} />)
        const item = screen.getAllByTestId("experience-item")[0]
        expect(item.dataset.href).toBe("/paris-url")
        expect(item.dataset.title).toBe("Paris")
        expect(item.dataset.address).toBe("Avenue des Champs-Élysées")
        expect(item.dataset.points).toBe("5000")
    })

    it("should pass address to mobile ExperienceItemCard", () => {
        render(<ActivityOffersCampaigns offers={[buildOffer("c1", "Campaign")]} />)
        const mobileItems = screen.getAllByTestId("experience-item").filter((el) => el.dataset.orientation === "horizontal")
        expect(mobileItems[0].dataset.address).toBe("Avenue des Champs-Élysées")
    })

    it("should render mobile items with horizontal orientation", () => {
        render(<ActivityOffersCampaigns offers={[buildOffer("c1", "Campaign")]} />)
        const mobileItems = screen.getAllByTestId("experience-item").filter((el) => el.dataset.orientation === "horizontal")
        expect(mobileItems.length).toBeGreaterThan(0)
    })
})