import {render, screen, fireEvent, act} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach, beforeAll} from "vitest"
import React from "react"
import Faq from "@/presentation/pages/Help/Faq/Faq"
import useSession from "@/presentation/hooks/useSession"

vi.mock("@/presentation/hooks/useSession", () => ({
    default: vi.fn(() => ({
        isLogged: false,
        member: null,
        isValidatingSession: false,
    })),
}))

beforeAll(() => {
    Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
        value: vi.fn(),
        writable: true,
    })
})

const CATEGORY_PROGRAM = {id: "cat-program", name: "Información del programa"}
const CATEGORY_ACCOUNT = {id: "cat-account", name: "Mi cuenta"}

const faqCategories = [
    {
        ...CATEGORY_PROGRAM,
        questions: [
            {id: "q1", title: "Pregunta programa 1", faqCategoryId: "cat-program", description: "<p>Respuesta programa 1</p>"},
            {id: "q2", title: "Pregunta programa 2", faqCategoryId: "cat-program", description: "<p>Respuesta programa 2 <a href=\"/terminos\">términos</a></p>"},
        ],
    },
    {
        ...CATEGORY_ACCOUNT,
        questions: [
            {id: "q3", title: "Pregunta cuenta 1", faqCategoryId: "cat-account", description: '<p>Respuesta cuenta 1 <a href="https://external.com">externo</a></p>'},
            {id: "q4", title: "Pregunta cuenta 2", faqCategoryId: "cat-account", description: "<p>Respuesta cuenta 2</p>"},
        ],
    },
]

type MockTabItem = {
    id: string
    label: string
    content: React.ReactNode
}

