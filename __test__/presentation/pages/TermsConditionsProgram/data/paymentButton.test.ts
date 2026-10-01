import { describe, it, expect } from "vitest";
import { paymentButton } from "@/presentation/pages/TermsConditionsProgram/data/paymentButton";

describe("paymentButton", () => {
    it("should be an array of strings", () => {
        expect(Array.isArray(paymentButton)).toBe(true);
        expect(paymentButton.every(item => typeof item === "string")).toBe(true);
    });

    it("should contain 7 items", () => {
        expect(paymentButton).toHaveLength(7);
    });

    it("should contain specific payment button terms", () => {
        expect(paymentButton[0]).toContain("botón de pago");
        expect(paymentButton[1]).toContain("Términos y condiciones");
        expect(paymentButton[2]).toContain("fines ilícitos");
        expect(paymentButton[3]).toContain("dólar estadounidense");
        expect(paymentButton[4]).toContain("fee de procesamiento");
    });

    it("should contain payment related terminology", () => {
        expect(paymentButton.some(term => term.includes("pago"))).toBe(true);
        expect(paymentButton.some(term => term.includes("servicios"))).toBe(true);
        expect(paymentButton.some(term => term.includes("Pichincha Miles"))).toBe(true);
        expect(paymentButton.some(term => term.includes("transacción"))).toBe(true);
    });

    it("should contain fee and processing information", () => {
        expect(paymentButton.some(term => term.includes("fee"))).toBe(true);
        expect(paymentButton.some(term => term.includes("procesamiento"))).toBe(true);
        expect(paymentButton.some(term => term.includes("reembolsable"))).toBe(true);
    });

    it("should mention currency information", () => {
        expect(paymentButton.some(term => term.includes("USD"))).toBe(true);
        expect(paymentButton.some(term => term.includes("dólar estadounidense"))).toBe(true);
    });

    it("should contain service types", () => {
        expect(paymentButton.some(term => term.includes("Copago de productos"))).toBe(true);
        expect(paymentButton.some(term => term.includes("Pago de fee de vuelos"))).toBe(true);
        expect(paymentButton.some(term => term.includes("tickets aéreos"))).toBe(true);
    });

    it("should contain legal restrictions", () => {
        expect(paymentButton.some(term => term.includes("prohibido"))).toBe(true);
        expect(paymentButton.some(term => term.includes("ilícitos"))).toBe(true);
        expect(paymentButton.some(term => term.includes("aceptación"))).toBe(true);
    });
});
