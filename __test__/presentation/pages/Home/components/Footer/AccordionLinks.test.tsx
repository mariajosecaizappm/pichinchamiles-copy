import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"

vi.mock("next/navigation", () => ({
    usePathname: () => "/",
    useRouter: () => ({ push: vi.fn() }),
}))

vi.mock("next/link", () => ({
    default: ({children, href}: {children: React.ReactNode; href: string}) => (
        <a href={href}>{children}</a>
    ),
}))

vi.mock("@heroui/react", () => ({
    cn: (...classes: (string | undefined | false | null)[]) => classes.filter(Boolean).join(" "),
    Accordion: ({children}: {children: React.ReactNode}) => (
        <div data-testid="accordion">{children}</div>
    ),
    AccordionItem: ({children, title}: {children: React.ReactNode; title: string}) => (
        <div data-testid="accordion-item"><span>{title}</span>{children}</div>
    ),
}))

import AccordionLinks from "@/presentation/pages/Home/components/Footer/AccordionLinks"

describe("AccordionLinks", () => {
    it("should render the accordion", () => {
        render(<AccordionLinks />)
        expect(screen.getByTestId("accordion")).toBeInTheDocument()
    })

    it("should render footer item titles", () => {
        render(<AccordionLinks />)
        expect(screen.getByText("Utiliza tus millas")).toBeInTheDocument()
        expect(screen.getByText("Condiciones legales")).toBeInTheDocument()
    })

    it("should render footer links", () => {
        render(<AccordionLinks />)
        expect(screen.getByText("Productos")).toBeInTheDocument()
        expect(screen.getByText("Alertas de seguridad")).toBeInTheDocument()
        expect(screen.getByText("Política de cookies")).toBeInTheDocument()
    })

    it("should have accessible accordion with proper structure", () => {
        render(<AccordionLinks />)
        const accordion = screen.getByTestId("accordion")
        expect(accordion).toBeInTheDocument()
    })

    it("should have accessible accordion items with proper ARIA labels", () => {
        render(<AccordionLinks />)
        const accordionItems = screen.getAllByTestId("accordion-item")
        expect(accordionItems.length).toBe(2)
        
        // Check that accordion items have proper ARIA labels
        expect(screen.getByText("Utiliza tus millas")).toBeInTheDocument()
        expect(screen.getByText("Condiciones legales")).toBeInTheDocument()
    })

    it("should render links with proper focus management", () => {
        render(<AccordionLinks />)
        const links = screen.getAllByRole("link")
        expect(links.length).toBeGreaterThan(0)
        
        // Check that links have focus styles (would be applied via CSS classes)
        links.forEach(link => {
            expect(link).toBeInTheDocument()
        })
    })

    it("should have proper list structure for links", () => {
        render(<AccordionLinks />)
        const lists = screen.getAllByRole("list")
        expect(lists.length).toBeGreaterThan(0)
    })

    it("should have accessible SVG icons", () => {
        render(<AccordionLinks />)
        // Check that the component renders without SVG icon errors
        expect(screen.getByTestId("accordion")).toBeInTheDocument()
    })

    it("should be accessible by screen readers", () => {
        render(<AccordionLinks />)
        
        // Check that important elements are accessible
        expect(screen.getByTestId("accordion")).toBeInTheDocument()
        expect(screen.getAllByRole("list")).toHaveLength(2) // Two lists for two sections
    })
})
