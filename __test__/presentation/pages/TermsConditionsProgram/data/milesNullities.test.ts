import { describe, it, expect } from "vitest";
import { milesNullities } from "@/presentation/pages/TermsConditionsProgram/data/milesNullities";

describe("milesNullities", () => {
    it("should be an array of strings", () => {
        expect(Array.isArray(milesNullities)).toBe(true);
        expect(milesNullities.every(item => typeof item === "string")).toBe(true);
    });

    it("should contain 7 items", () => {
        expect(milesNullities).toHaveLength(7);
    });

    it("should contain specific miles nullity conditions", () => {
        expect(milesNullities[0]).toContain("cancelado por decisión voluntaria");
        expect(milesNullities[1]).toContain("inactividad del uso");
        expect(milesNullities[2]).toContain("cambio de Tarjeta de Crédito");
        expect(milesNullities[3]).toContain("fallecimiento del titular");
        expect(milesNullities[4]).toContain("mora superior a 30 días");
    });

    it("should contain miles and credit card terminology", () => {
        expect(milesNullities.some(term => term.includes("Millas"))).toBe(true);
        expect(milesNullities.some(term => term.includes("Tarjeta de Crédito"))).toBe(true);
        expect(milesNullities.some(term => term.includes("Cliente"))).toBe(true);
        expect(milesNullities.some(term => term.includes("Banco Pichincha"))).toBe(true);
    });

    it("should contain legal and financial terms", () => {
        expect(milesNullities.some(term => term.includes("anuladas"))).toBe(true);
        expect(milesNullities.some(term => term.includes("documentación"))).toBe(true);
        expect(milesNullities.some(term => term.includes("autoridad competente"))).toBe(true);
    });

    it("should mention time periods", () => {
        expect(milesNullities.some(term => term.includes("180 días"))).toBe(true);
        expect(milesNullities.some(term => term.includes("30 días"))).toBe(true);
    });

    it("should contain fraud prevention clauses", () => {
        expect(milesNullities.some(term => term.includes("fraude"))).toBe(true);
        expect(milesNullities.some(term => term.includes("abuso"))).toBe(true);
        expect(milesNullities.some(term => term.includes("lavado de activos"))).toBe(true);
    });
});
