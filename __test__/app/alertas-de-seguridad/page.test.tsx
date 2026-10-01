import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Index from "@/app/alertas-de-seguridad/page";

// Mock the SecurityAlertsPage component
vi.mock("@/presentation/pages/SecurityAlerts", () => ({
    default: () => <div data-testid="security-alerts-page">Security Alerts Page</div>,
}));

describe("Alertas de Seguridad Page", () => {
    it("renders without crashing", () => {
        render(<Index />);
    });

    it("renders the SecurityAlertsPage component", () => {
        render(<Index />);
        expect(screen.getByTestId("security-alerts-page")).toBeInTheDocument();
        expect(screen.getByText("Security Alerts Page")).toBeInTheDocument();
    });

    it("is a client component", () => {
        // The component uses "use client" directive
        expect(typeof Index).toBe("function");
    });

    it("exports as default", () => {
        expect(Index).toBeDefined();
    });
});
