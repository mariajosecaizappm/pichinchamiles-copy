import { describe, it, expect } from "vitest";
import { discountsTerms } from "@/presentation/pages/TermsConditionsProgram/data/discountsTerms";

describe("discountsTerms", () => {
    it("should be an array of strings", () => {
        expect(Array.isArray(discountsTerms)).toBe(true);
        expect(discountsTerms.every(item => typeof item === "string")).toBe(true);
    });

    it("should contain 4 items", () => {
        expect(discountsTerms).toHaveLength(4);
    });

    it("should contain specific discount terms", () => {
        expect(discountsTerms[0]).toContain("tiempo y disponibilidad limitada");
        expect(discountsTerms[1]).toContain("carrito");
        expect(discountsTerms[2]).toContain("válidas únicamente hasta");
        expect(discountsTerms[3]).toContain("valor en millas vigente");
    });

    it("should contain promotion and offer related terms", () => {
        expect(discountsTerms.some(term => term.includes("ofertas"))).toBe(true);
        expect(discountsTerms.some(term => term.includes("promoción"))).toBe(true);
        expect(discountsTerms.some(term => term.includes("plataforma"))).toBe(true);
        expect(discountsTerms.some(term => term.includes("millas"))).toBe(true);
    });

    it("should mention time limitations", () => {
        expect(discountsTerms.some(term => term.includes("tiempo"))).toBe(true);
        expect(discountsTerms.some(term => term.includes("expire"))).toBe(true);
        expect(discountsTerms.some(term => term.includes("fecha"))).toBe(true);
    });
});
