import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"

vi.mock("next/image", () => ({
    getImageProps: (options: any) => ({
        props: { src: options.src, srcSet: options.src, alt: options.alt || "", width: options.width, height: options.height }
    }),
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    default: (props: Record<string, unknown>) => <img {...props} />,
}))

vi.mock("next/link", () => ({
    default: ({children, href}: {children: React.ReactNode; href: string}) => (
        <a href={href} data-testid="mock-link">{children}</a>
    ),
}))

vi.mock("next/navigation", () => ({
    usePathname: () => "/",
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
    }),
}))

const mockDispatch = vi.fn()
vi.mock("react-redux", () => ({
    useDispatch: () => mockDispatch,
    useSelector: () => ({
        information: null,
        isLogged: false,
        balance: 0,
        isValidatingSession: false,
        basket: null
    }),
}))

vi.mock("@heroui/react", () => ({
    extendVariants: () => {
        const MockButton = ({children, onPress, ...rest}: Record<string, unknown>) => (
            <button onClick={onPress as () => void} {...rest}>
                {children as React.ReactNode}
            </button>
        )
        return MockButton
    },
    Button: ({children, ...rest}: Record<string, unknown>) => (
        <button {...rest}>{children as React.ReactNode}</button>
    ),
}))

vi.mock("@/presentation/pages/Home/components/Header/components/Menu", () => ({
    default: () => (
        <div data-testid="home-menu">
            <span data-testid="menu-icon">
                <svg><path /></svg>
            </span>
            <span>Menú</span>
        </div>
    ),
}))

vi.mock("@/presentation/pages/Home/components/Header/components/HeaderActions/HeaderActions", () => ({
    default: () => <div data-testid="header-actions">Header Actions</div>,
}))

vi.mock("@/presentation/pages/Home/components/Header/components/Miles", () => ({
    default: ({ isMobile }: { isMobile?: boolean }) => (
        <div data-testid="miles-component">
            {isMobile ? "Mobile Miles" : "Desktop Miles"}
        </div>
    ),
}))

import Header from "@/presentation/pages/Home/components/Header/Header"

describe("Header", () => {
    it("should render a header element", () => {
        const {container} = render(<Header />)
        expect(container.querySelector("header")).toBeInTheDocument()
    })

    it("should render the Pichincha Miles logo", () => {
        render(<Header />)
        const img = screen.getByAltText("Pichincha Miles Logo")
        expect(img).toBeInTheDocument()
        expect(img).toHaveAttribute("src", "/pm-logo.svg")
    })

    it("should render a link to home page wrapping the logo", () => {
        render(<Header />)
        const link = screen.getByTestId("mock-link")
        expect(link).toHaveAttribute("href", "/")
    })

    it("should render the MenuIcon svg", () => {
        const {container} = render(<Header />)
        const svg = container.querySelector("svg")
        expect(svg).toBeInTheDocument()
    })

    it("should render the Menú text (hidden on mobile)", () => {
        render(<Header />)
        expect(screen.getByText("Menú")).toBeInTheDocument()
    })

    it("should render the HeaderActions component", () => {
        render(<Header />)
        expect(screen.getByTestId("header-actions")).toBeInTheDocument()
        expect(screen.getByText("Header Actions")).toBeInTheDocument()
    })

    it("should render the Miles component with isMobile prop", () => {
        render(<Header />)
        const milesComponent = screen.getByTestId("miles-component")
        expect(milesComponent).toBeInTheDocument()
        expect(milesComponent).toHaveTextContent("Mobile Miles")
    })
})
