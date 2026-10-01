import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CurrencyType } from "@/domain/entity/Currency/currency";
import CopaymentCounter from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartCopaymentCounter/CopaymentCounter";

vi.mock("@iconify/react", () => ({
    Icon: ({ icon }: { icon: string }) => <span data-testid={`icon-${icon}`} />,
}));

describe("CopaymentCounter", () => {
    it("should render miles label and formatted value", () => {
        render(
            <CopaymentCounter
                type={CurrencyType.POINTS}
                label="Millas a usar"
                value={5612}
                min={1}
                max={9000}
                onChange={vi.fn()}
            />
        );

        expect(screen.getByText("Millas a usar")).toBeInTheDocument();
        expect(screen.getByText("5.612")).toBeInTheDocument();
        expect(screen.getByTestId("icon-mdi:minus")).toBeInTheDocument();
        expect(screen.getByTestId("icon-mdi:plus")).toBeInTheDocument();
    });

    it("should render coins with decimal formatting", () => {
        render(
            <CopaymentCounter
                type={CurrencyType.COINS}
                label="Dólares a pagar"
                value={235.7}
                min={1}
                max={500}
                onChange={vi.fn()}
            />
        );

        expect(screen.getByText("Dólares a pagar")).toBeInTheDocument();
        expect(screen.getByText("235,70")).toBeInTheDocument();
    });

    it("should call onChange when incrementing and decrementing", () => {
        const onChange = vi.fn();
        render(
            <CopaymentCounter
                type={CurrencyType.POINTS}
                label="Millas a usar"
                value={10}
                min={8}
                max={12}
                onChange={onChange}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Aumentar millas a usar" }));
        fireEvent.click(screen.getByRole("button", { name: "Disminuir millas a usar" }));

        expect(onChange).toHaveBeenCalledWith(11);
        expect(onChange).toHaveBeenCalledWith(9);
    });

    it("should disable buttons at min and max", () => {
        const onChange = vi.fn();
        render(
            <CopaymentCounter
                type={CurrencyType.COINS}
                label="Dólares a pagar"
                value={1}
                min={1}
                max={1}
                onChange={onChange}
            />
        );

        expect(screen.getByRole("button", { name: "Disminuir dólares a pagar" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Aumentar dólares a pagar" })).toBeDisabled();
    });
});
