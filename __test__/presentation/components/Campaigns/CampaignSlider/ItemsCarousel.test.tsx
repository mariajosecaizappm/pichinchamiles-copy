import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"

const mocks = vi.hoisted(() => ({
    isDesktop: true,
    canScrollLeft: false,
    canScrollRight: true,
    handleUpdate: vi.fn(),
}))

vi.mock("next/link", () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}))

vi.mock("@/presentation/hooks/useIsDesktop", () => ({
    default: () => ({ isDesktop: mocks.isDesktop }),
}))

vi.mock("@/presentation/hooks/useScrollMenuSlideTracker", () => ({
    useScrollMenuSlideTracker: () => ({
        canScrollLeft: mocks.canScrollLeft,
        canScrollRight: mocks.canScrollRight,
        handleUpdate: mocks.handleUpdate,
    }),
}))

vi.mock(
    "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/CardsSliderWrapper/CardsSliderWrapper",
    () => ({
        default: ({
            items,
            renderItem,
            showLeftArrow,
            showRightArrow,
            onScroll,
        }: {
            items: unknown[]
            renderItem: (item: unknown) => React.ReactNode
            showLeftArrow?: boolean
            showRightArrow?: boolean
            onScroll?: () => void
        }) => (
            <div
                data-testid="cards-slider"
                data-left={String(showLeftArrow)}
                data-right={String(showRightArrow)}
            >
                {items.map((item, i) => (
                    <div key={i} data-testid="carousel-item">{renderItem(item)}</div>
                ))}
                <button data-testid="scroll-trigger" onClick={() => onScroll?.()}>scroll</button>
            </div>
        ),
    }),
)

vi.mock("@/presentation/components/icons/IconArrow", () => ({
    default: () => <span data-testid="icon-arrow" />,
}))

import ItemsCarousel from "@/presentation/components/Campaigns/CampaignSlider/ItemsCarousel"

type Item = { id: string; label: string }

const buildItems = (count: number): Item[] =>
    Array.from({ length: count }, (_, i) => ({ id: `item-${i}`, label: `Item ${i}` }))

const renderItem = (item: Item) => <div data-testid="rendered-item">{item.label}</div>
const renderMobileItem = (item: Item, index: number) => (
    <div data-testid="rendered-mobile-item" key={index}>{item.label}</div>
)

