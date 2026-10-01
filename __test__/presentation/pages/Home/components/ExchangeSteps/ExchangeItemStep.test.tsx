import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"

vi.mock("next/image", () => ({
    getImageProps: (options: any) => ({
        props: { src: options.src, srcSet: options.src, alt: options.alt || "", width: options.width, height: options.height }
    }),
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    default: (props: Record<string, unknown>) => <img {...props} />,
}))

import ExchangeItemStep from "@/presentation/pages/Home/components/ExchangeSteps/ExchanteItemStep"

describe("ExchangeItemStep", () => {
    const mockStep = {
        step: 1,
        title: "Accede con tu identificación",
        description: "Ingresa con tu número de identificación y sigue las instrucciones para completar tu registro.",
        image: "/test-image.jpg"
    }

    it("should render step title", () => {
        render(<ExchangeItemStep step={mockStep} />)
        expect(screen.getByText("Accede con tu identificación")).toBeInTheDocument()
    })

    it("should render step description", () => {
        render(<ExchangeItemStep step={mockStep} />)
        expect(screen.getByText("Ingresa con tu número de identificación y sigue las instrucciones para completar tu registro.")).toBeInTheDocument()
    })

    it("should render step counter", () => {
        render(<ExchangeItemStep step={mockStep} />)
        expect(screen.getByText("PASO 1/3")).toBeInTheDocument()
    })

    it("should render step image", () => {
        render(<ExchangeItemStep step={mockStep} />)
        const image = screen.getByAltText("Accede con tu identificación")
        expect(image).toBeInTheDocument()
        expect(image).toHaveAttribute("src", "/test-image.jpg")
    })

    it("should use semantic article element", () => {
        render(<ExchangeItemStep step={mockStep} />)
        const article = screen.getByRole("article")
        expect(article).toBeInTheDocument()
    })

    it("should have proper ARIA relationships", () => {
        render(<ExchangeItemStep step={mockStep} />)
        const article = screen.getByRole("article")
        expect(article).toHaveAttribute("aria-labelledby", "step-1-title")
        expect(article).toHaveAttribute("aria-describedby", "step-1-description")
    })

    it("should have accessible step indicator", () => {
        render(<ExchangeItemStep step={mockStep} />)
        const stepIndicator = screen.getByText("PASO 1/3")
        expect(stepIndicator).toHaveAttribute("aria-label", "Paso 1 de 3")
    })

    it("should have proper heading structure with ID", () => {
        render(<ExchangeItemStep step={mockStep} />)
        const heading = screen.getByRole("heading", { name: "Accede con tu identificación" })
        expect(heading).toHaveAttribute("id", "step-1-title")
    })

    it("should have description with proper ID", () => {
        render(<ExchangeItemStep step={mockStep} />)
        const description = screen.getByText("Ingresa con tu número de identificación y sigue las instrucciones para completar tu registro.")
        expect(description).toHaveAttribute("id", "step-1-description")
    })

    it("should be accessible by screen readers", () => {
        render(<ExchangeItemStep step={mockStep} />)
        
        // Check that all important elements are accessible
        expect(screen.getByRole("article")).toBeInTheDocument()
        expect(screen.getByRole("heading", { name: "Accede con tu identificación" })).toBeInTheDocument()
        expect(screen.getByRole("img", { name: "Accede con tu identificación" })).toBeInTheDocument()
    })
})
