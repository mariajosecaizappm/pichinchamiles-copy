import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PaymentMethod } from "@/domain/entity/Payment/payment";
import { ProductType } from "@/domain/entity/Product/product";
import { BasketItem } from "@/domain/entity/Basket/structure/basket";
import ShoppingCartProductModalItem from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartProductModal/ShoppingCartProductModalItem";

vi.mock("next/image", () => ({
    default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}));

const buildBasketItem = (overrides: Partial<BasketItem> = {}): BasketItem => ({
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
        assets: [{ desktopUrl: "https://example.com/image.jpg", order: 1, type: "image" }],
        features: [
            { name: "Tamaño", option: "18''" },
            { name: "Color", option: "Negro" },
        ],
    },
    paymentTypes: { points: { currencyId: "pts", amount: 48234 } },
    ...overrides,
});

describe("ShoppingCartProductModalItem", () => {
    it("should render product name, image and each feature on its own line", () => {
        render(<ShoppingCartProductModalItem basketItem={buildBasketItem()} />);

        expect(screen.getByText("Podadora")).toBeInTheDocument();
        expect(screen.getByRole("img", { name: "Podadora" })).toHaveAttribute(
            "src",
            "https://example.com/image.jpg"
        );
        expect(screen.getByText((_, element) => element?.textContent === "Tamaño: 18''")).toBeInTheDocument();
        expect(screen.getByText((_, element) => element?.textContent === "Color: Negro")).toBeInTheDocument();
    });

    it("should render fallback when product has no image", () => {
        render(
            <ShoppingCartProductModalItem
                basketItem={buildBasketItem({
                    variationInfo: {
                        ...buildBasketItem().variationInfo,
                        assets: [],
                    },
                })}
            />
        );

        expect(screen.getByText("Sin imagen")).toBeInTheDocument();
    });
});
