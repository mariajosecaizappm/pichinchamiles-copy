import { describe, it, expect } from "vitest";
import { conditionsHotels } from "@/presentation/pages/TermsConditionsProgram/data/conditionsHotels";

describe("conditionsHotels", () => {
    it("should be an array of strings", () => {
        expect(Array.isArray(conditionsHotels)).toBe(true);
        expect(conditionsHotels.every(item => typeof item === "string")).toBe(true);
    });

    it("should contain 14 items", () => {
        expect(conditionsHotels).toHaveLength(14);
    });

    it("should contain specific hotel conditions", () => {
        expect(conditionsHotels[0]).toContain("habitaciones de hotel");
        expect(conditionsHotels[1]).toContain("cancelaciones o modificaciones");
        expect(conditionsHotels[2]).toContain("no se presente");
        expect(conditionsHotels[3]).toContain("llegará tarde");
        expect(conditionsHotels[4]).toContain("salida anticipada");
    });

    it("should contain hotel related terminology", () => {
        expect(conditionsHotels.some(term => term.includes("hotel"))).toBe(true);
        expect(conditionsHotels.some(term => term.includes("reserva"))).toBe(true);
        expect(conditionsHotels.some(term => term.includes("huésped"))).toBe(true);
        expect(conditionsHotels.some(term => term.includes("habitación"))).toBe(true);
    });

    it("should contain check-in and check-out information", () => {
        expect(conditionsHotels.some(term => term.includes("registrarse"))).toBe(true);
        expect(conditionsHotels.some(term => term.includes("llegada"))).toBe(true);
        expect(conditionsHotels.some(term => term.includes("salida"))).toBe(true);
    });

    it("should mention payment and charges", () => {
        expect(conditionsHotels.some(term => term.includes("tarjeta de crédito"))).toBe(true);
        expect(conditionsHotels.some(term => term.includes("cargos"))).toBe(true);
        expect(conditionsHotels.some(term => term.includes("impuestos"))).toBe(true);
    });

    it("should contain contact information", () => {
        expect(conditionsHotels.some(term => term.includes("1800 BPMILE"))).toBe(true);
        expect(conditionsHotels.some(term => term.includes("276453"))).toBe(true);
    });
});
