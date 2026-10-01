import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HotelsRedemptionSection from "@/presentation/pages/TermsConditionsProgram/components/HotelsRedemptionSection";

// Mock the List component
vi.mock("@/presentation/components/List", () => ({
    default: ({ items }: { items: string[] }) => (
        <ul data-testid="hotels-redemption-list">
            {items.map((item, index) => (
                <li key={index} data-testid={`hotel-condition-item-${index}`}>
                    {item}
                </li>
            ))}
        </ul>
    )
}));

describe("HotelsRedemptionSection", () => {
    it("renders without crashing", () => {
        render(<HotelsRedemptionSection />);
        expect(screen.getByTestId("hotels-redemption-list")).toBeInTheDocument();
    });

    it("renders list items", () => {
        render(<HotelsRedemptionSection />);
        expect(screen.getByTestId("hotel-condition-item-0")).toBeInTheDocument();
        expect(screen.getByTestId("hotel-condition-item-13")).toBeInTheDocument();
    });

    it("contains hotel conditions content", () => {
        render(<HotelsRedemptionSection />);
        expect(screen.getByText(/habitaciones de hotel/)).toBeInTheDocument();
        expect(screen.getByText(/centro turístico/)).toBeInTheDocument();
    });

    it("renders all 14 hotel conditions", () => {
        render(<HotelsRedemptionSection />);
        expect(screen.getAllByTestId(/^hotel-condition-item-/)).toHaveLength(14);
    });
});
