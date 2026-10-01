import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TransactionStatus } from "@/domain/entity/Transaction/transaction";
import TransactionStatusChipIcon from "@/presentation/pages/Profile/Transactions/components/TransactionDetailModal/components/TransactionDetailModalSection/components/TransactionStatusChip/TransactionStatusChipIcon";

describe("TransactionStatusChipIcon", () => {
    it("renders the approved icon", () => {
        const { container } = render(<TransactionStatusChipIcon status={TransactionStatus.APPROVED} />);

        expect(container.querySelector("svg")).toHaveAttribute("width", "16");
    });

    it("renders the rejected icon", () => {
        const { container } = render(<TransactionStatusChipIcon status={TransactionStatus.REJECTED} />);

        expect(container.querySelector("svg")).toHaveAttribute("width", "16");
    });

    it("renders the pending icon by default", () => {
        const { container } = render(<TransactionStatusChipIcon status={TransactionStatus.PENDING} />);

        expect(container.querySelector("svg")).toHaveAttribute("width", "12");
    });
});
