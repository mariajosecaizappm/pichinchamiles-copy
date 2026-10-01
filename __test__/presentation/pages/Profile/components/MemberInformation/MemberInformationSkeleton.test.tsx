import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import MemberInformationSkeleton from "@/presentation/pages/Profile/components/MemberInformation/MemberInformationSkeleton"

vi.mock("@heroui/react", () => ({
    Skeleton: ({ className }: { className?: string }) => <div data-testid="skeleton" className={className} />,
    cn: (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" "),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Layout/Tabs/components/TabLinksSkeleton", () => ({
    default: ({ className, itemClassName }: { className?: string; itemClassName?: string }) => (
        <div data-testid="tab-links-skeleton" className={`${className} ${itemClassName}`} />
    ),
}))

describe("MemberInformationSkeleton", () => {
    it("should render the tab links skeleton", () => {
        render(<MemberInformationSkeleton />)

        expect(screen.getByTestId("tab-links-skeleton")).toBeInTheDocument()
    })

    it("should render a skeleton placeholder for the content", () => {
        const { container } = render(<MemberInformationSkeleton />)

        expect(container.querySelector('[data-testid="skeleton"]')).toBeInTheDocument()
    })

    it("should apply the expected container classes", () => {
        const { container } = render(<MemberInformationSkeleton />)

        const wrappers = container.querySelectorAll(".body-container")
        expect(wrappers.length).toBeGreaterThanOrEqual(1)

        const contentWrapper = Array.from(wrappers).find((el) =>
            el.className.includes("md:max-w-[676px]")
        )
        expect(contentWrapper).toBeInTheDocument()
    })
})
