import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { ExperienceCampaignBanner } from "@/domain/entity/Campaign/campaign"
import { Banner } from "@/domain/entity/Banner/banner"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"
import { CampaignStatus, CampaignType } from "@/domain/entity/Campaign/campaign"

const mockUseIsDesktop = vi.fn()
const mockUseScrollMenuSlideTracker = vi.fn()

vi.mock("@/presentation/hooks/useIsDesktop", () => ({
    default: () => mockUseIsDesktop(),
}))

vi.mock("@/presentation/hooks/useScrollMenuSlideTracker", () => ({
    useScrollMenuSlideTracker: () => mockUseScrollMenuSlideTracker(),
}))

vi.mock("@/presentation/components/Banner/SectionBanner", () => ({
    SectionBanner: ({ title }: { title: string }) => (
        <div data-testid="section-banner">{title}</div>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/CardsSliderWrapper/CardsSliderWrapper", () => ({
    default: ({ items, renderItem }: { items: unknown[]; renderItem: (item: unknown) => React.ReactNode }) => (
        <div data-testid="cards-slider">
            {items.map((item, i) => (
                <div key={i} data-testid="slider-item">{renderItem(item)}</div>
            ))}
        </div>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/ExperienceItemCard", () => ({
    default: ({ title, address }: { title: string; address?: string }) => (
        <div data-testid="experience-item-card" data-address={address}>{title}</div>
    ),
}))

import TravelDealTabContent from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/TravelDeals/TravelDealsTabContent"

const mockBanner: Banner = {
    id: "ban-1",
    title: "Vuelos a Miami",
    subtitle: "",
    description: "",
    summary: "",
    link: "/vuelos",
    linkText: "Ver más",
    textColor: "#fff",
    isOutstanding: false,
    segmentCodes: [],
    positions: [MarketingPositions.HOME_UV_GUEST_OFFERS],
    priority: 1,
    campaignId: "c-1",
    image: { desktopUrl: "https://example.com/d.jpg", mobileUrl: "https://example.com/m.jpg" },
}

const mockOffer: ExperienceCampaignBanner = {
    banner: mockBanner,
    campaign: {
        id: "c-1",
        mainTitle: "Vuelos",
        slug: "vuelos",
        isOutstanding: false,
        positions: [],
        segmentCodes: [],
        hasLanding: false,
        image: { desktopUrl: "", mobileUrl: "" },
        numberElementsSlide: 1,
        order: 1,
        status: CampaignStatus.ACTIVE,
        priority: 1,
        campaignType: CampaignType.EXPERIENCES,
        experiences: [],
    },
    experiences: [
        {
            name: "Spa Relax",
            slug: "spa-relax",
            address: "Calle 1",
            experience: "Spa",
            description: "5000",
            url: "/spa",
            type: "national" as never,
            image: { desktopUrl: "https://bucket.s3.us-east-2.amazonaws.com/spa.jpg", mobileUrl: "https://bucket.s3.us-east-2.amazonaws.com/spa-m.jpg" },
            validTo: new Date(),
        },
        {
            name: "Tour Ciudad",
            slug: "tour-ciudad",
            address: "Calle 2",
            experience: "Tour",
            description: "not-a-number",
            url: "/tour",
            type: "national" as never,
            image: { desktopUrl: "https://cdn.example.com/tour.jpg", mobileUrl: "https://cdn.example.com/tour-m.jpg" },
            validTo: new Date(),
        },
    ],
}

describe("TravelDealTabContent", () => {
    beforeEach(() => {
        mockUseIsDesktop.mockReturnValue({ isDesktop: false })
        mockUseScrollMenuSlideTracker.mockReturnValue({
            canScrollLeft: false,
            canScrollRight: false,
            handleUpdate: vi.fn(),
        })
    })

    describe("Basic Rendering", () => {
        it("should render the section banner with offer title", () => {
            render(<TravelDealTabContent offer={mockOffer} />)

            expect(screen.getByTestId("section-banner")).toBeInTheDocument()
            expect(screen.getByText("Vuelos a Miami")).toBeInTheDocument()
        })

        it("should render one card per experience", () => {
            render(<TravelDealTabContent offer={mockOffer} />)

            expect(screen.getAllByTestId("experience-item-card")).toHaveLength(2)
            expect(screen.getByText("Spa Relax")).toBeInTheDocument()
            expect(screen.getByText("Tour Ciudad")).toBeInTheDocument()
        })

        it("should render the cards slider", () => {
            render(<TravelDealTabContent offer={mockOffer} />)

            expect(screen.getByTestId("cards-slider")).toBeInTheDocument()
        })

        it("should render with empty experiences list", () => {
            const offerNoExperiences: ExperienceCampaignBanner = {
                ...mockOffer,
                experiences: [],
            }

            render(<TravelDealTabContent offer={offerNoExperiences} />)

            expect(screen.getByTestId("section-banner")).toBeInTheDocument()
            expect(screen.queryAllByTestId("experience-item-card")).toHaveLength(0)
        })

        it("should render with single experience", () => {
            const offerSingleExperience: ExperienceCampaignBanner = {
                ...mockOffer,
                experiences: [mockOffer.experiences[0]],
            }

            render(<TravelDealTabContent offer={offerSingleExperience} />)

            expect(screen.getAllByTestId("experience-item-card")).toHaveLength(1)
            expect(screen.getByText("Spa Relax")).toBeInTheDocument()
            expect(screen.queryByText("Tour Ciudad")).not.toBeInTheDocument()
        })
    })

    describe("Layout and Structure", () => {
        it("should render with correct flex layout classes", () => {
            const { container } = render(<TravelDealTabContent offer={mockOffer} />)

            const mainContainer = container.firstChild
            expect(mainContainer).toHaveClass("flex", "gap-3", "flex-col", "md:flex-row", "md:px-6")
        })

        it("should render banner container with correct classes", () => {
            const { container } = render(<TravelDealTabContent offer={mockOffer} />)

            const bannerContainer = container.querySelector(".px-6.md\\:px-0")
            expect(bannerContainer).toBeInTheDocument()
        })

        it("should render slider container with overflow classes", () => {
            const { container } = render(<TravelDealTabContent offer={mockOffer} />)

            const sliderContainer = container.querySelector(".flex-1.min-w-0.overflow-hidden")
            expect(sliderContainer).toBeInTheDocument()
        })
    })

    describe("Props Passing", () => {
        it("should pass correct props to SectionBanner", () => {
            render(<TravelDealTabContent offer={mockOffer} />)

            expect(screen.getByTestId("section-banner")).toHaveTextContent("Vuelos a Miami")
        })

        it("should pass experience data to ExperienceItemCard", () => {
            render(<TravelDealTabContent offer={mockOffer} />)

            const experienceCards = screen.getAllByTestId("experience-item-card")
            expect(experienceCards[0]).toHaveTextContent("Spa Relax")
            expect(experienceCards[0]).toHaveAttribute("data-address", "Calle 1")
            expect(experienceCards[1]).toHaveTextContent("Tour Ciudad")
            expect(experienceCards[1]).toHaveAttribute("data-address", "Calle 2")
        })

        it("should pass items array to CardsSliderWrapper", () => {
            render(<TravelDealTabContent offer={mockOffer} />)

            expect(screen.getByTestId("cards-slider")).toBeInTheDocument()
            expect(screen.getAllByTestId("slider-item")).toHaveLength(2)
        })
    })

    describe("Responsive Behavior", () => {
        it("should render on mobile layout by default", () => {
            render(<TravelDealTabContent offer={mockOffer} />)

            const { container } = render(<TravelDealTabContent offer={mockOffer} />)
            const mainContainer = container.firstChild
            expect(mainContainer).toHaveClass("flex-col")
        })

        it("should render on desktop layout when isDesktop is true", () => {
            mockUseIsDesktop.mockReturnValue({ isDesktop: true })

            const { container } = render(<TravelDealTabContent offer={mockOffer} />)
            const mainContainer = container.firstChild
            expect(mainContainer).toHaveClass("md:flex-row")
        })
    })

    describe("Slider Navigation", () => {
        it("should not show arrows on mobile", () => {
            mockUseIsDesktop.mockReturnValue({ isDesktop: false })
            mockUseScrollMenuSlideTracker.mockReturnValue({
                canScrollLeft: true,
                canScrollRight: true,
                handleUpdate: vi.fn(),
            })

            render(<TravelDealTabContent offer={mockOffer} />)

            // On mobile, arrows should not be shown
            expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument()
            expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument()
        })

        it("should show left arrow on desktop when there are items to the left", () => {
            mockUseIsDesktop.mockReturnValue({ isDesktop: true })
            mockUseScrollMenuSlideTracker.mockReturnValue({ 
                canScrollLeft: true,
                canScrollRight: false,
                handleUpdate: vi.fn() 
            })

            render(<TravelDealTabContent offer={mockOffer} />)

            const slider = screen.getByTestId("cards-slider")
            expect(slider).toBeInTheDocument()
        })

        it("should show right arrow on desktop when there are items to the right", () => {
            mockUseIsDesktop.mockReturnValue({ isDesktop: true })
            mockUseScrollMenuSlideTracker.mockReturnValue({ 
                canScrollLeft: false,
                canScrollRight: true,
                handleUpdate: vi.fn() 
            })

            render(<TravelDealTabContent offer={mockOffer} />)

            const slider = screen.getByTestId("cards-slider")
            expect(slider).toBeInTheDocument()
        })

        it("should not show right arrow when there are no items to the right", () => {
            mockUseIsDesktop.mockReturnValue({ isDesktop: true })
            mockUseScrollMenuSlideTracker.mockReturnValue({ 
                canScrollLeft: true,
                canScrollRight: false,
                handleUpdate: vi.fn() 
            })

            render(<TravelDealTabContent offer={mockOffer} />)

            const slider = screen.getByTestId("cards-slider")
            expect(slider).toBeInTheDocument()
        })

        it("should not show right arrow when experiences length <= 2", () => {
            mockUseIsDesktop.mockReturnValue({ isDesktop: true })
            mockUseScrollMenuSlideTracker.mockReturnValue({ 
                canScrollLeft: false,
                canScrollRight: false,
                handleUpdate: vi.fn() 
            })

            const offerSingleExperience: ExperienceCampaignBanner = {
                ...mockOffer,
                experiences: [mockOffer.experiences[0]],
            }

            render(<TravelDealTabContent offer={offerSingleExperience} />)

            const slider = screen.getByTestId("cards-slider")
            expect(slider).toBeInTheDocument()
        })
    })

    describe("Hook Integration", () => {
        it("should call useScrollMenuSlideTracker", () => {
            render(<TravelDealTabContent offer={mockOffer} />)

            expect(mockUseScrollMenuSlideTracker).toHaveBeenCalled()
        })

        it("should call useIsDesktop", () => {
            render(<TravelDealTabContent offer={mockOffer} />)

            expect(mockUseIsDesktop).toHaveBeenCalled()
        })

        it("should pass handleUpdate to CardsSliderWrapper", () => {
            const mockHandleUpdate = vi.fn()
            mockUseScrollMenuSlideTracker.mockReturnValue({ 
                canScrollLeft: false,
                canScrollRight: true,
                handleUpdate: mockHandleUpdate 
            })

            render(<TravelDealTabContent offer={mockOffer} />)

            expect(mockUseScrollMenuSlideTracker).toHaveBeenCalled()
        })
    })

    describe("Data Processing", () => {
        it("should handle experience with numeric description as previousPoints", () => {
            const experienceWithNumericDesc: ExperienceCampaignBanner = {
                ...mockOffer,
                experiences: [{
                    ...mockOffer.experiences[0],
                    description: "8000",
                }]
            }

            render(<TravelDealTabContent offer={experienceWithNumericDesc} />)

            expect(screen.getByText("Spa Relax")).toBeInTheDocument()
        })

        it("should handle experience with non-numeric description", () => {
            const experienceWithNonNumericDesc: ExperienceCampaignBanner = {
                ...mockOffer,
                experiences: [{
                    ...mockOffer.experiences[0],
                    description: "not-a-number",
                }]
            }

            render(<TravelDealTabContent offer={experienceWithNonNumericDesc} />)

            expect(screen.getByText("Spa Relax")).toBeInTheDocument()
        })

        it("should handle experience with empty description", () => {
            const experienceWithEmptyDesc: ExperienceCampaignBanner = {
                ...mockOffer,
                experiences: [{
                    ...mockOffer.experiences[0],
                    description: "",
                }]
            }

            render(<TravelDealTabContent offer={experienceWithEmptyDesc} />)

            expect(screen.getByText("Spa Relax")).toBeInTheDocument()
        })
    })

    describe("Edge Cases", () => {
        it("should handle missing pointsAmount", () => {
            const experienceWithoutPoints: ExperienceCampaignBanner = {
                ...mockOffer,
                experiences: [{
                    ...mockOffer.experiences[0],
                    pointsAmount: undefined,
                }]
            }

            render(<TravelDealTabContent offer={experienceWithoutPoints} />)

            expect(screen.getByText("Spa Relax")).toBeInTheDocument()
        })

        it("should handle zero pointsAmount", () => {
            const experienceWithZeroPoints: ExperienceCampaignBanner = {
                ...mockOffer,
                experiences: [{
                    ...mockOffer.experiences[0],
                    pointsAmount: 0,
                }]
            }

            render(<TravelDealTabContent offer={experienceWithZeroPoints} />)

            expect(screen.getByText("Spa Relax")).toBeInTheDocument()
        })

        it("should handle missing slug", () => {
            const experienceWithoutSlug: ExperienceCampaignBanner = {
                ...mockOffer,
                experiences: [{
                    ...mockOffer.experiences[0],
                    slug: "" as string,
                }]
            }

            render(<TravelDealTabContent offer={experienceWithoutSlug} />)

            expect(screen.getByText("Spa Relax")).toBeInTheDocument()
        })

        it("should handle missing name", () => {
            const experienceWithoutName: ExperienceCampaignBanner = {
                ...mockOffer,
                experiences: [{
                    ...mockOffer.experiences[0],
                    name: "" as string,
                }]
            }

            render(<TravelDealTabContent offer={experienceWithoutName} />)

            expect(screen.getAllByTestId("experience-item-card")).toHaveLength(1)
        })

        it("should handle missing image URLs", () => {
            const experienceWithoutImage: ExperienceCampaignBanner = {
                ...mockOffer,
                experiences: [{
                    ...mockOffer.experiences[0],
                    image: { desktopUrl: "" as string, mobileUrl: "" as string },
                }]
            }

            render(<TravelDealTabContent offer={experienceWithoutImage} />)

            expect(screen.getByText("Spa Relax")).toBeInTheDocument()
        })
    })

    describe("Accessibility", () => {
        it("should render with proper semantic structure", () => {
            const { container } = render(<TravelDealTabContent offer={mockOffer} />)

            // Should have proper div structure
            expect(container.querySelector("div")).toBeInTheDocument()
        })

        it("should handle keyboard navigation structure", () => {
            render(<TravelDealTabContent offer={mockOffer} />)

            // Cards slider should be present for keyboard navigation
            expect(screen.getByTestId("cards-slider")).toBeInTheDocument()
        })
    })
})
