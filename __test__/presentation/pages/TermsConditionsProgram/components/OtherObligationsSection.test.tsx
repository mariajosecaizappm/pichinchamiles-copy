import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import OtherObligationsSection from "@/presentation/pages/TermsConditionsProgram/components/OtherObligationsSection";

// Mock the List component
vi.mock("@/presentation/components/List", () => ({
    default: ({ items }: { items: string[] }) => (
        <ul data-testid="other-obligations-list">
            {items.map((item, index) => (
                <li key={index} data-testid={`other-obligation-item-${index}`}>
                    {item}
                </li>
            ))}
        </ul>
    )
}));

describe("OtherObligationsSection", () => {
    it("renders without crashing", () => {
        render(<OtherObligationsSection />);
        expect(screen.getByTestId("other-obligations-list")).toBeInTheDocument();
    });

    it("renders the introduction paragraph", () => {
        render(<OtherObligationsSection />);
        expect(screen.getByText(/Pichincha Miles tiene las siguientes obligaciones/)).toBeInTheDocument();
    });

    it("renders other obligation items", () => {
        render(<OtherObligationsSection />);
        expect(screen.getByTestId("other-obligation-item-0")).toBeInTheDocument();
        expect(screen.getByTestId("other-obligation-item-3")).toBeInTheDocument();
    });

    it("contains other obligations content", () => {
        render(<OtherObligationsSection />);
        expect(screen.getByText(/Reconocer al cliente/)).toBeInTheDocument();
        expect(screen.getByText(/beneficios/)).toBeInTheDocument();
    });

    it("renders all 4 other obligations", () => {
        render(<OtherObligationsSection />);
        expect(screen.getAllByTestId(/^other-obligation-item-/)).toHaveLength(4);
    });

    it("has correct container structure", () => {
        render(<OtherObligationsSection />);
        const container = screen.getByTestId("other-obligations-list").parentElement;
        expect(container).toHaveClass("mb-4", "[&>p]:base-paragraph", "[&>p]:font-medium", "[&>p]:leading-body-dropdown", "[&>p]:text-dropdown");
    });
});
