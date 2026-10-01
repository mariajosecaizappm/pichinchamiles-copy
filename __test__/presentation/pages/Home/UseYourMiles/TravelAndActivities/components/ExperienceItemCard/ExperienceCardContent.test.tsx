import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@heroui/react", () => ({
    cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
}))

vi.mock("@/presentation/components/icons/IconPing", () => ({
    default: ({ className }: { className?: string }) => (
        <span data-testid="icon-ping" data-class={className} />
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/ExperienceItemCard/ExperienceCardPrices", () => ({
    default: ({ points }: { points: number }) => (
        <div data-testid="experience-card-prices" data-points={points} />
    ),
}))

import ExperienceCardContent from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/ExperienceItemCard/ExperienceCardContent"

describe("ExperienceCardContent", () => {
    it("should render title, location and payment note in vertical layout", () => {
        render(
            <ExperienceCardContent
                title="Spa Premium"
                address="Quito, Ecuador"
                points={8000}
                isHorizontal={false}
            />,
        )

        expect(screen.getByText("Spa Premium")).toBeInTheDocument()
        expect(screen.getByTestId("icon-ping")).toHaveAttribute("data-class", "text-grayscale-400")
        expect(screen.getByText("Quito, Ecuador")).toBeInTheDocument()
        expect(screen.getByText("Puedes utilizar millas + tarjeta")).toBeInTheDocument()
        expect(screen.getByTestId("experience-card-prices")).toHaveAttribute("data-points", "8000")
    })

    it("should not render location when address is not provided", () => {
        render(
            <ExperienceCardContent
                title="Spa Premium"
                points={8000}
                isHorizontal={false}
            />,
        )

        expect(screen.queryByTestId("icon-ping")).not.toBeInTheDocument()
    })

    it("should render address with horizontal leading class", () => {
        render(
            <ExperienceCardContent
                title="Spa Premium"
                address="Guayaquil, Ecuador"
                points={8000}
                isHorizontal
            />,
        )

        expect(screen.getByText("Guayaquil, Ecuador")).toHaveClass("leading-4")
    })

    it("should render payment note in horizontal layout", () => {
        render(
            <ExperienceCardContent
                title="Spa Premium"
                points={8000}
                isHorizontal
            />,
        )

        expect(screen.getByText("Puedes utilizar millas + tarjeta")).toBeInTheDocument()
    })
})
