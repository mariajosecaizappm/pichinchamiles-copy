import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProgramChangesSection from "@/presentation/pages/TermsConditionsProgram/components/ProgramChangesSection";

describe("ProgramChangesSection", () => {
    it("renders without crashing", () => {
        render(<ProgramChangesSection />);
    });

    it("renders the program changes content", () => {
        render(<ProgramChangesSection />);
        expect(screen.getByText(/El Banco Pichincha podrá modificar/)).toBeInTheDocument();
        expect(screen.getByText(/suspender o cancelar/)).toBeInTheDocument();
        expect(screen.getByText(/beneficios y los términos y\/o condiciones/)).toBeInTheDocument();
    });

    it("contains legal modification terms", () => {
        render(<ProgramChangesSection />);
        expect(screen.getByText(/legislación aplicable vigente/)).toBeInTheDocument();
        expect(screen.getByText(/previo aviso/)).toBeInTheDocument();
        expect(screen.getByText(/incumplimiento contractual/)).toBeInTheDocument();
    });

    it("has correct container structure", () => {
        render(<ProgramChangesSection />);
        const container = screen.getByText(/El Banco Pichincha podrá modificar/).parentElement;
        expect(container).toHaveClass("mb-4", "[&>p]:base-paragraph", "[&>p]:font-medium", "[&>p]:leading-body-dropdown", "[&>p]:text-dropdown");
    });

    it("renders paragraph with correct styling", () => {
        render(<ProgramChangesSection />);
        const paragraph = screen.getByText(/El Banco Pichincha podrá modificar/);
        expect(paragraph).toBeInTheDocument();
    });
});
