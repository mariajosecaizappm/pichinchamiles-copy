import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProductsRedemptionSection from "@/presentation/pages/TermsConditionsProgram/components/ProductsRedemptionSection";

// Mock the List component
vi.mock("@/presentation/components/List", () => ({
    default: ({ items }: { items: string[] }) => (
        <ul data-testid="products-redemption-list">
            {items.map((item, index) => (
                <li key={index} data-testid={`product-redemption-item-${index}`}>
                    {item}
                </li>
            ))}
        </ul>
    )
}));

describe("ProductsRedemptionSection", () => {
    it("renders without crashing", () => {
        render(<ProductsRedemptionSection />);
        expect(screen.getByTestId("products-redemption-list")).toBeInTheDocument();
    });

    it("renders products redemption items", () => {
        render(<ProductsRedemptionSection />);
        expect(screen.getByTestId("product-redemption-item-0")).toBeInTheDocument();
        expect(screen.getByTestId("product-redemption-item-12")).toBeInTheDocument();
    });

    it("contains products redemption content", () => {
        render(<ProductsRedemptionSection />);
        expect(screen.getByText("Pichincha Miles® declara en forma explícita que obra únicamente como intermediario entre el cliente y los diferentes proveedores de los bienes y servicios que consten en el Programa.")).toBeInTheDocument();
        expect(screen.getByText("Por lo anterior, Pichincha Miles® no tiene responsabilidad por los incumplimientos en que puedan incurrir los proveedores de los bienes y servicios; sin embargo, realizará las gestiones que consideré pertinentes para la entrega del producto o servicio solicitado por parte del cliente.")).toBeInTheDocument();
    });

    it("renders all 13 products redemption terms", () => {
        render(<ProductsRedemptionSection />);
        expect(screen.getAllByTestId(/^product-redemption-item-/)).toHaveLength(13);
    });
});
