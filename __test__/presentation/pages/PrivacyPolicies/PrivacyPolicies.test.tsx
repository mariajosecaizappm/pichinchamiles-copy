import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PrivacyPolicies from "@/presentation/pages/PrivacyPolicies/PrivacyPolicies";

vi.mock("@/presentation/components/Layout/LegalConditionsLayout", () => ({
    default: ({ children, title }: { children: React.ReactNode; title: string }) => (
        <div data-testid="legal-conditions-layout">
            <h1 data-testid="page-title">{title}</h1>
            {children}
        </div>
    )
}));

describe("PrivacyPolicies", () => {
    it("renders without crashing", () => {
        render(<PrivacyPolicies />);
        expect(screen.getByTestId("legal-conditions-layout")).toBeInTheDocument();
    });

    it("renders the correct title", () => {
        render(<PrivacyPolicies />);
        expect(screen.getByTestId("page-title")).toHaveTextContent("Políticas de privacidad en Internet");
    });

    it("renders the introduction paragraph", () => {
        render(<PrivacyPolicies />);
        expect(screen.getByText(/Bienvenido al sitio WEB de/)).toBeInTheDocument();
        expect(screen.getByText("Pichincha Miles")).toBeInTheDocument();
    });

    it("renders security commitment paragraph", () => {
        render(<PrivacyPolicies />);
        expect(screen.getByText(/Estamos comprometidos en proteger su información/)).toBeInTheDocument();
        expect(screen.getByText(/codificación de datos/)).toBeInTheDocument();
        expect(screen.getByText(/firewalls/)).toBeInTheDocument();
    });

    it("renders information access paragraph", () => {
        render(<PrivacyPolicies />);
        expect(screen.getByText(/Al visitar nuestro sitio web Usted puede encontrar información/)).toBeInTheDocument();
        expect(screen.getByText(/necesidad de que nos proporcione información/)).toBeInTheDocument();
    });

    it("renders data security paragraph", () => {
        render(<PrivacyPolicies />);
        expect(screen.getByText(/La información que ingresa en nuestra página se mantiene/)).toBeInTheDocument();
        expect(screen.getByText(/estándares de seguridad/)).toBeInTheDocument();
        expect(screen.getByText(/estricta confidencialidad/)).toBeInTheDocument();
    });

    it("renders personal information protection paragraph", () => {
        render(<PrivacyPolicies />);
        expect(screen.getByText(/De proporcionarnos información adicional/)).toBeInTheDocument();
        expect(screen.getByText(/dirección, correo electrónico/)).toBeInTheDocument();
        expect(screen.getByText(/no será revelada a terceros/)).toBeInTheDocument();
    });

    it("renders Microsoft Clarity paragraph", () => {
        render(<PrivacyPolicies />);
        expect(screen.getByText(/Nos asociamos con Microsoft Clarity/)).toBeInTheDocument();
        expect(screen.getByText(/métricas de comportamiento/)).toBeInTheDocument();
        expect(screen.getByText(/mapas de calor/)).toBeInTheDocument();
    });

    it("renders Microsoft privacy link", () => {
        render(<PrivacyPolicies />);
        const link = screen.getByText("aquí");
        expect(link).toBeInTheDocument();
        expect(link.closest("a")).toHaveAttribute("href", "https://privacy.microsoft.com/es-es/privacystatement");
        expect(link.closest("a")).toHaveAttribute("target", "_blank");
    });

    it("contains all privacy policy keywords", () => {
        render(<PrivacyPolicies />);
        expect(screen.getAllByText(/seguridad/).length).toBeGreaterThan(0);
        expect(screen.getByText(/confidencialidad/)).toBeInTheDocument();
        expect(screen.getAllByText(/codificación/).length).toBeGreaterThan(0);
        expect(screen.getByText(/cookies/)).toBeInTheDocument();
    });

    it("renders all paragraphs", () => {
        render(<PrivacyPolicies />);
        const paragraphs = screen.getAllByRole("paragraph");
        expect(paragraphs.length).toBe(6);
    });
});
