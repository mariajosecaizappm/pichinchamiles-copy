import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MilesRedemptionSection from "@/presentation/pages/TermsConditionsProgram/components/MilesRedemptionSection";

describe("MilesRedemptionSection", () => {
    it("renders without crashing", () => {
        render(<MilesRedemptionSection />);
    });

    it("renders the redemption introduction paragraph", () => {
        render(<MilesRedemptionSection />);
        expect(screen.getByText(/El Cliente podrá redimir o canjear sus Millas/)).toBeInTheDocument();
        expect(screen.getByText(/productos y\/o servicios/)).toBeInTheDocument();
        expect(screen.getByText(/registrado o activado en Pichincha Miles/)).toBeInTheDocument();
    });

    it("renders the website redemption paragraph", () => {
        render(<MilesRedemptionSection />);
        expect(screen.getByText(/La redención de Millas podrá realizarse/)).toBeInTheDocument();
        expect(screen.getByText(/www.pichinchamiles.com/)).toBeInTheDocument();
    });

    it("renders the information maintenance paragraph", () => {
        render(<MilesRedemptionSection />);
        expect(screen.getByText(/mediante la página web u otros medios/)).toBeInTheDocument();
        expect(screen.getByText(/mantendrá informados a los clientes/)).toBeInTheDocument();
        expect(screen.getByText(/posibilidades de adquisición/)).toBeInTheDocument();
    });

    it("renders the cash redemption restriction", () => {
        render(<MilesRedemptionSection />);
        expect(screen.getByText(/Las millas no podrán ser redimidas/)).toBeInTheDocument();
        expect(screen.getByText(/en ninguna circunstancia, por dinero en efectivo/)).toBeInTheDocument();
    });

    it("has correct container structure", () => {
        render(<MilesRedemptionSection />);
        const container = screen.getByText(/El Cliente podrá redimir o canjear sus Millas/).parentElement;
        expect(container).toHaveClass("mb-4", "[&>p]:base-paragraph", "[&>p]:font-medium", "[&>p]:leading-body-dropdown", "[&>p]:text-dropdown");
    });

    it("renders all paragraphs with correct styling", () => {
        render(<MilesRedemptionSection />);
        const paragraphs = screen.getAllByRole("paragraph");
        paragraphs.forEach(paragraph => {
            expect(paragraph).toBeInTheDocument();
        });
    });

    it("contains miles redemption terminology", () => {
        render(<MilesRedemptionSection />);
        expect(screen.getByText("El Cliente podrá redimir o canjear sus Millas acumuladas por productos y/o servicios, una vez este registrado o activado en Pichincha Miles®.")).toBeInTheDocument();
        expect(screen.getByText("La redención de Millas podrá realizarse a través de la página web www.pichinchamiles.com")).toBeInTheDocument();
        expect(screen.getByText("Las millas no podrán ser redimidas, en ninguna circunstancia, por dinero en efectivo.")).toBeInTheDocument();
    });
});
