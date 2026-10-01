import { render, screen, within, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const mockOnOpen = vi.fn()
const mockOnOpenChange = vi.fn()
const mockUseSession = vi.fn()
const mockDrawerProps = vi.fn()

vi.mock("@heroui/react", () => ({
    useDisclosure: () => ({
        isOpen: true,
        onOpen: mockOnOpen,
        onOpenChange: mockOnOpenChange,
    }),
    cn: (...args: string[]) => args.filter(Boolean).join(" "),
    Drawer: ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => {
        mockDrawerProps(props)
        return <div data-testid="drawer">{children}</div>
    },
    DrawerContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DrawerBody: ({ children }: { children: React.ReactNode }) => <div data-testid="drawer-body">{children}</div>,
    DrawerFooter: ({ children }: { children: React.ReactNode }) => <div data-testid="drawer-footer">{children}</div>,
    extendVariants: () => {
        return ({ children, onPress, ...rest }: Record<string, unknown>) => (
            <button onClick={onPress as () => void} {...rest}>
                {children as React.ReactNode}
            </button>
        )
    },
    Button: ({ children, onPress, ...rest }: Record<string, unknown>) => (
        <button onClick={onPress as () => void} {...rest}>
            {children as React.ReactNode}
        </button>
    ),
}))

vi.mock("next/link", () => ({
    default: ({ children, href, onClick }: { children: React.ReactNode; href: string; onClick?: () => void }) => (
        <a href={href} onClick={onClick}>{children}</a>
    ),
}))

vi.mock("@/presentation/pages/Home/components/Button/LoginButton", () => ({
    default: () => (
        <button data-testid="login-button">Ingresar</button>
    ),
}))

vi.mock("@/presentation/pages/Home/components/Header/components/Icons/MenuIcon", () => ({
    default: () => <span data-testid="menu-icon">MenuIcon</span>,
}))

vi.mock("@/presentation/pages/Home/components/Header/components/Menu/components/Icons/CloseIcon", () => ({
    default: () => <span data-testid="close-icon">CloseIcon</span>,
}))

vi.mock("@/presentation/pages/Home/components/Header/components/Menu/components/Icons/ArrowIcon", () => ({
    default: () => <span data-testid="arrow-icon">ArrowIcon</span>,
}))

const mockUseIsDesktop = vi.fn(() => ({ isDesktop: false }))

vi.mock("@/presentation/hooks/useIsDesktop", () => ({
    default: () => mockUseIsDesktop(),
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: (...args: unknown[]) => mockUseSession(...args),
}))

vi.mock("@/presentation/hooks/useContactLinkGuard", () => ({
    default: () => vi.fn(),
}))

vi.mock("@/presentation/pages/Home/components/Header/components/Menu/components/CloseSessionButton", () => ({
    default: () => <button data-testid="close-session-button">Cerrar Sesión</button>,
}))

import HomeMenu from "@/presentation/pages/Home/components/Header/components/Menu/HomeMenu"
import type { Category } from "@/domain/entity/Category/structure/category"

const guestSession = { member: null, isValidatingSession: false }
const authenticatedSession = { member: { id: "m-1", name: "Test User" }, isValidatingSession: false }

const mockCategories: Category[] = [
    { id: "1", name: "Hogar", slug: "hogar", parent: null },
    { id: "2", name: "Cocina", slug: "cocina", parent: null },
]

describe("HomeMenu", () => {

    beforeEach(() => {
        vi.clearAllMocks()
        mockUseSession.mockReturnValue(guestSession)
    })

    describe("Menu trigger button", () => {
        it("should render the menu trigger button with correct aria-label", () => {
            render(<HomeMenu />)
            expect(screen.getByLabelText("Abrir menú de navegación")).toBeInTheDocument()
        })

        it("should render the MenuIcon", () => {
            render(<HomeMenu />)
            expect(screen.getByTestId("menu-icon")).toBeInTheDocument()
        })

        it("should render 'Menú' text", () => {
            render(<HomeMenu />)
            expect(screen.getByText("Menú")).toBeInTheDocument()
        })
    })

    describe("without productCategories (fallback/static)", () => {
        it("should render static nav items when no productCategories are passed", () => {
            render(<HomeMenu />)
            expect(screen.getByText("¿Qué es Pichincha Miles?")).toBeInTheDocument()
            expect(screen.getByText("Explorar recompensas")).toBeInTheDocument()
            expect(screen.getByText("Viajes y actividades")).toBeInTheDocument()
            expect(screen.getByText("Ayuda")).toBeInTheDocument()
        })

        it("should NOT render 'Productos' when no productCategories are passed", () => {
            render(<HomeMenu />)
            expect(screen.queryByText("Productos")).not.toBeInTheDocument()
        })

        it("should render items without submenus as links", () => {
            render(<HomeMenu />)
            const link = screen.getByText("¿Qué es Pichincha Miles?").closest("a")
            expect(link).toBeInTheDocument()
            expect(link).toHaveAttribute("href", "/")
        })

        it("should render items with submenus as buttons with aria-haspopup", () => {
            render(<HomeMenu />)
            const btn = screen.getByText("Viajes y actividades").closest("button")
            expect(btn).toBeInTheDocument()
            expect(btn).toHaveAttribute("aria-haspopup", "true")
        })

        it("should render arrow icons for items with submenus", () => {
            render(<HomeMenu />)
            const arrowIcons = screen.getAllByTestId("arrow-icon")
            expect(arrowIcons.length).toBeGreaterThanOrEqual(2)
        })
    })

    describe("with productCategories", () => {
        it("should render 'Productos' when productCategories are provided", () => {
            render(<HomeMenu productCategories={mockCategories} />)
            expect(screen.getByText("Productos")).toBeInTheDocument()
        })

        it("should render Productos as a button with submenus", () => {
            render(<HomeMenu productCategories={mockCategories} />)
            const btn = screen.getByText("Productos").closest("button")
            expect(btn).toBeInTheDocument()
            expect(btn).toHaveAttribute("aria-haspopup", "true")
        })

        it("should render all 6 nav items in the correct order", () => {
            render(<HomeMenu productCategories={mockCategories} />)
            const nav = screen.getByLabelText("Menú principal")
            const items = within(nav).getAllByRole("listitem")
            expect(items).toHaveLength(6)
            expect(items[0]).toHaveTextContent("¿Qué es Pichincha Miles?")
            expect(items[1]).toHaveTextContent("Explorar recompensas")
            expect(items[2]).toHaveTextContent("Ofertas")
            expect(items[3]).toHaveTextContent("Productos")
            expect(items[4]).toHaveTextContent("Viajes y actividades")
            expect(items[5]).toHaveTextContent("Ayuda")
        })
    })

    describe("submenu navigation", () => {
        it("should show submenu view when clicking an item with submenus", () => {
            render(<HomeMenu productCategories={mockCategories} />)

            fireEvent.click(screen.getByText("Productos"))

            expect(screen.getByText("Hogar")).toBeInTheDocument()
            expect(screen.getByText("Cocina")).toBeInTheDocument()
        })

        it("should show the back button with 'Menú principal' text in submenu view", () => {
            render(<HomeMenu productCategories={mockCategories} />)

            fireEvent.click(screen.getByText("Productos"))

            expect(screen.getByLabelText("Volver al menú principal")).toBeInTheDocument()
            expect(screen.getByText("Menú principal")).toBeInTheDocument()
        })

        it("should display the submenu nav with aria-label matching the parent label", () => {
            render(<HomeMenu productCategories={mockCategories} />)

            fireEvent.click(screen.getByText("Productos"))

            const nav = screen.getByLabelText("Menú productos")
            expect(nav).toBeInTheDocument()
        })

        it("should render submenu items as links with correct hrefs", () => {
            render(<HomeMenu productCategories={mockCategories} />)

            fireEvent.click(screen.getByText("Productos"))

            const hogarLink = screen.getByText("Hogar").closest("a")
            expect(hogarLink).toHaveAttribute("href", "/productos/categoria/hogar")
            const cocinaLink = screen.getByText("Cocina").closest("a")
            expect(cocinaLink).toHaveAttribute("href", "/productos/categoria/cocina")
        })

        it("should return to main menu when clicking back button", () => {
            render(<HomeMenu productCategories={mockCategories} />)

            fireEvent.click(screen.getByText("Productos"))
            expect(screen.getByText("Hogar")).toBeInTheDocument()

            fireEvent.click(screen.getByLabelText("Volver al menú principal"))
            expect(screen.queryByText("Hogar")).not.toBeInTheDocument()
            expect(screen.getByText("Productos")).toBeInTheDocument()
        })

        it("should show travel submenus when clicking 'Viajes y actividades'", () => {
            render(<HomeMenu />)

            fireEvent.click(screen.getByText("Viajes y actividades"))

            expect(screen.getByText("Vuelos")).toBeInTheDocument()
            expect(screen.getByText("Hoteles")).toBeInTheDocument()
            expect(screen.getByText("Renta de autos")).toBeInTheDocument()
            expect(screen.getByText("Actividades")).toBeInTheDocument()
            expect(screen.getByText("Disney")).toBeInTheDocument()
        })

        it("should show help submenus when clicking 'Ayuda'", () => {
            render(<HomeMenu />)

            fireEvent.click(screen.getByText("Ayuda"))

            expect(screen.getByText("Preguntas frecuentes")).toBeInTheDocument()
            expect(screen.getByText("Contacto")).toBeInTheDocument()
        })

        it("should render submenu title as a link when the item has an href", () => {
            render(<HomeMenu />)

            fireEvent.click(screen.getByText("Viajes y actividades"))

            const nav = screen.getByLabelText("Menú viajes y actividades")
            const titleLink = within(nav).getByText("Viajes y actividades").closest("a")
            expect(titleLink).toHaveAttribute("href", "/utilice-sus-millas/viajes-y-actividades/vuelos")
        })

        it("should render submenu title as an h2 when the item has no href", () => {
            render(<HomeMenu />)

            fireEvent.click(screen.getByText("Ayuda"))

            const nav = screen.getByLabelText("Menú ayuda")
            const heading = within(nav).getByRole("heading", { level: 2 })
            expect(heading).toHaveTextContent("Ayuda")
        })
    })

    describe("drawer elements", () => {
        it("should render the close button with CloseIcon", () => {
            render(<HomeMenu />)
            expect(screen.getByTestId("close-icon")).toBeInTheDocument()
        })

        it("should render the LoginButton in the footer when user is not logged in", () => {
            render(<HomeMenu />)
            expect(screen.getByTestId("login-button")).toBeInTheDocument()
            expect(screen.queryByTestId("close-session-button")).not.toBeInTheDocument()
        })
    })

    describe("mobile footer when member is authenticated", () => {
        beforeEach(() => {
            mockUseSession.mockReturnValue(authenticatedSession)
        })

        it("should render CloseSessionButton in the footer when user is logged in", () => {
            render(<HomeMenu />)
            expect(screen.getByTestId("close-session-button")).toBeInTheDocument()
        })

        it("should NOT render LoginButton when user is logged in", () => {
            render(<HomeMenu />)
            expect(screen.queryByTestId("login-button")).not.toBeInTheDocument()
        })

        it("should hide the footer when a submenu is active", () => {
            render(<HomeMenu />)

            fireEvent.click(screen.getByText("Viajes y actividades"))

            expect(screen.queryByTestId("close-session-button")).not.toBeInTheDocument()
            expect(screen.queryByTestId("drawer-footer")).not.toBeInTheDocument()
        })

        it("should show the footer again when returning from submenu to main menu", () => {
            render(<HomeMenu />)

            fireEvent.click(screen.getByText("Viajes y actividades"))
            expect(screen.queryByTestId("close-session-button")).not.toBeInTheDocument()

            fireEvent.click(screen.getByLabelText("Volver al menú principal"))
            expect(screen.getByTestId("close-session-button")).toBeInTheDocument()
        })

        it("should render authenticated nav items when user is logged in", () => {
            render(<HomeMenu />)
            expect(screen.getByText("Explorar recompensas")).toBeInTheDocument()
            expect(screen.getByText("Transferencia de millas")).toBeInTheDocument()
            expect(screen.getByText("Mis pedidos")).toBeInTheDocument()
            expect(screen.getByText("Mi perfil")).toBeInTheDocument()
        })

        it("should NOT render guest-only nav items when user is logged in", () => {
            render(<HomeMenu />)
            expect(screen.queryByText("¿Qué es Pichincha Miles?")).not.toBeInTheDocument()
        })
    })

    describe("mobile footer when member is guest", () => {
        beforeEach(() => {
            mockUseSession.mockReturnValue(guestSession)
        })

        it("should render LoginButton in the footer when user is not logged in", () => {
            render(<HomeMenu />)
            expect(screen.getByTestId("login-button")).toBeInTheDocument()
        })

        it("should render LoginButton when submenu is active for guest user", () => {
            render(<HomeMenu />)

            fireEvent.click(screen.getByText("Viajes y actividades"))

            expect(screen.getByTestId("login-button")).toBeInTheDocument()
        })

        it("should NOT render CloseSessionButton when user is not logged in", () => {
            render(<HomeMenu />)
            expect(screen.queryByTestId("close-session-button")).not.toBeInTheDocument()
        })
    })

    describe("desktop view", () => {
        beforeEach(() => {
            mockUseIsDesktop.mockReturnValue({ isDesktop: true })
        })

        afterEach(() => {
            mockUseIsDesktop.mockReturnValue({ isDesktop: false })
        })

        it("should render desktop layout when isDesktop is true", () => {
            render(<HomeMenu />)
            expect(screen.getByTestId("drawer")).toBeInTheDocument()
        })

        it("should render CloseMenuButton in desktop view", () => {
            render(<HomeMenu />)
            expect(screen.getByTestId("close-icon")).toBeInTheDocument()
        })

        it("should render CloseSessionButton in desktop footer when user is logged in", () => {
            mockUseSession.mockReturnValue(authenticatedSession)
            render(<HomeMenu />)
            expect(screen.getByTestId("close-session-button")).toBeInTheDocument()
        })

        it("should render LoginButton in desktop footer when user is not logged in", () => {
            mockUseSession.mockReturnValue(guestSession)
            render(<HomeMenu />)
            expect(screen.getByTestId("login-button")).toBeInTheDocument()
        })

        it("should render submenu alongside main menu in desktop view", () => {
            render(<HomeMenu productCategories={mockCategories} />)

            fireEvent.click(screen.getByText("Productos"))

            expect(screen.getAllByText("Productos")).toHaveLength(2)
            expect(screen.getByText("Hogar")).toBeInTheDocument()
            expect(screen.getByText("Cocina")).toBeInTheDocument()
        })

        it("should not render back button in desktop submenu view", () => {
            render(<HomeMenu productCategories={mockCategories} />)

            fireEvent.click(screen.getByText("Productos"))

            expect(screen.queryByLabelText("Volver al menú principal")).not.toBeInTheDocument()
        })

        it("should render submenu in desktop view with activeSubmenu", () => {
            mockUseSession.mockReturnValue(guestSession)
            render(<HomeMenu productCategories={mockCategories} />)

            fireEvent.click(screen.getByText("Productos"))

            // Verify both main menu and submenu are visible in desktop
            expect(screen.getAllByText("Productos")).toHaveLength(2)
            expect(screen.getByText("Hogar")).toBeInTheDocument()
        })

        it("should render mobile footer with LoginButton when guest user has active submenu", () => {
            mockUseSession.mockReturnValue(guestSession)
            render(<HomeMenu />)

            fireEvent.click(screen.getByText("Viajes y actividades"))

            // Guest users should see LoginButton even when submenu is active
            expect(screen.getByTestId("login-button")).toBeInTheDocument()
        })

        it("should render menu trigger button with ref", () => {
            render(<HomeMenu />)
            
            const menuButton = screen.getByLabelText("Abrir menú de navegación")
            expect(menuButton).toBeInTheDocument()
            expect(menuButton).toHaveAttribute("aria-controls", "navigation-menu")
        })

        it("should close the drawer when clicking a desktop submenu item link", () => {
            render(<HomeMenu productCategories={mockCategories} />)

            fireEvent.click(screen.getByText("Productos"))
            fireEvent.click(screen.getByText("Hogar"))

            expect(mockOnOpenChange).toHaveBeenCalled()
        })

        it("should close the drawer when clicking the desktop submenu title link", () => {
            render(<HomeMenu />)

            fireEvent.click(screen.getByText("Viajes y actividades"))

            const submenuNav = screen.getByLabelText("Menú viajes y actividades")
            const titleLink = within(submenuNav).getByText("Viajes y actividades").closest("a") as HTMLAnchorElement
            fireEvent.click(titleLink)

            expect(mockOnOpenChange).toHaveBeenCalled()
        })
    })

    describe("mobile submenu link interactions", () => {
        it("should close the drawer when clicking a mobile submenu item link", () => {
            render(<HomeMenu productCategories={mockCategories} />)

            fireEvent.click(screen.getByText("Productos"))
            fireEvent.click(screen.getByText("Hogar"))

            expect(mockOnOpenChange).toHaveBeenCalled()
        })
    })

    describe("scroll behavior (MCBPE-2640)", () => {
        it("should keep a single body scroll on mobile", () => {
            mockUseIsDesktop.mockReturnValue({ isDesktop: false })
            render(<HomeMenu productCategories={mockCategories} />)

            expect(mockDrawerProps).toHaveBeenCalled()
            const props = mockDrawerProps.mock.calls.at(-1)?.[0] as {
                scrollBehavior?: string
                classNames?: { base?: string; body?: string }
            }

            expect(props.scrollBehavior).toBe("inside")
            expect(props.classNames?.base).toContain("overflow-y-hidden")
            expect(props.classNames?.body).toContain("overflow-y-auto")
        })

        it("should use independent hidden scrolls per desktop section", () => {
            mockUseIsDesktop.mockReturnValue({ isDesktop: true })
            render(<HomeMenu productCategories={mockCategories} />)

            fireEvent.click(screen.getByText("Productos"))

            const props = mockDrawerProps.mock.calls.at(-1)?.[0] as {
                classNames?: { body?: string }
            }
            expect(props.classNames?.body).toContain("overflow-hidden")

            const mainNav = screen.getByLabelText("Menú principal")
            const mainScrollArea = mainNav.parentElement
            expect(mainScrollArea?.className).toContain("overflow-y-auto")
            expect(mainScrollArea?.className).toContain("[&::-webkit-scrollbar]:hidden")

            const submenuNav = screen.getByLabelText("Menú productos")
            const submenuPanel = submenuNav.parentElement
            expect(submenuPanel?.className).toContain("overflow-y-auto")
            expect(submenuPanel?.className).toContain("[&::-webkit-scrollbar]:hidden")
            expect(submenuPanel?.className).toContain("h-full")
            expect(submenuPanel?.className).not.toContain("py-20")

            mockUseIsDesktop.mockReturnValue({ isDesktop: false })
        })
    })
})
