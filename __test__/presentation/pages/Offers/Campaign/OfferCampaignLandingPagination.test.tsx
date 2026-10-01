import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mockReplace = vi.fn()

vi.mock("next/navigation", () => ({
    useRouter: () => ({ replace: mockReplace }),
    usePathname: vi.fn(() => "/ofertas/viajes-y-actividades/cyber-days"),
    useSearchParams: vi.fn(() => new URLSearchParams("page=2&sort=asc")),
}))

vi.mock("@/presentation/components/Pagination", () => ({
    default: ({
        total,
        page,
        onChange,
    }: {
        total: number
        page: number
        onChange: (nextPage: number) => void
    }) => (
        <div data-testid="pagination" data-total={total} data-page={page}>
            <button type="button" onClick={() => onChange(1)}>
                go-page-1
            </button>
            <button type="button" onClick={() => onChange(3)}>
                go-page-3
            </button>
        </div>
    ),
}))

import { usePathname, useSearchParams } from "next/navigation"
import OfferCampaignLandingPagination from "@/presentation/pages/Offers/Campaign/OfferCampaignLandingPagination"

describe("OfferCampaignLandingPagination", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(usePathname).mockReturnValue("/ofertas/viajes-y-actividades/cyber-days")
        vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams("page=2&sort=asc") as never)
    })

    it("should render nothing when totalPages is 1", () => {
        const { container } = render(
            <OfferCampaignLandingPagination page={1} totalPages={1} />,
        )

        expect(container.firstChild).toBeNull()
    })

    it("should render nothing when totalPages is 0", () => {
        const { container } = render(
            <OfferCampaignLandingPagination page={1} totalPages={0} />,
        )

        expect(container.firstChild).toBeNull()
    })

    it("should render pagination when totalPages is greater than 1", () => {
        render(<OfferCampaignLandingPagination page={2} totalPages={3} />)

        expect(screen.getByTestId("pagination")).toHaveAttribute("data-total", "3")
        expect(screen.getByTestId("pagination")).toHaveAttribute("data-page", "2")
    })

    it("should remove page query param when navigating to first page", () => {
        render(<OfferCampaignLandingPagination page={2} totalPages={3} />)

        fireEvent.click(screen.getByRole("button", { name: "go-page-1" }))

        expect(mockReplace).toHaveBeenCalledWith(
            "/ofertas/viajes-y-actividades/cyber-days?sort=asc",
            { scroll: false },
        )
    })

    it("should set page query param when navigating beyond first page", () => {
        render(<OfferCampaignLandingPagination page={2} totalPages={3} />)

        fireEvent.click(screen.getByRole("button", { name: "go-page-3" }))

        expect(mockReplace).toHaveBeenCalledWith(
            "/ofertas/viajes-y-actividades/cyber-days?page=3&sort=asc",
            { scroll: false },
        )
    })

    it("should navigate without query string when params are empty", () => {
        vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams("") as never)

        render(<OfferCampaignLandingPagination page={2} totalPages={3} />)

        fireEvent.click(screen.getByRole("button", { name: "go-page-1" }))

        expect(mockReplace).toHaveBeenCalledWith(
            "/ofertas/viajes-y-actividades/cyber-days",
            { scroll: false },
        )
    })

    it("should use empty pathname when usePathname returns null", () => {
        vi.mocked(usePathname).mockReturnValue(null as never)
        vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams("") as never)

        render(<OfferCampaignLandingPagination page={2} totalPages={3} />)

        fireEvent.click(screen.getByRole("button", { name: "go-page-3" }))

        expect(mockReplace).toHaveBeenCalledWith("?page=3", { scroll: false })
    })
})
