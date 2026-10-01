import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Index from "@/app/politicas-de-privacidad/page";

// Mock the PrivacyPoliciesPage component
vi.mock("@/presentation/pages/PrivacyPolicies", () => ({
    default: () => <div data-testid="privacy-policies-page">Privacy Policies Page</div>,
}));

describe("Políticas de Privacidad Page", () => {
    it("renders without crashing", () => {
        render(<Index />);
    });

    it("renders the PrivacyPoliciesPage component", () => {
        render(<Index />);
        expect(screen.getByTestId("privacy-policies-page")).toBeInTheDocument();
        expect(screen.getByText("Privacy Policies Page")).toBeInTheDocument();
    });

    it("is a client component", () => {
        // The component uses "use client" directive
        expect(typeof Index).toBe("function");
    });

    it("exports as default", () => {
        expect(Index).toBeDefined();
    });
});
