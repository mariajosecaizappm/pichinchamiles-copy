import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import {Banner} from "@/domain/entity/Banner/banner"
import {MarketingPositions} from "@/domain/entity/Marketing/marketing"

vi.mock("react-responsive-carousel", () => ({
    Carousel: ({children, renderIndicator, swipeScrollTolerance, autoPlay, showIndicators}: {
        children: React.ReactNode;
        swipeScrollTolerance?: number;
        autoPlay?: boolean;
        showIndicators?: boolean;
        renderIndicator?: (
            onClickHandler: (e: React.MouseEvent | React.KeyboardEvent) => void,
            isSelected: boolean,
            index: number,
            label: string,
        ) => React.ReactNode;
    }) => (
        <div
            data-testid="carousel"
            data-swipe-scroll-tolerance={swipeScrollTolerance}
            data-autoplay={String(autoPlay)}
            data-show-indicators={String(showIndicators)}
        >
            {children}
            {showIndicators && renderIndicator && (
                <div data-testid="indicators">
                    {renderIndicator(() => {}, true, 0, "slide")}
                    {renderIndicator(() => {}, false, 1, "slide")}
                </div>
            )}
        </div>
    ),
}))

import BannerCarousel from "@/presentation/pages/Home/components/HomeBannerCarousel/components/BannerCarousel"

const mockBanners: Banner[] = [
    {
        id: "banner-1",
        campaignId: "campaign-1",
        title: "Banner 1",
        subtitle: "Subtitle 1",
        description: "Description 1",
        summary: "Summary 1",
        link: "/link1",
        linkText: "Click 1",
        textColor: "#FFFFFF",
        isOutstanding: true,
        segmentCodes: [],
        positions: [MarketingPositions.HOME_NOT_LOGGED_MAIN_CAROUSEL],
        priority: 1,
        image: {desktopUrl: "https://example.com/1.jpg", mobileUrl: "https://example.com/1m.jpg"},
    },
    {
        id: "banner-2",
        campaignId: "campaign-2",
        title: "Banner 2",
        subtitle: "Subtitle 2",
        description: "Description 2",
        summary: "Summary 2",
        link: "/link2",
        linkText: "Click 2",
        textColor: "#000000",
        isOutstanding: false,
        segmentCodes: [],
        positions: [MarketingPositions.HOME_NOT_LOGGED_MAIN_CAROUSEL],
        priority: 2,
        image: {desktopUrl: "https://example.com/2.jpg", mobileUrl: "https://example.com/2m.jpg"},
    },
]

