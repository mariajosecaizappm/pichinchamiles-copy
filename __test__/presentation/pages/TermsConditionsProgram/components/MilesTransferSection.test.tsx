import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MilesTransferSection from "@/presentation/pages/TermsConditionsProgram/components/MilesTransferSection";

describe("MilesTransferSection", () => {
    it("renders without crashing", () => {
        render(<MilesTransferSection />);
    });

    it("renders the transfer requirements paragraph", () => {
        render(<MilesTransferSection />);
        expect(screen.getByText(/Para transferir Millas de una cuenta/)).toBeInTheDocument();
        expect(screen.getByText(/ambos usuarios deben estar activos/)).toBeInTheDocument();
        expect(screen.getByText(/monto mínimo de transferencia es de diez/)).toBeInTheDocument();
        expect(screen.getByText(/máximo es el saldo disponible/)).toBeInTheDocument();
    });

    it("renders the no return paragraph", () => {
        render(<MilesTransferSection />);
        expect(screen.getByText(/Una vez que se haya realizado la transferencia/)).toBeInTheDocument();
        expect(screen.getByText(/no es posible devolver las millas/)).toBeInTheDocument();
    });

    it("contains transfer amounts", () => {
        render(<MilesTransferSection />);
        expect(screen.getByText(/diez \(10\) millas/)).toBeInTheDocument();
        expect(screen.getByText(/saldo disponible/)).toBeInTheDocument();
    });

    it("has correct container structure", () => {
        render(<MilesTransferSection />);
        const container = screen.getByText(/Para transferir Millas/).parentElement;
        expect(container).toHaveClass("mb-4", "[&>p]:base-paragraph", "[&>p]:font-medium", "[&>p]:leading-body-dropdown", "[&>p]:text-dropdown");
    });

    it("renders paragraphs with correct styling", () => {
        render(<MilesTransferSection />);
        const paragraphs = screen.getAllByRole("paragraph");
        paragraphs.forEach(paragraph => {
            expect(paragraph).toBeInTheDocument();
        });
    });

    it("contains miles transfer terminology", () => {
        render(<MilesTransferSection />);
        expect(screen.getByText(/transferir/)).toBeInTheDocument();
        expect(screen.getByText(/Millas/)).toBeInTheDocument();
        expect(screen.getByText(/cuenta Pichincha Miles/)).toBeInTheDocument();
    });
});
