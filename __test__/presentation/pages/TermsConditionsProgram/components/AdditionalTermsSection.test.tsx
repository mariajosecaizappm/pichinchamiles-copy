import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AdditionalTermsSection from "@/presentation/pages/TermsConditionsProgram/components/AdditionalTermsSection";

// Mock the List component
vi.mock("@/presentation/components/List", () => ({
    default: ({ items }: { items: string[] }) => (
        <ul data-testid="additional-terms-list">
            {items.map((item, index) => (
                <li key={index} data-testid={`additional-term-item-${index}`}>
                    {item}
                </li>
            ))}
        </ul>
    )
}));

describe("AdditionalTermsSection", () => {
    it("renders without crashing", () => {
        render(<AdditionalTermsSection />);
        expect(screen.getByTestId("additional-terms-list")).toBeInTheDocument();
    });

    it("renders list items", () => {
        render(<AdditionalTermsSection />);
        expect(screen.getByTestId("additional-term-item-0")).toBeInTheDocument();
        expect(screen.getByTestId("additional-term-item-5")).toBeInTheDocument();
    });

    it("contains additional terms content", () => {
        render(<AdditionalTermsSection />);
        expect(screen.getByText(/actualizar su plataforma/)).toBeInTheDocument();
        expect(screen.getByText(/cierre intempestivo/)).toBeInTheDocument();
    });

    it("renders all 6 additional terms", () => {
        render(<AdditionalTermsSection />);
        expect(screen.getAllByTestId(/^additional-term-item-/)).toHaveLength(6);
    });
});
