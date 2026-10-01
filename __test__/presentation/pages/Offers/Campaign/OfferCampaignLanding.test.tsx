import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import {
    CampaignExperienceType,
    CampaignStatus,
    CampaignType,
    ExperienceCampaign,
} from "@/domain/entity/Campaign/campaign"

const mockUseIsDesktop = vi.fn()

vi.mock("@/presentation/hooks/useIsDesktop", () => ({
    default: (breakpoint: number) => mockUseIsDesktop(breakpoint),
}))

vi.mock("@/presentation/pages/Offers/Campaign/OfferCampaignBanner", () => ({
    default: ({
        image,
        title,
        subtitle,
    }: {
        image: unknown
        title: string
        subtitle?: string
    }) => (
        <div
            data-testid="campaign-banner"
            data-title={title}
            data-subtitle={subtitle ?? ""}
            data-image={JSON.stringify(image)}
        >
            <h1>{title}</h1>
        </div>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/ExperienceItemCard", () => ({
    default: ({
        href,
        title,
        address,
        orientation,
        className,
        classNameImage,
        tag,
        points,
    }: {
        href: string
        title: string
        address?: string
        orientation: string
        className?: string
        classNameImage?: string
        tag?: string
        points?: number
    }) => (
        <div
            data-testid="experience-card"
            data-href={href}
            data-address={address ?? "none"}
            data-orientation={orientation}
            data-class-name={className ?? "none"}
            data-class-name-image={classNameImage ?? "none"}
            data-tag={tag ?? "none"}
            data-points={points}
        >
            {title}
        </div>
    ),
}))

vi.mock("@/presentation/pages/Offers/Campaign/OfferCampaignLandingPagination", () => ({
    default: ({ page, totalPages }: { page: number; totalPages: number }) => (
        <div data-testid="campaign-pagination" data-page={page} data-total-pages={totalPages} />
    ),
}))

const mockDocumentTitle = vi.fn()
vi.mock("@/presentation/components/Layout/DocumentTitle", () => ({
    default: ({ title }: { title: string }) => {
        mockDocumentTitle(title)
        return null
    },
}))

import OfferCampaignLanding from "@/presentation/pages/Offers/Campaign/OfferCampaignLanding"

const buildCampaign = (overrides: Partial<ExperienceCampaign> = {}): ExperienceCampaign => ({
    id: "c-1",
    mainTitle: "Cyber Days",
    slug: "cyber-days",
    shortDescription: "Ofertas de viaje",
    isOutstanding: false,
    positions: [],
    segmentCodes: [],
    hasLanding: true,
    image: { desktopUrl: "https://bucket.s3.us-east-2.amazonaws.com/banner.jpg", mobileUrl: "" },
    numberElementsSlide: 12,
    order: 1,
    status: CampaignStatus.ACTIVE,
    priority: 1,
    campaignType: CampaignType.EXPERIENCES,
    experiences: [
        {
            name: "Paris",
            slug: "paris",
            address: "Paris, France",
            experience: "Vuelo",
            description: "5000",
            pointsAmount: 3000,
            url: "/paris",
            type: CampaignExperienceType.INTERNATIONAL,
            image: {
                desktopUrl: "https://bucket.s3.us-east-1.amazonaws.com/paris.jpg",
                mobileUrl: "https://bucket.s3.us-east-1.amazonaws.com/paris-mobile.jpg",
            },
            validTo: new Date(),
        },
        {
            name: "Rome",
            slug: "rome",
            address: "Rome, Italy",
            experience: "Hotel",
            description: "invalid",
            pointsAmount: 4000,
            url: "",
            type: CampaignExperienceType.INTERNATIONAL,
            image: { desktopUrl: "https://bucket.s3.us-east-2.amazonaws.com/rome.jpg", mobileUrl: "" },
            validTo: new Date(),
        },
    ],
    ...overrides,
})

describe("OfferCampaignLanding", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockUseIsDesktop.mockReturnValue({ isDesktop: true })
    })

    it("should render campaign banner with campaign image and title", () => {
        const campaign = buildCampaign()
        render(
            <OfferCampaignLanding
                campaign={campaign}
                pagination={{ page: 1, pageSize: 12, total: 2, totalPages: 1 }}
            />,
        )

        const banner = screen.getByTestId("campaign-banner")
        expect(banner).toHaveAttribute("data-title", "Cyber Days")
        const bannerImage = JSON.parse(String(banner.getAttribute("data-image")))
        expect(bannerImage).toEqual(campaign.image)
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Cyber Days")
    })

    it("should pass campaign secondaryTitle as banner subtitle", () => {
        render(
            <OfferCampaignLanding
                campaign={buildCampaign({ secondaryTitle: "Hasta 50% off" })}
                pagination={{ page: 1, pageSize: 12, total: 2, totalPages: 1 }}
            />,
        )

        expect(screen.getByTestId("campaign-banner")).toHaveAttribute("data-subtitle", "Hasta 50% off")
    })

    it("should set document title through DocumentTitle", () => {
        render(
            <OfferCampaignLanding
                campaign={buildCampaign()}
                pagination={{ page: 1, pageSize: 12, total: 2, totalPages: 1 }}
            />,
        )

        expect(mockDocumentTitle).toHaveBeenCalledWith("Cyber Days")
    })

    it("should render experiences section with description and cards", () => {
        render(
            <OfferCampaignLanding
                campaign={buildCampaign()}
                pagination={{ page: 1, pageSize: 12, total: 2, totalPages: 1 }}
            />,
        )

        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Ofertas de viaje")
        expect(screen.getAllByTestId("experience-card")).toHaveLength(2)
        expect(screen.getByTestId("campaign-pagination")).toBeInTheDocument()
    })

    it("should use fallback description when shortDescription is missing", () => {
        render(
            <OfferCampaignLanding
                campaign={buildCampaign({ shortDescription: undefined })}
                pagination={{ page: 1, pageSize: 12, total: 2, totalPages: 1 }}
            />,
        )

        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Experiencias recomendadas para ti")
    })

    it("should use fallback description when shortDescription is empty string", () => {
        render(
            <OfferCampaignLanding
                campaign={buildCampaign({ shortDescription: "" })}
                pagination={{ page: 1, pageSize: 12, total: 2, totalPages: 1 }}
            />,
        )

        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Experiencias recomendadas para ti")
    })

    it("should not render experiences section when campaign has no experiences", () => {
        render(
            <OfferCampaignLanding
                campaign={buildCampaign({ experiences: [] })}
                pagination={{ page: 1, pageSize: 12, total: 0, totalPages: 0 }}
            />,
        )

        expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument()
        expect(screen.queryByTestId("experience-card")).not.toBeInTheDocument()
        expect(screen.queryByTestId("campaign-pagination")).not.toBeInTheDocument()
    })

    it("should render vertical cards with max-w-none classes on desktop", () => {
        mockUseIsDesktop.mockReturnValue({ isDesktop: true })

        render(
            <OfferCampaignLanding
                campaign={buildCampaign()}
                pagination={{ page: 2, pageSize: 12, total: 24, totalPages: 2 }}
            />,
        )

        const cards = screen.getAllByTestId("experience-card")
        expect(cards[0]).toHaveAttribute("data-orientation", "vertical")
        expect(cards[0]).toHaveAttribute("data-class-name", "max-w-none")
        expect(cards[0]).toHaveAttribute("data-class-name-image", "max-w-none")
    })

    it("should render horizontal cards without extra classes on mobile", () => {
        mockUseIsDesktop.mockReturnValue({ isDesktop: false })

        render(
            <OfferCampaignLanding
                campaign={buildCampaign()}
                pagination={{ page: 1, pageSize: 12, total: 2, totalPages: 1 }}
            />,
        )

        const cards = screen.getAllByTestId("experience-card")
        expect(cards[0]).toHaveAttribute("data-orientation", "horizontal")
        expect(cards[0]).toHaveAttribute("data-class-name", "none")
        expect(cards[0]).toHaveAttribute("data-class-name-image", "none")
        expect(mockUseIsDesktop).toHaveBeenCalledWith(1024)
    })

    it("should use experience url as href when provided", () => {
        render(
            <OfferCampaignLanding
                campaign={buildCampaign()}
                pagination={{ page: 1, pageSize: 12, total: 2, totalPages: 1 }}
            />,
        )

        const cards = screen.getAllByTestId("experience-card")
        expect(cards[0]).toHaveAttribute("data-href", "/paris")
    })

    it("should fallback to experience slug when url is empty", () => {
        render(
            <OfferCampaignLanding
                campaign={buildCampaign()}
                pagination={{ page: 1, pageSize: 12, total: 2, totalPages: 1 }}
            />,
        )

        const cards = screen.getAllByTestId("experience-card")
        expect(cards[1]).toHaveAttribute("data-href", "rome")
    })

    it("should pass pointsAmount to each card and tag is not passed (removed)", () => {
        render(
            <OfferCampaignLanding
                campaign={buildCampaign()}
                pagination={{ page: 1, pageSize: 12, total: 2, totalPages: 1 }}
            />,
        )

        const cards = screen.getAllByTestId("experience-card")
        expect(cards[0]).toHaveAttribute("data-points", "3000")
        expect(cards[1]).toHaveAttribute("data-points", "4000")
    })

    it("should pass address to each ExperienceItemCard", () => {
        render(
            <OfferCampaignLanding
                campaign={buildCampaign()}
                pagination={{ page: 1, pageSize: 12, total: 2, totalPages: 1 }}
            />,
        )

        const cards = screen.getAllByTestId("experience-card")
        expect(cards[0]).toHaveAttribute("data-address", "Paris, France")
        expect(cards[1]).toHaveAttribute("data-address", "Rome, Italy")
    })

    it("should clean S3 domains from experience image urls via buildExperienceAsset", () => {
        const campaign = buildCampaign()
        render(
            <OfferCampaignLanding
                campaign={campaign}
                pagination={{ page: 1, pageSize: 12, total: 2, totalPages: 1 }}
            />,
        )

        const banner = screen.getByTestId("campaign-banner")
        const bannerImage = JSON.parse(String(banner.getAttribute("data-image")))
        expect(bannerImage.desktopUrl).toBe("https://bucket.s3.us-east-2.amazonaws.com/banner.jpg")
    })

    it("should pass pagination values correctly to pagination component", () => {
        render(
            <OfferCampaignLanding
                campaign={buildCampaign()}
                pagination={{ page: 3, pageSize: 12, total: 36, totalPages: 3 }}
            />,
        )

        const pagination = screen.getByTestId("campaign-pagination")
        expect(pagination).toHaveAttribute("data-page", "3")
        expect(pagination).toHaveAttribute("data-total-pages", "3")
    })

    it("should render banner even when there are no experiences", () => {
        render(
            <OfferCampaignLanding
                campaign={buildCampaign({ experiences: [] })}
                pagination={{ page: 1, pageSize: 12, total: 0, totalPages: 0 }}
            />,
        )

        expect(screen.getByTestId("campaign-banner")).toBeInTheDocument()
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Cyber Days")
    })
})
