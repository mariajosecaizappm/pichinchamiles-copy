import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ShoppingCartCopaymentAccordion from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartCopaymentAccordion/ShoppingCartCopaymentAccordion";

vi.mock("@iconify/react", () => ({
    Icon: ({ icon }: { icon: string }) => <span data-testid={`icon-${icon}`} />,
}));

describe("ShoppingCartCopaymentAccordion", () => {
    it("should render copayment breakdown when expanded", () => {
        render(
            <ShoppingCartCopaymentAccordion subtotal={210.45} taxes={25.25} total={235.7} />
        );

        expect(screen.getByText("Copago")).toBeInTheDocument();
        expect(screen.getByText("$235,70")).toBeInTheDocument();
        expect(screen.getByText("Subtotal copago")).toBeInTheDocument();
        expect(screen.getByText("$210,45")).toBeInTheDocument();
        expect(screen.getByText("IVA")).toBeInTheDocument();
        expect(screen.getByText("$25,25")).toBeInTheDocument();
        expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    });

    it("should hide breakdown when toggled closed", () => {
        render(
            <ShoppingCartCopaymentAccordion subtotal={0.87} taxes={0.13} total={1} />
        );

        fireEvent.click(screen.getByRole("button"));

        expect(screen.queryByText("Subtotal copago")).not.toBeInTheDocument();
        expect(screen.queryByText("IVA")).not.toBeInTheDocument();
        expect(screen.getByText("Copago")).toBeInTheDocument();
        expect(screen.getByText("$1,00")).toBeInTheDocument();
    });
});
