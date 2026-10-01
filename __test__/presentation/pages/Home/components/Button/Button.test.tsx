import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"

vi.mock("@heroui/react", () => ({
    extendVariants: (_Base: unknown, config: Record<string, unknown>) => {
        const MockButton = ({children, className, ...rest}: Record<string, unknown>) => (
            <button
                data-testid="custom-button"
                data-config={JSON.stringify(config)}
                className={className as string}
                {...rest}
            >
                {children as React.ReactNode}
            </button>
        )
        return MockButton
    },
    Button: ({children, ...rest}: Record<string, unknown>) => (
        <button {...rest}>{children as React.ReactNode}</button>
    ),
}))

import Button from "@/presentation/pages/Home/components/Button/Button"

describe("Button", () => {
    it("should render children text", () => {
        render(<Button>Click me</Button>)
        expect(screen.getByText("Click me")).toBeInTheDocument()
    })

    it("should render a button element", () => {
        render(<Button>Test</Button>)
        expect(screen.getByTestId("custom-button")).toBeInTheDocument()
    })

    it("should pass variant config with primary and secondary colors", () => {
        render(<Button>Test</Button>)
        const button = screen.getByTestId("custom-button")
        const config = JSON.parse(button.getAttribute("data-config") ?? "{}")
        expect(config.variants.color.primary).toBeDefined()
        expect(config.variants.color.secondary).toBeDefined()
    })

    it("should pass variant config with md and lg sizes", () => {
        render(<Button>Test</Button>)
        const button = screen.getByTestId("custom-button")
        const config = JSON.parse(button.getAttribute("data-config") ?? "{}")
        expect(config.variants.size.md).toBeDefined()
        expect(config.variants.size.lg).toBeDefined()
    })

    it("should include defaultVariants for color and size", () => {
        render(<Button>Test</Button>)
        const button = screen.getByTestId("custom-button")
        const config = JSON.parse(button.getAttribute("data-config") ?? "{}")
        expect(config.defaultVariants.color).toBe("primary")
        expect(config.defaultVariants.size).toBe("md")
    })

    it("should include compoundVariants", () => {
        render(<Button>Test</Button>)
        const button = screen.getByTestId("custom-button")
        const config = JSON.parse(button.getAttribute("data-config") ?? "{}")
        expect(config.compoundVariants).toHaveLength(2)
        expect(config.compoundVariants[0].color).toBe("primary")
        expect(config.compoundVariants[1].variant).toBe("bordered")
    })
})
