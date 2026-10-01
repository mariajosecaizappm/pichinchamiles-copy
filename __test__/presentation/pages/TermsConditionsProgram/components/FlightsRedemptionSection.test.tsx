import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FlightsRedemptionSection from "@/presentation/pages/TermsConditionsProgram/components/FlightsRedemptionSection";

// Mock the EmbeddedList component
vi.mock("@/presentation/components/EmbeddedList", () => ({
    default: ({ items, className }: { items: any[], className?: string }) => (
        <div data-testid="flights-redemption-embedded-list" className={className}>
            {items.map((item, index) => (
                <div key={index} data-testid={`flight-condition-item-${index}`}>
                    {item.content}
                </div>
            ))}
        </div>
    )
}));

describe("FlightsRedemptionSection", () => {
    it("renders without crashing", () => {
        render(<FlightsRedemptionSection />);
        expect(screen.getByTestId("flights-redemption-embedded-list")).toBeInTheDocument();
    });

    it("renders with correct className", () => {
        render(<FlightsRedemptionSection />);
        const listElement = screen.getByTestId("flights-redemption-embedded-list");
        expect(listElement).toHaveClass('space-y-0');
    });

    it("renders flight condition items", () => {
        render(<FlightsRedemptionSection />);
        expect(screen.getByTestId("flight-condition-item-0")).toBeInTheDocument();
    });

    it("contains flight conditions content", () => {
        render(<FlightsRedemptionSection />);
        expect(screen.getByText(/boletos de aerolíneas/)).toBeInTheDocument();
        expect(screen.getByText(/turbohélice/)).toBeInTheDocument();
    });

    it("renders multiple flight conditions", () => {
        render(<FlightsRedemptionSection />);
        const flightItems = screen.getAllByTestId(/^flight-condition-item-/);
        expect(flightItems.length).toBeGreaterThan(1);
    });
});
