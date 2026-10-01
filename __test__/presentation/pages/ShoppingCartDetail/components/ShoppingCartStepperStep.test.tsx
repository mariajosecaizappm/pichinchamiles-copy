import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import IconStepperAddress from "@/presentation/components/icons/IconStepperAddress";
import ShoppingCartStepperStep from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStepperStep";

vi.mock("@/presentation/components/icons/Icon", () => ({
    default: ({ name, width, height }: { name: string; width?: number; height?: number }) => (
        <svg data-testid={`sprite-icon-${name}`} width={width} height={height} />
    ),
}));

describe("ShoppingCartStepperStep", () => {
    it("should render active step with label", () => {
        render(
            <ShoppingCartStepperStep
                stepId={1}
                icon={<span data-testid="step-icon">cart</span>}
                isActive
                isCompleted={false}
            />
        );

        expect(screen.getByText("Carrito de compras")).toBeInTheDocument();
        expect(screen.getByTestId("step-icon")).toBeInTheDocument();
    });

    it("should render completed icon as check", () => {
        render(
            <ShoppingCartStepperStep
                stepId={2}
                icon={<IconStepperAddress data-testid="stepper-address-icon" />}
                isActive={false}
                isCompleted
            />
        );

        const checkIcon = screen.getByTestId("sprite-icon-icon-check");
        expect(checkIcon).toBeInTheDocument();
        expect(checkIcon).toHaveAttribute("width", "26");
        expect(checkIcon).toHaveAttribute("height", "20");
    });

    it("should render custom step icon when not completed", () => {
        render(
            <ShoppingCartStepperStep
                stepId={2}
                icon={<IconStepperAddress data-testid="stepper-address-icon" />}
                isActive
                isCompleted={false}
            />
        );

        expect(screen.getByTestId("stepper-address-icon")).toBeInTheDocument();
    });

    it("should render inactive incomplete step with grayscale styles", () => {
        const { container } = render(
            <ShoppingCartStepperStep
                stepId={1}
                icon={<span data-testid="step-icon">cart</span>}
                isActive={false}
                isCompleted={false}
            />
        );

        const iconWrapper = container.querySelector("li > span");
        expect(iconWrapper).toHaveClass("border-grayscale-400", "bg-white", "text-grayscale-400");
        expect(screen.getByText("Carrito de compras")).toHaveClass("text-grayscale-400");
    });

    it("should render billing and confirmation labels", () => {
        const { rerender } = render(
            <ShoppingCartStepperStep
                stepId={3}
                icon={<span>bill</span>}
                isActive
                isCompleted={false}
            />
        );

        expect(screen.getByText("Datos de facturación")).toBeInTheDocument();

        rerender(
            <ShoppingCartStepperStep
                stepId={4}
                icon={<span>confirm</span>}
                isActive
                isCompleted={false}
            />
        );

        expect(screen.getByText("Confirmación de pedido")).toBeInTheDocument();
    });
});
