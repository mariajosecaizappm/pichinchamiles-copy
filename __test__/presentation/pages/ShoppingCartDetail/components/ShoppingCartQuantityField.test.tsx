import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ShoppingCartQuantityField from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartQuantityField";

vi.mock("@iconify/react", () => ({
    Icon: ({ icon }: { icon: string }) => <span data-testid={`icon-${icon}`} />,
}));

describe("ShoppingCartQuantityField", () => {
    it("should render quantity value", () => {
        render(
            <ShoppingCartQuantityField
                value={3}
                max={10}
                onDecrease={vi.fn()}
                onIncrease={vi.fn()}
                onRemove={vi.fn()}
            />
        );

        expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("should call onDecrease when quantity is above minimum", () => {
        const onDecrease = vi.fn();
        render(
            <ShoppingCartQuantityField
                value={2}
                max={10}
                onDecrease={onDecrease}
                onIncrease={vi.fn()}
                onRemove={vi.fn()}
            />
        );

        expect(screen.getByTestId("icon-mdi:minus")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Disminuir cantidad" }));
        expect(onDecrease).toHaveBeenCalledTimes(1);
    });

    it("should call onRemove when quantity is at minimum", () => {
        const onRemove = vi.fn();
        render(
            <ShoppingCartQuantityField
                value={1}
                max={10}
                onDecrease={vi.fn()}
                onIncrease={vi.fn()}
                onRemove={onRemove}
            />
        );

        expect(screen.getByTestId("icon-mdi:delete-outline")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Eliminar producto" }));
        expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it("should call onIncrease and disable plus at max stock", () => {
        const onIncrease = vi.fn();
        const { rerender } = render(
            <ShoppingCartQuantityField
                value={5}
                max={10}
                onDecrease={vi.fn()}
                onIncrease={onIncrease}
                onRemove={vi.fn()}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Aumentar cantidad" }));
        expect(onIncrease).toHaveBeenCalledTimes(1);

        rerender(
            <ShoppingCartQuantityField
                value={10}
                max={10}
                onDecrease={vi.fn()}
                onIncrease={onIncrease}
                onRemove={vi.fn()}
            />
        );

        expect(screen.getByRole("button", { name: "Aumentar cantidad" })).toBeDisabled();
    });
});
