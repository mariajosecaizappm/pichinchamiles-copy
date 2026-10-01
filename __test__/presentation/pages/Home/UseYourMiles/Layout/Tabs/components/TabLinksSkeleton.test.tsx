import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import TabLinksSkeleton from "@/presentation/pages/Home/UseYourMiles/Layout/Tabs/components/TabLinksSkeleton"

vi.mock("@heroui/react", () => ({
    Skeleton: ({ className }: { className?: string }) => <div data-testid="skeleton" className={className} />,
    cn: (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" "),
}))

describe("TabLinksSkeleton", () => {
    it("should render four tab placeholders", () => {
        const { container } = render(<TabLinksSkeleton />)
        const items = container.querySelectorAll(".w-34.h-12")

        expect(items).toHaveLength(4)
    })

    it("should render a skeleton inside each placeholder", () => {
        render(<TabLinksSkeleton />)

        expect(screen.getAllByTestId("skeleton")).toHaveLength(4)
    })

    it("should apply the default border classes to the container", () => {
        const { container } = render(<TabLinksSkeleton />)
        const wrapper = container.firstChild as HTMLElement

        expect(wrapper).toHaveClass("flex")
        expect(wrapper).toHaveClass("border-b")
    })

    it("should apply a bottom border to the first item only", () => {
        const { container } = render(<TabLinksSkeleton />)
        const items = container.querySelectorAll(".w-34.h-12")

        expect(items[0]).toHaveClass("border-b-2")
        expect(items[1]).not.toHaveClass("border-b-2")
        expect(items[2]).not.toHaveClass("border-b-2")
        expect(items[3]).not.toHaveClass("border-b-2")
    })

    it("should merge custom className and itemClassName", () => {
        const { container } = render(<TabLinksSkeleton className="custom-wrapper" itemClassName="custom-item" />)
        const wrapper = container.firstChild as HTMLElement
        const items = container.querySelectorAll(".w-34.h-12")

        expect(wrapper).toHaveClass("custom-wrapper")
        expect(items[0]).toHaveClass("custom-item")
    })
})
