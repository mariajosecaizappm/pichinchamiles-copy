import { describe, expect, it } from "vitest";
import { PaymentMethod } from "@/domain/entity/Payment/payment";
import { TransactionTypes } from "@/domain/entity/Transaction/transaction";
import { getTransactionDetails } from "@/presentation/pages/Profile/Transactions/components/TransactionDetailModal/components/TransactionDetailModalSection/helpers";

describe("transaction detail helpers", () => {
    it("returns accreditation details", () => {
        expect(
            getTransactionDetails({
                transactionType: TransactionTypes.Accreditation,
                promo: "Promo verano",
                cutOffDate: "2026-07-15T06:00:00Z",
            } as any),
        ).toEqual([
            { label: "Tipo", value: "Promoción" },
            { label: "Promocion", value: "Promo verano" },
            { label: "Fecha de corte", value: "15/07/2026" },
        ]);
    });

    it("returns transfer details for sent and received transactions", () => {
        expect(
            getTransactionDetails({
                transactionType: TransactionTypes.TransferSend,
                destinationMemberUser: "Socio destino",
                pointsAmount: 1200,
            } as any),
        ).toEqual([
            { label: "Socio de destino", value: "Socio destino" },
            { label: "Millas transferidas", value: "1.200" },
        ]);

        expect(
            getTransactionDetails({
                transactionType: TransactionTypes.TransferReceive,
                originalMemberUser: "Socio origen",
                pointsAmount: 450,
            } as any),
        ).toEqual([
            { label: "Socio que emite", value: "Socio origen" },
            { label: "Millas transferidas", value: "450" },
        ]);

        expect(
            getTransactionDetails({
                transactionType: TransactionTypes.ProgramTransferSend,
                destinationMemberUser: "Socio destino",
                pointsAmount: 800,
            } as any),
        ).toEqual([
            { label: "Socio de destino", value: "Socio destino" },
            { label: "Millas transferidas", value: "800" },
        ]);
    });

    it("returns aggregated travel redemption details", () => {
        expect(
            getTransactionDetails({
                transactionType: TransactionTypes.UltraviajesFlightRedemption,
                paymentMethod: PaymentMethod.COPAYMENT,
                details: [
                    { totalPoints: 1000, totalCoins: 12.5 },
                    { totalPoints: 500, totalCoins: 7.5 },
                ],
            } as any),
        ).toEqual([
            { label: "Cantidad", value: 1 },
            { label: "Monto en dólares", value: "20,00" },
            { label: "Monto de redención", value: "1.500" },
            { label: "Método de redención", value: "Millas + Dólares" },
        ]);
    });

    it("returns product redemption details", () => {
        expect(
            getTransactionDetails({
                transactionType: TransactionTypes.ProductRedemption,
                paymentMethod: PaymentMethod.POINTS,
                details: [
                    { quantity: 1, totalPoints: 500, totalCoins: 0 },
                    { quantity: 2, totalPoints: 480, totalCoins: 0 },
                ],
            } as any),
        ).toEqual([
            { label: "Cantidad", value: 3 },
            { label: "Valor en millas", value: "980" },
            { label: "Monto de copago", value: 0 },
            { label: "Método de redención", value: "Millas" },
        ]);
    });

    it("returns an empty array for unsupported transaction types", () => {
        expect(
            getTransactionDetails({
                transactionType: TransactionTypes.Expiration,
            } as any),
        ).toEqual([]);
    });
});
