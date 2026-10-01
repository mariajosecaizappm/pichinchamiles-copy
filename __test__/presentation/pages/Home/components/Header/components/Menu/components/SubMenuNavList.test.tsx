import { render, screen, within, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/presentation/hooks/useContactLinkGuard", () => {
    const fn = vi.fn()
    return {
        default: () => fn,
        __getHandleContactClick: () => fn,
    }
})

import * as useContactLinkGuardModule from "@/presentation/hooks/useContactLinkGuard"
const handleContactClick = () => (useContactLinkGuardModule as unknown as {__getHandleContactClick: () => ReturnType<typeof vi.fn>}).__getHandleContactClick()

beforeEach(() => {
    vi.clearAllMocks()
})

vi.mock("next/link", () => ({
    default: ({ children, href, onClick }: { children: React.ReactNode; href: string; onClick?: () => void }) => (
        <a href={href} onClick={onClick}>{children}</a>
    ),
}))
 
import SubMenuNavList from "@/presentation/pages/Home/components/Header/components/Menu/components/SubMenuNavList"
import type { MenuItem } from "@/presentation/pages/Home/components/Header/components/Menu/HomeMenuConfig"
 
const menuWithHref: MenuItem = {
    label: "Viajes y actividades",
    href: "/utilice-sus-millas/viajes-y-actividades",
    submenus: [
        { label: "Vuelos", href: "/viajes/vuelos" },
        { label: "Hoteles", href: "/viajes/hoteles" },
    ],
}
 
const menuWithoutHref: MenuItem = {
    label: "Ayuda",
    submenus: [
        { label: "Preguntas frecuentes", href: "/ayuda/faq" },
        { label: "Contacto", href: "/ayuda/contacto" },
    ],
}
 
describe("SubMenuNavList", () => {
    const handleDrawerChange = vi.fn()

    it("should render a nav with aria-label matching the menu label", () => {
        render(<SubMenuNavList activeSubmenu={menuWithHref} handleDrawerChange={handleDrawerChange} />)
        expect(screen.getByLabelText("Menú viajes y actividades")).toBeInTheDocument()
    })
 
    it("should render all submenu items as list items", () => {
        render(<SubMenuNavList activeSubmenu={menuWithHref} handleDrawerChange={handleDrawerChange} />)
        const nav = screen.getByLabelText("Menú viajes y actividades")
        const items = within(nav).getAllByRole("listitem")
        expect(items).toHaveLength(2)
    })
 
    it("should render submenu items as links with correct hrefs", () => {
        render(<SubMenuNavList activeSubmenu={menuWithHref} handleDrawerChange={handleDrawerChange} />)
        const vuelosLink = screen.getByText("Vuelos").closest("a")
        expect(vuelosLink).toHaveAttribute("href", "/viajes/vuelos")
        const hotelesLink = screen.getByText("Hoteles").closest("a")
        expect(hotelesLink).toHaveAttribute("href", "/viajes/hoteles")
    })
 
    describe("title rendering", () => {
        it("should render the title as a link when the menu item has an href", () => {
            render(<SubMenuNavList activeSubmenu={menuWithHref} handleDrawerChange={handleDrawerChange} />)
            const titleLink = screen.getByText("Viajes y actividades").closest("a")
            expect(titleLink).toBeInTheDocument()
            expect(titleLink).toHaveAttribute("href", "/utilice-sus-millas/viajes-y-actividades")
        })
 
        it("should render the title as an h2 when the menu item has no href", () => {
            render(<SubMenuNavList activeSubmenu={menuWithoutHref} handleDrawerChange={handleDrawerChange} />)
            const heading = screen.getByRole("heading", { level: 2 })
            expect(heading).toHaveTextContent("Ayuda")
        })
 
        it("should NOT render a heading when the menu item has an href", () => {
            render(<SubMenuNavList activeSubmenu={menuWithHref} handleDrawerChange={handleDrawerChange} />)
            expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument()
        })
 
        it("should NOT render a link title when the menu item has no href", () => {
            render(<SubMenuNavList activeSubmenu={menuWithoutHref} handleDrawerChange={handleDrawerChange} />)
            const titleLink = screen.getByText("Ayuda").closest("a")
            expect(titleLink).not.toBeInTheDocument()
        })
    })

    describe("handleDrawerChange invocation", () => {
        it("should call handleDrawerChange when clicking the title link", () => {
            const onChange = vi.fn()
            render(<SubMenuNavList activeSubmenu={menuWithHref} handleDrawerChange={onChange} />)

            const titleLink = screen.getByText("Viajes y actividades").closest("a") as HTMLAnchorElement
            fireEvent.click(titleLink)

            expect(onChange).toHaveBeenCalledTimes(1)
        })

        it("should call handleDrawerChange when clicking a submenu item link", () => {
            const onChange = vi.fn()
            render(<SubMenuNavList activeSubmenu={menuWithHref} handleDrawerChange={onChange} />)

            const vuelosLink = screen.getByText("Vuelos").closest("a") as HTMLAnchorElement
            fireEvent.click(vuelosLink)

            expect(onChange).toHaveBeenCalledTimes(1)
        })

        it("should NOT call handleDrawerChange when clicking the h2 title (no href)", () => {
            const onChange = vi.fn()
            render(<SubMenuNavList activeSubmenu={menuWithoutHref} handleDrawerChange={onChange} />)

            const heading = screen.getByRole("heading", { level: 2 })
            fireEvent.click(heading)

            expect(onChange).not.toHaveBeenCalled()
        })

        it("should call handleDrawerChange independently for each submenu item clicked", () => {
            const onChange = vi.fn()
            render(<SubMenuNavList activeSubmenu={menuWithoutHref} handleDrawerChange={onChange} />)

            fireEvent.click(screen.getByText("Preguntas frecuentes").closest("a") as HTMLAnchorElement)
            fireEvent.click(screen.getByText("Contacto").closest("a") as HTMLAnchorElement)

            expect(onChange).toHaveBeenCalledTimes(2)
        })
    })

    describe("contact link guard", () => {
        it("should call handleContactClick when clicking a submenu link", () => {
            render(<SubMenuNavList activeSubmenu={menuWithHref} handleDrawerChange={handleDrawerChange} />)

            const vuelosLink = screen.getByText("Vuelos").closest("a") as HTMLAnchorElement
            fireEvent.click(vuelosLink)

            expect(handleContactClick()).toHaveBeenCalled()
        })

        it("should not call handleContactClick when clicking the title link", () => {
            render(<SubMenuNavList activeSubmenu={menuWithHref} handleDrawerChange={handleDrawerChange} />)

            const titleLink = screen.getByText("Viajes y actividades").closest("a") as HTMLAnchorElement
            fireEvent.click(titleLink)

            expect(handleContactClick()).not.toHaveBeenCalled()
            expect(handleDrawerChange).toHaveBeenCalledTimes(1)
        })
    })
})
 