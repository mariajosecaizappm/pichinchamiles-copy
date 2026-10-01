import {render} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"

vi.mock("@heroui/react", () => ({
    cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
    Skeleton: ({children, className}: {children: React.ReactNode; className?: string}) => (
        <div data-testid="skeleton" className={className}>{children}</div>
    ),
}))

import HomeBannerCarouselSkeleton from "@/presentation/pages/Home/components/HomeBannerCarousel/HomeBannerCarouselSkeleton"

describe("HomeBannerCarouselSkeleton", () => {
    it("should render a skeleton wrapper", () => {
        const {container} = render(<HomeBannerCarouselSkeleton />)
        const placeholder = container.querySelector(".w-full.h-\\[600px\\]")
        expect(placeholder).toBeInTheDocument()
        expect(placeholder).toHaveAttribute("aria-hidden", "true")
    })

    it("should render a placeholder div with correct dimensions", () => {
        const {container} = render(<HomeBannerCarouselSkeleton />)
        const placeholder = container.querySelector(".w-full.h-\\[600px\\]")
        expect(placeholder).toBeInTheDocument()
    })
})
