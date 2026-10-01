import { describe, it, expect } from "vitest"
import { buildNavItems } from "@/presentation/pages/Home/components/Header/components/Menu/HomeMenuConfig"
import type { SubMenuItem } from "@/presentation/pages/Home/components/Header/components/Menu/HomeMenuConfig"

describe("HomeMenuConfig", () => {
    describe("buildNavItems", () => {
        const mockProductSubmenus: SubMenuItem[] = [
            { label: "Hogar", href: "/productos/hogar" },
            { label: "Cocina", href: "/productos/cocina" },
        ]

        it("should return guest nav items when isAuth is false", () => {
            const result = buildNavItems(mockProductSubmenus, false)
            expect(result.length).toBeGreaterThan(0)
            expect(result.some(i => i.label === "¿Qué es Pichincha Miles?")).toBe(true)
        })

        it("should return authenticated nav items when isAuth is true", () => {
            const result = buildNavItems(mockProductSubmenus, true)
            expect(result.some(i => i.label === "Mi perfil")).toBe(true)
            expect(result.some(i => i.label === "Mis pedidos")).toBe(true)
        })

        it("should include Productos when productSubmenus has items", () => {
            const result = buildNavItems(mockProductSubmenus, false)
            const productItem = result.find(i => i.label === "Productos")
            expect(productItem).toBeDefined()
            expect(productItem?.href).toBe("/productos")
            expect(productItem?.submenus).toEqual(mockProductSubmenus)
        })

        it("should point authenticated Productos menu to products catalog", () => {
            const result = buildNavItems(mockProductSubmenus, true)
            const productItem = result.find(i => i.label === "Productos")
            expect(productItem).toBeDefined()
            expect(productItem?.href).toBe("/productos")
        })

        it("should exclude Productos when productSubmenus is empty", () => {
            const result = buildNavItems([], false)
            expect(result.some(i => i.label === "Productos")).toBe(false)
        })

        it("should include Ofertas in guest nav items", () => {
            const result = buildNavItems([], false)
            const ofertasItem = result.find(i => i.label === "Ofertas")
            expect(ofertasItem).toBeDefined()
        })

        it("should include Ofertas in authenticated nav items", () => {
            const result = buildNavItems([], true)
            const ofertasItem = result.find(i => i.label === "Ofertas")
            expect(ofertasItem).toBeDefined()
        })

        it("should include Ofertas with submenus in guest nav items", () => {
            const result = buildNavItems([], false)
            const ofertasItem = result.find(i => i.label === "Ofertas")
            expect(ofertasItem?.submenus).toBeDefined()
            expect(ofertasItem?.submenus?.length).toBeGreaterThan(0)
        })

        it("should include Ofertas submenus with Productos and Viajes y actividades", () => {
            const result = buildNavItems([], false)
            const ofertasItem = result.find(i => i.label === "Ofertas")
            const subLabels = ofertasItem?.submenus?.map(s => s.label)
            expect(subLabels).toContain("Productos")
            expect(subLabels).toContain("Viajes y actividades")
        })


        it("should position Ofertas after Explorar recompensas in guest nav", () => {
            const result = buildNavItems([], false)
            const explorarIndex = result.findIndex(i => i.label === "Explorar recompensas")
            const ofertasIndex = result.findIndex(i => i.label === "Ofertas")
            expect(ofertasIndex).toBeGreaterThan(explorarIndex)
        })
    })

    describe("PROFILE_SUBMENUS", () => {
        it("should have correct length (4 items)", () => {
            const result = buildNavItems([], true)
            const profileItem = result.find(i => i.label === "Mi perfil")
            expect(profileItem?.submenus).toBeDefined()
            expect(profileItem?.submenus?.length).toBe(4)
        })

        it("should have first item as 'Historial de transacciones' with correct href", () => {
            const result = buildNavItems([], true)
            const profileItem = result.find(i => i.label === "Mi perfil")
            const firstSubmenu = profileItem?.submenus?.[0]
            
            expect(firstSubmenu?.label).toBe("Historial de transacciones")
            expect(firstSubmenu?.href).toBe("/mi-perfil/transacciones")
        })

        it("should have second item as 'Información personal' with correct href", () => {
            const result = buildNavItems([], true)
            const profileItem = result.find(i => i.label === "Mi perfil")
            const secondSubmenu = profileItem?.submenus?.[1]
            
            expect(secondSubmenu?.label).toBe("Información personal")
            expect(secondSubmenu?.href).toBe("/mi-perfil/informacion")
        })

        it("should have third item as 'Direcciones' with correct href", () => {
            const result = buildNavItems([], true)
            const profileItem = result.find(i => i.label === "Mi perfil")
            const thirdSubmenu = profileItem?.submenus?.[2]
            
            expect(thirdSubmenu?.label).toBe("Direcciones")
            expect(thirdSubmenu?.href).toBe("/mi-perfil/direcciones")
        })

        it("should have fourth item as 'Seguridad' with correct href", () => {
            const result = buildNavItems([], true)
            const profileItem = result.find(i => i.label === "Mi perfil")
            const fourthSubmenu = profileItem?.submenus?.[3]
            
            expect(fourthSubmenu?.label).toBe("Seguridad")
            expect(fourthSubmenu?.href).toBe("/mi-perfil/seguridad")
        })

        it("should have all submenu items with required properties (label, href)", () => {
            const result = buildNavItems([], true)
            const profileItem = result.find(i => i.label === "Mi perfil")
            
            profileItem?.submenus?.forEach((submenu) => {
                expect(submenu).toHaveProperty("label")
                expect(submenu).toHaveProperty("href")
                expect(typeof submenu.label).toBe("string")
                expect(typeof submenu.href).toBe("string")
                expect(submenu.label.length).toBeGreaterThan(0)
                expect(submenu.href.length).toBeGreaterThan(0)
            })
        })

        it("should not include 'Estado de millas' in profile submenus", () => {
            const result = buildNavItems([], true)
            const profileItem = result.find(i => i.label === "Mi perfil")
            const subLabels = profileItem?.submenus?.map(s => s.label)
            
            expect(subLabels).not.toContain("Estado de millas")
        })

        it("should not include 'Información' (old label) in profile submenus", () => {
            const result = buildNavItems([], true)
            const profileItem = result.find(i => i.label === "Mi perfil")
            const subLabels = profileItem?.submenus?.map(s => s.label)
            
            expect(subLabels).not.toContain("Información")
        })
    })
})
