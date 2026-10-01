import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"

vi.mock("next/image", () => ({
    getImageProps: (options: any) => ({
        props: { src: options.src, srcSet: options.src, alt: options.alt || "", width: options.width, height: options.height }
    }),
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    default: (props: Record<string, unknown>) => <img {...props} />,
}))

vi.mock("next/navigation", () => ({
    usePathname: () => "/",
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
    }),
}))

vi.mock("react-redux", () => ({
    useDispatch: () => vi.fn(),
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => ({
        isLogged: false,
        isValidatingSession: false,
    }),
}))

vi.mock("next/link", () => ({
    default: ({children, href, "aria-label": ariaLabel}: {children: React.ReactNode; href: string; "aria-label"?: string}) => (
        <a href={href} data-testid="mock-link" aria-label={ariaLabel}>{children}</a>
    ),
}))

vi.mock("@heroui/react", () => ({
    Divider: () => <div data-testid="divider" />,
    Accordion: ({children}: {children: React.ReactNode}) => <div data-testid="accordion">{children}</div>,
    AccordionItem: ({children}: {children: React.ReactNode}) => <div>{children}</div>,
}))

vi.mock("@/presentation/pages/Home/components/Footer/AccordionLinks", () => ({
    default: () => <div data-testid="accordion-links">AccordionLinks</div>,
}))

vi.mock("@/presentation/pages/Home/components/Footer/Icons/PhoneIcon", () => ({
    default: () => <svg data-testid="phone-icon" />,
}))

vi.mock("@/presentation/hooks/useContactLinkGuard", () => ({
    default: () => vi.fn(),
}))

import Footer from "@/presentation/pages/Home/components/Footer/Footer"

describe("Footer", () => {
    it("should render a footer element", () => {
        const {container} = render(<Footer />)
        expect(container.querySelector("footer")).toBeInTheDocument()
    })

    it("should render the PM logo", () => {
        render(<Footer />)
        const img = screen.getByAltText("Pichincha Miles Logo")
        expect(img).toBeInTheDocument()
        expect(img).toHaveAttribute("src", "/pm-logo.svg")
    })

    it("should render a link to home page wrapping the logo", () => {
        render(<Footer />)
        const links = screen.getAllByTestId("mock-link")
        const homeLink = links[0]
        expect(homeLink).toHaveAttribute("href", "/")
    })

    it("should render the Ayuda section title", () => {
        render(<Footer />)
        expect(screen.getByText("Ayuda")).toBeInTheDocument()
    })

    it("should render the phone button with correct text", () => {
        render(<Footer />)
        expect(screen.getByText("Llámanos al 1800 - BPMILE (276453)")).toBeInTheDocument()
    })

    it("should render the PhoneIcon", () => {
        render(<Footer />)
        expect(screen.getByTestId("phone-icon")).toBeInTheDocument()
    })

    it("should render AccordionLinks component", () => {
        render(<Footer />)
        expect(screen.getByTestId("accordion-links")).toBeInTheDocument()
    })

    it("should render footer items with correct titles", () => {
        render(<Footer />)
        expect(screen.getByText("Utiliza tus millas")).toBeInTheDocument()
        expect(screen.getByText("Condiciones legales")).toBeInTheDocument()
    })

    it("should render footer links for Utiliza tus millas section", () => {
        render(<Footer />)
        expect(screen.getByText("Productos")).toBeInTheDocument()
        expect(screen.getByText("Viajes y Actividades")).toBeInTheDocument()
    })

    it("should render footer links for Condiciones legales section", () => {
        render(<Footer />)
        expect(screen.getByText("Alertas de seguridad")).toBeInTheDocument()
        expect(screen.getByText("Políticas de privacidad en internet")).toBeInTheDocument()
        expect(screen.getByText("Términos y condiciones del programa")).toBeInTheDocument()
        expect(screen.getByText("Términos y condiciones de uso")).toBeInTheDocument()
        expect(screen.getByText("Aviso de política de privacidad")).toBeInTheDocument()
        expect(screen.queryByText("Conoce nuestras tarjetas")).not.toBeInTheDocument()
        expect(screen.getByText("Política de cookies")).toBeInTheDocument()
    })

    it("should render the Publipromueve disclaimer text", () => {
        render(<Footer />)
        expect(
            screen.getByText(/El programa de recompensas Pichincha Miles® es gestionado y administrado por la empresa Publipromueve S.A./)
        ).toBeInTheDocument()
    })

    it("should render Divider components", () => {
        render(<Footer />)
        const dividers = screen.getAllByTestId("divider")
        expect(dividers.length).toBeGreaterThan(0)
    })

    it("should use semantic footer element", () => {
        render(<Footer />)
        const footer = screen.getByRole("contentinfo")
        expect(footer).toBeInTheDocument()
    })

    it("should have accessible logo link", () => {
        render(<Footer />)
        const logoLink = screen.getByRole("link", { name: "Pichincha Miles - Inicio" })
        expect(logoLink).toBeInTheDocument()
        expect(logoLink).toHaveAttribute("href", "/")
    })

    it("should have proper ARIA attributes for logo image", () => {
        render(<Footer />)
        const logo = screen.getByAltText("Pichincha Miles Logo")
        expect(logo).toHaveAttribute("aria-hidden", "true")
    })

    it("should have accessible help section", () => {
        render(<Footer />)
        const helpSection = screen.getByRole("region", { name: "Ayuda" })
        expect(helpSection).toBeInTheDocument()
        expect(helpSection).toHaveAttribute("aria-labelledby", "footer-help-title")
    })

    it("should have accessible phone button", () => {
        render(<Footer />)
        const phoneButton = screen.getByRole("button", { name: "Llamar al teléfono de atención al cliente: 1800 - BPMILE (276453)" })
        expect(phoneButton).toBeInTheDocument()
    })

    it("should have accessible navigation sections", () => {
        render(<Footer />)
        const navs = screen.getAllByRole("navigation")
        expect(navs.length).toBe(2)
        navs.forEach(nav => {
            expect(nav).toHaveAttribute("aria-label", "Enlaces del pie de página")
        })
    })

    it("should have proper heading structure for footer sections", () => {
        render(<Footer />)
        const headings = screen.getAllByRole("heading")
        expect(headings.length).toBeGreaterThan(0)
        
        // Check help section heading
        const helpHeading = screen.getByRole("heading", { name: "Ayuda" })
        expect(helpHeading).toHaveAttribute("id", "footer-help-title")
    })
})
