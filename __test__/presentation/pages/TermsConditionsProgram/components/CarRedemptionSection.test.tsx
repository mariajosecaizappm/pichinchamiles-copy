import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CarRedemptionSection from "@/presentation/pages/TermsConditionsProgram/components/CarRedemptionSection";

// Mock the List component
vi.mock("@/presentation/components/List", () => ({
    default: ({ items }: { items: string[] }) => (
        <ul data-testid="car-redemption-list">
            {items.map((item, index) => (
                <li key={index} data-testid={`car-condition-item-${index}`}>
                    {item}
                </li>
            ))}
        </ul>
    )
}));

describe("CarRedemptionSection", () => {
    it("renders without crashing", () => {
        render(<CarRedemptionSection />);
        expect(screen.getByTestId("car-redemption-list")).toBeInTheDocument();
    });

    it("renders list items", () => {
        render(<CarRedemptionSection />);
        expect(screen.getByTestId("car-condition-item-0")).toBeInTheDocument();
        expect(screen.getByTestId("car-condition-item-14")).toBeInTheDocument();
    });

    it("contains car rental conditions content", () => {
        render(<CarRedemptionSection />);
        expect(screen.getByText(/trayecto único/)).toBeInTheDocument();
        expect(screen.getByText(/retorno anticipado/)).toBeInTheDocument();
    });

    it("renders all 15 car conditions", () => {
        render(<CarRedemptionSection />);
        expect(screen.getAllByTestId(/^car-condition-item-/)).toHaveLength(15);
    });
});
