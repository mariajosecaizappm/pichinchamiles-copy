import { render } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const scrollToMock = vi.fn()
const usePathnameMock = vi.fn()

vi.mock("next/navigation", () => ({
    usePathname: () => usePathnameMock(),
}))

import ScrollToTopOnRouteChange from "@/presentation/components/ScrollToTopOnRouteChange"

describe("ScrollToTopOnRouteChange", () => {
    beforeEach(() => {
        scrollToMock.mockClear()
        usePathnameMock.mockReturnValue("/")
        Object.defineProperty(window, "scrollTo", {
            value: scrollToMock,
            writable: true,
        })
    })

    it("should scroll to top on mount", () => {
        render(<ScrollToTopOnRouteChange />)

        expect(scrollToMock).toHaveBeenCalledWith(0, 0)
    })

    it("should scroll to top when pathname changes", () => {
        const { rerender } = render(<ScrollToTopOnRouteChange />)
        scrollToMock.mockClear()

        usePathnameMock.mockReturnValue("/utilice-sus-millas/viajes-y-actividades")
        rerender(<ScrollToTopOnRouteChange />)

        expect(scrollToMock).toHaveBeenCalledWith(0, 0)
    })

    it("should not scroll again when pathname stays the same", () => {
        const { rerender } = render(<ScrollToTopOnRouteChange />)
        scrollToMock.mockClear()

        rerender(<ScrollToTopOnRouteChange />)

        expect(scrollToMock).not.toHaveBeenCalled()
    })
})
