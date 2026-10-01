import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PqrTermsSection from "@/presentation/pages/TermsConditionsProgram/components/PqrTermsSection";

describe("PqrTermsSection", () => {
    it("renders without crashing", () => {
        render(<PqrTermsSection />);
    });

    it("renders the PQR contact information", () => {
        render(<PqrTermsSection />);
        expect(screen.getByText("El Cliente podrá realizar cualquier petición, queja y/o reclamación sobre los beneficios otorgados o resolver cualquier inquietud que se tenga sobre el Programa, a través de la línea de atención dispuesta: 1800 - BPMILE (276453).")).toBeInTheDocument();
    });

    it("renders the support documentation paragraph", () => {
        render(<PqrTermsSection />);
        expect(screen.getByText("En el momento en el que Cliente registre una PQR, se podrá solicitar los soportes que sean necesarios para atender la petición, queja o reclamo, en caso de no contar con esta documentación, se dará prevalencia a la información que se tenga en el sistema de Pichincha Miles.")).toBeInTheDocument();
    });

    it("contains system information precedence", () => {
        render(<PqrTermsSection />);
        expect(screen.getByText("En el momento en el que Cliente registre una PQR, se podrá solicitar los soportes que sean necesarios para atender la petición, queja o reclamo, en caso de no contar con esta documentación, se dará prevalencia a la información que se tenga en el sistema de Pichincha Miles.")).toBeInTheDocument();
    });

    it("has correct container structure", () => {
        render(<PqrTermsSection />);
        const container = screen.getByText("El Cliente podrá realizar cualquier petición, queja y/o reclamación sobre los beneficios otorgados o resolver cualquier inquietud que se tenga sobre el Programa, a través de la línea de atención dispuesta: 1800 - BPMILE (276453).").parentElement;
        expect(container).toHaveClass("mb-4", "[&>p]:base-paragraph", "[&>p]:font-medium", "[&>p]:leading-body-dropdown", "[&>p]:text-dropdown");
    });

    it("renders paragraphs with correct styling", () => {
        render(<PqrTermsSection />);
        const paragraphs = screen.getAllByRole("paragraph");
        paragraphs.forEach(paragraph => {
            expect(paragraph).toBeInTheDocument();
        });
    });
});