describe("BannerCarousel", () => {
    it("should render the carousel wrapper", () => {
        const renderBanner = vi.fn((banner: Banner) => (
            <div key={banner.id} data-testid={`banner-${banner.id}`}>{banner.title}</div>
        ))
        render(<BannerCarousel banners={mockBanners} renderBanner={renderBanner} />)
        expect(screen.getByTestId("carousel")).toBeInTheDocument()
    })

    it("should call renderBanner for each banner", () => {
        const renderBanner = vi.fn((banner: Banner) => (
            <div key={banner.id}>{banner.title}</div>
        ))
        render(<BannerCarousel banners={mockBanners} renderBanner={renderBanner} />)
        expect(renderBanner).toHaveBeenCalledTimes(2)
    })

    it("should pass isMainBanner=true for first banner and false for others", () => {
        const renderBanner = vi.fn((banner: Banner) => (
            <div key={banner.id}>{banner.title}</div>
        ))
        render(<BannerCarousel banners={mockBanners} renderBanner={renderBanner} />)
        expect(renderBanner).toHaveBeenCalledWith(mockBanners[0], true)
        expect(renderBanner).toHaveBeenCalledWith(mockBanners[1], false)
    })

    it("should render banner content from renderBanner", () => {
        const renderBanner = vi.fn((banner: Banner) => (
            <div key={banner.id}>{banner.title}</div>
        ))
        render(<BannerCarousel banners={mockBanners} renderBanner={renderBanner} />)
        expect(screen.getByText("Banner 1")).toBeInTheDocument()
        expect(screen.getByText("Banner 2")).toBeInTheDocument()
    })

    it("should render indicator buttons", () => {
        const renderBanner = vi.fn((banner: Banner) => (
            <div key={banner.id}>{banner.title}</div>
        ))
        render(<BannerCarousel banners={mockBanners} renderBanner={renderBanner} />)
        const indicators = screen.getByTestId("indicators")
        const buttons = indicators.querySelectorAll("button")
        expect(buttons).toHaveLength(2)
    })

    it("should apply selected style to active indicator", () => {
        const renderBanner = vi.fn((banner: Banner) => (
            <div key={banner.id}>{banner.title}</div>
        ))
        render(<BannerCarousel banners={mockBanners} renderBanner={renderBanner} />)
        const indicators = screen.getByTestId("indicators")
        const buttons = indicators.querySelectorAll("button")
        expect(buttons[0].className).toContain("bg-yellow-500")
        expect(buttons[1].className).toContain("bg-blue-100")
    })

    it("should set correct aria-label on indicators", () => {
        const renderBanner = vi.fn((banner: Banner) => (
            <div key={banner.id}>{banner.title}</div>
        ))
        render(<BannerCarousel banners={mockBanners} renderBanner={renderBanner} />)
        const indicators = screen.getByTestId("indicators")
        const buttons = indicators.querySelectorAll("button")
        expect(buttons[0]).toHaveAttribute("aria-label", "Diapositiva 1 de 2, seleccionada")
        expect(buttons[1]).toHaveAttribute("aria-label", "Ir a diapositiva 2 de 2")
    })

    it("should have accessible carousel indicators with proper ARIA attributes", () => {
        const renderBanner = vi.fn((banner: Banner) => (
            <div key={banner.id}>{banner.title}</div>
        ))
        render(<BannerCarousel banners={mockBanners} renderBanner={renderBanner} />)
        const indicators = screen.getByTestId("indicators")
        const buttons = indicators.querySelectorAll("button")

        expect(buttons[0]).toHaveAttribute("aria-label", "Diapositiva 1 de 2, seleccionada")
        expect(buttons[1]).toHaveAttribute("aria-label", "Ir a diapositiva 2 de 2")

        expect(buttons[0]).toHaveAttribute("aria-current", "true")
        expect(buttons[1]).toHaveAttribute("aria-current", "false")
    })

    it("should have keyboard accessible indicators", () => {
        const renderBanner = vi.fn((banner: Banner) => (
            <div key={banner.id}>{banner.title}</div>
        ))
        render(<BannerCarousel banners={mockBanners} renderBanner={renderBanner} />)
        const indicators = screen.getByTestId("indicators")
        const buttons = indicators.querySelectorAll("button")
        
        // Check that indicators are keyboard accessible
        buttons.forEach(button => {
            expect(button).toHaveAttribute("tabIndex", "0")
        })
    })

    it("should have accessible list structure for indicators", () => {
        const renderBanner = vi.fn((banner: Banner) => (
            <div key={banner.id}>{banner.title}</div>
        ))
        render(<BannerCarousel banners={mockBanners} renderBanner={renderBanner} />)
        const indicators = screen.getByTestId("indicators")
        const listItems = indicators.querySelectorAll("li")
        
        // Check that indicators are in list items
        expect(listItems).toHaveLength(2)
    })

    it("should pass swipeScrollTolerance of 80 to the Carousel", () => {
        const renderBanner = vi.fn((banner: Banner) => (
            <div key={banner.id}>{banner.title}</div>
        ))
        render(<BannerCarousel banners={mockBanners} renderBanner={renderBanner} />)
        expect(screen.getByTestId("carousel")).toHaveAttribute("data-swipe-scroll-tolerance", "80")
    })

    it("should show indicators when there is more than one banner", () => {
        const renderBanner = vi.fn((banner: Banner) => (
            <div key={banner.id}>{banner.title}</div>
        ))
        render(<BannerCarousel banners={mockBanners} renderBanner={renderBanner} />)
        expect(screen.getByTestId("carousel")).toHaveAttribute("data-show-indicators", "true")
        expect(screen.getByTestId("indicators")).toBeInTheDocument()
    })

    it("should hide indicators when there is only one banner", () => {
        const renderBanner = vi.fn((banner: Banner) => (
            <div key={banner.id}>{banner.title}</div>
        ))
        render(<BannerCarousel banners={[mockBanners[0]]} renderBanner={renderBanner} />)
        expect(screen.getByTestId("carousel")).toHaveAttribute("data-show-indicators", "false")
        expect(screen.queryByTestId("indicators")).not.toBeInTheDocument()
    })

    describe("accessibility (ARIA)", () => {
        it("should wrap the carousel in a region landmark", () => {
            const renderBanner = vi.fn((banner: Banner) => <div key={banner.id}>{banner.title}</div>)
            render(<BannerCarousel banners={mockBanners} renderBanner={renderBanner} />)
            expect(screen.getByRole("region", { name: "Banners promocionales" })).toBeInTheDocument()
        })

        it("should have aria-roledescription='carrusel' on the region wrapper", () => {
            const renderBanner = vi.fn((banner: Banner) => <div key={banner.id}>{banner.title}</div>)
            const { container } = render(<BannerCarousel banners={mockBanners} renderBanner={renderBanner} />)
            const wrapper = container.querySelector("[aria-roledescription='carrusel']")
            expect(wrapper).toBeInTheDocument()
        })

        it("should render each banner slide as an article element", () => {
            const renderBanner = vi.fn((banner: Banner) => <div key={banner.id}>{banner.title}</div>)
            render(<BannerCarousel banners={mockBanners} renderBanner={renderBanner} />)
            const slides = screen.getAllByRole("article")
            expect(slides).toHaveLength(mockBanners.length)
        })

        it("should label each slide with its title and position", () => {
            const renderBanner = vi.fn((banner: Banner) => <div key={banner.id}>{banner.title}</div>)
            render(<BannerCarousel banners={mockBanners} renderBanner={renderBanner} />)
            const slides = screen.getAllByRole("article")
            expect(slides[0]).toHaveAttribute("aria-label", "Diapositiva 1 de 2: Banner 1")
            expect(slides[1]).toHaveAttribute("aria-label", "Diapositiva 2 de 2: Banner 2")
        })

        it("should have aria-roledescription='diapositiva' on each slide group", () => {
            const renderBanner = vi.fn((banner: Banner) => <div key={banner.id}>{banner.title}</div>)
            const { container } = render(<BannerCarousel banners={mockBanners} renderBanner={renderBanner} />)
            const slides = container.querySelectorAll("[aria-roledescription='diapositiva']")
            expect(slides).toHaveLength(mockBanners.length)
        })

        it("should disable autoPlay to prevent uncontrolled scrolling", () => {
            const renderBanner = vi.fn((banner: Banner) => <div key={banner.id}>{banner.title}</div>)
            render(<BannerCarousel banners={mockBanners} renderBanner={renderBanner} />)
            expect(screen.getByTestId("carousel")).toHaveAttribute("data-autoplay", "false")
        })
    })
})
