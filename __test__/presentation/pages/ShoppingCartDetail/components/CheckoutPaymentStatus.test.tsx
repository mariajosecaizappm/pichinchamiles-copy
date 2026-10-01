import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CheckoutPaymentStatus from "@/presentation/pages/ShoppingCartDetail/components/CheckoutPaymentStatus";

const mocks = vi.hoisted(() => ({
    reference: null as string | null,
    openShoppingCartStatusModal: vi.fn(),
    getPaymentDetail: vi.fn(),
    containerGet: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    useSearchParams: () => ({
        get: (key: string) => (key === "reference" ? mocks.reference : null),
    }),
}));

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}));

vi.mock("@/presentation/pages/ShoppingCartDetail/hooks/useShoppingCartStatusModal", () => ({
    default: () => ({
        openShoppingCartStatusModal: mocks.openShoppingCartStatusModal,
    }),
}));

vi.mock("@heroui/spinner", () => ({
    Spinner: ({ "aria-label": ariaLabel }: { "aria-label": string }) => (
        <div aria-label={ariaLabel}>spinner</div>
    ),
}));

const renderComponent = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return render(
        <QueryClientProvider client={queryClient}>
            <CheckoutPaymentStatus />
        </QueryClientProvider>
    );
};

describe("CheckoutPaymentStatus", () => {
    beforeEach(() => {
        mocks.reference = null;
        mocks.openShoppingCartStatusModal.mockReset();
        mocks.getPaymentDetail.mockReset();
        mocks.containerGet.mockReset();
        mocks.containerGet.mockReturnValue({
            getPaymentDetail: mocks.getPaymentDetail,
        });
    });

    it("does not request payment detail when there is no reference", () => {
        renderComponent();

        expect(screen.queryByLabelText("Consultando estado del pago")).not.toBeInTheDocument();
        expect(mocks.getPaymentDetail).not.toHaveBeenCalled();
    });

    it("shows a loading overlay while the payment detail is loading", () => {
        mocks.reference = "ABC123";
        mocks.getPaymentDetail.mockImplementation(
            () => new Promise(() => undefined)
        );

        renderComponent();

        expect(screen.getByLabelText("Consultando estado del pago")).toBeInTheDocument();
    });

    it("opens the shopping cart status modal when payment detail is resolved", async () => {
        mocks.reference = "ABC123";
        mocks.getPaymentDetail.mockResolvedValue({
            reference: "ABC123",
            status: "APPROVED",
            totalAmount: 42,
        });

        renderComponent();

        await waitFor(() => {
            expect(mocks.getPaymentDetail).toHaveBeenCalledWith("ABC123");
            expect(mocks.openShoppingCartStatusModal).toHaveBeenCalledWith({
                status: "APPROVED",
                amount: 42,
                type: "payment",
                reference: "ABC123",
            });
        });
    });
});
