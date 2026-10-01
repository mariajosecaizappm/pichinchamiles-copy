import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PaymentMethod } from "@/domain/entity/Payment/payment";
import { ProductType } from "@/domain/entity/Product/product";
import ShoppingCartProductImage from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartProduct/components/ShoppingCartProductImage";

vi.mock("next/image", () => ({
    default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

const baseItem = {
    id: "1",
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
        features: [],
    },
    paymentTypes: { points: { currencyId: "pts", amount: 48234 } },
} as const;

describe("ShoppingCartProductImage", () => {
    it("renders product image when desktop url exists", () => {
        render(<ShoppingCartProductImage item={baseItem as any} />);

        expect(screen.getByRole("img", { name: "Podadora" })).toBeInTheDocument();
        expect(screen.queryByText("Sin imagen")).not.toBeInTheDocument();
    });

    it("renders fallback when product has no image", () => {
        render(
            <ShoppingCartProductImage
                item={{
                    ...baseItem,
                    variationInfo: { ...baseItem.variationInfo, assets: [] },
                } as any}
            />
        );

        expect(screen.getByText("Sin imagen")).toBeInTheDocument();
    });
});
