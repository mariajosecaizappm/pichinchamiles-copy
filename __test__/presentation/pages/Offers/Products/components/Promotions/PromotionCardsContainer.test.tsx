import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import "@testing-library/jest-dom"

const mockUseSession = vi.fn()
const mockUseQuery = vi.fn()

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

vi.mock("@tanstack/react-query", () => ({
    useQuery: (options: { queryKey: unknown[] }) => mockUseQuery(options),
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: { get: vi.fn() },
}))

import container from "@/presentation/config/inversify.config"

vi.mock("@/presentation/pages/Offers/Products/components/Promotions/PromotionCards", () => ({
    default: ({ banners }: { banners: unknown[] }) => (
        <div data-testid="promotion-banners">{banners.length} banners</div>
    ),
}))

vi.mock("@/presentation/pages/Offers/Products/components/Promotions/PromotionCardsSkeleton", () => ({
    default: () => <div data-testid="promotion-cards-skeleton">Skeleton</div>,
}))

import PromotionBannersContainer from "@/presentation/pages/Offers/Products/components/Promotions/PromotionCardsContainer"

const mockListWithData = {
    data: [{ id: "1" }, { id: "2" }],
    pagination: { page: 1, pageSize: 4, total: 2, totalPages: 1 },
}

describe("PromotionBannersContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockUseSession.mockReturnValue({ isLogged: false })
    })

    it("should show skeleton while loading", () => {
        mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, error: null })

        render(<PromotionBannersContainer type="products" />)

        expect(screen.getByTestId("promotion-cards-skeleton")).toBeInTheDocument()
    })

    it("should show skeleton on error", () => {
        mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, error: new Error("fetch error") })

        render(<PromotionBannersContainer type="products" />)

        expect(screen.getByTestId("promotion-cards-skeleton")).toBeInTheDocument()
    })

    it("should return null when no banners are found", () => {
        mockUseQuery.mockReturnValue({
            data: { data: [], pagination: { total: 0 } },
            isLoading: false,
            error: null,
        })

        const { container } = render(<PromotionBannersContainer type="products" />)

        expect(container).toBeEmptyDOMElement()
    })

    it("should render PromotionBanners when data is present", () => {
        mockUseQuery.mockReturnValue({
            data: mockListWithData,
            isLoading: false,
            error: null,
        })

        render(<PromotionBannersContainer type="products" />)

        expect(screen.getByTestId("promotion-banners")).toHaveTextContent("2 banners")
    })

    it("should fallback to empty banners when data.data is undefined", () => {
        mockUseQuery.mockReturnValue({
            data: { pagination: { total: 1 } },
            isLoading: false,
            error: null,
        })

        render(<PromotionBannersContainer type="products" />)

        expect(screen.getByTestId("promotion-banners")).toHaveTextContent("0 banners")
    })

    it("should use correct queryKey for type=activities and isLogged=true", () => {
        mockUseSession.mockReturnValue({ isLogged: true })
        mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, error: null })

        render(<PromotionBannersContainer type="activities" />)

        expect(mockUseQuery).toHaveBeenCalledWith(
            expect.objectContaining({ queryKey: ["promotional-banners", "activities", true] }),
        )
    })

    it("should call getPromotionBanners use case from queryFn", async () => {
        const mockGetPromotionBanners = vi.fn().mockResolvedValue(mockListWithData)
        vi.mocked(container.get).mockReturnValue({ getPromotionBanners: mockGetPromotionBanners })
        mockUseSession.mockReturnValue({ isLogged: true })

        let queryFn: (() => Promise<unknown>) | undefined
        mockUseQuery.mockImplementation(({ queryFn: fn }: { queryFn: () => Promise<unknown> }) => {
            queryFn = fn
            return { data: mockListWithData, isLoading: false, error: null }
        })

        render(<PromotionBannersContainer type="activities" />)

        await queryFn?.()

        expect(mockGetPromotionBanners).toHaveBeenCalledWith(true, "activities")
    })
})
