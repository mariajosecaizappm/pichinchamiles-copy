import { describe, it, expect } from "vitest";
import { validityData } from "@/presentation/pages/TermsConditionsProgram/data/validityData";

describe("validityData", () => {
    it("should be an array of strings", () => {
        expect(Array.isArray(validityData)).toBe(true);
        expect(validityData.every(item => typeof item === "string")).toBe(true);
    });

    it("should contain 3 items", () => {
        expect(validityData).toHaveLength(3);
    });

    it("should contain specific validity conditions", () => {
        expect(validityData[0]).toContain("fallecimiento del titular");
        expect(validityData[1]).toContain("cancelación voluntaria");
        expect(validityData[2]).toContain("cambio de Tarjeta de Crédito");
    });

    it("should contain account related terminology", () => {
        expect(validityData.some(term => term.includes("titular de la cuenta"))).toBe(true);
        expect(validityData.some(term => term.includes("cliente"))).toBe(true);
        expect(validityData.some(term => term.includes("Tarjeta de Crédito"))).toBe(true);
    });

    it("should contain cancellation conditions", () => {
        expect(validityData.some(term => term.includes("cancelación"))).toBe(true);
        expect(validityData.some(term => term.includes("políticas del producto"))).toBe(true);
        expect(validityData.some(term => term.includes("autoridad competente"))).toBe(true);
    });

    it("should contain program change conditions", () => {
        expect(validityData.some(term => term.includes("programa de Pichincha Miles"))).toBe(true);
        expect(validityData.some(term => term.includes("Tarjeta de Crédito Miles"))).toBe(true);
    });

    it("should contain legal and financial terms", () => {
        expect(validityData.some(term => term.includes("fallecimiento"))).toBe(true);
        expect(validityData.some(term => term.includes("voluntaria"))).toBe(true);
    });
});
