import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import IrrevocableMandateSection from "@/presentation/pages/TermsConditionsProgram/components/IrrevocableMandateSection";

describe("IrrevocableMandateSection", () => {
    it("renders without crashing", () => {
        render(<IrrevocableMandateSection />);
    });

    it("renders the mandate authorization paragraph", () => {
        render(<IrrevocableMandateSection />);
        expect(screen.getByText(/Por medio del presente documento/)).toBeInTheDocument();
        expect(screen.getByText(/confiere mandato irrevocable/)).toBeInTheDocument();
        expect(screen.getByText(/a favor de Pichincha Miles/)).toBeInTheDocument();
        expect(screen.getByText(/reciba a nombre del cliente/)).toBeInTheDocument();
    });

    it("renders the document types", () => {
        render(<IrrevocableMandateSection />);
        expect(screen.getByText(/facturas/)).toBeInTheDocument();
        expect(screen.getByText(/notas de venta/)).toBeInTheDocument();
        expect(screen.getByText(/tickets/)).toBeInTheDocument();
        expect(screen.getByText(/soportes físicos o electrónicos/)).toBeInTheDocument();
    });

    it("renders the additional authorization paragraph", () => {
        render(<IrrevocableMandateSection />);
        expect(screen.getByText(/Adicionalmente, el cliente autoriza/)).toBeInTheDocument();
        expect(screen.getByText(/expresa e irrevocablemente/)).toBeInTheDocument();
    });

    it("contains legal terminology", () => {
        render(<IrrevocableMandateSection />);
        expect(screen.getByText(/mandato irrevocable/)).toBeInTheDocument();
        expect(screen.getByText(/acreditación de millas/)).toBeInTheDocument();
        expect(screen.getByText(/adquisición de los bienes o servicios/)).toBeInTheDocument();
    });

    it("has correct container structure", () => {
        render(<IrrevocableMandateSection />);
        const container = screen.getByText(/Por medio del presente documento/).parentElement;
        expect(container).toHaveClass("mb-4", "[&>p]:base-paragraph", "[&>p]:font-medium", "[&>p]:leading-body-dropdown", "[&>p]:text-dropdown");
    });

    it("renders paragraphs with correct styling", () => {
        render(<IrrevocableMandateSection />);
        const paragraphs = screen.getAllByRole("paragraph");
        paragraphs.forEach(paragraph => {
            expect(paragraph).toBeInTheDocument();
        });
    });
});
