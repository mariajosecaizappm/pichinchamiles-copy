import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MilesNullitySection from "@/presentation/pages/TermsConditionsProgram/components/MilesNullitySection";

// Mock the List component
vi.mock("@/presentation/components/List", () => ({
    default: ({ items, type, className }: { items: string[]; type?: string; className?: string }) => (
        <ol data-testid="miles-nullity-list" className={className}>
            {items.map((item, index) => (
                <li key={index} data-testid={`miles-nullity-item-${index}`}>
                    {item}
                </li>
            ))}
        </ol>
    )
}));

describe("MilesNullitySection", () => {
    it("renders without crashing", () => {
        render(<MilesNullitySection />);
        expect(screen.getByTestId("miles-nullity-list")).toBeInTheDocument();
    });

    it("renders the introduction paragraphs", () => {
        render(<MilesNullitySection />);
        expect(screen.getByText(/A partir del 1 de enero de 2024/)).toBeInTheDocument();
        expect(screen.getByText(/estarán sujetas a las condiciones de nulidad/)).toBeInTheDocument();
    });

    it("renders information about old credit cards", () => {
        render(<MilesNullitySection />);
        expect(screen.getByText(/tarjetas de crédito emitidas antes de la fecha/)).toBeInTheDocument();
        expect(screen.getByText(/no tendrán alteración/)).toBeInTheDocument();
    });

    it("renders information about miles debiting", () => {
        render(<MilesNullitySection />);
        expect(screen.getByText(/se debitarán de la cuenta del Cliente/)).toBeInTheDocument();
        expect(screen.getByText(/mayor antigüedad/)).toBeInTheDocument();
    });

    it("renders information about non-reimbursable miles", () => {
        render(<MilesNullitySection />);
        expect(screen.getByText(/no podrán ser reintegrados/)).toBeInTheDocument();
        expect(screen.getByText(/por ningún motivo/)).toBeInTheDocument();
    });

    it("renders the list with correct props", () => {
        render(<MilesNullitySection />);
        const list = screen.getByTestId("miles-nullity-list");
        expect(list).toHaveClass("pl-4", "base-paragraph", "font-medium", "leading-body-dropdown", "text-dropdown", "mb-4");
    });

    it("renders miles nullity items", () => {
        render(<MilesNullitySection />);
        expect(screen.getByTestId("miles-nullity-item-0")).toBeInTheDocument();
        expect(screen.getByTestId("miles-nullity-item-6")).toBeInTheDocument();
    });

    it("contains miles nullity content", () => {
        render(<MilesNullitySection />);
        expect(screen.getByText(/cancelado por decisión voluntaria/)).toBeInTheDocument();
        expect(screen.getByText(/inactividad del uso/)).toBeInTheDocument();
    });

    it("renders all 7 miles nullity conditions", () => {
        render(<MilesNullitySection />);
        expect(screen.getAllByTestId(/^miles-nullity-item-/)).toHaveLength(7);
    });

    it("has correct container structure", () => {
        render(<MilesNullitySection />);
        const container = screen.getByTestId("miles-nullity-list").parentElement;
        expect(container).toHaveClass("mb-4", "[&>p]:base-paragraph", "[&>p]:font-medium", "[&>p]:leading-body-dropdown", "[&>p]:text-dropdown");
    });
});
