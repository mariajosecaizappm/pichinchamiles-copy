import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const scrollToMock = vi.fn()

vi.mock("next/link", () => ({
    default: ({
        children,
        href,
        onClick,
        "aria-label": ariaLabel,
    }: {
        children: React.ReactNode
        href: string
        onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
        "aria-label"?: string
    }) => (
        <a href={href} aria-label={ariaLabel} onClick={onClick}>
            {children}
        </a>
    ),
}))

import AppLink from "@/presentation/components/AppLink"

describe("AppLink", () => {
    beforeEach(() => {
        scrollToMock.mockClear()
        window.history.replaceState({}, "", "/ofertas/promo")
        Object.defineProperty(window, "scrollTo", {
            value: scrollToMock,
            writable: true,
        })
    })

    it("should render a link with the given href and children", () => {
        render(<AppLink href="/ofertas">Promoción</AppLink>)

        expect(screen.getByRole("link", { name: "Promoción" })).toHaveAttribute("href", "/ofertas")
    })

    it("should forward aria-label to the link", () => {
        render(
            <AppLink href="/" aria-label="Pichincha Miles - Inicio">
                Home
            </AppLink>,
        )

        expect(screen.getByRole("link", { name: "Pichincha Miles - Inicio" })).toBeInTheDocument()
    })

    it("should scroll to top when clicking a link to the current pathname", () => {
        render(<AppLink href="/ofertas/promo">Promoción</AppLink>)

        fireEvent.click(screen.getByRole("link"))

        expect(scrollToMock).toHaveBeenCalledWith(0, 0)
    })

    it("should not scroll when clicking a link to a different pathname", () => {
        render(<AppLink href="/ofertas">Promoción</AppLink>)

        fireEvent.click(screen.getByRole("link"))

        expect(scrollToMock).not.toHaveBeenCalled()
    })

    it("should not scroll for external links", () => {
        render(<AppLink href="https://www.pichincha.com/promo">Promoción</AppLink>)

        fireEvent.click(screen.getByRole("link"))

        expect(scrollToMock).not.toHaveBeenCalled()
    })

    it("should not scroll when consumer onClick prevents default", () => {
        render(
            <AppLink
                href="/ofertas/promo"
                onClick={(event) => event.preventDefault()}
            >
                Promoción
            </AppLink>,
        )

        fireEvent.click(screen.getByRole("link"))

        expect(scrollToMock).not.toHaveBeenCalled()
    })
})
