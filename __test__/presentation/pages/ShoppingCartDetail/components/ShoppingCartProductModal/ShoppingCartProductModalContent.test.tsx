import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PaymentMethod } from "@/domain/entity/Payment/payment";
import { ProductType } from "@/domain/entity/Product/product";
import { BasketItem } from "@/domain/entity/Basket/structure/basket";
import ShoppingCartProductModalContent from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartProductModal/ShoppingCartProductModalContent";

vi.mock(
    "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartProductModal/ShoppingCartProductModalItem",
    () => ({
        default: ({ basketItem }: { basketItem: BasketItem }) => (
            <li data-testid={`modal-item-${basketItem.id}`}>{basketItem.variationInfo.productName}</li>
        ),
    })
);

const basketItem: BasketItem = {
    id: "item-1",
    storeId: "store",
    supplierId: "supplier",
    productId: "product",
    variationId: "variation",
    categoryId: "cat",
    quantity: 1,
    brandName: "Truper",
    categoryName: "Herramientas",
    paymentMethod: PaymentMethod.POINTS,
    productType: ProductType.PHYSICAL_PRODUCT,
    description: "desc",
    slug: "slug",
    options: [],
    variationInfo: {
        productName: "Podadora",
        productSlug: "podadora",
        stock: 6,
        price: 10,
        pointsPrice: 48234,
        taxes: 15,
        assets: [],
        features: [],
    },
    paymentTypes: { points: { currencyId: "pts", amount: 48234 } },
};

describe("ShoppingCartProductModalContent", () => {
    it("should render modal content and basket items", () => {
        render(
            <ShoppingCartProductModalContent
                title="Actualización de precio"
                description="Los siguientes productos han sido actualizados con un nuevo precio."
                icon={<span data-testid="modal-icon">icon</span>}
                basketItems={[basketItem]}
                onUpdateShoppingCart={vi.fn()}
            />
        );

        expect(screen.getByText("Actualización de precio")).toBeInTheDocument();
        expect(
            screen.getByText("Los siguientes productos han sido actualizados con un nuevo precio.")
        ).toBeInTheDocument();
        expect(screen.getByTestId("modal-icon")).toBeInTheDocument();
        expect(screen.getByTestId("modal-item-item-1")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Actualizar carrito" })).toBeInTheDocument();
    });

    it("should call onUpdateShoppingCart when button is pressed", () => {
        const onUpdateShoppingCart = vi.fn();

        render(
            <ShoppingCartProductModalContent
                title="Actualización de stock"
                description="Descripción"
                icon={<span>icon</span>}
                basketItems={[basketItem]}
                onUpdateShoppingCart={onUpdateShoppingCart}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Actualizar carrito" }));

        expect(onUpdateShoppingCart).toHaveBeenCalledTimes(1);
    });
});
