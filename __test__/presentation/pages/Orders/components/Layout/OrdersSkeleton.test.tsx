import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@heroui/react", () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
    Skeleton: ({ className }: any) => (
        <div data-testid="skeleton" className={className}>
            Skeleton
        </div>
    ),
}));

vi.mock("@/presentation/pages/Orders/components/OrderCardItem/OrderCardItem.module.css", () => ({
    default: new Proxy({}, { get: (_target, prop) => String(prop) }),
}));

import OrdersSkeleton from "@/presentation/pages/Orders/components/Layout/Skeleton/OrdersSkeleton";

describe("OrdersSkeleton", () => {
    it("renders skeleton elements", () => {
        render(<OrdersSkeleton />);

        const skeletons = screen.getAllByTestId("skeleton");
        expect(skeletons.length).toBeGreaterThan(0);
        expect(skeletons[0]).toBeInTheDocument();
    });

    it("applies custom className to the container", () => {
        const { container } = render(<OrdersSkeleton className="custom-class" />);

        const mainContainer = container.querySelector(".body-container");
        expect(mainContainer).toBeInTheDocument();
        expect(mainContainer).toHaveClass("custom-class");
    });

    it("renders with default container classes when no className provided", () => {
        const { container } = render(<OrdersSkeleton />);

        const mainContainer = container.querySelector(".body-container");
        expect(mainContainer).toBeInTheDocument();
        expect(mainContainer).toHaveClass("body-container", "py-4");
    });

    it("overrides container classes with custom className", () => {
        const { container } = render(<OrdersSkeleton className="p-0" />);

        const mainContainer = container.querySelector(".body-container");
        expect(mainContainer).toHaveClass("p-0");
    });
});
