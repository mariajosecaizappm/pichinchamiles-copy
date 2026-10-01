import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import MainLayout from "@/presentation/components/Layout/MainLayout/MainLayout"

vi.mock("next/image", () => ({
    getImageProps: (options: any) => ({
        props: { src: options.src, srcSet: options.src, alt: options.alt || "", width: options.width, height: options.height }
    }),
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    default: (props: Record<string, unknown>) => <img {...props} />,
}))

vi.mock("next/link", () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}))

vi.mock("@heroui/react", () => ({
    extendVariants: () => {
        const MockButton = ({ children, ...rest }: Record<string, unknown>) => (
            <button {...rest}>{children as React.ReactNode}</button>
        )
        return MockButton
    },
    Button: ({ children, ...rest }: Record<string, unknown>) => (
        <button {...rest}>{children as React.ReactNode}</button>
    ),
}))

vi.mock("@/presentation/components/Layout/MainLayout/components/AuthModal", () => ({
    default: () => <div data-testid="auth-modal">AuthModal</div>,
}))

vi.mock("@/presentation/components/Layout/MainLayout/components/LopdModal", () => ({
    default: () => <div data-testid="lopd-modal">LopdModal</div>,
}))

vi.mock("@/presentation/components/Layout/MainLayout/AuthInitializer", () => ({
    default: () => <div data-testid="auth-initializer">AuthInitializer</div>,
}))

vi.mock("@/presentation/components/Layout/MainLayout/AnalyticsInitializer", () => ({
    default: () => <div data-testid="analytics-initializer">AnalyticsInitializer</div>,
}))

vi.mock("@/presentation/pages/Home/components/Header", () => ({
    default: () => <div data-testid="header">Header</div>,
}))

vi.mock("@/presentation/pages/Home/components/Footer", () => ({
    default: () => <div data-testid="footer">Footer</div>,
}))

describe("MainLayout", () => {
    const renderMainLayout = (children: React.ReactNode = <div>Test Content</div>) =>
        render(<MainLayout>{children}</MainLayout>)

    it("when rendered, should render the AuthModal component", async () => {
        renderMainLayout()
        expect(await screen.findByTestId("auth-modal")).toBeInTheDocument()
    })

    it("when rendered, should render the LopdModal component", async () => {
        renderMainLayout()
        expect(await screen.findByTestId("lopd-modal")).toBeInTheDocument()
    })

    it("when rendered, should render the Header component", () => {
        renderMainLayout()
        expect(screen.getByTestId("header")).toBeInTheDocument()
    })

    it("when rendered, should render the AuthInitializer component", () => {
        renderMainLayout()
        expect(screen.getByTestId("auth-initializer")).toBeInTheDocument()
    })

    it("when rendered, should render the Footer component", () => {
        renderMainLayout()
        expect(screen.getByTestId("footer")).toBeInTheDocument()
    })

    it("when rendered, should render the AnalyticsInitializer component", () => {
        renderMainLayout()
        expect(screen.getByTestId("analytics-initializer")).toBeInTheDocument()
    })

    it("when children are provided, should render children content", () => {
        renderMainLayout(<div data-testid="test-child">Test Content</div>)
        expect(screen.getByTestId("test-child")).toBeInTheDocument()
        expect(screen.getByText("Test Content")).toBeInTheDocument()
    })

    it("when children are provided, should render children between Header and Footer", () => {
        renderMainLayout(<div data-testid="test-child">Test Content</div>)
        
        const header = screen.getByTestId("header")
        const footer = screen.getByTestId("footer")
        const child = screen.getByTestId("test-child")
        
        const parent = child.parentElement?.parentElement
        expect(parent).toContain(header)
        expect(parent).toContain(child)
        expect(parent).toContain(footer)
    })

    it("when rendered, should apply correct CSS classes to outer wrapper", () => {
        const {container} = renderMainLayout()
        
        const outerWrapper = container.firstElementChild
        expect(outerWrapper?.className).toContain("bg-linear-to-br")
        expect(outerWrapper?.className).toContain("from-white")
        expect(outerWrapper?.className).toContain("to-white")
        expect(outerWrapper?.className).toContain("flex")
        expect(outerWrapper?.className).toContain("items-center")
        expect(outerWrapper?.className).toContain("justify-center")
        expect(outerWrapper?.className).toContain("typo-main-body-book")
    })

    it("when multiple children are provided, should render all children correctly", () => {
        renderMainLayout(
            <>
                <div data-testid="child-1">First Child</div>
                <div data-testid="child-2">Second Child</div>
                <div data-testid="child-3">Third Child</div>
            </>,
        )
        
        expect(screen.getByTestId("child-1")).toBeInTheDocument()
        expect(screen.getByTestId("child-2")).toBeInTheDocument()
        expect(screen.getByTestId("child-3")).toBeInTheDocument()
    })

    it("when children are empty, should still render fixed layout components", async () => {
        renderMainLayout(null)
        
        expect(await screen.findByTestId("auth-modal")).toBeInTheDocument()
        expect(await screen.findByTestId("lopd-modal")).toBeInTheDocument()
        expect(screen.getByTestId("header")).toBeInTheDocument()
        expect(screen.getByTestId("footer")).toBeInTheDocument()
    })

    it("when rendered, should maintain correct component hierarchy", async () => {
        const {container} = renderMainLayout(
            <div data-testid="test-child">Test Content</div>,
        )
        
        const authModal = await screen.findByTestId("auth-modal")
        const lopdModal = await screen.findByTestId("lopd-modal")
        const authInitializer = screen.getByTestId("auth-initializer")
        const analyticsInitializer = screen.getByTestId("analytics-initializer")
        const header = screen.getByTestId("header")
        const footer = screen.getByTestId("footer")
        const child = screen.getByTestId("test-child")
        
        const outerWrapper = container.firstElementChild
        expect(outerWrapper).toContain(authModal)
        expect(outerWrapper).toContain(lopdModal)
        expect(outerWrapper).toContain(authInitializer)
        expect(outerWrapper).toContain(analyticsInitializer)
        
        const innerWrapper = child.parentElement?.parentElement
        expect(innerWrapper).toContain(header)
        expect(innerWrapper).toContain(child)
        expect(innerWrapper).toContain(footer)
    })
})
