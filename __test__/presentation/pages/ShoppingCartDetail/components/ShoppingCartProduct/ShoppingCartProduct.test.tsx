import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PaymentMethod } from "@/domain/entity/Payment/payment";
import { ProductType } from "@/domain/entity/Product/product";
import ShoppingCartProduct from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartProduct";

vi.mock("next/image", () => ({
    default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock(
    "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartQuantityField",
    () => ({
        default: ({ onRemove, onDecrease, onIncrease }: any) => (
            <div>
                <button onClick={onRemove}>remove</button>
                <button onClick={onDecrease}>decrease</button>
                <button onClick={onIncrease}>increase</button>
            </div>
        ),
    })
);

vi.mock(
    "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartCopaymentCounter",
    () => ({
        default: ({ type }: { type: string }) => (
            <div data-testid={`copayment-counter-${type}`} />
        ),
    })
);

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
    isAvailability: true,
    queryId: undefined,
    options: [],
    variationInfo: {
        productName: "Podadora",
        productSlug: "podadora",
        stock: 6,
        price: 10,
        pointsPrice: 48234,
        taxes: 15,
        assets: [{ desktopUrl: "https://example.com/image.jpg", order: 1, type: "image" }],
        features: [{ name: "Tamaño", option: "18''" }],
    },
    paymentTypes: { points: { currencyId: "pts", amount: 48234 } },
} as const;

describe("ShoppingCartProduct", () => {
    it("should render product information and trigger quantity actions", async () => {
        const onRemoveItem = vi.fn().mockResolvedValue(undefined);
        const onChangeQuantity = vi.fn().mockResolvedValue(undefined);

        const { container } = render(
            <ShoppingCartProduct
                item={baseItem as any}
                isLoading={false}
                maxQuantity={6}
                onRemoveItem={onRemoveItem}
                onChangeQuantity={onChangeQuantity}
                onUpdateBasketItem={vi.fn().mockResolvedValue(undefined)}
            />
        );

        expect(screen.getByText("Podadora")).toBeInTheDocument();
        expect(screen.getByText("Truper")).toBeInTheDocument();
        expect(screen.getAllByText("6 en stock").length).toBeGreaterThan(0);
        expect(screen.getAllByText("48.234 millas").length).toBeGreaterThan(0);

        expect(
            container.querySelector(".border-b.border-darkGrayishBlue-300")
        ).toBeInTheDocument();

        fireEvent.click(screen.getAllByText("remove")[0]);
        fireEvent.click(screen.getAllByText("decrease")[0]);
        fireEvent.click(screen.getAllByText("increase")[0]);

        expect(onRemoveItem).toHaveBeenCalledWith("1");
        expect(onChangeQuantity).toHaveBeenCalledWith("1", 0);
        expect(onChangeQuantity).toHaveBeenCalledWith("1", 2);
    });

    it("should render copayment counters when item has copayment", () => {
        const copaymentItem = {
            ...baseItem,
            paymentMethod: PaymentMethod.COPAYMENT,
            variationInfo: {
                ...baseItem.variationInfo,
                copayment: {
                    initialization: { points: 100, coins: 1 },
                    minimumPointsValue: 100,
                    pointsConversionRatePercentage: "MTAw",
                },
            },
            paymentTypes: {
                points: { currencyId: "pts", amount: 100 },
                coin: { currencyId: "usd", amount: 1 },
            },
        };

        render(
            <ShoppingCartProduct
                item={copaymentItem as any}
                isLoading={false}
                maxQuantity={6}
                onRemoveItem={vi.fn()}
                onChangeQuantity={vi.fn()}
                onUpdateBasketItem={vi.fn()}
            />
        );

        expect(screen.getByTestId("copayment-counter-points")).toBeInTheDocument();
        expect(screen.getByTestId("copayment-counter-coins")).toBeInTheDocument();
        expect(screen.getAllByText("48.234 millas").length).toBeGreaterThan(0);
    });
});
