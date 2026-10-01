import { describe, it, expect } from "vitest";
import { conditionsFlights } from "@/presentation/pages/TermsConditionsProgram/data/conditionsFlights";

describe("conditionsFlights", () => {
    it("should be an array of EmbeddedListItem objects", () => {
        expect(Array.isArray(conditionsFlights)).toBe(true);
        expect(conditionsFlights.every(item => 
            typeof item === 'object' && 
            typeof item.content === 'string'
        )).toBe(true);
    });

    it("should contain flight condition items", () => {
        expect(conditionsFlights.length).toBeGreaterThan(0);
    });

    it("should contain specific flight conditions", () => {
        expect(conditionsFlights.some(item => item.content.includes("boletos de aerolíneas"))).toBe(true);
        expect(conditionsFlights.some(item => item.content.includes("reembolsables"))).toBe(true);
        expect(conditionsFlights.some(item => item.content.includes("aerolínea"))).toBe(true);
    });

    it("should contain items with content property", () => {
        conditionsFlights.forEach(item => {
            expect(item).toHaveProperty('content');
            expect(typeof item.content).toBe('string');
            expect(item.content.length).toBeGreaterThan(0);
        });
    });

    it("may contain items with subList property", () => {
        // Some items might have subList, check if the structure is correct when present
        conditionsFlights.forEach(item => {
            if (item.subList) {
                expect(Array.isArray(item.subList)).toBe(true);
            }
        });
    });

    it("should contain Spanish flight terminology", () => {
        expect(conditionsFlights.some(item => 
            item.content.match(/[áéíóúñüÁÉÍÓÚÑÜ]/)
        )).toBe(true);
    });
});
