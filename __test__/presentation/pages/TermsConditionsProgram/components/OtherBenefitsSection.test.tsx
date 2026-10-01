import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import OtherBenefitsSection from "@/presentation/pages/TermsConditionsProgram/components/OtherBenefitsSection";

// Mock the List component
vi.mock("@/presentation/components/List", () => ({
    default: ({ items, type, className }: { items: string[]; type?: string; className?: string }) => (
        <ol data-testid="other-benefits-list" className={className}>
            {items.map((item, index) => (
                <li key={index} data-testid={`other-benefit-item-${index}`}>
                    {item}
                </li>
            ))}
        </ol>
    )
}));

describe("OtherBenefitsSection", () => {
    it("renders without crashing", () => {
        render(<OtherBenefitsSection />);
        expect(screen.getByTestId("other-benefits-list")).toBeInTheDocument();
    });

    it("renders the introduction paragraph", () => {
        render(<OtherBenefitsSection />);
        expect(screen.getByText(/Pichincha Miles podrá ofrecer alternativas adicionales/)).toBeInTheDocument();
        expect(screen.getByText(/acumular y\/o redimir sus Millas/)).toBeInTheDocument();
    });

    it("renders the conclusion paragraph", () => {
        render(<OtherBenefitsSection />);
        expect(screen.getByText(/Dichas campañas, incentivos u ofertas serán comunicadas/)).toBeInTheDocument();
        expect(screen.getByText(/se regirán por los términos y condiciones/)).toBeInTheDocument();
    });

    it("renders the list with correct props", () => {
        render(<OtherBenefitsSection />);
        const list = screen.getByTestId("other-benefits-list");
        expect(list).toHaveClass("pl-4", "base-paragraph", "font-medium", "leading-body-dropdown", "text-dropdown");
    });

    it("renders other benefit items", () => {
        render(<OtherBenefitsSection />);
        expect(screen.getByTestId("other-benefit-item-0")).toBeInTheDocument();
        expect(screen.getByTestId("other-benefit-item-3")).toBeInTheDocument();
    });

    it("contains other benefits content", () => {
        render(<OtherBenefitsSection />);
        expect(screen.getByText(/Sorteos/)).toBeInTheDocument();
        expect(screen.getByText(/Campañas especiales/)).toBeInTheDocument();
    });

    it("renders all 4 other benefits", () => {
        render(<OtherBenefitsSection />);
        expect(screen.getAllByTestId(/^other-benefit-item-/)).toHaveLength(4);
    });

    it("has correct container structure", () => {
        render(<OtherBenefitsSection />);
        const container = screen.getByTestId("other-benefits-list").parentElement;
        expect(container).toHaveClass("mb-4", "[&>p]:base-paragraph", "[&>p]:font-medium", "[&>p]:leading-body-dropdown", "[&>p]:text-dropdown");
    });
});
