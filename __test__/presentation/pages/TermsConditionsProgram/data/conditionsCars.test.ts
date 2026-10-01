import { describe, it, expect } from "vitest";
import { conditionsCars } from "@/presentation/pages/TermsConditionsProgram/data/conditionsCars";

describe("conditionsCars", () => {
    it("should be an array of strings", () => {
        expect(Array.isArray(conditionsCars)).toBe(true);
        expect(conditionsCars.every(item => typeof item === "string")).toBe(true);
    });

    it("should contain 15 items", () => {
        expect(conditionsCars).toHaveLength(15);
    });

    it("should contain specific car rental conditions", () => {
        expect(conditionsCars[0]).toContain("cancelaciones");
        expect(conditionsCars[1]).toContain("no se presente");
        expect(conditionsCars[2]).toContain("retorno anticipado");
        expect(conditionsCars[3]).toContain("impuesto");
        expect(conditionsCars[4]).toContain("24 horas");
    });

    it("should contain car rental specific terms", () => {
        expect(conditionsCars.some(term => term.includes("automóvil"))).toBe(true);
        expect(conditionsCars.some(term => term.includes("alquiler"))).toBe(true);
        expect(conditionsCars.some(term => term.includes("vehículo"))).toBe(true);
        expect(conditionsCars.some(term => term.includes("conducir"))).toBe(true);
    });

    it("should contain insurance and requirement information", () => {
        expect(conditionsCars.some(term => term.includes("seguro"))).toBe(true);
        expect(conditionsCars.some(term => term.includes("licencia"))).toBe(true);
        expect(conditionsCars.some(term => term.includes("tarjeta de crédito"))).toBe(true);
    });

    it("should mention geographical restrictions", () => {
        expect(conditionsCars.some(term => term.includes("restricciones geográficas"))).toBe(true);
        expect(conditionsCars.some(term => term.includes("transfronterizas"))).toBe(true);
    });
});
