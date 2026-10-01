import { describe, it, expect } from "vitest";
import { otherObligations } from "@/presentation/pages/TermsConditionsProgram/data/otherObligations";

describe("otherObligations", () => {
    it("should be an array of strings", () => {
        expect(Array.isArray(otherObligations)).toBe(true);
        expect(otherObligations.every(item => typeof item === "string")).toBe(true);
    });

    it("should contain 4 items", () => {
        expect(otherObligations).toHaveLength(4);
    });

    it("should contain specific other obligations", () => {
        expect(otherObligations[0]).toContain("Reconocer al cliente");
        expect(otherObligations[1]).toContain("Cumplir las normas");
        expect(otherObligations[2]).toContain("Archivar y documentar");
        expect(otherObligations[3]).toContain("Mantener una versión actualizada");
    });

    it("should contain obligation related terminology", () => {
        expect(otherObligations.some(term => term.includes("beneficios"))).toBe(true);
        expect(otherObligations.some(term => term.includes("recompensas"))).toBe(true);
        expect(otherObligations.some(term => term.includes("cliente"))).toBe(true);
        expect(otherObligations.some(term => term.includes("programa"))).toBe(true);
    });

    it("should contain documentation requirements", () => {
        expect(otherObligations.some(term => term.includes("facturas"))).toBe(true);
        expect(otherObligations.some(term => term.includes("documentos"))).toBe(true);
        expect(otherObligations.some(term => term.includes("originales"))).toBe(true);
    });

    it("should mention website URLs", () => {
        expect(otherObligations.some(term => term.includes("www.bancopichincha.com.ec"))).toBe(true);
        expect(otherObligations.some(term => term.includes("www.pichinchamiles.com.ec"))).toBe(true);
    });

    it("should contain terms and conditions references", () => {
        expect(otherObligations.some(term => term.includes("Términos y condiciones"))).toBe(true);
        expect(otherObligations.some(term => term.includes("disponibles"))).toBe(true);
    });
});
