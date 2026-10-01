import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PaymentButtonSection from "@/presentation/pages/TermsConditionsProgram/components/PaymentButtonSection";

// Mock the List component
vi.mock("@/presentation/components/List", () => ({
    default: ({ items }: { items: string[] }) => (
        <ul data-testid="payment-button-list">
            {items.map((item, index) => (
                <li key={index} data-testid={`payment-button-item-${index}`}>
                    {item}
                </li>
            ))}
        </ul>
    )
}));

describe("PaymentButtonSection", () => {
    it("renders without crashing", () => {
        render(<PaymentButtonSection />);
        expect(screen.getByTestId("payment-button-list")).toBeInTheDocument();
    });

    it("renders payment button items", () => {
        render(<PaymentButtonSection />);
        expect(screen.getByTestId("payment-button-item-0")).toBeInTheDocument();
        expect(screen.getByTestId("payment-button-item-6")).toBeInTheDocument();
    });

    it("contains payment button content", () => {
        render(<PaymentButtonSection />);
        expect(screen.getByText("El botón de pago tiene como objetivo el pago en línea de los servicios ofertados por Pichincha Miles.")).toBeInTheDocument();
        expect(screen.getByText("La moneda de transacción de los servicios que se contraten es el dólar estadounidense (USD).")).toBeInTheDocument();
    });

    it("renders all 7 payment button terms", () => {
        render(<PaymentButtonSection />);
        expect(screen.getAllByTestId(/^payment-button-item-/)).toHaveLength(7);
    });
});
