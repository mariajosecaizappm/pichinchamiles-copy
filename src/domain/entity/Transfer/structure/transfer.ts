export type TransferBeneficiary = {
    status: string
    id: string
    firstName: string
    secondName: string
    firstLastName: string
    secondLastName: string
    identificationNumber: string
}

export type CreateTransferParams = {
    originCurrencyId: string
    destinationMemberUserId: string
    destinationCurrencyId: string
    pointsAmount: number
    mfaCode?: string
    mfaToken?: string
}

export type CreateTransferResult = {
    balanceAfterOperation: number
}

export enum TransferStatus {
    CANCELED = "canceled",
    CANCELED_WITHOUT_ACCESS = "canceledwithoutaccess",
}

export const TRANSFER_OTP_OPERATION_TYPE = "TRANSFER_TRANSACTION"
