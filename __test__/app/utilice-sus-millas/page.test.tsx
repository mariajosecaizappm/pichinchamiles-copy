import { describe, it, expect, vi } from "vitest"

const mockRedirect = vi.fn()

vi.mock("next/navigation", () => ({
    redirect: (...args: unknown[]) => {
        mockRedirect(...args)
    },
}))

import UtiliceSusMillasPage from "@/app/utilice-sus-millas/(main)/page"
import links from "@/presentation/config/links"

describe("UtiliceSusMillasPage", () => {
    it("should redirect to products page", () => {
        UtiliceSusMillasPage()
        expect(mockRedirect).toHaveBeenCalledWith(links.products)
    })

    it("should call redirect exactly once", () => {
        mockRedirect.mockClear()
        UtiliceSusMillasPage()
        expect(mockRedirect).toHaveBeenCalledTimes(1)
    })
})
