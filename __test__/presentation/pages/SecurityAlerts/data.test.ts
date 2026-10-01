import { describe, it, expect } from "vitest";
import { securityAlerts } from "@/presentation/pages/SecurityAlerts/data";

describe("securityAlerts", () => {
    it("should be an array of strings", () => {
        expect(Array.isArray(securityAlerts)).toBe(true);
        expect(securityAlerts.every(item => typeof item === "string")).toBe(true);
    });

    it("should contain 13 items", () => {
        expect(securityAlerts).toHaveLength(13);
    });

    it("should contain specific security alerts", () => {
        expect(securityAlerts[0]).toContain("e-mails");
        expect(securityAlerts[1]).toContain("página web oficial");
        expect(securityAlerts[2]).toContain("bórrelo inmediatamente");
        expect(securityAlerts[3]).toContain("eliminar su nombre");
        expect(securityAlerts[4]).toContain("contraseña");
    });

    it("should contain email security warnings", () => {
        expect(securityAlerts.some(alert => alert.includes("e-mail"))).toBe(true);
        expect(securityAlerts.some(alert => alert.includes("correo electrónico"))).toBe(true);
        expect(securityAlerts.some(alert => alert.includes("desconocidos"))).toBe(true);
    });

    it("should contain password security guidelines", () => {
        expect(securityAlerts.some(alert => alert.includes("contraseña"))).toBe(true);
        expect(securityAlerts.some(alert => alert.includes("clave"))).toBe(true);
        expect(securityAlerts.some(alert => alert.includes("Cambie frecuentemente"))).toBe(true);
    });

    it("should contain financial security warnings", () => {
        expect(securityAlerts.some(alert => alert.includes("financieros"))).toBe(true);
        expect(securityAlerts.some(alert => alert.includes("transacciones"))).toBe(true);
        expect(securityAlerts.some(alert => alert.includes("Pichincha Miles"))).toBe(true);
    });

    it("should contain personal information protection", () => {
        expect(securityAlerts.some(alert => alert.includes("información confidencial"))).toBe(true);
        expect(securityAlerts.some(alert => alert.includes("documento de identificación"))).toBe(true);
        expect(securityAlerts.some(alert => alert.includes("código de membresía"))).toBe(true);
    });

    it("should warn about public computers", () => {
        expect(securityAlerts.some(alert => alert.includes("computadoras públicas"))).toBe(true);
        expect(securityAlerts.some(alert => alert.includes("enlaces incorporados"))).toBe(true);
    });
});
