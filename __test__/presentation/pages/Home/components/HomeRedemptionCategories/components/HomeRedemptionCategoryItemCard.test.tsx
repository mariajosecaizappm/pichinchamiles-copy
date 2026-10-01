import {render, screen, fireEvent} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"
import {MarketingPositions} from "@/domain/entity/Marketing/marketing"
import type {Banner} from "@/domain/entity/Banner/banner"

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn() }),
}))

vi.mock("next/link", () => ({
    default: ({ children, href, "aria-label": ariaLabel }: { children: React.ReactNode; href: string; "aria-label"?: string }) => (
        <a href={href} aria-label={ariaLabel}>{children}</a>
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

const mockUseSession = vi.fn()
vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

import HomeRedemptionCategoryItemCard from "@/presentation/pages/Home/components/HomeRedemptionCategories/components/HomeRedemptionCategoryItemCard"

const baseBanner: Banner = {
    id: "cat-1",
    campaignId: "campaign-1",
    title: "Productos",
    subtitle: "Subtitle",
    description: "Elige entre más de 15.000 productos",
    summary: "Summary",
    link: "/productos",
    linkText: "Texto desde Backoffice",
    textColor: "#000",
    isOutstanding: false,
    segmentCodes: [],
    positions: [MarketingPositions.HOME_NOT_LOGGED_REDEMPTION_CATEGORIES],
    priority: 1,
    image: {desktopUrl: "https://example.com/d.jpg", mobileUrl: "https://example.com/m.jpg"},
}

const flightsBanner: Banner = {
    ...baseBanner,
    id: "cat-2",
    title: "Vuelos",
    description: "Selecciona la aerolínea ideal",
    link: "/vuelos",
    linkText: "Texto CTA Backoffice",
}

describe("HomeRedemptionCategoryItemCard", () => {
    beforeEach(() => {
        mockDispatch.mockClear()
        mockUseSession.mockReturnValue({isLogged: false})
    })

    it("should render the category title", () => {
        render(<HomeRedemptionCategoryItemCard redemptionCategory={baseBanner} />)
        expect(screen.getByText("Productos")).toBeInTheDocument()
    })

    it("should render the category description", () => {
        render(<HomeRedemptionCategoryItemCard redemptionCategory={baseBanner} />)
        expect(screen.getByText("Elige entre más de 15.000 productos")).toBeInTheDocument()
    })

    it("should render the asset image", () => {
        render(<HomeRedemptionCategoryItemCard redemptionCategory={baseBanner} />)
        expect(screen.getByTestId("asset-image")).toBeInTheDocument()
    })

    it("should ignore Backoffice linkText and show Ver productos for Productos", () => {
        render(<HomeRedemptionCategoryItemCard redemptionCategory={baseBanner} />)
        expect(screen.getByText("Ver productos")).toBeInTheDocument()
        expect(screen.queryByText("Texto desde Backoffice")).not.toBeInTheDocument()
    })

    it("should show Reserva ahora for non-product categories", () => {
        render(<HomeRedemptionCategoryItemCard redemptionCategory={flightsBanner} />)
        expect(screen.getByText("Reserva ahora")).toBeInTheDocument()
        expect(screen.queryByText("Texto CTA Backoffice")).not.toBeInTheDocument()
    })

    it("should open auth modal when guest clicks CTA", () => {
        render(<HomeRedemptionCategoryItemCard redemptionCategory={baseBanner} />)
        fireEvent.click(screen.getByText("Ver productos"))
        expect(mockDispatch).toHaveBeenCalledWith({type: "authModal/openAuthModal"})
        expect(screen.queryByRole("link")).not.toBeInTheDocument()
    })

    it("should navigate to Backoffice link when user is logged in", () => {
        mockUseSession.mockReturnValue({isLogged: true})
        render(<HomeRedemptionCategoryItemCard redemptionCategory={baseBanner} />)
        const link = screen.getByRole("link", {name: "Ver productos: Productos"})
        expect(link).toHaveAttribute("href", "/productos")
    })

    it("should open auth modal when logged in but link is missing", () => {
        mockUseSession.mockReturnValue({isLogged: true})
        render(
            <HomeRedemptionCategoryItemCard
                redemptionCategory={{...baseBanner, link: ""}}
            />,
        )
        fireEvent.click(screen.getByText("Ver productos"))
        expect(mockDispatch).toHaveBeenCalledWith({type: "authModal/openAuthModal"})
    })

    it("should have accessible image with proper alt text", () => {
        render(<HomeRedemptionCategoryItemCard redemptionCategory={baseBanner} />)
        expect(screen.getByAltText("Productos")).toBeInTheDocument()
    })

    it("should have accessible guest CTA with proper aria-label", () => {
        render(<HomeRedemptionCategoryItemCard redemptionCategory={baseBanner} />)
        expect(
            screen.getByRole("button", {name: "Ver productos, iniciar sesión en Pichincha Miles"}),
        ).toBeInTheDocument()
    })
})
