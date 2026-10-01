import {act, fireEvent, render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import {MarketingPositions} from "@/domain/entity/Marketing/marketing"
import type {Banner} from "@/domain/entity/Banner/banner"

globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}))

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn() }),
}))

vi.mock("next/link", () => ({
    default: ({children, href}: {children: React.ReactNode; href: string}) => (
        <a href={href}>{children}</a>
    ),
}))

vi.mock("@/presentation/components/AssetImage", () => ({
    default: (props: Record<string, unknown>) => <img data-testid="asset-image" alt={props.alt as string} />,
}))

const mockDispatch = vi.fn()
vi.mock("react-redux", () => ({
    useDispatch: () => mockDispatch,
}))

vi.mock("@/presentation/redux/features/authModalSlice", () => ({
    openAuthModal: () => ({type: "authModal/openAuthModal"}),
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => ({isLogged: false}),
}))

import MobileCarouselHomeRedeptionCategories from "@/presentation/pages/Home/components/HomeRedemptionCategories/components/MobileCarouselHomeRedeptionCategories"

const buildBanner = (overrides: Partial<Banner> & {id: string; title: string}): Banner => ({
    campaignId: "campaign-1",
    subtitle: "Sub",
    description: "Desc",
    summary: "Summary",
    link: "#",
    linkText: "Ver más",
    textColor: "#000",
    isOutstanding: false,
    segmentCodes: [],
    positions: [MarketingPositions.HOME_NOT_LOGGED_REDEMPTION_CATEGORIES],
    priority: 1,
    image: {desktopUrl: "https://example.com/d.jpg", mobileUrl: "https://example.com/m.jpg"},
    ...overrides,
})

const mockCategories: Banner[] = [
    buildBanner({id: "cat-1", title: "Productos", description: "Elige entre más de 15.000 productos", link: "/productos", linkText: "Ver productos", priority: 1}),
    buildBanner({id: "cat-2", title: "Vuelos", description: "Selecciona la aerolínea ideal", link: "/vuelos", linkText: "Buscar vuelos", priority: 2}),
]

describe("MobileCarouselHomeRedeptionCategories", () => {
    it("should render the scroll menu", () => {
        render(<MobileCarouselHomeRedeptionCategories redemptionCategories={mockCategories} />)
        expect(screen.getByTestId("carousel")).toBeInTheDocument()
    })

    it("should render all category cards", () => {
        render(<MobileCarouselHomeRedeptionCategories redemptionCategories={mockCategories} />)
        expect(screen.getByText("Productos")).toBeInTheDocument()
        expect(screen.getByText("Vuelos")).toBeInTheDocument()
    })

    it("should render the slide counter starting at 1", () => {
        render(<MobileCarouselHomeRedeptionCategories redemptionCategories={mockCategories} />)
        expect(screen.getByText(/1 de 2/)).toBeInTheDocument()
    })

    it("should render a single item", () => {
        const singleCategory: Banner[] = [
            buildBanner({id: "cat-1", title: "Productos", priority: 1}),
        ]
        render(<MobileCarouselHomeRedeptionCategories redemptionCategories={singleCategory} />)
        expect(screen.getByText("Productos")).toBeInTheDocument()
        expect(screen.getByText(/1 de 1/)).toBeInTheDocument()
    })

    it("should render the correct total count for multiple items", () => {
        const fiveCategories: Banner[] = Array.from({length: 5}, (_, i) =>
            buildBanner({id: `cat-${i}`, title: `Cat ${i}`, priority: i}),
        )
        render(<MobileCarouselHomeRedeptionCategories redemptionCategories={fiveCategories} />)
        expect(screen.getByText(/1 de 5/)).toBeInTheDocument()
    })

    it("should have accessible slide counter with ARIA live region", () => {
        render(<MobileCarouselHomeRedeptionCategories redemptionCategories={mockCategories} />)
        const slideCounter = screen.getByText(/1 de 2/)
        expect(slideCounter).toBeInTheDocument()
        expect(slideCounter).toHaveAttribute("aria-live", "polite")
        expect(slideCounter).toHaveAttribute("aria-atomic", "true")
    })

    it("should update slide counter with ARIA live region when slide changes", () => {
        render(<MobileCarouselHomeRedeptionCategories redemptionCategories={mockCategories} />)
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

        const updatedSlideCounter = screen.getByText(/2 de 2/)
        expect(updatedSlideCounter).toBeInTheDocument()
        expect(updatedSlideCounter).toHaveAttribute("aria-live", "polite")
        expect(updatedSlideCounter).toHaveAttribute("aria-atomic", "true")
    })

    it("should be accessible by screen readers", () => {
        render(<MobileCarouselHomeRedeptionCategories redemptionCategories={mockCategories} />)
        
        // Check that carousel and slide counter are accessible
        expect(screen.getByTestId("carousel")).toBeInTheDocument()
        expect(screen.getByText(/1 de 2/)).toBeInTheDocument()
    })
})
