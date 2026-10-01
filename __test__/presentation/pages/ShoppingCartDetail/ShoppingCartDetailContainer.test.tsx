import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ShoppingCartDetailContainer from "@/presentation/pages/ShoppingCartDetail/ShoppingCartDetailContainer";

const mocks = vi.hoisted(() => ({
    replace: vi.fn(),
    getShoppingCartValues: vi.fn(),
    updateBasket: vi.fn(),
    useSession: vi.fn(),
    useSearchParams: vi.fn(() => new URLSearchParams()),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({ replace: mocks.replace }),
    useSearchParams: mocks.useSearchParams,
}));

vi.mock("@/presentation/config/inversify.config", () => ({
    default: { get: () => ({ getShoppingCartValues: mocks.getShoppingCartValues }) },
}));

vi.mock("@/presentation/hooks/useSession", () => ({
    default: mocks.useSession,
}));

vi.mock("@/presentation/pages/ShoppingCartDetail/ShoppingCartDetail", () => ({
    default: ({ basket, pendingReference }: { basket: { items: unknown[] }; pendingReference: string }) => (
        <div data-testid="shopping-cart-detail">
            {basket.items.length}-{pendingReference}
        </div>
    ),
}));

vi.mock("@/presentation/pages/ShoppingCartDetail/components/CheckoutPaymentStatus", () => ({
    default: () => <div data-testid="checkout-payment-status" />,
}));

vi.mock("@/presentation/pages/ShoppingCartDetail/context/CheckoutProvider", () => ({
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("ShoppingCartDetailContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("redirects to home when session is not logged", async () => {
        mocks.useSession.mockReturnValue({
            basket: null,
            updateBasket: mocks.updateBasket,
            isLogged: false,
            isValidatingSession: false,
        });

        render(<ShoppingCartDetailContainer />);

        await waitFor(() => {
            expect(mocks.replace).toHaveBeenCalledWith("/");
        });
    });

    it("loads fresh basket and renders detail", async () => {
        mocks.getShoppingCartValues.mockResolvedValue({
            basket: { buyerId: "b", items: [{ id: "1" }] },
            pendingTransaction: "ABC123",
        });
        mocks.useSession.mockReturnValue({
            basket: { buyerId: "old", items: [] },
            updateBasket: mocks.updateBasket,
            isLogged: true,
            isValidatingSession: false,
        });

        render(<ShoppingCartDetailContainer />);

        await waitFor(() => {
            expect(mocks.getShoppingCartValues).toHaveBeenCalledTimes(1);
            expect(mocks.updateBasket).toHaveBeenCalledWith({ buyerId: "b", items: [{ id: "1" }] });
            expect(screen.getByTestId("shopping-cart-detail")).toHaveTextContent("0-ABC123");
        });
    });
});
