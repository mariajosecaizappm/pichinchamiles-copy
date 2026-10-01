import { describe, it, expect } from "vitest";
import { registersData } from "@/presentation/pages/TermsConditionsProgram/data/registersData";

describe("registersData", () => {
    it("should be an array of strings", () => {
        expect(Array.isArray(registersData)).toBe(true);
        expect(registersData.every(item => typeof item === "string")).toBe(true);
    });

    it("should contain 4 items", () => {
        expect(registersData).toHaveLength(4);
    });

    it("should contain specific register data terms", () => {
        expect(registersData[0]).toContain("responsabilidad");
        expect(registersData[1]).toContain("autoriza");
        expect(registersData[2]).toContain("valor monetario");
        expect(registersData[3]).toContain("clave de acceso");
    });

    it("should contain registration related terminology", () => {
        expect(registersData.some(term => term.includes("clientes"))).toBe(true);
        expect(registersData.some(term => term.includes("programa Pichincha Miles"))).toBe(true);
        expect(registersData.some(term => term.includes("términos y condiciones"))).toBe(true);
        expect(registersData.some(term => term.includes("cliente"))).toBe(true);
    });

    it("should contain miles and financial information", () => {
        expect(registersData.some(term => term.includes("millas"))).toBe(true);
        expect(registersData.some(term => term.includes("tarjeta de crédito"))).toBe(true);
        expect(registersData.some(term => term.includes("débito recurrente"))).toBe(true);
    });

    it("should contain security and access information", () => {
        expect(registersData.some(term => term.includes("clave de acceso"))).toBe(true);
        expect(registersData.some(term => term.includes("seguridad"))).toBe(true);
        expect(registersData.some(term => term.includes("piratas informáticos"))).toBe(true);
        expect(registersData.some(term => term.includes("estafas"))).toBe(true);
    });

    it("should contain website references", () => {
        expect(registersData.some(term => term.includes("www.pichinchamiles.com"))).toBe(true);
        expect(registersData.some(term => term.includes("canales de atención"))).toBe(true);
    });

    it("should contain transaction restrictions", () => {
        expect(registersData.some(term => term.includes("comprar, vender, intercambiar"))).toBe(true);
        expect(registersData.some(term => term.includes("transacción"))).toBe(true);
        expect(registersData.some(term => term.includes("autorizada"))).toBe(true);
    });
});
