import { describe, it, expect } from "vitest";
import { otherBenefits } from "@/presentation/pages/TermsConditionsProgram/data/otherBenefits";

describe("otherBenefits", () => {
    it("should be an array of strings", () => {
        expect(Array.isArray(otherBenefits)).toBe(true);
        expect(otherBenefits.every(item => typeof item === "string")).toBe(true);
    });

    it("should contain 4 items", () => {
        expect(otherBenefits).toHaveLength(4);
    });

    it("should contain specific other benefits", () => {
        expect(otherBenefits[0]).toContain("Sorteos");
        expect(otherBenefits[1]).toContain("Campañas especiales");
        expect(otherBenefits[2]).toContain("incentivos");
        expect(otherBenefits[3]).toContain("Ofertas especiales");
    });

    it("should contain benefit related terminology", () => {
        expect(otherBenefits.some(term => term.includes("Clientes"))).toBe(true);
        expect(otherBenefits.some(term => term.includes("Pichincha Miles"))).toBe(true);
        expect(otherBenefits.some(term => term.includes("Millas"))).toBe(true);
        expect(otherBenefits.some(term => term.includes("beneficios"))).toBe(true);
    });

    it("should contain promotional terms", () => {
        expect(otherBenefits.some(term => term.includes("promocionales"))).toBe(true);
        expect(otherBenefits.some(term => term.includes("campañas"))).toBe(true);
        expect(otherBenefits.some(term => term.includes("ofertas"))).toBe(true);
    });

    it("should mention customer participation", () => {
        expect(otherBenefits.some(term => term.includes("participar"))).toBe(true);
        expect(otherBenefits.some(term => term.includes("inscripción"))).toBe(true);
        expect(otherBenefits.some(term => term.includes("segmento de Clientes"))).toBe(true);
    });
});
