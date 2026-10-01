import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"

vi.mock("@heroui/react", () => ({
    Skeleton: ({className, ...rest}: {className?: string; [key: string]: unknown}) => (
        <div data-testid="skeleton" className={className} {...rest} />
    ),
}))

import HeaderActionsSkeleton from "@/presentation/pages/Home/components/Header/components/HeaderActions/HeaderActionsSkeleton"

describe("HeaderActionsSkeleton", () => {
    it("should render a skeleton element", () => {
        render(<HeaderActionsSkeleton />)
        const skeleton = screen.getByTestId("skeleton")
        expect(skeleton).toBeInTheDocument()
    })

    it("should apply the correct CSS classes", () => {
        render(<HeaderActionsSkeleton />)
        const skeleton = screen.getByTestId("skeleton")
        expect(skeleton).toHaveClass(
            "w-8.25 h-8.25 rounded-sm lg:w-26.25 lg:h-9.25 p-2 flex gap-2.5 items-center"
        )
    })

    it("should have responsive width classes", () => {
        render(<HeaderActionsSkeleton />)
        const skeleton = screen.getByTestId("skeleton")
        expect(skeleton).toHaveClass("w-8.25")
        expect(skeleton).toHaveClass("lg:w-26.25")
    })

    it("should have responsive height classes", () => {
        render(<HeaderActionsSkeleton />)
        const skeleton = screen.getByTestId("skeleton")
        expect(skeleton).toHaveClass("h-8.25")
        expect(skeleton).toHaveClass("lg:h-9.25")
    })

    it("should have rounded corners", () => {
        render(<HeaderActionsSkeleton />)
        const skeleton = screen.getByTestId("skeleton")
        expect(skeleton).toHaveClass("rounded-sm")
    })

    it("should have padding", () => {
        render(<HeaderActionsSkeleton />)
        const skeleton = screen.getByTestId("skeleton")
        expect(skeleton).toHaveClass("p-2")
    })

    it("should have flex layout with gap", () => {
        render(<HeaderActionsSkeleton />)
        const skeleton = screen.getByTestId("skeleton")
        expect(skeleton).toHaveClass("flex")
        expect(skeleton).toHaveClass("gap-2.5")
        expect(skeleton).toHaveClass("items-center")
    })
})
