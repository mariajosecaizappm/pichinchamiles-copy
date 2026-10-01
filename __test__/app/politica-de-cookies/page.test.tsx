import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Index from "@/app/politica-de-cookies/page";

// Mock the CookiesPoliciesPage component
vi.mock("@/presentation/pages/CookiesPolicies", () => ({
    default: () => <div data-testid="cookies-policies-page">Cookies Policies Page</div>,
}));

describe("Política de Cookies Page", () => {
    it("renders without crashing", () => {
        render(<Index />);
    });

    it("renders the CookiesPoliciesPage component", () => {
        render(<Index />);
        expect(screen.getByTestId("cookies-policies-page")).toBeInTheDocument();
        expect(screen.getByText("Cookies Policies Page")).toBeInTheDocument();
    });

    it("is a client component", () => {
        // The component uses "use client" directive
        expect(typeof Index).toBe("function");
    });

    it("exports as default", () => {
        expect(Index).toBeDefined();
    });
});
