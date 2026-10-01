import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DiscountsSection from "@/presentation/pages/TermsConditionsProgram/components/DiscountsSection";

// Mock the List component
vi.mock("@/presentation/components/List", () => ({
    default: ({ items }: { items: string[] }) => (
        <ul data-testid="discounts-list">
            {items.map((item, index) => (
                <li key={index} data-testid={`discount-term-item-${index}`}>
                    {item}
                </li>
            ))}
        </ul>
    )
}));

describe("DiscountsSection", () => {
    it("renders without crashing", () => {
        render(<DiscountsSection />);
        expect(screen.getByTestId("discounts-list")).toBeInTheDocument();
    });

    it("renders list items", () => {
        render(<DiscountsSection />);
        expect(screen.getByTestId("discount-term-item-0")).toBeInTheDocument();
        expect(screen.getByTestId("discount-term-item-3")).toBeInTheDocument();
    });

    it("contains discount terms content", () => {
        render(<DiscountsSection />);
        expect(screen.getByText(/tiempo y disponibilidad limitada/)).toBeInTheDocument();
        expect(screen.getByText(/productos agregados al carrito/)).toBeInTheDocument();
    });

    it("renders all 4 discount terms", () => {
        render(<DiscountsSection />);
        expect(screen.getAllByTestId(/^discount-term-item-/)).toHaveLength(4);
    });
});
