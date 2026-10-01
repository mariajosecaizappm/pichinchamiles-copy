import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import ExperienceCardPrices from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/ExperienceItemCard/ExperienceCardPrices"

describe("ExperienceCardPrices", () => {
    it("should render Desde label with formatted points in vertical layout", () => {
        render(
            <ExperienceCardPrices
                points={8000}
                isHorizontal={false}
            />,
        )

        expect(screen.getByText(/Desde/)).toBeInTheDocument()
        expect(screen.getByText("Desde")).toHaveClass("text-[14px]", "text-grayscale-500")
        expect(screen.getByText(/8.000 millas/)).toHaveClass("text-blue-500", "text-[28px]")
        expect(screen.queryByText(/Antes/)).not.toBeInTheDocument()
    })

    it("should render Desde label with formatted points in horizontal layout", () => {
        render(
            <ExperienceCardPrices
                points={8000}
                isHorizontal
            />,
        )

        expect(screen.getByText(/Desde/)).toBeInTheDocument()
        expect(screen.getByText("Desde")).toHaveClass("text-[14px]", "text-grayscale-500")
        expect(screen.getByText(/8.000 millas/)).toHaveClass("text-blue-500", "text-lg")
        expect(screen.queryByText(/Antes/)).not.toBeInTheDocument()
    })
})
