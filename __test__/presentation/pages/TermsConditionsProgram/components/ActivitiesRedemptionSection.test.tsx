import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ActivitiesRedemptionSection from "@/presentation/pages/TermsConditionsProgram/components/ActivitiesRedemptionSection";

// Mock the List component
vi.mock("@/presentation/components/List", () => ({
    default: ({ items }: { items: string[] }) => (
        <ul data-testid="activities-redemption-list">
            {items.map((item, index) => (
                <li key={index} data-testid={`activity-item-${index}`}>
                    {item}
                </li>
            ))}
        </ul>
    )
}));

describe("ActivitiesRedemptionSection", () => {
    it("renders without crashing", () => {
        render(<ActivitiesRedemptionSection />);
        expect(screen.getByTestId("activities-redemption-list")).toBeInTheDocument();
    });

    it("renders list items", () => {
        render(<ActivitiesRedemptionSection />);
        expect(screen.getByTestId("activity-item-0")).toBeInTheDocument();
        expect(screen.getByTestId("activity-item-4")).toBeInTheDocument();
    });

    it("contains redemption terms content", () => {
        render(<ActivitiesRedemptionSection />);
        expect(screen.getByText(/parques temáticos/)).toBeInTheDocument();
        expect(screen.getByText(/reconfirmar la actividad/)).toBeInTheDocument();
    });
});
