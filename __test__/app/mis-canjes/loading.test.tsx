import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/presentation/pages/Orders/components/Layout", () => ({
    OrdersSkeleton: () => <div data-testid="orders-skeleton">Loading...</div>,
}));

import Loading from "@/app/mis-pedidos/loading";

describe("mis-pedidos/loading", () => {
    it("renders OrdersSkeleton", () => {
        render(<Loading />);

        expect(screen.getByTestId("orders-skeleton")).toBeInTheDocument();
    });

    it("displays loading text", () => {
        render(<Loading />);

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
});
