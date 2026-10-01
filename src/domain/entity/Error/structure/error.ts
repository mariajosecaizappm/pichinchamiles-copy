export enum ErrorCode {
    INVALID_USER,
    USER_CANCELED,
    INVALID_ATTEMPT,
    USER_BLOCKED,
    EXPORT_TRANSACTION_MAX_RANGE,
    EXPORT_TRANSACTIONS_NOT_FOUND,
    BENEFICIARY_NOT_FOUND,
    SELF_TRANSFER,
    MISSING_UV_SESSION,
    UNKNOWN
}

export type ErrorMetadataMap = {
    [ErrorCode.INVALID_USER]: undefined
    [ErrorCode.USER_CANCELED]: undefined
    [ErrorCode.INVALID_ATTEMPT]: {
        remainingAttempts?: number
    }
    [ErrorCode.USER_BLOCKED]: {
        minutes: number
    }
    [ErrorCode.EXPORT_TRANSACTION_MAX_RANGE]: undefined
    [ErrorCode.EXPORT_TRANSACTIONS_NOT_FOUND]: undefined
    [ErrorCode.BENEFICIARY_NOT_FOUND]: undefined
    [ErrorCode.SELF_TRANSFER]: undefined
    [ErrorCode.MISSING_UV_SESSION]: undefined
    [ErrorCode.UNKNOWN]: undefined
}
