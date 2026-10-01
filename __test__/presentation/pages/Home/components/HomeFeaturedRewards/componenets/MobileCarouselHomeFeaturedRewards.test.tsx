import {act, fireEvent, render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import {MarketingPositions} from "@/domain/entity/Marketing/marketing"

globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}))

vi.mock("react-horizontal-scrolling-menu", () => ({
    ScrollMenu: ({children, ...props}: {children: React.ReactNode; [key: string]: unknown}) => (
        <div data-testid={(props["data-testid"] as string) || "scroll-menu"} data-swipe-scroll-tolerance="80">{children}</div>
    ),
    VisibilityContext: {},
}))

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn() }),
}))

vi.mock("@/presentation/components/AssetImage", () => ({
    default: (props: Record<string, unknown>) => <img data-testid="asset-image" alt={props.alt as string} />,
}))

vi.mock("@/presentation/hooks/useScrollMenuSlideTracker", () => ({
    useScrollMenuSlideTracker: () => ({
        currentSlide: 0,
        handleUpdate: vi.fn()
    })
}))

import MobileCarouselHomeFeaturedRewards from "@/presentation/pages/Home/components/HomeFeaturedRewards/componenets/MobileCarouselHomeFeaturedRewards"
import { Banner } from "@/domain/entity/Banner/banner"

const mockRewards: Banner[] = [
    {
        id: "c-1",
        campaignId: "campaign-1",
        title: "Producto A",
        subtitle: "5000",
        description: "",
        summary: "",
        link: "#",
        textColor: "",
        isOutstanding: true,
        positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
        segmentCodes: [],
        image: {desktopUrl: "https://example.com/d.jpg", mobileUrl: "https://example.com/m.jpg"},
        priority: 1
    },
    {
        id: "c-2",
        campaignId: "campaign-2",
        title: "Producto B",
        subtitle: "3000",
        description: "",
        summary: "",
        link: "#",
        textColor: "",
        isOutstanding: true,
        positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
        segmentCodes: [],
        image: {desktopUrl: "https://example.com/d2.jpg", mobileUrl: "https://example.com/m2.jpg"},
        priority: 2
    },
]

describe("MobileCarouselHomeFeaturedRewards", () => {
    it("should render the scroll menu", () => {
        render(<MobileCarouselHomeFeaturedRewards rewards={mockRewards} />)
        expect(screen.getByTestId("carousel")).toBeInTheDocument()
    })

    it("should render all reward cards", () => {
        render(<MobileCarouselHomeFeaturedRewards rewards={mockRewards} />)
        expect(screen.getByText("Producto A")).toBeInTheDocument()
        expect(screen.getByText("Producto B")).toBeInTheDocument()
    })

    it("should render the slide counter", () => {
        render(<MobileCarouselHomeFeaturedRewards rewards={mockRewards} />)
        expect(screen.getByText(/1 de 2/)).toBeInTheDocument()
    })

    it("should have accessible slide counter with ARIA live region", () => {
        render(<MobileCarouselHomeFeaturedRewards rewards={mockRewards} />)
        const slideCounter = screen.getByText(/1 de 2/)
        expect(slideCounter).toBeInTheDocument()
        expect(slideCounter).toHaveAttribute("aria-live", "polite")
        expect(slideCounter).toHaveAttribute("aria-atomic", "true")
    })

    it("should be accessible by screen readers", () => {
        render(<MobileCarouselHomeFeaturedRewards rewards={mockRewards} />)
        
        // Check that carousel and slide counter are accessible
        expect(screen.getByTestId("carousel")).toBeInTheDocument()
        expect(screen.getByText(/1 de 2/)).toBeInTheDocument()
    })

    it("should update slide counter when scrolling to the last card", () => {
        render(<MobileCarouselHomeFeaturedRewards rewards={mockRewards} />)
        expect(screen.getByText(/1 de 2/)).toBeInTheDocument()

        const carousel = screen.getByTestId("carousel")
        const slides = Array.from(carousel.children) as HTMLElement[]

        act(() => {
            Object.defineProperty(carousel, "clientWidth", { value: 430, configurable: true })
            vi.spyOn(carousel, "getBoundingClientRect").mockReturnValue({
                x: 0, y: 0, top: 0, left: 0, right: 430, bottom: 0, width: 430, height: 0, toJSON: () => ({}),
            })
            slides.forEach((slide, index) => {
                const left = index === 0 ? -316 : 65
                vi.spyOn(slide, "getBoundingClientRect").mockReturnValue({
                    x: left, y: 0, top: 0, left, right: left + 300, bottom: 0, width: 300, height: 0, toJSON: () => ({}),
                })
            })
            fireEvent.scroll(carousel)
        })

        expect(screen.getByText(/2 de 2/)).toBeInTheDocument()
    })
})