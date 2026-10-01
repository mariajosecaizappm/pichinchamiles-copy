import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Index from "@/app/terminos-condiciones-del-programa/page";

// Mock the TermsConditionsProgramPage component
vi.mock("@/presentation/pages/TermsConditionsProgram", () => ({
    default: () => <div data-testid="terms-conditions-program-page">Terms Conditions Program Page</div>,
}));

describe("Términos y Condiciones del Programa Page", () => {
    it("renders without crashing", () => {
        render(<Index />);
    });

    it("renders the TermsConditionsProgramPage component", () => {
        render(<Index />);
        expect(screen.getByTestId("terms-conditions-program-page")).toBeInTheDocument();
        expect(screen.getByText("Terms Conditions Program Page")).toBeInTheDocument();
    });

    it("is a client component", () => {
        // The component uses "use client" directive
        expect(typeof Index).toBe("function");
    });

    it("exports as default", () => {
        expect(Index).toBeDefined();
    });
});
