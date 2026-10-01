export type ExportTransactionsAlertType =
    | "report-ready"
    | "report-sent"
    | "review-dates"
    | "reports-not-found"

export type ExportTransactionsAlertHandler = (type: ExportTransactionsAlertType) => void
