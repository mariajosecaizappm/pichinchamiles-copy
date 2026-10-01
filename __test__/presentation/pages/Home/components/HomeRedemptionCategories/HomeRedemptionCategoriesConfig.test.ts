import { describe, it, expect } from "vitest"
import { getRedemptionCategoryCta } from "@/presentation/pages/Home/components/HomeRedemptionCategories/HomeRedemptionCategoriesConfig"

describe("getRedemptionCategoryCta", () => {
    it("should return Ver productos for Productos", () => {
        expect(getRedemptionCategoryCta("Productos")).toBe("Ver productos")
    })

    it("should match Productos case-insensitively", () => {
        expect(getRedemptionCategoryCta("  productos  ")).toBe("Ver productos")
    })

    it.each([
        "Vuelos",
        "Hoteles",
        "Renta de autos",
        "Actividades",
        "Disney",
        "Nueva categoría",
    ])("should return Reserva ahora for %s", (title) => {
        expect(getRedemptionCategoryCta(title)).toBe("Reserva ahora")
    })
})
