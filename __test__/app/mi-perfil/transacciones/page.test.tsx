import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page from "@/app/mi-perfil/transacciones/page";

vi.mock("next/dynamic", () => ({
    default: () => {
        return function MockDynamicTransactions() {
            return <div data-testid="transactions-page-content">Transactions page</div>;
        };
    },
}));

describe("Transactions Page (src/app/mi-perfil/transacciones/page.tsx)", () => {
    it("renders the client transactions view", () => {
        render(<Page />);

        expect(screen.getByTestId("transactions-page-content")).toBeInTheDocument();
    });
});
