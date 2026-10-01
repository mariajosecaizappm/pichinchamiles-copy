import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ShoppingCartProductsList from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartProductsList";

const mockProduct = vi.fn();

vi.mock(
    "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartProduct",
    () => ({
        default: (props: any) => {
            mockProduct(props);
            return <div data-testid={`product-${props.item.id}`}>{props.item.id}</div>;
        },
    })
);

describe("ShoppingCartProductsList", () => {
    it("should render one ShoppingCartProduct per item", () => {
        const basketState = {
            items: [{ id: "1" }, { id: "2" }],
            isLoading: false,
            getMaxQuantity: (id: string) => (id === "1" ? 4 : 2),
            onRemoveItem: vi.fn(),
            onChangeQuantity: vi.fn(),
        } as any;

        render(<ShoppingCartProductsList basketState={basketState} />);

        expect(screen.getByTestId("product-1")).toBeInTheDocument();
        expect(screen.getByTestId("product-2")).toBeInTheDocument();
        expect(mockProduct).toHaveBeenCalledTimes(2);
        expect(mockProduct.mock.calls[0][0]).toMatchObject({
            item: { id: "1" },
            isLoading: false,
            maxQuantity: 4,
        });
        expect(mockProduct.mock.calls[1][0]).toMatchObject({
            item: { id: "2" },
            maxQuantity: 2,
        });
    });
});

