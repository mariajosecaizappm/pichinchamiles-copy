import { describe, it, expect, vi } from "vitest"
import links from "@/presentation/config/links"

const mockRedirect = vi.fn()

vi.mock("next/navigation", () => ({
    redirect: (url: string) => mockRedirect(url),
}))

describe("Profile Root Page (src/app/mi-perfil/page.tsx)", () => {
    it("should call redirect with links.myTransactions", async () => {
        mockRedirect.mockClear()
        
        const Page = (await import("@/app/mi-perfil/page")).default
        
        Page()
        
        expect(mockRedirect).toHaveBeenCalledWith(links.myTransactions)
        expect(mockRedirect).toHaveBeenCalledTimes(1)
    })

    it("should redirect to correct path", async () => {
        mockRedirect.mockClear()
        
        const Page = (await import("@/app/mi-perfil/page")).default
        
        Page()
        
        expect(mockRedirect).toHaveBeenCalledWith("/mi-perfil/transacciones")
    })

    it("should use redirect from next/navigation", async () => {
        mockRedirect.mockClear()
        
        const Page = (await import("@/app/mi-perfil/page")).default
        
        Page()
        
        expect(mockRedirect).toHaveBeenCalled()
    })
})
