import {
    USE_YOUR_MILES_BASE_PATH,
    matchesPath,
    nonStickyPathsDesktop,
    nonStickyPathsMobile,
    shouldHeaderStick,
} from "@/presentation/pages/Home/components/Header/data"
import links from "@/presentation/config/links"
import { describe, expect, it } from "vitest"

describe("Header sticky path data", () => {
    it("should exclude use-your-miles routes that own sticky top-0", () => {
        expect(nonStickyPathsMobile).toEqual([USE_YOUR_MILES_BASE_PATH])
        expect(nonStickyPathsDesktop).toEqual([USE_YOUR_MILES_BASE_PATH])
    })

    it("should match exact paths and nested paths", () => {
        expect(matchesPath("/utilice-sus-millas", nonStickyPathsMobile)).toBe(true)
        expect(matchesPath("/utilice-sus-millas/productos", nonStickyPathsMobile)).toBe(true)
        expect(matchesPath("/utilice-sus-millas/", nonStickyPathsMobile)).toBe(true)
    })

    it("should stick on profile, legal, products and offers paths", () => {
        expect(shouldHeaderStick("/mi-perfil", nonStickyPathsMobile)).toBe(true)
        expect(shouldHeaderStick("/mi-perfil/informacion", nonStickyPathsMobile)).toBe(true)
        expect(shouldHeaderStick("/alertas-de-seguridad", nonStickyPathsMobile)).toBe(true)
        expect(shouldHeaderStick("/politicas-de-privacidad", nonStickyPathsMobile)).toBe(true)
        expect(shouldHeaderStick(links.termsAndConditions, nonStickyPathsMobile)).toBe(true)
        expect(shouldHeaderStick("/terminos-condiciones-de-uso", nonStickyPathsMobile)).toBe(true)
        expect(shouldHeaderStick("/politica-de-cookies", nonStickyPathsMobile)).toBe(true)
        expect(shouldHeaderStick(links.productsList, nonStickyPathsMobile)).toBe(true)
        expect(shouldHeaderStick(links.offers, nonStickyPathsMobile)).toBe(true)
        expect(shouldHeaderStick(links.home, nonStickyPathsMobile)).toBe(true)
    })

    it("should not stick on use-your-miles paths", () => {
        expect(shouldHeaderStick("/utilice-sus-millas", nonStickyPathsMobile)).toBe(false)
        expect(shouldHeaderStick(links.products, nonStickyPathsMobile)).toBe(false)
        expect(shouldHeaderStick(links.flights, nonStickyPathsDesktop)).toBe(false)
    })
})
