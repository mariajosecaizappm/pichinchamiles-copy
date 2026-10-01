import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PaymentMethod } from "@/domain/entity/Payment/payment";
import { ProductType } from "@/domain/entity/Product/product";
import ShoppingCartDetail from "@/presentation/pages/ShoppingCartDetail/ShoppingCartDetail";

const mockUseShoppingCartBasket = vi.fn();
const mockUseCheckout = vi.fn();

vi.mock("@/presentation/pages/ShoppingCartDetail/hooks/useShoppingCartBasket", () => ({
    useShoppingCartBasket: (basket: unknown) => mockUseShoppingCartBasket(basket),
}));

vi.mock("@/presentation/pages/ShoppingCartDetail/hooks/useCheckout", () => ({
    default: () => mockUseCheckout(),
}));

vi.mock("@/presentation/pages/ShoppingCartDetail/components/EmptyShoppingCart", () => ({
    default: () => <div data-testid="empty-cart" />,
}));

vi.mock("@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStepper", () => ({
    default: () => <div data-testid="stepper" />,
}));

vi.mock("@/presentation/pages/ShoppingCartDetail/components/ShoppingCartProductModal", () => ({
    default: () => null,
}));

vi.mock("@/presentation/pages/ShoppingCartDetail/components/CheckoutProducts", () => ({
    default: () => <div data-testid="checkout-products" />,
}));

vi.mock("@/presentation/pages/ShoppingCartDetail/components/CheckoutShipping", () => ({
    default: ({ basket }: { basket: unknown }) => (
        <div data-testid="checkout-shipping" data-basket={JSON.stringify(basket)} />
    ),
}));

vi.mock("@/presentation/pages/ShoppingCartDetail/components/CheckoutBilling", () => ({
    default: () => <div data-testid="checkout-billing" />,
}));

vi.mock("@/presentation/pages/ShoppingCartDetail/components/CheckoutConfirmation", () => ({
    default: () => <div data-testid="checkout-confirmation" />,
}));

vi.mock("@/presentation/pages/ShoppingCartDetail/components/ShoppingCartSummary", () => ({
    default: () => <div data-testid="summary" />,
}));

const basketState = {
    items: [],
    isLoading: false,
    isVerifying: false,
};

describe("ShoppingCartDetail", () => {
    beforeEach(() => {
        mockUseShoppingCartBasket.mockReturnValue(basketState);
        mockUseCheckout.mockReturnValue({
            step: 1,
            billingFormRef: { current: null },
        });
    });

    it("should render empty state when basket has no items", () => {
        render(
            <ShoppingCartDetail
                basket={{ buyerId: "buyer", items: [] }}
                pendingReference=""
            />
        );

        expect(screen.getByTestId("empty-cart")).toBeInTheDocument();
        expect(screen.queryByTestId("stepper")).not.toBeInTheDocument();
    });

    it("should render empty state when basket.items is undefined", () => {
        render(
            <ShoppingCartDetail
                basket={{ buyerId: "buyer" } as any}
                pendingReference=""
            />
        );

        expect(screen.getByTestId("empty-cart")).toBeInTheDocument();
        expect(mockUseShoppingCartBasket).toHaveBeenCalledWith(
            expect.objectContaining({ items: [] })
        );
    });

    it("should render cart layout with grid when basket has items", () => {
        const basket = {
            buyerId: "buyer",
            items: [
                {
                    id: "1",
                    paymentMethod: PaymentMethod.POINTS,
                    productType: ProductType.PHYSICAL_PRODUCT,
                    quantity: 1,
                },
            ],
        };

        const { container } = render(<ShoppingCartDetail basket={basket as any} pendingReference="ABC123" />);

        expect(screen.getByTestId("stepper")).toBeInTheDocument();
        expect(screen.getByTestId("checkout-products")).toBeInTheDocument();
        expect(screen.getByTestId("checkout-shipping")).toBeInTheDocument();
        expect(screen.getByTestId("checkout-billing")).toBeInTheDocument();
        expect(screen.getByTestId("checkout-confirmation")).toBeInTheDocument();
        expect(screen.getByTestId("summary")).toBeInTheDocument();
        expect(container.querySelector(".xl\\:grid")).toBeInTheDocument();
        expect(mockUseShoppingCartBasket).toHaveBeenCalledWith(
            expect.objectContaining({ items: basket.items })
        );
    });

    it("should hide checkout products when step is not 1", () => {
        const basket = {
            buyerId: "buyer",
            items: [
                {
                    id: "1",
                    paymentMethod: PaymentMethod.POINTS,
                    productType: ProductType.PHYSICAL_PRODUCT,
                    quantity: 1,
                },
            ],
        };

        mockUseCheckout.mockReturnValue({
            step: 2,
            billingFormRef: { current: null },
        });

        render(<ShoppingCartDetail basket={basket as any} pendingReference="" />);

        expect(screen.queryByTestId("checkout-products")).not.toBeInTheDocument();
        expect(screen.getByTestId("checkout-shipping")).toBeInTheDocument();
        expect(screen.getByTestId("summary")).toBeInTheDocument();
    });
});
