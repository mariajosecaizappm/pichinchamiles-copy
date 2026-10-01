import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ValiditySection from "@/presentation/pages/TermsConditionsProgram/components/ValiditySection";

// Mock the List component
vi.mock("@/presentation/components/List", () => ({
    default: ({ items, type, className }: { items: string[]; type?: string; className?: string }) => (
        <ol data-testid="validity-data-list" className={className}>
            {items.map((item, index) => (
                <li key={index} data-testid={`validity-data-item-${index}`}>
                    {item}
                </li>
            ))}
        </ol>
    )
}));

describe("ValiditySection", () => {
    it("renders without crashing", () => {
        render(<ValiditySection />);
        expect(screen.getByTestId("validity-data-list")).toBeInTheDocument();
    });

    it("renders the membership validity paragraph", () => {
        render(<ValiditySection />);
        expect(screen.getByText(/El plazo de vigencia de la membresía es de un año/)).toBeInTheDocument();
        expect(screen.getByText(/fecha de registro en el Programa Pichincha Miles/)).toBeInTheDocument();
        expect(screen.getByText(/renovado de manera automática/)).toBeInTheDocument();
    });

    it("renders the account closure conditions paragraph", () => {
        render(<ValiditySection />);
        expect(screen.getByText(/Una cuenta Pichincha Miles podrá ser cerrada o cancelada/)).toBeInTheDocument();
        expect(screen.getByText(/bajo las siguientes condiciones/)).toBeInTheDocument();
    });

    it("renders the miles usage paragraph", () => {
        render(<ValiditySection />);
        expect(screen.getByText(/En los casos indicados las millas acumuladas/)).toBeInTheDocument();
        expect(screen.getByText(/podrán ser utilizadas o transferidas/)).toBeInTheDocument();
        expect(screen.getByText(/hasta 180 días posteriores al cierre/)).toBeInTheDocument();
    });

    it("renders the list with correct props", () => {
        render(<ValiditySection />);
        const list = screen.getByTestId("validity-data-list");
        expect(list).toHaveClass("pl-4", "base-paragraph", "font-medium", "leading-body-dropdown", "text-dropdown");
    });

    it("renders validity data items", () => {
        render(<ValiditySection />);
        expect(screen.getByTestId("validity-data-item-0")).toBeInTheDocument();
        expect(screen.getByTestId("validity-data-item-2")).toBeInTheDocument();
    });

    it("contains validity data content", () => {
        render(<ValiditySection />);
        expect(screen.getByText(/fallecimiento del titular/)).toBeInTheDocument();
        expect(screen.getByText(/cancelación voluntaria/)).toBeInTheDocument();
    });

    it("renders all 3 validity data items", () => {
        render(<ValiditySection />);
        expect(screen.getAllByTestId(/^validity-data-item-/)).toHaveLength(3);
    });

    it("has correct container structure", () => {
        render(<ValiditySection />);
        const container = screen.getByTestId("validity-data-list").parentElement;
        expect(container).toHaveClass("mb-4", "[&>p]:base-paragraph", "[&>p]:font-medium", "[&>p]:leading-body-dropdown", "[&>p]:text-dropdown");
    });
});
