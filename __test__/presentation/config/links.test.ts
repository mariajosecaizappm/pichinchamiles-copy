import { describe, it, expect } from "vitest"
import links from "@/presentation/config/links"

describe("links config (src/presentation/config/links.ts)", () => {
    it("should be defined", () => {
        expect(links).toBeDefined()
    })

    it("should be frozen (immutable)", () => {
        expect(Object.isFrozen(links)).toBe(true)
    })

    describe("existing links", () => {
        it("should have home link", () => {
            expect(links.home).toBe("/")
        })

        it("should have flights link", () => {
            expect(links.flights).toBe("/utilice-sus-millas/viajes-y-actividades/vuelos")
        })

        it("should have hotels link", () => {
            expect(links.hotels).toBe("/utilice-sus-millas/viajes-y-actividades/hoteles")
        })

        it("should have carRental link", () => {
            expect(links.carRental).toBe("/utilice-sus-millas/viajes-y-actividades/autos")
        })

        it("should have activities link", () => {
            expect(links.activities).toBe("/utilice-sus-millas/viajes-y-actividades/actividades")
        })

        it("should have disney link", () => {
            expect(links.disney).toBe("/utilice-sus-millas/viajes-y-actividades/disney")
        })

        it("should have faq link", () => {
            expect(links.faq).toBe("/ayuda/preguntas-frecuentes")
        })

        it("should have contact link", () => {
            expect(links.contact).toBe("/ayuda/contacto")
        })

        it("should have products link", () => {
            expect(links.products).toBe("/utilice-sus-millas/productos")
        })

        it("should have shoppingProducts link", () => {
            expect(links.shoppingProducts).toBe("/utilice-sus-millas/productos")
        })

        it("should have travelAndActivities link", () => {
            expect(links.travelAndActivities).toBe("/viajes-y-actividades")
        })

        it("should have campaignOffers link", () => {
            expect(links.campaignOffers).toBe("/ofertas")
        })

        it("should have transferMiles link", () => {
            expect(links.transferMiles).toBe("/transferencia-de-millas")
        })

        it("should have myOrders link", () => {
            expect(links.myOrders).toBe("/mis-pedidos")
        })

        it("should have termsAndConditions link", () => {
            expect(links.termsAndConditions).toBe("/terminos-condiciones-del-programa")
        })

        it("should have lopdDocument link", () => {
            expect(links.lopdDocument).toBe(
                "https://s3.amazonaws.com/resources.miles.com.ec/public/documents/pichinchamilesec/lopd/autorizacion-para-tratamiento-de-documentos-personales-v01-1.pdf"
            )
        })

        it("should have offers link", () => {
            expect(links.offers).toBe("/ofertas")
        })

        it("should have productsList link", () => {
            expect(links.productsList).toBe("/productos")
        })

        it("should have travelOffers link", () => {
            expect(links.travelOffers).toBe("/ofertas/viajes-y-actividades")
        })
    })

    describe("profile-related links", () => {
        it("should have myProfile link", () => {
            expect(links.myProfile).toBe("/mi-perfil")
        })

        it("should have myMiles link", () => {
            expect(links.myMiles).toBe("/mi-perfil/estado-de-millas")
        })

        it("should have myInformation link", () => {
            expect(links.myInformation).toBe("/mi-perfil/informacion")
        })

        it("should have myAddresses link", () => {
            expect(links.myAddresses).toBe("/mi-perfil/direcciones")
        })

        it("should have mySecurity link", () => {
            expect(links.mySecurity).toBe("/mi-perfil/seguridad")
        })

        it("should have myTransactions link (new)", () => {
            expect(links.myTransactions).toBe("/mi-perfil/transacciones")
        })

        it("should have all profile links start with /mi-perfil", () => {
            expect(links.myProfile).toMatch(/^\/mi-perfil/)
            expect(links.myMiles).toMatch(/^\/mi-perfil/)
            expect(links.myInformation).toMatch(/^\/mi-perfil/)
            expect(links.myAddresses).toMatch(/^\/mi-perfil/)
            expect(links.mySecurity).toMatch(/^\/mi-perfil/)
            expect(links.myTransactions).toMatch(/^\/mi-perfil/)
        })
    })

    describe("link uniqueness", () => {
        it("should not have duplicate values except for intentional aliases", () => {
            const values = Object.values(links)
            const duplicates = values.filter((value, index) => values.indexOf(value) !== index)
            const allowedDuplicates = ["/utilice-sus-millas/productos", "/ofertas"]
            
            duplicates.forEach((duplicate) => {
                expect(allowedDuplicates).toContain(duplicate)
            })
        })
    })

    describe("type safety", () => {
        it("should have all values as strings", () => {
            Object.values(links).forEach((value) => {
                expect(typeof value).toBe("string")
            })
        })

        it("should have all keys as strings", () => {
            Object.keys(links).forEach((key) => {
                expect(typeof key).toBe("string")
            })
        })
    })
})
