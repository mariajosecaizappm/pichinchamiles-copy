import { render, screen, within, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"

const useSession = vi.hoisted(() => vi.fn(() => ({
    member: null,
    isValidatingSession: false,
} as Partial<{ member: Member | null; isValidatingSession: boolean }>)))

const track = vi.hoisted(() => vi.fn())

vi.mock("@/presentation/hooks/useSession", () => ({
    default: useSession,
}))

vi.mock("@/presentation/hooks/useContactLinkGuard", () => {
    const fn = vi.fn()
    return {
        default: () => fn,
        __getHandleContactClick: () => fn,
    }
})

vi.mock("@/presentation/hooks/useAnalytics", () => ({
    default: () => ({ track }),
}))

import * as useContactLinkGuardModule from "@/presentation/hooks/useContactLinkGuard"
const handleContactClick = () => (useContactLinkGuardModule as unknown as {__getHandleContactClick: () => ReturnType<typeof vi.fn>}).__getHandleContactClick()

vi.mock("next/link", () => ({
    default: ({ children, href, onClick }: { children: React.ReactNode; href: string; onClick?: () => void }) => (
        <a href={href} onClick={onClick}>{children}</a>
    ),
}))
 
vi.mock("@/presentation/pages/Home/components/Header/components/Menu/components/Icons/ArrowIcon", () => ({
    default: () => <span data-testid="arrow-icon">ArrowIcon</span>,
}))

vi.mock("@heroui/react", () => ({
    Skeleton: ({ className }: { className: string }) => (
        <div data-testid="skeleton" className={className}>Loading...</div>
    ),
}))
 
import MainMenuNavList from "@/presentation/pages/Home/components/Header/components/Menu/components/MainMenuNavList"
import type { MenuItem } from "@/presentation/pages/Home/components/Header/components/Menu/HomeMenuConfig"
import { Member, MemberType } from "@/domain/entity/Member/member"
import links from "@/presentation/config/links"
import { EventName } from "@/presentation/analytics/types"

const mockItems: MenuItem[] = [
    { label: "Link Item", href: "/link", submenus: [] },
    { label: "Submenu Item", href: "/parent", submenus: [
        { label: "Child 1", href: "/child-1" },
        { label: "Child 2", href: "/child-2" },
    ]},
    { label: "No Href Submenu", submenus: [
        { label: "Child A", href: "/child-a" },
    ]},
    { label: "Transferir Millas", href: links.transferMiles, submenus: [] },
]
 
describe("MainMenuNavList", () => {
    const mockSetActiveSubmenu = vi.fn()
    const mockHandleDrawerChange = vi.fn()
 
    beforeEach(() => {
        vi.clearAllMocks()
    })
 
    it("should render a nav with aria-label 'Menú principal'", () => {
        render(
            <MainMenuNavList
                items={mockItems}
                setActiveSubmenu={mockSetActiveSubmenu}
                handleDrawerChange={mockHandleDrawerChange}
                activeSubmenu={null}
            />
        )
        expect(screen.getByLabelText("Menú principal")).toBeInTheDocument()
    })
 
    it("should render all items as list items", () => {
        render(
            <MainMenuNavList
                items={mockItems}
                setActiveSubmenu={mockSetActiveSubmenu}
                handleDrawerChange={mockHandleDrawerChange}
                activeSubmenu={null}
            />
        )
        const nav = screen.getByLabelText("Menú principal")
        const items = within(nav).getAllByRole("listitem")
        expect(items).toHaveLength(4)
    })
 
    it("should render items without submenus as links", () => {
        render(
            <MainMenuNavList
                items={mockItems}
                setActiveSubmenu={mockSetActiveSubmenu}
                handleDrawerChange={mockHandleDrawerChange}
                activeSubmenu={null}
            />
        )
        const link = screen.getByText("Link Item").closest("a")
        expect(link).toHaveAttribute("href", "/link")
    })
 
    it("should call handleDrawerChange when clicking a link item", () => {
        render(
            <MainMenuNavList
                items={mockItems}
                setActiveSubmenu={mockSetActiveSubmenu}
                handleDrawerChange={mockHandleDrawerChange}
                activeSubmenu={null}
            />
        )
        fireEvent.click(screen.getByText("Link Item"))
        expect(mockHandleDrawerChange).toHaveBeenCalledOnce()
    })
 
    it("should render items with submenus as buttons with aria-haspopup", () => {
        render(
            <MainMenuNavList
                items={mockItems}
                setActiveSubmenu={mockSetActiveSubmenu}
                handleDrawerChange={mockHandleDrawerChange}
                activeSubmenu={null}
            />
        )
        const btn = screen.getByText("Submenu Item").closest("button")
        expect(btn).toBeInTheDocument()
        expect(btn).toHaveAttribute("aria-haspopup", "true")
    })
 
    it("should render ArrowIcon for items with submenus", () => {
        render(
            <MainMenuNavList
                items={mockItems}
                setActiveSubmenu={mockSetActiveSubmenu}
                handleDrawerChange={mockHandleDrawerChange}
                activeSubmenu={null}
            />
        )
        const arrowIcons = screen.getAllByTestId("arrow-icon")
        expect(arrowIcons).toHaveLength(2)
    })
 
    it("should call setActiveSubmenu with the item when clicking a submenu button", () => {
        render(
            <MainMenuNavList
                items={mockItems}
                setActiveSubmenu={mockSetActiveSubmenu}
                handleDrawerChange={mockHandleDrawerChange}
                activeSubmenu={null}
            />
        )
        fireEvent.click(screen.getByText("Submenu Item"))
        expect(mockSetActiveSubmenu).toHaveBeenCalledWith(mockItems[1])
    })
 
    it("should highlight the active submenu item with border class", () => {
        render(
            <MainMenuNavList
                items={mockItems}
                setActiveSubmenu={mockSetActiveSubmenu}
                handleDrawerChange={mockHandleDrawerChange}
                activeSubmenu={mockItems[1]}
            />
        )
        const activeItem = screen.getByText("Submenu Item").closest("li")
        expect(activeItem?.className).toContain("md:border-blue-500")
    })
 
    it("should apply font-semibold to the active submenu label", () => {
        render(
            <MainMenuNavList
                items={mockItems}
                setActiveSubmenu={mockSetActiveSubmenu}
                handleDrawerChange={mockHandleDrawerChange}
                activeSubmenu={mockItems[1]}
            />
        )
        const label = screen.getByText("Submenu Item")
        expect(label.className).toContain("font-semibold")
    })
 
    it("should NOT highlight inactive items", () => {
        render(
            <MainMenuNavList
                items={mockItems}
                setActiveSubmenu={mockSetActiveSubmenu}
                handleDrawerChange={mockHandleDrawerChange}
                activeSubmenu={mockItems[1]}
            />
        )
        const inactiveItem = screen.getByText("No Href Submenu").closest("li")
        expect(inactiveItem?.className).not.toContain("md:border-blue-500")
    })

    describe("authenticated user greeting", () => {
        it("should display greeting with personal member first name", () => {
            useSession.mockReturnValue({
                member: {
                    firstName: "John",
                    memberType: MemberType.PERSONAL,
                } as Partial<Member> as Member,
                isValidatingSession: false,
            })

            render(
                <MainMenuNavList
                    items={mockItems}
                    setActiveSubmenu={mockSetActiveSubmenu}
                    handleDrawerChange={mockHandleDrawerChange}
                    activeSubmenu={null}
                />
            )

            expect(screen.getByText(/Hola, John/)).toBeInTheDocument()
        })

        it("should display greeting with company name for corporate member", () => {
            useSession.mockReturnValue({
                member: {
                    companyName: "Acme Corp",
                    memberType: MemberType.CORPORATE,
                } as Partial<Member> as Member,
                isValidatingSession: false,
            })

            render(
                <MainMenuNavList
                    items={mockItems}
                    setActiveSubmenu={mockSetActiveSubmenu}
                    handleDrawerChange={mockHandleDrawerChange}
                    activeSubmenu={null}
                />
            )

            expect(screen.getByText(/Hola, Acme Corp/)).toBeInTheDocument()
        })

        it("should render user icon in greeting", () => {
            useSession.mockReturnValue({
                member: {
                    firstName: "Jane",
                    memberType: MemberType.PERSONAL,
                } as Partial<Member> as Member,
                isValidatingSession: false,
            })

            const { container } = render(
                <MainMenuNavList
                    items={mockItems}
                    setActiveSubmenu={mockSetActiveSubmenu}
                    handleDrawerChange={mockHandleDrawerChange}
                    activeSubmenu={null}
                />
            )

            const svg = container.querySelector("svg")
            expect(svg).toBeInTheDocument()
        })

        it("should not display greeting when member is null", () => {
            useSession.mockReturnValue({
                member: null,
                isValidatingSession: false,
            })

            render(
                <MainMenuNavList
                    items={mockItems}
                    setActiveSubmenu={mockSetActiveSubmenu}
                    handleDrawerChange={mockHandleDrawerChange}
                    activeSubmenu={null}
                />
            )

            expect(screen.queryByText(/Hola,/)).not.toBeInTheDocument()
        })
    })

    describe("contact link guard", () => {
        it("should call handleContactClick and close drawer when clicking a link item", () => {
            render(
                <MainMenuNavList
                    items={mockItems}
                    setActiveSubmenu={mockSetActiveSubmenu}
                    handleDrawerChange={mockHandleDrawerChange}
                    activeSubmenu={null}
                />
            )

            const link = screen.getByText("Link Item").closest("a") as HTMLAnchorElement
            fireEvent.click(link)

            expect(handleContactClick()).toHaveBeenCalled()
            expect(mockHandleDrawerChange).toHaveBeenCalledTimes(1)
        })

        it("should not call handleContactClick when clicking a submenu button", () => {
            render(
                <MainMenuNavList
                    items={mockItems}
                    setActiveSubmenu={mockSetActiveSubmenu}
                    handleDrawerChange={mockHandleDrawerChange}
                    activeSubmenu={null}
                />
            )

            fireEvent.click(screen.getByText("Submenu Item"))
            expect(handleContactClick()).not.toHaveBeenCalled()
        })
    })

    describe("analytics tracking", () => {
        it("should track CLICKED_TRANSFER when clicking the transfer miles link", () => {
            render(
                <MainMenuNavList
                    items={mockItems}
                    setActiveSubmenu={mockSetActiveSubmenu}
                    handleDrawerChange={mockHandleDrawerChange}
                    activeSubmenu={null}
                />
            )

            const link = screen.getByText("Transferir Millas").closest("a") as HTMLAnchorElement
            fireEvent.click(link)

            expect(track).toHaveBeenCalledWith(EventName.CLICKED_TRANSFER)
        })

        it("should NOT track CLICKED_TRANSFER when clicking other links", () => {
            render(
                <MainMenuNavList
                    items={mockItems}
                    setActiveSubmenu={mockSetActiveSubmenu}
                    handleDrawerChange={mockHandleDrawerChange}
                    activeSubmenu={null}
                />
            )

            const link = screen.getByText("Link Item").closest("a") as HTMLAnchorElement
            fireEvent.click(link)

            expect(track).not.toHaveBeenCalled()
        })

        it("should NOT track CLICKED_TRANSFER when clicking submenu buttons", () => {
            render(
                <MainMenuNavList
                    items={mockItems}
                    setActiveSubmenu={mockSetActiveSubmenu}
                    handleDrawerChange={mockHandleDrawerChange}
                    activeSubmenu={null}
                />
            )

            fireEvent.click(screen.getByText("Submenu Item"))
            expect(track).not.toHaveBeenCalled()
        })
    })
})
 