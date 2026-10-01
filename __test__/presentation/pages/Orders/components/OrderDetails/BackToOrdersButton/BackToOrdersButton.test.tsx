import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BackToOrdersButton from "@/presentation/pages/Orders/components/OrderDetails/BackToOrdersButton/BackToOrdersButton";

describe("BackToOrdersButton", () => {
    it("renders back button with correct text", () => {
        render(<BackToOrdersButton onPressBack={vi.fn()} />);

        expect(screen.getByRole("button", { name: /Regresar/i })).toBeInTheDocument();
    });

    it("calls onPressBack when clicked", () => {
        const onPressBack = vi.fn();
        render(<BackToOrdersButton onPressBack={onPressBack} />);

        fireEvent.click(screen.getByRole("button"));
        expect(onPressBack).toHaveBeenCalledTimes(1);
    });
});
