import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, afterEach } from "vitest"
import { Banner } from "@/domain/entity/Banner/banner"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"

const mocks = vi.hoisted(() => {
    const receivedProps: Record<string, unknown>[] = []
    return { receivedProps }
})

vi.mock("@/presentation/pages/Home/components/HomeBannerCarousel/components/BannerSlide", () => ({
    default: (props: Record<string, unknown>) => {
        mocks.receivedProps.push(props)
        return <div data-testid="banner-slide">BannerSlide</div>
    },
}))

import HeroBannerItem from "@/presentation/pages/Home/UseYourMiles/Products/HeroCarousel/HeroBannerItem"

const mockBanner: Banner = {
    id: "banner-1",
    title: "Hero Banner",
    subtitle: "",
    description: "",
    summary: "",
    link: "/hero-link",
    linkText: "Ver más",
    textColor: "#fff",
    isOutstanding: false,
    segmentCodes: [],
    positions: [MarketingPositions.HOME_LOGGED_MAIN_SLIDER],
    priority: 1,
    image: { desktopUrl: "https://example.com/d.jpg", mobileUrl: "https://example.com/m.jpg" },
    campaignId: "",
}

describe("HeroBannerItem", () => {
    afterEach(() => {
        vi.clearAllMocks()
        mocks.receivedProps.length = 0
    })

    it("should render BannerSlide", () => {
        render(<HeroBannerItem banner={mockBanner} />)
        expect(screen.getByTestId("banner-slide")).toBeInTheDocument()
    })

    it("should pass the banner prop to BannerSlide", () => {
        render(<HeroBannerItem banner={mockBanner} />)
        expect(mocks.receivedProps[0].banner).toBe(mockBanner)
    })

    it("should pass the correct container className", () => {
        render(<HeroBannerItem banner={mockBanner} />)
        expect(mocks.receivedProps[0].containerClassName).toBe("relative h-112.5 md:h-77.5")
    })

    it("should pass image height and breakpoint props", () => {
        render(<HeroBannerItem banner={mockBanner} />)
        expect(mocks.receivedProps[0].imageHeight).toBe(620)
        expect(mocks.receivedProps[0].imageBreakpoint).toBe(768)
    })

    it("should pass priority and fetchPriority props", () => {
        render(<HeroBannerItem banner={mockBanner} />)
        expect(mocks.receivedProps[0].priority).toBe(true)
        expect(mocks.receivedProps[0].fetchPriority).toBe("high")
    })

    it("should pass custom overlay and gradient classNames", () => {
        render(<HeroBannerItem banner={mockBanner} />)
        const props = mocks.receivedProps[0]
        expect(props.overlayInnerClassName).toContain("md:flex")
        expect(props.textWrapperClassName).toContain("md:text-start")
        expect(props.mobileGradientClassName).toContain("md:opacity-0")
        expect(props.desktopGradientClassName).toContain("hidden md:block")
    })

    it("should pass mobile gradient override", () => {
        render(<HeroBannerItem banner={mockBanner} />)
        const props = mocks.receivedProps[0]
        expect(props.mobileGradient).toContain("rgba(15, 38, 92, 0.65)")
    })
})
