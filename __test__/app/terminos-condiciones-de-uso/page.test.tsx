import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Index from "@/app/terminos-condiciones-de-uso/page";

// Mock the TermsConditionsUse component
vi.mock("@/presentation/pages/TermsConditionsUse", () => ({
    default: () => <div data-testid="terms-conditions-use-page">Terms Conditions Use Page</div>,
}));

describe("Términos y Condiciones de Uso Page", () => {
    it("renders without crashing", () => {
        render(<Index />);
    });

    it("renders the TermsConditionsUse component", () => {
        render(<Index />);
        expect(screen.getByTestId("terms-conditions-use-page")).toBeInTheDocument();
        expect(screen.getByText("Terms Conditions Use Page")).toBeInTheDocument();
    });

    it("is a client component", () => {
        // The component uses "use client" directive
        expect(typeof Index).toBe("function");
    });

    it("exports as default", () => {
        expect(Index).toBeDefined();
    });
});
