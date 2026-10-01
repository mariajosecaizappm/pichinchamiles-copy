import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MobileToolbar from "@/presentation/pages/Products/components/ProductsToolbar/MobileToolbarWrapper"

const mockUseSession = vi.fn()

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

vi.mock("@heroui/react", () => ({
    cn: (...classes: (string | false)[]) => classes.filter(Boolean).join(" "),
}))

vi.mock(
    "@/presentation/pages/Home/UseYourMiles/Layout/components/StickyNavWrapper",
    () => ({
        default: ({
            className,
            children,
        }: {
            className?: string
            children: React.ReactNode
        }) => (
            <div data-testid="sticky-nav" data-class={className}>
                {children}
            </div>
        ),
    }),
)

describe("MobileToolbarWrapper", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("applies logged-in sticky offsets", () => {
        mockUseSession.mockReturnValue({ isLogged: true })

        render(<MobileToolbar>toolbar</MobileToolbar>)

        expect(screen.getByTestId("sticky-nav")).toHaveAttribute(
            "data-class",
            "sticky bg-white z-20 lg:hidden top-24 md:top-27",
        )
    })

    it("applies guest sticky offsets", () => {
        mockUseSession.mockReturnValue({ isLogged: false })

        render(<MobileToolbar>toolbar</MobileToolbar>)

        expect(screen.getByTestId("sticky-nav")).toHaveAttribute(
            "data-class",
            "sticky bg-white z-20 lg:hidden top-15 md:top-18",
        )
    })
})
