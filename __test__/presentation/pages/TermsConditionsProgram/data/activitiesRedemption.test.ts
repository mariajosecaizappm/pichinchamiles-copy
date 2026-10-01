import { describe, it, expect } from "vitest";
import { activitiesRedemption } from "@/presentation/pages/TermsConditionsProgram/data/activitiesRedemption";

describe("activitiesRedemption", () => {
    it("should be an array of strings", () => {
        expect(Array.isArray(activitiesRedemption)).toBe(true);
        expect(activitiesRedemption.every(item => typeof item === "string")).toBe(true);
    });

    it("should contain 5 items", () => {
        expect(activitiesRedemption).toHaveLength(5);
    });

    it("should contain specific redemption terms", () => {
        expect(activitiesRedemption[0]).toContain("parques temáticos");
        expect(activitiesRedemption[1]).toContain("cancelaciones");
        expect(activitiesRedemption[2]).toContain("no se presente");
        expect(activitiesRedemption[3]).toContain("72 horas");
        expect(activitiesRedemption[4]).toContain("documento de identificación");
    });

    it("should contain Spanish text content", () => {
        activitiesRedemption.forEach(item => {
            expect(item).toMatch(/[áéíóúñüÁÉÍÓÚÑÜ]/); // Should contain Spanish characters
        });
    });
});
