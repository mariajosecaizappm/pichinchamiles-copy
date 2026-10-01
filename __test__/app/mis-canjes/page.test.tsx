import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/presentation/pages/Orders", () => ({
    default: ({ orderNumber }: any) => (
        <div data-testid="orders-page">
            Order Number: {orderNumber || "none"}
        </div>
    ),
}));

import Page from "@/app/mis-pedidos/page";

describe("mis-pedidos/page", () => {
    it("renders Orders component", async () => {
        const searchParams = Promise.resolve({});
        
        render(await Page({ searchParams }));

        expect(screen.getByTestId("orders-page")).toBeInTheDocument();
    });

    it("passes orderNumber from searchParams to Orders", async () => {
        const searchParams = Promise.resolve({ orderNumber: "123456" });
        
        render(await Page({ searchParams }));

        expect(screen.getByText("Order Number: 123456")).toBeInTheDocument();
    });

    it("handles undefined orderNumber", async () => {
        const searchParams = Promise.resolve({});
        
        render(await Page({ searchParams }));

        expect(screen.getByText("Order Number: none")).toBeInTheDocument();
    });

    it("awaits searchParams correctly", async () => {
        const searchParams = Promise.resolve({ orderNumber: "789012" });
        
        const result = await Page({ searchParams });
        
        expect(result).toBeDefined();
    });
});
