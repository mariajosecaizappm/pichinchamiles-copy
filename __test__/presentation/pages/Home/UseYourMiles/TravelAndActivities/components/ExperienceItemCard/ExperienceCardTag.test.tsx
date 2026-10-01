import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/ProductCard/ProductCardTag", () => ({
    default: ({
        tag,
        backgroundColor,
        textColor,
        className,
    }: {
        tag: string
        backgroundColor?: string
        textColor?: string
        className?: string
    }) => (
        <span
            data-testid="product-card-tag"
            data-tag={tag}
            data-bg={backgroundColor}
            data-color={textColor}
            data-class={className}
        >
            {tag}
        </span>
    ),
}))

vi.mock("@/presentation/style/colors", () => ({
    default: {
        yellow: { 500: "#fbbf24" },
        blue: { 500: "#3b82f6" },
    },
}))

import ExperienceCardTag from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/ExperienceItemCard/ExperienceCardTag"

describe("ExperienceCardTag", () => {
    it("should render ProductCardTag with experience styling", () => {
        render(<ExperienceCardTag tag="Nuevo" />)

        const tag = screen.getByTestId("product-card-tag")
        expect(tag).toHaveTextContent("Nuevo")
        expect(tag).toHaveAttribute("data-bg", "#fbbf24")
        expect(tag).toHaveAttribute("data-color", "#3b82f6")
        expect(tag).toHaveAttribute("data-class", "max-w-18 truncate")
    })
})
