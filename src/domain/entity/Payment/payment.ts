export enum PaymentMethod{
    POINTS = 'points',
    COPAYMENT = 'copayment'
}

export type CopaymentMaxMin = {
    max: number
    min: number
}

export enum PaymentStatus {
    SUCCESS = "APPROVED",
    PENDING = "PENDING",
    REJECTED = "REJECTED"
}

export type PaymentDetail = {
    reference: string
    totalAmount: number
    status: PaymentStatus
}

export type FeePaymentDetail = PaymentDetail & {
    status: PaymentStatus | null
}