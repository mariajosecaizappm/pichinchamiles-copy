import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ShoppingCartStepper from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStepper";

const mockStep = vi.fn();

vi.mock(
    "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStepperStep",
    () => ({
        default: (props: any) => {
            mockStep(props);
            return <li data-testid={`step-${props.stepId}`} />;
        },
    })
);

describe("ShoppingCartStepper", () => {
    it("should render 4 steps and mark states correctly", () => {
        render(<ShoppingCartStepper currentStep={3} />);

        expect(mockStep).toHaveBeenCalledTimes(4);
        expect(mockStep.mock.calls[0][0]).toMatchObject({
            stepId: 1,
            isCompleted: true,
            isActive: false,
        });
        expect(mockStep.mock.calls[2][0]).toMatchObject({
            stepId: 3,
            isCompleted: false,
            isActive: true,
        });
    });
});

