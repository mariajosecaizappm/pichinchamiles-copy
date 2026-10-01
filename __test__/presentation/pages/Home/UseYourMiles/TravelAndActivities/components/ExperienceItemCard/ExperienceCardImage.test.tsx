import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@/presentation/components/AssetImage", () => ({
    default: ({
        alt,
        className,
    }: {
        alt: string
        className?: string
    }) => <img data-testid="asset-image" alt={alt} data-class={className} />,
}))

vi.mock("@heroui/react", () => ({
    cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/ExperienceItemCard/ExperienceCardTag", () => ({
    default: ({ tag }: { tag: string }) => <span data-testid="experience-card-tag">{tag}</span>,
}))

import ExperienceCardImage from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/ExperienceItemCard/ExperienceCardImage"

const asset = {
    desktopUrl: "https://example.com/d.jpg",
    mobileUrl: "https://example.com/m.jpg",
}

describe("ExperienceCardImage", () => {
    it("should render vertical image with default classes", () => {
        render(
            <ExperienceCardImage
                asset={asset}
                title="Spa Premium"
                isHorizontal={false}
            />,
        )

        const image = screen.getByTestId("asset-image")
        expect(image).toHaveAttribute("alt", "Spa Premium")
        expect(image).toHaveAttribute("data-class", expect.stringContaining("max-w-[250px]"))
        expect(screen.queryByTestId("experience-card-tag")).not.toBeInTheDocument()
    })

    it("should render vertical image with custom classNameImage", () => {
        render(
            <ExperienceCardImage
                asset={asset}
                title="Spa Premium"
                isHorizontal={false}
                classNameImage="max-w-none"
            />,
        )

        expect(screen.getByTestId("asset-image")).toHaveAttribute(
            "data-class",
            expect.stringContaining("max-w-none"),
        )
    })

    it("should render horizontal image with tag overlay", () => {
        const { container } = render(
            <ExperienceCardImage
                asset={asset}
                title="Spa Premium"
                tag="Nuevo"
                isHorizontal
            />,
        )

        expect(container.querySelector(".min-h-\\[150px\\]")).toBeInTheDocument()
        expect(screen.getByTestId("asset-image")).toHaveAttribute("alt", "Spa Premium")
        expect(screen.getByTestId("experience-card-tag")).toHaveTextContent("Nuevo")
    })

    it("should render horizontal image without tag overlay", () => {
        render(
            <ExperienceCardImage
                asset={asset}
                title="Spa Premium"
                isHorizontal
            />,
        )

        expect(screen.getByTestId("asset-image")).toBeInTheDocument()
        expect(screen.queryByTestId("experience-card-tag")).not.toBeInTheDocument()
    })
})
