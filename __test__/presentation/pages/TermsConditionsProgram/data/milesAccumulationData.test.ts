import { describe, it, expect } from "vitest";
import { 
    milesAccumulationForPerson, 
    milesAccumulationForCompany, 
    milesAccumulationForPymes, 
    milesAccumulationForMicrocompany 
} from "@/presentation/pages/TermsConditionsProgram/data/milesAccumulationData";

describe("milesAccumulationData", () => {
    describe("milesAccumulationForPerson", () => {
        it("should be an array of strings", () => {
            expect(Array.isArray(milesAccumulationForPerson)).toBe(true);
            expect(milesAccumulationForPerson.every(item => typeof item === "string")).toBe(true);
        });

        it("should contain 11 items", () => {
            expect(milesAccumulationForPerson).toHaveLength(11);
        });

        it("should contain Visa credit cards", () => {
            expect(milesAccumulationForPerson.some(item => item.includes("Visa"))).toBe(true);
            expect(milesAccumulationForPerson.some(item => item.includes("Infinite"))).toBe(true);
            expect(milesAccumulationForPerson.some(item => item.includes("Signature"))).toBe(true);
            expect(milesAccumulationForPerson.some(item => item.includes("Platinum"))).toBe(true);
            expect(milesAccumulationForPerson.some(item => item.includes("Gold"))).toBe(true);
        });

        it("should contain Mastercard credit cards", () => {
            expect(milesAccumulationForPerson.some(item => item.includes("Mastercard"))).toBe(true);
            expect(milesAccumulationForPerson.some(item => item.includes("Black"))).toBe(true);
            expect(milesAccumulationForPerson.some(item => item.includes("Premium"))).toBe(true);
        });

        it("should contain Joven category cards", () => {
            expect(milesAccumulationForPerson.some(item => item.includes("Joven"))).toBe(true);
            expect(milesAccumulationForPerson.filter(item => item.includes("Joven"))).toHaveLength(2);
        });

        it("should contain Pichincha Miles branding", () => {
            expect(milesAccumulationForPerson.every(item => item.includes("Pichincha Miles"))).toBe(true);
        });
    });

    describe("milesAccumulationForCompany", () => {
        it("should be an array of strings", () => {
            expect(Array.isArray(milesAccumulationForCompany)).toBe(true);
            expect(milesAccumulationForCompany.every(item => typeof item === "string")).toBe(true);
        });

        it("should contain 5 items", () => {
            expect(milesAccumulationForCompany).toHaveLength(5);
        });

        it("should contain company credit card types", () => {
            expect(milesAccumulationForCompany.some(item => item.includes("Empresarial"))).toBe(true);
            expect(milesAccumulationForCompany.some(item => item.includes("Corporativa"))).toBe(true);
            expect(milesAccumulationForCompany.some(item => item.includes("Business"))).toBe(true);
        });

        it("should contain Pichincha Miles branding", () => {
            expect(milesAccumulationForCompany.every(item => item.includes("Pichincha Miles"))).toBe(true);
        });
    });

    describe("milesAccumulationForPymes", () => {
        it("should be an array of strings", () => {
            expect(Array.isArray(milesAccumulationForPymes)).toBe(true);
            expect(milesAccumulationForPymes.every(item => typeof item === "string")).toBe(true);
        });

        it("should contain 1 item", () => {
            expect(milesAccumulationForPymes).toHaveLength(1);
        });

        it("should contain PYMES credit card type", () => {
            expect(milesAccumulationForPymes.some(item => item.includes("Business Black"))).toBe(true);
        });

        it("should contain Pichincha Miles branding", () => {
            expect(milesAccumulationForPymes.every(item => item.includes("Pichincha Miles"))).toBe(true);
        });
    });

    describe("milesAccumulationForMicrocompany", () => {
        it("should be an array of strings", () => {
            expect(Array.isArray(milesAccumulationForMicrocompany)).toBe(true);
            expect(milesAccumulationForMicrocompany.every(item => typeof item === "string")).toBe(true);
        });

        it("should contain 2 items", () => {
            expect(milesAccumulationForMicrocompany).toHaveLength(2);
        });

        it("should contain microempresa credit cards", () => {
            expect(milesAccumulationForMicrocompany.some(item => item.includes("Microfinanzas"))).toBe(true);
        });

        it("should contain Pichincha Miles branding", () => {
            expect(milesAccumulationForMicrocompany.every(item => item.includes("Pichincha Miles"))).toBe(true);
        });
    });

    describe("All arrays should contain credit card terminology", () => {
        it("should contain Tarjeta de Crédito in all items except PYMES", () => {
            expect(milesAccumulationForPerson.every(item => item.includes("Tarjeta de Crédito"))).toBe(true);
            expect(milesAccumulationForCompany.every(item => item.includes("Tarjeta de Crédito"))).toBe(true);
            expect(milesAccumulationForMicrocompany.every(item => item.includes("Tarjeta de Crédito"))).toBe(true);
        });
    });
});
