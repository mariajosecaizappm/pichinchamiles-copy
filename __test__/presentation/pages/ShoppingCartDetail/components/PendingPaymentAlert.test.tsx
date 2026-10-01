import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PendingPaymentAlert from "@/presentation/pages/ShoppingCartDetail/components/PendingPaymentAlert";

vi.mock("@/presentation/components/Alert/Alert", () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="alert">{children}</div>,
}));

describe("PendingPaymentAlert", () => {
    it("returns null when there is no reference", () => {
        const { container } = render(<PendingPaymentAlert pendingReference="" />);
        expect(container.firstChild).toBeNull();
    });

    it("renders message with reference number", () => {
        render(<PendingPaymentAlert pendingReference="ABC123" />);
        expect(screen.getByTestId("alert")).toHaveTextContent("Tu pago con referencia");
        expect(screen.getByText("No. ABC123")).toBeInTheDocument();
        expect(screen.getByText(/se encuentra pendiente/)).toBeInTheDocument();
    });
});
