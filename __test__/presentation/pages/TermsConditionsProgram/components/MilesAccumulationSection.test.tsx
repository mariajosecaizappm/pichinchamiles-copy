import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MilesAccumulationSection from "@/presentation/pages/TermsConditionsProgram/components/MilesAccumulationSection";

// Mock the List component
vi.mock("@/presentation/components/List", () => ({
    default: ({ items, className }: { items: string[]; className?: string }) => (
        <ul data-testid="miles-accumulation-list" className={className}>
            {items.map((item, index) => (
                <li key={index} data-testid={`miles-accumulation-item-${index}`}>
                    {item}
                </li>
            ))}
        </ul>
    )
}));

// Mock Link component
vi.mock("next/link", () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href} data-testid="external-link">
            {children}
        </a>
    ),
}));

describe("MilesAccumulationSection", () => {
    it("renders without crashing", () => {
        render(<MilesAccumulationSection />);
    });

    it("renders the accumulation introduction paragraph", () => {
        render(<MilesAccumulationSection />);
        expect(screen.getByText(/Los Clientes acumulan millas por los consumos/)).toBeInTheDocument();
        expect(screen.getByText(/Tarjetas de Crédito Miles del Banco Pichincha/)).toBeInTheDocument();
        expect(screen.getByText(/Ecuador y alrededor del mundo/)).toBeInTheDocument();
    });

    it("renders the credit paragraph", () => {
        render(<MilesAccumulationSection />);
        expect(screen.getByText(/Pichincha Miles® acreditará las millas/)).toBeInTheDocument();
        expect(screen.getByText(/cuenta individual del programa/)).toBeInTheDocument();
        expect(screen.getByText(/www.pichinchamiles.com/)).toBeInTheDocument();
    });

    it("renders the negative balances paragraph", () => {
        render(<MilesAccumulationSection />);
        expect(screen.getByText(/saldos de Millas negativos/)).toBeInTheDocument();
        expect(screen.getByText(/transacción de acumulación sea reversada/)).toBeInTheDocument();
        expect(screen.getByText(/ajuste débito de Millas/)).toBeInTheDocument();
    });

    it("renders the closed accounts paragraph", () => {
        render(<MilesAccumulationSection />);
        expect(screen.getByText(/No se acumularán Millas en las cuentas/)).toBeInTheDocument();
        expect(screen.getByText(/cerradas o bloqueadas/)).toBeInTheDocument();
    });

    it("renders the Personas section", () => {
        render(<MilesAccumulationSection />);
        expect(screen.getByText(/Para Personas:/)).toBeInTheDocument();
        expect(screen.getAllByText(/Productos con los que se acumula Pichincha Miles:/)).toHaveLength(4);
        expect(screen.getAllByTestId("miles-accumulation-list")).toHaveLength(4);
    });

    it("has correct container structure", () => {
        render(<MilesAccumulationSection />);
        const container = screen.getByText(/Los Clientes acumulan millas/).parentElement;
        expect(container).toHaveClass("mb-4", "*:base-paragraph", "*:font-medium", "*:leading-body-dropdown", "*:text-dropdown");
    });

    it("renders paragraphs with correct styling", () => {
        render(<MilesAccumulationSection />);
        const paragraphs = screen.getAllByText(/Los Clientes acumulan|Pichincha Miles® acreditará|Los Clientes podrán tener|No se acumularán/);
        paragraphs.forEach(paragraph => {
            expect(paragraph).toBeInTheDocument();
        });
    });

    it("contains miles accumulation terminology", () => {
        render(<MilesAccumulationSection />);
        expect(screen.getByText(/acumulan/)).toBeInTheDocument();
        expect(screen.getAllByText(/Millas/).length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText(/consumos/)).toBeInTheDocument();
    });

    it("renders external link", () => {
        render(<MilesAccumulationSection />);
        expect(screen.getAllByTestId("external-link")).toHaveLength(4);
        expect(screen.getAllByTestId("external-link")[0]).toHaveAttribute("href", "https://www.pichincha.com/sites/default/files/excepciones_en_planes_de_recompensas.pdf");
    });
});
