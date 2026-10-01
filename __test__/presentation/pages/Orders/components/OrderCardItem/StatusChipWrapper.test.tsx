import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@heroui/react", () => ({
    cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(" "),
}));

import StatusChipWrapper from "@/presentation/pages/Orders/components/OrderCardItem/components/OrderStatusChip/StatusChipWrapper";

describe("StatusChipWrapper", () => {
    it("renders children", () => {
        render(<StatusChipWrapper>Chip content</StatusChipWrapper>);

        expect(screen.getByText("Chip content")).toBeInTheDocument();
    });

    it("applies base classes always", () => {
        render(<StatusChipWrapper>content</StatusChipWrapper>);

        const span = screen.getByText("content").closest("span");
        expect(span).toHaveClass("flex");
        expect(span).toHaveClass("items-center");
        expect(span).toHaveClass("rounded-2xl");
        expect(span).toHaveClass("border");
    });

    it("applies additional className when provided", () => {
        render(<StatusChipWrapper className="border-success-200 bg-success-50 text-success-500">content</StatusChipWrapper>);

        const span = screen.getByText("content").closest("span");
        expect(span).toHaveClass("border-success-200");
        expect(span).toHaveClass("bg-success-50");
        expect(span).toHaveClass("text-success-500");
    });

    it("renders without className prop", () => {
        render(<StatusChipWrapper>content</StatusChipWrapper>);

        expect(screen.getByText("content")).toBeInTheDocument();
    });

    it("renders a span element", () => {
        render(<StatusChipWrapper>label</StatusChipWrapper>);

        expect(screen.getByText("label").closest("span")).toBeInTheDocument();
    });
});
