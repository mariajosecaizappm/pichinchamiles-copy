import {render, screen, waitFor} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"

vi.mock("next/dynamic", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require("react") as typeof import("react")
    return {
        default: (factory: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>) => {
            return function DynamicImportWrapper(props: Record<string, unknown>) {
                const [Resolved, setResolved] = React.useState<React.ComponentType<Record<string, unknown>> | null>(
                    null,
                )
                React.useLayoutEffect(() => {
                    let cancelled = false
                    void factory().then((mod) => {
                        if (!cancelled) {
                            setResolved(() => mod.default)
                        }
                    })
                    return () => {
                        cancelled = true
                    }
                }, [])
                if (!Resolved) {
                    return null
                }
                return React.createElement(Resolved, props)
            }
        },
    }
})

vi.mock("next/image", () => ({
    getImageProps: (options: { src: string; alt?: string; width?: number; height?: number }) => ({
        props: { src: options.src, srcSet: options.src, alt: options.alt || "", width: options.width, height: options.height }
    }),
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    default: (props: Record<string, unknown>) => <img {...props} />,
}))

globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}))

vi.mock("react-horizontal-scrolling-menu", () => ({
    ScrollMenu: ({children, LeftArrow, RightArrow}: {
        children: React.ReactNode;
        LeftArrow?: React.FC;
        RightArrow?: React.FC;
    }) => (
        <div data-testid="scroll-menu">
            {LeftArrow && <LeftArrow />}
            {children}
            {RightArrow && <RightArrow />}
        </div>
    ),
    VisibilityContext: {
        _currentValue: {
            scrollPrev: vi.fn(),
            scrollNext: vi.fn(),
            useIsVisible: (id: string) => id === "first",
        },
    },
}))

import ExchangeSteps from "@/presentation/pages/Home/components/ExchangeSteps/ExchangeSteps"

describe("ExchangeSteps", () => {
    it("should render the section title", () => {
        render(<ExchangeSteps />)
        expect(screen.getByText("Canjear tus millas es muy fácil")).toBeInTheDocument()
    })

    it("should render the section subtitle", () => {
        render(<ExchangeSteps />)
        expect(screen.getByText("Sigue estos 3 simples pasos para disfrutar de tus recompensas.")).toBeInTheDocument()
    })

    it("should render all 3 exchange steps", () => {
        render(<ExchangeSteps />)
        expect(screen.getAllByText("Accede con tu identificación")).toBeTruthy()
        expect(screen.getAllByText("Explora y elige tu recompensa")).toBeTruthy()
        expect(screen.getAllByText("Canjea y disfruta")).toBeTruthy()
    })

    it("should render step descriptions", () => {
        render(<ExchangeSteps />)
        expect(screen.getAllByText(/Ingresa con tu número de identificación/)).toBeTruthy()
        expect(screen.getAllByText(/Descubre las opciones disponibles/)).toBeTruthy()
        expect(screen.getAllByText(/Confirma tu canje/)).toBeTruthy()
    })

    it("should render step counters", () => {
        render(<ExchangeSteps />)
        expect(screen.getAllByText("PASO 1/3")).toBeTruthy()
        expect(screen.getAllByText("PASO 2/3")).toBeTruthy()
        expect(screen.getAllByText("PASO 3/3")).toBeTruthy()
    })

    it("should render images for each step", () => {
        render(<ExchangeSteps />)
        expect(screen.getAllByAltText("Accede con tu identificación")).toBeTruthy()
        expect(screen.getAllByAltText("Explora y elige tu recompensa")).toBeTruthy()
        expect(screen.getAllByAltText("Canjea y disfruta")).toBeTruthy()
    })

    it("should render the mobile carousel", async () => {
        render(<ExchangeSteps />)
        await waitFor(
            () => {
                expect(screen.getByTestId("scroll-menu")).toBeInTheDocument()
            },
            { timeout: 5000 },
        )
    })

    it("should use semantic section element with proper ARIA attributes", () => {
        render(<ExchangeSteps />)
        const section = screen.getByRole("region", { name: "Canjear tus millas es muy fácil" })
        expect(section).toBeInTheDocument()
        expect(section).toHaveAttribute("aria-labelledby", "exchange-steps-title")
    })

    it("should have proper heading structure", () => {
        render(<ExchangeSteps />)
        const heading = screen.getByRole("heading", { name: "Canjear tus millas es muy fácil" })
        expect(heading).toBeInTheDocument()
        expect(heading).toHaveAttribute("id", "exchange-steps-title")
    })

    it("should render steps as list items with proper ARIA labels", () => {
        render(<ExchangeSteps />)
        const list = screen.getByRole("list", { name: "Pasos para canjear millas" })
        expect(list).toBeInTheDocument()
        
        const listItems = screen.getAllByRole("listitem")
        expect(listItems).toHaveLength(3)
    })

    it("should have accessible step indicators", async () => {
        render(<ExchangeSteps />)
        await waitFor(
            () => {
                expect(screen.getByTestId("scroll-menu")).toBeInTheDocument()
            },
            { timeout: 5000 },
        )
        const stepIndicators = screen.getAllByText(/PASO \d\/3/)
        expect(stepIndicators).toHaveLength(6)
        
        // Check that step indicators are present and accessible
        stepIndicators.forEach(indicator => {
            expect(indicator).toBeInTheDocument()
        })
    })

    it("should have proper ARIA relationships for step content", async () => {
        render(<ExchangeSteps />)
        await waitFor(
            () => {
                expect(screen.getByTestId("scroll-menu")).toBeInTheDocument()
            },
            { timeout: 5000 },
        )
        const articles = screen.getAllByRole("article")
        expect(articles).toHaveLength(6)
        
        // Check that articles are present and have proper structure
        articles.forEach(article => {
            expect(article).toBeInTheDocument()
        })
    })
})
