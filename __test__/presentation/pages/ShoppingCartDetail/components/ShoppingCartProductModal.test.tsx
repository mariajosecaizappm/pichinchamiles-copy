import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ShoppingCartProductModal from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartProductModal/ShoppingCartProductModal";

vi.mock("@/presentation/components/Modal/Modal", () => ({
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="modal">{children}</div>
    ),
}));

vi.mock(
    "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartProductModal/ShoppingCartProductModalContent",
    () => ({
        default: ({ title }: { title: string }) => <div>{title}</div>,
    })
);

describe("ShoppingCartProductModal", () => {
    it("should not render without changed items", () => {
        const basketState = {
            changedBasketItems: null,
            clearChangedBasketItems: vi.fn(),
        } as any;
        const { container } = render(<ShoppingCartProductModal basketState={basketState} />);
        expect(container).toBeEmptyDOMElement();
    });

    it("should not render when changed item lists are empty", () => {
        const basketState = {
            changedBasketItems: {
                changedStockProducts: [],
                changedPriceProducts: [],
                disabledProducts: [],
            },
            clearChangedBasketItems: vi.fn(),
        } as any;
        const { container } = render(<ShoppingCartProductModal basketState={basketState} />);
        expect(container).toBeEmptyDOMElement();
    });

    it("should render stock modal when stock changed products exist", () => {
        const basketState = {
            changedBasketItems: {
                changedStockProducts: [{ id: "1" }],
                changedPriceProducts: [],
                disabledProducts: [],
            },
            clearChangedBasketItems: vi.fn(),
        } as any;

        render(<ShoppingCartProductModal basketState={basketState} />);

        expect(screen.getByTestId("modal")).toBeInTheDocument();
        expect(screen.getByText("Actualización de stock")).toBeInTheDocument();
    });

    it("should render price modal when only price changed products exist", () => {
        const basketState = {
            changedBasketItems: {
                changedStockProducts: [],
                changedPriceProducts: [{ id: "1" }],
                disabledProducts: [],
            },
            clearChangedBasketItems: vi.fn(),
        } as any;

        render(<ShoppingCartProductModal basketState={basketState} />);

        expect(screen.getByText("Actualización de precio")).toBeInTheDocument();
    });

    it("should render disabled modal when only disabled products exist", () => {
        const basketState = {
            changedBasketItems: {
                changedStockProducts: [],
                changedPriceProducts: [],
                disabledProducts: [{ id: "1" }],
            },
            clearChangedBasketItems: vi.fn(),
        } as any;

        render(<ShoppingCartProductModal basketState={basketState} />);

        expect(screen.getByText("Producto desactivado")).toBeInTheDocument();
    });

    it("should prioritize stock modal over price and disabled products", () => {
        const basketState = {
            changedBasketItems: {
                changedStockProducts: [{ id: "1" }],
                changedPriceProducts: [{ id: "2" }],
                disabledProducts: [{ id: "3" }],
            },
            clearChangedBasketItems: vi.fn(),
        } as any;

        render(<ShoppingCartProductModal basketState={basketState} />);

        expect(screen.getByText("Actualización de stock")).toBeInTheDocument();
        expect(screen.queryByText("Actualización de precio")).not.toBeInTheDocument();
    });
});
