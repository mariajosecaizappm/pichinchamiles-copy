/* eslint-disable @typescript-eslint/no-explicit-any */

import {FeePaymentDetail, PaymentDetail} from "@/domain/entity/Payment/payment";

export const getPendingTransaction = (data: any): string => {
    return data?.reference ?? "";
};

const parsePaymentAmount = (value: unknown): number => {
    if (typeof value === "number") return value;
    if (typeof value !== "string") return 0;

    const normalizedValue = value.trim().replace(",", ".");
    const amount = Number(normalizedValue);

    return Number.isFinite(amount) ? amount : 0;
};

export const getPaymentDetailAdapter = (data: any): PaymentDetail =>{
    return {
        reference: data.reference,
        status: data.status,
        totalAmount: parsePaymentAmount(data.totalAmount)
    }
}

export const getFeePaymentDetailAdapter = (data: any): FeePaymentDetail =>{
    return {
        reference: data.reference,
        status: data.status ?? null,
        totalAmount: data.totalAmount
    }
}