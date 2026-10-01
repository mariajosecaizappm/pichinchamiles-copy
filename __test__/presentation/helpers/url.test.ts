import { firstParam, getPathnameFromHref, handleAppLinkClick, isExternalHref, titleCaseSlug } from "@/presentation/helpers/url"
import type { MouseEvent } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

describe("url helpers", () => {
    it("should return a string param as-is", () => {
        expect(firstParam("electronics")).toBe("electronics")
    })

    it("should return the first item from an array param", () => {
        expect(firstParam(["electronics", "phones"])).toBe("electronics")
    })

    it("should return undefined for missing param", () => {
        expect(firstParam(undefined)).toBeUndefined()
    })

    it("should title case slugs", () => {
        expect(titleCaseSlug("smart-phones-and-tablets")).toBe("Smart Phones And Tablets")
    })

    it("should strip query and hash from href pathname", () => {
        expect(getPathnameFromHref("/alertas-de-seguridad?utm=footer#top")).toBe("/alertas-de-seguridad")
    })

    it("should detect external hrefs", () => {
        expect(isExternalHref("https://www.pichincha.com/doc.pdf")).toBe(true)
        expect(isExternalHref("mailto:ayuda@example.com")).toBe(true)
        expect(isExternalHref("/politica-de-cookies")).toBe(false)
    })

    describe("handleAppLinkClick", () => {
        const scrollToMock = vi.fn()

        beforeEach(() => {
            scrollToMock.mockClear()
            window.history.replaceState({}, "", "/ofertas/promo")
            Object.defineProperty(window, "scrollTo", {
                value: scrollToMock,
                writable: true,
            })
        })

        it("should scroll to top when href pathname matches current pathname", () => {
            const event = { defaultPrevented: false } as MouseEvent<Element>

            handleAppLinkClick("/ofertas/promo", event)

            expect(scrollToMock).toHaveBeenCalledWith(0, 0)
        })

        it("should not scroll when href pathname differs from current pathname", () => {
            const event = { defaultPrevented: false } as MouseEvent<Element>

            handleAppLinkClick("/home", event)

            expect(scrollToMock).not.toHaveBeenCalled()
        })

        it("should not scroll for external hrefs", () => {
            const event = { defaultPrevented: false } as MouseEvent<Element>

            handleAppLinkClick("https://www.pichincha.com/promo", event)

            expect(scrollToMock).not.toHaveBeenCalled()
        })

        it("should not scroll when onClick prevents default", () => {
            const event = {
                defaultPrevented: false,
                preventDefault() {
                    this.defaultPrevented = true
                },
            } as MouseEvent<Element>
            const onClick = vi.fn((clickEvent: MouseEvent<Element>) => clickEvent.preventDefault())

            handleAppLinkClick("/ofertas/promo", event, onClick)

            expect(onClick).toHaveBeenCalledWith(event)
            expect(scrollToMock).not.toHaveBeenCalled()
        })
    })
})