describe("ItemsCarousel", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.isDesktop = true
        mocks.canScrollLeft = false
        mocks.canScrollRight = true
    })

    describe("desktop carousel", () => {
        it("should render CardsSliderWrapper with all items", () => {
            render(
                <ItemsCarousel
                    items={buildItems(3)}
                    renderItem={renderItem}
                    renderMobileItem={renderMobileItem}
                    campaignHref="/test"
                />,
            )

            expect(screen.getByTestId("cards-slider")).toBeInTheDocument()
            expect(screen.getAllByTestId("carousel-item")).toHaveLength(3)
        })

        it("should hide left arrow when there are no items to the left", () => {
            mocks.canScrollLeft = false
            render(
                <ItemsCarousel
                    items={buildItems(3)}
                    renderItem={renderItem}
                    renderMobileItem={renderMobileItem}
                    campaignHref="/test"
                />,
            )

            expect(screen.getByTestId("cards-slider")).toHaveAttribute("data-left", "false")
        })

        it("should show left arrow on desktop when there are items to the left", () => {
            mocks.canScrollLeft = true
            render(
                <ItemsCarousel
                    items={buildItems(3)}
                    renderItem={renderItem}
                    renderMobileItem={renderMobileItem}
                    campaignHref="/test"
                />,
            )

            expect(screen.getByTestId("cards-slider")).toHaveAttribute("data-left", "true")
        })

        it("should hide left arrow on mobile even when there are items to the left", () => {
            mocks.isDesktop = false
            mocks.canScrollLeft = true
            render(
                <ItemsCarousel
                    items={buildItems(3)}
                    renderItem={renderItem}
                    renderMobileItem={renderMobileItem}
                    campaignHref="/test"
                />,
            )

            expect(screen.getByTestId("cards-slider")).toHaveAttribute("data-left", "false")
        })

        it("should show right arrow on desktop when there are items to the right", () => {
            mocks.canScrollRight = true
            render(
                <ItemsCarousel
                    items={buildItems(3)}
                    renderItem={renderItem}
                    renderMobileItem={renderMobileItem}
                    campaignHref="/test"
                />,
            )

            expect(screen.getByTestId("cards-slider")).toHaveAttribute("data-right", "true")
        })

        it("should hide right arrow when all items fit", () => {
            mocks.canScrollRight = false
            render(
                <ItemsCarousel
                    items={buildItems(3)}
                    renderItem={renderItem}
                    renderMobileItem={renderMobileItem}
                    campaignHref="/test"
                />,
            )

            expect(screen.getByTestId("cards-slider")).toHaveAttribute("data-right", "false")
        })

        it("should hide right arrow when there are no more items to the right", () => {
            mocks.canScrollRight = false
            render(
                <ItemsCarousel
                    items={buildItems(6)}
                    renderItem={renderItem}
                    renderMobileItem={renderMobileItem}
                    campaignHref="/test"
                />,
            )

            expect(screen.getByTestId("cards-slider")).toHaveAttribute("data-right", "false")
        })

        it("should call handleUpdate when carousel scrolls", () => {
            render(
                <ItemsCarousel
                    items={buildItems(3)}
                    renderItem={renderItem}
                    renderMobileItem={renderMobileItem}
                    campaignHref="/test"
                />,
            )

            fireEvent.click(screen.getByTestId("scroll-trigger"))

            expect(mocks.handleUpdate).toHaveBeenCalledTimes(1)
        })
    })

    describe("mobile list", () => {
        beforeEach(() => {
            mocks.isDesktop = false
        })

        it("should render only the first 2 mobile items", () => {
            render(
                <ItemsCarousel
                    items={buildItems(5)}
                    renderItem={renderItem}
                    renderMobileItem={renderMobileItem}
                    campaignHref="/test"
                />,
            )

            expect(screen.getAllByTestId("rendered-mobile-item")).toHaveLength(2)
        })

        it("should render all mobile items when 2 or fewer", () => {
            render(
                <ItemsCarousel
                    items={buildItems(2)}
                    renderItem={renderItem}
                    renderMobileItem={renderMobileItem}
                    campaignHref="/test"
                />,
            )

            expect(screen.getAllByTestId("rendered-mobile-item")).toHaveLength(2)
        })

        it("should show Ver más link with campaignHref when more than 2 items", () => {
            render(
                <ItemsCarousel
                    items={buildItems(3)}
                    renderItem={renderItem}
                    renderMobileItem={renderMobileItem}
                    campaignHref="/ofertas/viajes-y-actividades/summer"
                />,
            )

            const link = screen.getByRole("link", { name: /ver más/i })
            expect(link).toBeInTheDocument()
            expect(link).toHaveAttribute("href", "/ofertas/viajes-y-actividades/summer")
        })

        it("should not show Ver más link when 2 or fewer items", () => {
            render(
                <ItemsCarousel
                    items={buildItems(2)}
                    renderItem={renderItem}
                    renderMobileItem={renderMobileItem}
                    campaignHref="/test"
                />,
            )

            expect(screen.queryByRole("link", { name: /ver más/i })).not.toBeInTheDocument()
        })

        it("should render IconArrow inside Ver más link", () => {
            render(
                <ItemsCarousel
                    items={buildItems(3)}
                    renderItem={renderItem}
                    renderMobileItem={renderMobileItem}
                    campaignHref="/test"
                />,
            )

            expect(screen.getByTestId("icon-arrow")).toBeInTheDocument()
        })
    })
})
