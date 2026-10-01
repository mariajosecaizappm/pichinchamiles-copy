import { describe, it, expect } from "vitest";
import { conditionsTravel } from "@/presentation/pages/TermsConditionsProgram/data/conditionsTravel";

describe("conditionsTravel", () => {
    it("should be an array of strings", () => {
        expect(Array.isArray(conditionsTravel)).toBe(true);
        expect(conditionsTravel.every(item => typeof item === "string")).toBe(true);
    });

    it("should contain 30 items", () => {
        expect(conditionsTravel).toHaveLength(30);
    });

    it("should contain specific travel conditions", () => {
        expect(conditionsTravel[0]).toContain("intermediario");
        expect(conditionsTravel[1]).toContain("responsabilidad");
    });

    it("should contain travel related terminology", () => {
        expect(conditionsTravel.some(term => term.includes("viajero"))).toBe(true);
        expect(conditionsTravel.some(term => term.includes("servicio"))).toBe(true);
        expect(conditionsTravel.some(term => term.includes("cliente"))).toBe(true);
        expect(conditionsTravel.some(term => term.includes("Pichincha Miles"))).toBe(true);
    });

    it("should contain liability and responsibility clauses", () => {
        expect(conditionsTravel.some(term => term.includes("responsabilidad"))).toBe(true);
        expect(conditionsTravel.some(term => term.includes("exonera"))).toBe(true);
        expect(conditionsTravel.some(term => term.includes("reclamos"))).toBe(true);
    });

    it("should contain all travel conditions content", () => {
        expect(conditionsTravel.some(term => term.includes("paquetes turísticos"))).toBe(true);
        expect(conditionsTravel.some(term => term.includes("documentación"))).toBe(true);
        expect(conditionsTravel.some(term => term.includes("menores de 18 años"))).toBe(true);
        expect(conditionsTravel.some(term => term.includes("1800 BPMILES"))).toBe(true);
    });

    it("should contain travel package information", () => {
        expect(conditionsTravel.some(term => term.includes("disponibilidad de cupos"))).toBe(true);
        expect(conditionsTravel.some(term => term.includes("temporada alta"))).toBe(true);
    });

    it("should mention transportation and accommodation", () => {
        expect(conditionsTravel.some(term => term.includes("transporte"))).toBe(true);
        expect(conditionsTravel.some(term => term.includes("hoteles"))).toBe(true);
        expect(conditionsTravel.some(term => term.includes("aeropuertos"))).toBe(true);
    });

    it("should contain force majeure clauses", () => {
        expect(conditionsTravel.some(term => term.includes("fuerza mayor"))).toBe(true);
        expect(conditionsTravel.some(term => term.includes("caso fortuito"))).toBe(true);
        expect(conditionsTravel.some(term => term.includes("huelgas"))).toBe(true);
    });
});
