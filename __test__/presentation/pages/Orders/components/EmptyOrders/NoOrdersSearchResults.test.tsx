import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import NoOrdersSearchResults from "@/presentation/pages/Orders/components/EmptyOrders/NoOrdersSearchResults";

describe("NoOrdersSearchResults", () => {
    it("renders search icon", () => {
        const { container } = render(<NoOrdersSearchResults />);

        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute("width", "24");
        expect(svg).toHaveAttribute("height", "24");
    });

    it("renders no results message", () => {
        render(<NoOrdersSearchResults />);

        expect(
            screen.getByText("No se encontraron resultados")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Intenta con otro termino de búsqueda")
        ).toBeInTheDocument();
    });

    it("applies correct container styling", () => {
        const { container } = render(<NoOrdersSearchResults />);

        const mainContainer = container.querySelector(".flex.flex-col.gap-1");
        expect(mainContainer).toBeInTheDocument();
        expect(mainContainer).toHaveClass(
            "p-4",
            "rounded-lg",
            "border",
            "border-information-100"
        );
    });

    it("renders icon container with correct styling", () => {
        const { container } = render(<NoOrdersSearchResults />);

        const iconContainer = container.querySelector(".w-6.h-6");
        expect(iconContainer).toBeInTheDocument();
        expect(iconContainer).toHaveClass("aspect-square");
    });
});
