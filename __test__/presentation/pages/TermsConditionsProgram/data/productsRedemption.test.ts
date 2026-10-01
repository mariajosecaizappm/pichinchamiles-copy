import { describe, it, expect } from "vitest";
import { productsRedemption } from "@/presentation/pages/TermsConditionsProgram/data/productsRedemption";

describe("productsRedemption", () => {
    it("should be an array of strings", () => {
        expect(Array.isArray(productsRedemption)).toBe(true);
        expect(productsRedemption.every(item => typeof item === "string")).toBe(true);
    });

    it("should contain 13 items", () => {
        expect(productsRedemption).toHaveLength(13);
    });

    it("should contain specific products redemption terms", () => {
        expect(productsRedemption[0]).toContain("intermediario");
        expect(productsRedemption[1]).toContain("responsabilidad");
        expect(productsRedemption[2]).toContain("dirección");
        expect(productsRedemption[3]).toContain("retrasos en la entrega");
        expect(productsRedemption[4]).toContain("garantía");
    });

    it("should contain product related terminology", () => {
        expect(productsRedemption.some(term => term.includes("productos"))).toBe(true);
        expect(productsRedemption.some(term => term.includes("cliente"))).toBe(true);
        expect(productsRedemption.some(term => term.includes("proveedores"))).toBe(true);
        expect(productsRedemption.some(term => term.includes("Pichincha Miles"))).toBe(true);
    });

    it("should contain delivery and shipping information", () => {
        expect(productsRedemption.some(term => term.includes("entregados"))).toBe(true);
        expect(productsRedemption.some(term => term.includes("dirección"))).toBe(true);
        expect(productsRedemption.some(term => term.includes("despachado"))).toBe(true);
        expect(productsRedemption.some(term => term.includes("plazos"))).toBe(true);
    });

    it("should contain warranty and guarantee information", () => {
        expect(productsRedemption.some(term => term.includes("garantía"))).toBe(true);
        expect(productsRedemption.some(term => term.includes("empaque original"))).toBe(true);
        expect(productsRedemption.some(term => term.includes("48 horas"))).toBe(true);
    });

    it("should contain liability and responsibility clauses", () => {
        expect(productsRedemption.some(term => term.includes("responsabilidad"))).toBe(true);
        expect(productsRedemption.some(term => term.includes("incumplimientos"))).toBe(true);
        expect(productsRedemption.some(term => term.includes("interpretaciones erróneas"))).toBe(true);
    });

    it("should mention international shipping", () => {
        expect(productsRedemption.some(term => term.includes("internacionales"))).toBe(true);
        expect(productsRedemption.some(term => term.includes("aduana"))).toBe(true);
        expect(productsRedemption.some(term => term.includes("transporte internacional"))).toBe(true);
    });

    it("should contain catalog and availability information", () => {
        expect(productsRedemption.some(term => term.includes("catálogo"))).toBe(true);
        expect(productsRedemption.some(term => term.includes("disponibilidad"))).toBe(true);
        expect(productsRedemption.some(term => term.includes("fotografías"))).toBe(true);
    });
});
