import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ShoppingCartProductFeatureLine from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartProduct/components/ShoppingCartProductFeatureLine";

describe("ShoppingCartProductFeatureLine", () => {
    it("should render feature name and option", () => {
        render(<ShoppingCartProductFeatureLine feature={{ name: "Color", option: "Azul" }} />);

        expect(screen.getByText("Color:", { exact: false })).toBeInTheDocument();
        expect(screen.getByText("Azul")).toBeInTheDocument();
    });
});
