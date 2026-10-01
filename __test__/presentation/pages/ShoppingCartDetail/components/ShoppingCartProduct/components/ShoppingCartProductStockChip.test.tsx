import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ShoppingCartProductStockChip from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartProduct/components/ShoppingCartProductStockChip";

describe("ShoppingCartProductStockChip", () => {
    it("should render stock count when stock is greater than zero", () => {
        render(<ShoppingCartProductStockChip stock={5} />);

        expect(screen.getByText("5 en stock")).toBeInTheDocument();
    });

    it("should render unavailable label when stock is zero", () => {
        render(<ShoppingCartProductStockChip stock={0} />);

        expect(screen.getByText("No disponible")).toBeInTheDocument();
    });
});
