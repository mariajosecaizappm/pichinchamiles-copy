import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TravelsRedemptionSection from "@/presentation/pages/TermsConditionsProgram/components/TravelsRedemptionSection";

// Mock the List component
vi.mock("@/presentation/components/List", () => ({
    default: ({ items }: { items: string[] }) => (
        <ul data-testid="travels-redemption-list">
            {items.map((item, index) => (
                <li key={index} data-testid={`travel-condition-item-${index}`}>
                    {item}
                </li>
            ))}
        </ul>
    )
}));

describe("TravelsRedemptionSection", () => {
    it("renders without crashing", () => {
        render(<TravelsRedemptionSection />);
        expect(screen.getByTestId("travels-redemption-list")).toBeInTheDocument();
    });

    it("renders travel condition items", () => {
        render(<TravelsRedemptionSection />);
        expect(screen.getByTestId("travel-condition-item-0")).toBeInTheDocument();
        expect(screen.getByTestId("travel-condition-item-29")).toBeInTheDocument();
    });

    it("contains travel conditions content", () => {
        render(<TravelsRedemptionSection />);
        expect(screen.getByText("Pichincha Miles declara en forma explícita que obra únicamente como intermediario entre los viajeros y las entidades o personas llamadas a facilitar los servicios solicitados por sus clientes, es decir, empresas de transporte, hoteles, restaurantes, líneas aéreas y demás proveedores del servicio.")).toBeInTheDocument();
        expect(screen.getByText("Por lo anterior, Pichincha Miles no tiene responsabilidad por las deficiencias e incumplimientos en que pueda incurrir la empresa prestadora del servicio contratado, tales como retrasos, cambio o modificación de itinerarios y/o recorridos, pérdidas o daños en los equipajes o bienes, asignación de espacios en medios de transporte y en habitaciones hoteleras, cancelaciones intempestivas de reservas y otros incumplimientos, cualquiera sea su causa.")).toBeInTheDocument();
    });

    it("renders all 30 travel conditions", () => {
        render(<TravelsRedemptionSection />);
        expect(screen.getAllByTestId(/^travel-condition-item-/)).toHaveLength(30);
    });
});
