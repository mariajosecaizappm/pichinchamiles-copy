import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ShoppingCartPage from "@/app/carrito-de-compra/page";

vi.mock("@/presentation/pages/ShoppingCartDetail", () => ({
    default: () => <div data-testid="shopping-cart-container" />,
}));

describe("carrito-de-compra page", () => {
    it("renders ShoppingCartDetailContainer", () => {
        render(<ShoppingCartPage />);
        expect(screen.getByTestId("shopping-cart-container")).toBeInTheDocument();
    });
});
