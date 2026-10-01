import { describe, it, expect } from "vitest";
import { additionalTerms } from "@/presentation/pages/TermsConditionsProgram/data/additionalTerms";

describe("additionalTerms", () => {
    it("should be an array of strings", () => {
        expect(Array.isArray(additionalTerms)).toBe(true);
        expect(additionalTerms.every(item => typeof item === "string")).toBe(true);
    });

    it("should contain 6 items", () => {
        expect(additionalTerms).toHaveLength(6);
    });

    it("should contain specific additional terms", () => {
        expect(additionalTerms[0]).toContain("actualizar su plataforma");
        expect(additionalTerms[1]).toContain("cierre intempestivo");
        expect(additionalTerms[2]).toContain("transferir la propiedad");
        expect(additionalTerms[3]).toContain("tolerancia");
        expect(additionalTerms[4]).toContain("inválida, nula o ilegal");
        expect(additionalTerms[5]).toContain("actualizaciones automáticas");
    });

    it("should contain legal and platform terms", () => {
        expect(additionalTerms.some(term => term.includes("Pichincha Miles"))).toBe(true);
        expect(additionalTerms.some(term => term.includes("cliente"))).toBe(true);
        expect(additionalTerms.some(term => term.includes("plataforma"))).toBe(true);
    });
});
