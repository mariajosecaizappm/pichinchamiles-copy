import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TransactionStatus } from "@/domain/entity/Transaction/transaction";
import TransactionStatusChip from "@/presentation/pages/Profile/Transactions/components/TransactionDetailModal/components/TransactionDetailModalSection/components/TransactionStatusChip/TransactionStatusChip";

describe("TransactionStatusChip", () => {
    it("renders the approved chip", () => {
        render(<TransactionStatusChip status={TransactionStatus.APPROVED} />);

        const chip = screen.getByText("Aprobado").parentElement;
        expect(screen.getByText("Aprobado")).toBeInTheDocument();
        expect(chip).toHaveStyle({
            color: "rgb(49, 164, 81)",
        });
    });

    it("renders the rejected chip", () => {
        render(<TransactionStatusChip status={TransactionStatus.REJECTED} />);

        expect(screen.getByText("Rechazado")).toBeInTheDocument();
    });

    it("renders the pending chip", () => {
        render(<TransactionStatusChip status={TransactionStatus.PENDING} />);

        expect(screen.getByText("Pendiente")).toBeInTheDocument();
    });
});
