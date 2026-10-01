import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from "vitest"
import { usePathname } from "next/navigation"
import TabLinks, { TabLink } from "@/presentation/pages/Home/UseYourMiles/Layout/Tabs/components/TabLinks"

// Mock dependencies
vi.mock("next/navigation", () => ({
    usePathname: vi.fn(),
}))

// Mock scrollIntoView to prevent JSDOM errors
const scrollIntoViewMock = vi.fn()
beforeAll(() => {
    HTMLElement.prototype.scrollIntoView = scrollIntoViewMock
})

afterAll(() => {
    scrollIntoViewMock.mockRestore()
})

const mockTabs: TabLink[] = [
    {
        id: "products",
        label: "Productos",
        href: "/utilice-sus-millas/productos"
    },
    {
        id: "travels",
        label: "Viajes y actividades",
        href: "/utilice-sus-millas/viajes"
    },
]

describe("TabLinks", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render all tabs with correct labels", () => {
        vi.mocked(usePathname).mockReturnValue("/")

        render(<TabLinks tabs={mockTabs} />)

        expect(screen.getByText("Productos")).toBeInTheDocument()
        expect(screen.getByText("Viajes y actividades")).toBeInTheDocument()
    })

    it("should mark products tab as active when on productos page", () => {
        vi.mocked(usePathname).mockReturnValue("/utilice-sus-millas/productos")

        render(<TabLinks tabs={mockTabs} />)

        const productsLink = screen.getByText("Productos").closest("a")
        expect(productsLink).toHaveClass("text-blue-500")
        expect(productsLink).not.toHaveClass("text-gray-500")

        const travelsLink = screen.getByText("Viajes y actividades").closest("a")
        expect(travelsLink).toHaveClass("text-gray-500")
        expect(travelsLink).not.toHaveClass("text-blue-500")
    })

    it("should mark travels tab as active when on viajes page", () => {
        vi.mocked(usePathname).mockReturnValue("/utilice-sus-millas/viajes")

        render(<TabLinks tabs={mockTabs} />)

        const travelsLink = screen.getByText("Viajes y actividades").closest("a")
        expect(travelsLink).toHaveClass("text-blue-500")
        expect(travelsLink).not.toHaveClass("text-gray-500")

        const productsLink = screen.getByText("Productos").closest("a")
        expect(productsLink).toHaveClass("text-gray-500")
        expect(productsLink).not.toHaveClass("text-blue-500")
    })

    it("should mark all tabs as inactive when on other pages", () => {
        vi.mocked(usePathname).mockReturnValue("/")

        render(<TabLinks tabs={mockTabs} />)

        const productsLink = screen.getByText("Productos").closest("a")
        const travelsLink = screen.getByText("Viajes y actividades").closest("a")

        expect(productsLink).toHaveClass("text-gray-500")
        expect(productsLink).not.toHaveClass("text-blue-500")

        expect(travelsLink).toHaveClass("text-gray-500")
        expect(travelsLink).not.toHaveClass("text-blue-500")
    })

    it("should render tabs as links with correct href attributes", () => {
        vi.mocked(usePathname).mockReturnValue("/")

        render(<TabLinks tabs={mockTabs} />)

        const productsLink = screen.getByText("Productos").closest("a")
        expect(productsLink).toHaveAttribute("href", "/utilice-sus-millas/productos")

        const travelsLink = screen.getByText("Viajes y actividades").closest("a")
        expect(travelsLink).toHaveAttribute("href", "/utilice-sus-millas/viajes")
    })

    it("should apply correct CSS classes to container", () => {
        vi.mocked(usePathname).mockReturnValue("/")

        const { container } = render(<TabLinks tabs={mockTabs} />)

        const tabContainer = container.firstChild as HTMLElement
        expect(tabContainer).toBeInTheDocument()
        expect(tabContainer).toHaveClass("flex", "overflow-x-auto")
    })

    it("should apply correct CSS classes to tab links", () => {
        vi.mocked(usePathname).mockReturnValue("/")

        render(<TabLinks tabs={mockTabs} />)

        const productsLink = screen.getByText("Productos").closest("a")
        expect(productsLink).toHaveClass(
            "flex-1",
            "h-12",
            "flex",
            "flex-col",
            "items-center",
            "text-sm",
            "cursor-pointer",
            "text-center"
        )

        // Check hover state for inactive tabs
        expect(productsLink).toHaveClass("text-gray-500", "hover:text-gray-700")
        expect(productsLink).not.toHaveClass("font-semibold")
    })

    it("should apply font-semibold class to active tab", () => {
        vi.mocked(usePathname).mockReturnValue("/utilice-sus-millas/productos")

        render(<TabLinks tabs={mockTabs} />)

        const productsLink = screen.getByText("Productos").closest("a")
        expect(productsLink).toHaveClass("font-semibold", "text-blue-500")
        expect(productsLink).not.toHaveClass("text-gray-500")
    })

    it("should show blue indicator for active tab only", () => {
        vi.mocked(usePathname).mockReturnValue("/utilice-sus-millas/productos")

        const { container } = render(<TabLinks tabs={mockTabs} />)

        const indicators = container.querySelectorAll('div.bg-blue-500')
        expect(indicators).toHaveLength(1)

        // Check that the indicator has correct sizing classes
        const indicator = indicators[0]
        expect(indicator).toHaveClass("w-full", "h-0.5", "bg-blue-500")
    })

    it("should not show indicators for inactive tabs", () => {
        vi.mocked(usePathname).mockReturnValue("/")

        const { container } = render(<TabLinks tabs={mockTabs} />)

        const indicators = container.querySelectorAll('div.bg-blue-500')
        expect(indicators).toHaveLength(0)
    })

    it("should render tabs in correct order as links", () => {
        vi.mocked(usePathname).mockReturnValue("/")

        const { container } = render(<TabLinks tabs={mockTabs} />)

        const links = container.querySelectorAll('a')

        expect(links).toHaveLength(2)
        expect(links[0]).toHaveTextContent("Productos")
        expect(links[1]).toHaveTextContent("Viajes y actividades")
    })

    it("should handle empty tabs array", () => {
        vi.mocked(usePathname).mockReturnValue("/")

        const { container } = render(<TabLinks tabs={[]} />)

        const links = container.querySelectorAll('a')
        expect(links).toHaveLength(0)
    })

    it("should scroll active tab into view on mount", () => {
        vi.mocked(usePathname).mockReturnValue("/utilice-sus-millas/productos")

        render(<TabLinks tabs={mockTabs} />)

        expect(scrollIntoViewMock).toHaveBeenCalledWith({
            behavior: "instant",
            block: "nearest",
            inline: "center",
        })
    })

    it("should have aria-label indicating 'no seleccionado' for inactive tabs", () => {
        vi.mocked(usePathname).mockReturnValue("/")

        render(<TabLinks tabs={mockTabs} />)

        const productsLink = screen.getByText("Productos").closest("a")
        expect(productsLink).toHaveAttribute("aria-label", "Productos, no seleccionado")

        const travelsLink = screen.getByText("Viajes y actividades").closest("a")
        expect(travelsLink).toHaveAttribute("aria-label", "Viajes y actividades, no seleccionado")
    })

    describe("accessibility (ARIA roles and states)", () => {
        it("should have role='tablist' on the container", () => {
            vi.mocked(usePathname).mockReturnValue("/")
            render(<TabLinks tabs={mockTabs} />)
            expect(screen.getByRole("tablist")).toBeInTheDocument()
        })

        it("should have aria-label='Secciones principales' on the tablist", () => {
            vi.mocked(usePathname).mockReturnValue("/")
            render(<TabLinks tabs={mockTabs} />)
            expect(screen.getByRole("tablist", { name: "Secciones principales" })).toBeInTheDocument()
        })

        it("should assign role='tab' to each tab link", () => {
            vi.mocked(usePathname).mockReturnValue("/")
            render(<TabLinks tabs={mockTabs} />)
            const tabs = screen.getAllByRole("tab")
            expect(tabs).toHaveLength(2)
        })

        it("should set aria-selected=true on the active tab", () => {
            vi.mocked(usePathname).mockReturnValue("/utilice-sus-millas/productos")
            render(<TabLinks tabs={mockTabs} />)
            const productsTab = screen.getByRole("tab", { name: /Productos/ })
            expect(productsTab).toHaveAttribute("aria-selected", "true")
        })

        it("should set aria-selected=false on inactive tabs", () => {
            vi.mocked(usePathname).mockReturnValue("/utilice-sus-millas/productos")
            render(<TabLinks tabs={mockTabs} />)
            const travelsTab = screen.getByRole("tab", { name: /Viajes/ })
            expect(travelsTab).toHaveAttribute("aria-selected", "false")
        })

        it("should announce 'seleccionado' in aria-label for the active tab", () => {
            vi.mocked(usePathname).mockReturnValue("/utilice-sus-millas/productos")
            render(<TabLinks tabs={mockTabs} />)
            const activeTab = screen.getByRole("tab", { name: "Productos, seleccionado" })
            expect(activeTab.getAttribute("aria-label")).toBe("Productos, seleccionado")
        })

        it("should announce 'no seleccionado' in aria-label for inactive tabs", () => {
            vi.mocked(usePathname).mockReturnValue("/utilice-sus-millas/productos")
            render(<TabLinks tabs={mockTabs} />)
            const inactiveTab = screen.getByRole("tab", { name: /Viajes y actividades, no seleccionado/ })
            expect(inactiveTab).toBeInTheDocument()
        })

        it("should have aria-hidden on the visual indicator to avoid duplicate announcement", () => {
            vi.mocked(usePathname).mockReturnValue("/utilice-sus-millas/productos")
            const { container } = render(<TabLinks tabs={mockTabs} />)
            const indicatorWrappers = container.querySelectorAll("[aria-hidden='true']")
            expect(indicatorWrappers.length).toBeGreaterThan(0)
        })
    })

    describe("classNames prop", () => {
        it("should apply custom active and inactive classNames", () => {
            vi.mocked(usePathname).mockReturnValue("/utilice-sus-millas/productos")

            render(
                <TabLinks
                    tabs={mockTabs}
                    classNames={{
                        active: "typo-main-body-semi-bold text-blue-500",
                        inactive: "typo-main-body-book hover:text-grayscale-700",
                    }}
                />
            )

            const productsLink = screen.getByText("Productos").closest("a")
            expect(productsLink).toHaveClass("typo-main-body-semi-bold", "text-blue-500")
            expect(productsLink).not.toHaveClass("text-sm")

            const travelsLink = screen.getByText("Viajes y actividades").closest("a")
            expect(travelsLink).toHaveClass("typo-main-body-book", "hover:text-grayscale-700")
            expect(travelsLink).not.toHaveClass("text-gray-500")
        })

        it("should use default classNames when classNames prop is omitted", () => {
            vi.mocked(usePathname).mockReturnValue("/")

            render(<TabLinks tabs={mockTabs} />)

            const productsLink = screen.getByText("Productos").closest("a")
            expect(productsLink).toHaveClass("text-sm", "text-gray-500", "hover:text-gray-700")
        })
    })

    describe("className prop", () => {
        it("should accept and apply optional className prop", () => {
            vi.mocked(usePathname).mockReturnValue("/")

            const { container } = render(<TabLinks tabs={mockTabs} className="custom-class" />)

            const tabContainer = container.firstChild as HTMLElement
            expect(tabContainer).toHaveClass("custom-class")
        })

        it("should merge className with default classes", () => {
            vi.mocked(usePathname).mockReturnValue("/")

            const { container } = render(<TabLinks tabs={mockTabs} className="custom-class another-class" />)

            const tabContainer = container.firstChild as HTMLElement
            expect(tabContainer).toHaveClass("custom-class")
            expect(tabContainer).toHaveClass("another-class")
            expect(tabContainer).toHaveClass("flex")
            expect(tabContainer).toHaveClass("overflow-x-auto")
        })

        it("should work correctly without className prop (backward compatibility)", () => {
            vi.mocked(usePathname).mockReturnValue("/")

            const { container } = render(<TabLinks tabs={mockTabs} />)

            const tabContainer = container.firstChild as HTMLElement
            expect(tabContainer).toHaveClass("flex")
            expect(tabContainer).toHaveClass("overflow-x-auto")
        })

        it("should not override essential layout classes with custom className", () => {
            vi.mocked(usePathname).mockReturnValue("/")

            const { container } = render(<TabLinks tabs={mockTabs} className="w-1/2" />)

            const tabContainer = container.firstChild as HTMLElement
            expect(tabContainer).toHaveClass("flex")
            expect(tabContainer).toHaveClass("overflow-x-auto")
            expect(tabContainer).toHaveClass("w-1/2")
        })
    })
})