vi.mock("@/presentation/components/Tabs/Tabs", async () => {
    const React = await import("react")
    const { useState } = React

    function MockTabs({ items, defaultTab, onTabChange, className, classNames }: {
        items: MockTabItem[]
        defaultTab?: string
        onTabChange?: (id: string) => void
        className?: string
        classNames?: Record<string, string>
    }) {
        const [active, setActive] = useState(defaultTab ?? items[0]?.id)
        return (
            <div className={className} data-testid="tabs">
                <div className={classNames?.tabList} role="tablist">
                    {items.map((item) => (
                        <button
                            key={item.id}
                            role="tab"
                            aria-selected={active === item.id}
                            onClick={() => {
                                setActive(item.id)
                                onTabChange?.(item.id)
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
                <div className={classNames?.panel}>{items.find((item) => item.id === active)?.content}</div>
            </div>
        )
    }

    return { default: MockTabs }
})

vi.mock("@/presentation/components/Accordion/Accordion", () => {
    function MockAccordion({ items, selectedKeys, onSelectionChange, itemClassName }: {
        items: { id: string; title: string; content: React.ReactNode }[]
        selectedKeys: Set<string>
        onSelectionChange?: (keys: Set<string>) => void
        itemClassName?: string
    }) {
        const openKey = Array.from(selectedKeys ?? [])[0]
        return (
            <div data-testid="accordion">
                {items.map((item) => {
                    const isOpen = openKey === item.id
                    return (
                        <div key={item.id} data-key={item.id} data-open={isOpen}>
                            <button
                                type="button"
                                aria-expanded={isOpen}
                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                    event.currentTarget.focus()
                                    onSelectionChange?.(isOpen ? new Set<string>() : new Set([item.id]))
                                }}
                            >
                                {item.title}
                            </button>
                            {isOpen && <div className={itemClassName}>{item.content}</div>}
                        </div>
                    )
                })}
            </div>
        )
    }

    return { default: MockAccordion }
})

describe("Faq", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render the title and category tabs", () => {
        render(<Faq faqCategories={faqCategories} />)

        expect(screen.getByRole("heading", { name: "Preguntas frecuentes" })).toBeInTheDocument()
        expect(screen.getByRole("tab", { name: "Información del programa" })).toBeInTheDocument()
        expect(screen.getByRole("tab", { name: "Mi cuenta" })).toBeInTheDocument()
    })

    it("should open the first question by default and keep the rest closed", () => {
        render(<Faq faqCategories={faqCategories} />)

        const firstTrigger = screen.getByRole("button", { name: /Pregunta programa 1/ })
        const secondTrigger = screen.getByRole("button", { name: /Pregunta programa 2/ })

        expect(firstTrigger).toHaveAttribute("aria-expanded", "true")
        expect(secondTrigger).toHaveAttribute("aria-expanded", "false")
        expect(screen.getByText("Respuesta programa 1")).toBeInTheDocument()
        expect(screen.queryByText("Respuesta programa 2")).not.toBeInTheDocument()
    })

    it("should close the previously opened question when opening another", () => {
        render(<Faq faqCategories={faqCategories} />)

        const firstTrigger = screen.getByRole("button", { name: /Pregunta programa 1/ })
        const secondTrigger = screen.getByRole("button", { name: /Pregunta programa 2/ })

        fireEvent.click(secondTrigger)

        expect(firstTrigger).toHaveAttribute("aria-expanded", "false")
        expect(secondTrigger).toHaveAttribute("aria-expanded", "true")
        expect(screen.queryByText("Respuesta programa 1")).not.toBeInTheDocument()
        expect(screen.getByText("Respuesta programa 2")).toBeInTheDocument()
    })

    it("should reset to the first question when switching categories", () => {
        render(<Faq faqCategories={faqCategories} />)

        const accountTab = screen.getByRole("tab", { name: "Mi cuenta" })
        fireEvent.click(accountTab)

        expect(screen.getByRole("button", { name: /Pregunta cuenta 1/ })).toHaveAttribute("aria-expanded", "true")
        expect(screen.getByRole("button", { name: /Pregunta cuenta 2/ })).toHaveAttribute("aria-expanded", "false")
    })

    const mockRect = (element: Element, top: number, bottom: number) => {
        element.getBoundingClientRect = vi.fn(() => ({
            top,
            bottom,
            left: 0,
            right: 0,
            width: 0,
            height: bottom - top,
            x: 0,
            y: top,
            toJSON: () => {},
        }))
    }

    it("should scroll so the question header sits with a gap below the sticky header/title/tabs, then focus it", () => {
        vi.useFakeTimers()
        const scrollToSpy = vi.fn()
        window.scrollTo = scrollToSpy
        Object.defineProperty(window, "scrollY", { value: 100, writable: true })

        render(<Faq faqCategories={faqCategories} />)

        const stickyContainer = screen.getByRole("heading", { name: "Preguntas frecuentes" }).parentElement as HTMLElement
        mockRect(stickyContainer, 0, 200)

        const secondTrigger = screen.getByRole("button", { name: /Pregunta programa 2/ })
        mockRect(secondTrigger, 350, 390)

        act(() => {
            fireEvent.click(secondTrigger)
        })
        act(() => {
            vi.advanceTimersByTime(0)
        })

        expect(scrollToSpy).toHaveBeenCalledWith({ top: 100 + (350 - 200 - 100), behavior: "smooth" })
        expect(document.activeElement).toBe(secondTrigger)
        vi.useRealTimers()
    })

    it("should not scroll when the selected question header already has the gap below the sticky header/title/tabs", () => {
        vi.useFakeTimers()
        const scrollToSpy = vi.fn()
        window.scrollTo = scrollToSpy

        render(<Faq faqCategories={faqCategories} />)

        const stickyContainer = screen.getByRole("heading", { name: "Preguntas frecuentes" }).parentElement as HTMLElement
        mockRect(stickyContainer, 0, 200)

        const secondTrigger = screen.getByRole("button", { name: /Pregunta programa 2/ })
        mockRect(secondTrigger, 300, 340)

        act(() => {
            fireEvent.click(secondTrigger)
        })
        act(() => {
            vi.advanceTimersByTime(0)
        })

        expect(scrollToSpy).not.toHaveBeenCalled()
        expect(document.activeElement).toBe(secondTrigger)
        vi.useRealTimers()
    })

    it("should render null when faqCategories is empty", () => {
        const { container } = render(<Faq faqCategories={[]} />)
        expect(container.firstChild).toBeNull()
    })

    it("should apply logged-in sticky position classes when the user is logged in", () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useSession).mockReturnValue({ isLogged: true, member: null, isValidatingSession: false } as any)
        render(<Faq faqCategories={faqCategories} />)
        const heading = screen.getByRole("heading", { name: "Preguntas frecuentes" })
        expect(heading.parentElement?.className).toContain("top-24.25")
    })

    it("should mark internal links as regular and external links as safe new-tab links", () => {
        render(<Faq faqCategories={faqCategories} />)

        fireEvent.click(screen.getByRole("button", { name: /Pregunta programa 2/ }))

        const internalLink = screen.getByText("términos")
        expect(internalLink).toHaveAttribute("href", "/terminos")
        expect(internalLink).not.toHaveAttribute("target")

        const accountTab = screen.getByRole("tab", { name: "Mi cuenta" })
        fireEvent.click(accountTab)

        const externalLink = screen.getByText("externo")
        expect(externalLink).toHaveAttribute("href", "https://external.com")
        expect(externalLink).toHaveAttribute("target", "_blank")
        expect(externalLink).toHaveAttribute("rel", "noopener noreferrer")
    })
})
