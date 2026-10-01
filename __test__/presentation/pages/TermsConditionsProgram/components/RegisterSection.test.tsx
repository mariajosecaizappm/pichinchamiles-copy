import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RegisterSection from "@/presentation/pages/TermsConditionsProgram/components/RegisterSection";

// Mock the List component
vi.mock("@/presentation/components/List", () => ({
    default: ({ items, type, className }: { items: string[]; type?: string; className?: string }) => (
        <ol data-testid="register-data-list" className={className}>
            {items.map((item, index) => (
                <li key={index} data-testid={`register-data-item-${index}`}>
                    {item}
                </li>
            ))}
        </ol>
    )
}));

describe("RegisterSection", () => {
    it("renders without crashing", () => {
        render(<RegisterSection />);
        expect(screen.getByTestId("register-data-list")).toBeInTheDocument();
    });

    it("renders the introduction paragraph about credit card", () => {
        render(<RegisterSection />);
        expect(screen.getByText(/El registro en el programa aplica para Clientes/)).toBeInTheDocument();
        expect(screen.getByText(/Tarjeta de Crédito Pichincha Miles activa/)).toBeInTheDocument();
    });

    it("renders the terms acceptance paragraph", () => {
        render(<RegisterSection />);
        expect(screen.getByText("Con el registro en el programa el Cliente declara que conoce y acepta los siguientes términos y condiciones, así mismo tendrá derecho a los beneficios de Pichincha Miles con base en los convenios que para el efecto suscriba el Programa en calidad de administrador, con las sociedades o individuos que forman parte del Programa de recompensas.")).toBeInTheDocument();
    });

    it("renders the website registration paragraph", () => {
        render(<RegisterSection />);
        expect(screen.getByText("El canal habilitado para el registro o activación en el programa es la página web www.pichinchamiles.com. La cuenta creada por cada Cliente es personal e intransferible.")).toBeInTheDocument();
    });

    it("renders the publicity authorization paragraph", () => {
        render(<RegisterSection />);
        expect(screen.getByText("Cuando el cliente sea acreedor de algún tipo de premio o beneficio otorgado por el Pichincha Miles con motivo de alguna campaña promocional, autoriza al programa para publicar su nombre y el beneficio recibido en cualquier medio publicitario, sin lugar a ningún tipo de compensación y sin que sea necesario requerir de alguna autorización adicional.")).toBeInTheDocument();
    });

    it("renders the commitment paragraph", () => {
        render(<RegisterSection />);
        expect(screen.getByText(/El cliente que se registre en el Programa se compromete/)).toBeInTheDocument();
    });

    it("renders the list with correct props", () => {
        render(<RegisterSection />);
        const list = screen.getByTestId("register-data-list");
        expect(list).toHaveClass("pl-4", "base-paragraph", "font-medium", "leading-body-dropdown", "text-dropdown");
    });

    it("renders register data items", () => {
        render(<RegisterSection />);
        expect(screen.getByTestId("register-data-item-0")).toBeInTheDocument();
        expect(screen.getByTestId("register-data-item-3")).toBeInTheDocument();
    });

    it("contains register data content", () => {
        render(<RegisterSection />);
        expect(screen.getByText(/Es responsabilidad de todos los clientes/)).toBeInTheDocument();
        expect(screen.getByText(/débito recurrente/)).toBeInTheDocument();
    });

    it("renders all 4 register data items", () => {
        render(<RegisterSection />);
        expect(screen.getAllByTestId(/^register-data-item-/)).toHaveLength(4);
    });

    it("has correct container structure", () => {
        render(<RegisterSection />);
        const container = screen.getByTestId("register-data-list").parentElement;
        expect(container).toHaveClass("mb-4", "mr-6", "[&>p]:base-paragraph", "[&>p]:font-medium", "[&>p]:leading-body-dropdown", "[&>p]:text-dropdown");
    });
});
