import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SecurityAlerts from "@/presentation/pages/SecurityAlerts/SecurityAlerts";

vi.mock("@/presentation/components/Layout/LegalConditionsLayout", () => ({
    default: ({ children, title }: { children: React.ReactNode; title: string }) => (
        <div data-testid="legal-conditions-layout">
            <h1 data-testid="page-title">{title}</h1>
            {children}
        </div>
    )
}));

vi.mock("@/presentation/components/List", () => ({
    default: ({ items, itemClassName }: { items: string[]; itemClassName?: string }) => (
        <ul data-testid="security-alerts-list">
            {items.map((item, index) => {
                const keyItem = `keylistitem-${index}`;
                return    <li key={keyItem} data-testid={`security-alert-item-${index}`} className={itemClassName}>
                    {item}
                </li>
            }

            )}
        </ul>
    )
}));

describe("SecurityAlerts", () => {
    it("renders without crashing", () => {
        render(<SecurityAlerts />);
        expect(screen.getByTestId("legal-conditions-layout")).toBeInTheDocument();
    });

    it("renders the correct title", () => {
        render(<SecurityAlerts />);
        expect(screen.getByTestId("page-title")).toHaveTextContent("Alertas de Seguridad en Internet");
    });

    it("renders the introduction paragraphs", () => {
        render(<SecurityAlerts />);
        expect(screen.getByText(/sofisticados métodos fraudulentos/)).toBeInTheDocument();
        expect(screen.getByText(/evitar que Usted se convierta en víctima/)).toBeInTheDocument();
    });

    it("renders the security alerts list", () => {
        render(<SecurityAlerts />);
        expect(screen.getByTestId("security-alerts-list")).toBeInTheDocument();
    });

    it("renders security alert items", () => {
        render(<SecurityAlerts />);
        expect(screen.getByTestId("security-alert-item-0")).toBeInTheDocument();
        expect(screen.getByTestId("security-alert-item-12")).toBeInTheDocument();
    });

    it("contains security alert content", () => {
        render(<SecurityAlerts />);
        expect(screen.getByText(/personas desconocidas/)).toBeInTheDocument();
        expect(screen.getByText(/Cambie frecuentemente/)).toBeInTheDocument();
    });

    it("applies correct className to list items", () => {
        render(<SecurityAlerts />);
        const listItem = screen.getByTestId("security-alert-item-0");
        expect(listItem).toHaveClass("base-paragraph");
    });

    it("renders all 13 security alerts", () => {
        render(<SecurityAlerts />);
        expect(screen.getAllByTestId(/^security-alert-item-/)).toHaveLength(13);
    });
});
